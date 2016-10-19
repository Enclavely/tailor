<?php

/**
 * Templates class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Templates' ) ) {

    /**
     * Tailor Templates class.
     *
     * @since 1.0.0
     */
	class Tailor_Templates {

		/**
		 * Tailor Templates instance.
		 *
		 * @since 1.0.0
		 * @access private
		 * @var Tailor_Templates
		 */
		private static $instance;

        /**
         * The template storage post name.
         *
         * @since 1.0.0
         * @access private
         * @var string
         */
        private $post_name;

		/**
		 * Returns the Tailor Templates instance.
		 *
		 * @since 1.0.0
		 *
		 * @return Tailor_Templates
		 */
		public static function get_instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {
	        $this->post_name = apply_filters( 'tailor_templates_post_name', 'tailor_templates' );
	        $this->register_post_type();
            $this->add_actions();
	        
	        if ( tailor()->is_template_preview() ) {

		        // Hides the Admin Bar
		        define( 'IFRAME_REQUEST', true );

		        add_filter( 'the_content', array( $this, 'template_preview_content' ) );
	        }
        }

		/**
		 * Registers the template storage post type.
		 *
		 * @since 1.0.0
		 * @access protected
		 */
		protected function register_post_type() {

			register_post_type( $this->post_name, array(
				'labels'            =>  array(
					'name'              =>  __( 'Tailor Templates', 'tailor' )
				),
				'show_ui'           =>  false,
				'query_var'         =>  true,
				'capability_type'   =>  'post',
				'hierarchical'      =>  false,
				'rewrite'           =>  false,
				'supports'          =>  false,
				'can_export'        =>  true,
				'public'            =>  false,
				'show_in_nav_menus' =>  false
			) );

		}

		/**
		 * Adds required action hooks.
		 *
		 * @since 1.0.0
		 * @access protected
		 */
		protected function add_actions() {
			add_action( 'tailor_enqueue_sidebar_scripts', array( $this, 'print_template_data' ) );

			add_action( 'wp_ajax_tailor_save_template', array( $this, 'save_template' ) );
			add_action( 'wp_ajax_tailor_load_template', array( $this, 'load_template' ) );
			add_action( 'wp_ajax_tailor_delete_template', array( $this, 'delete_template' ) );
		}

		/**
		 * Returns the template storage post ID.
		 *
		 * @since 1.0.0
		 *
		 * @return int|WP_Error
		 */
		protected function get_storage_post_id() {

			$args = array(
				'post_type'         =>  $this->post_name,
				'post_title'        =>  $this->post_name,
				'post_status'       =>  'draft',
				'comment_status'    =>  'closed',
				'ping_status'       =>  'closed',
			);

			if ( is_null( $post = get_page_by_title( $this->post_name, 'object', $this->post_name ) ) ) {
				if ( is_wp_error( $post_id = wp_insert_post( $args ) ) ) {
					return -1;
				}
				else {
					return $post_id;
				}
			}

			return $post->ID;
		}

		/**
		 * Returns the IDs for all saved templates.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @return array
		 */
		public function get_template_ids() {

			global $wpdb;

			return $wpdb->get_col( $wpdb->prepare(
				"SELECT meta_key FROM {$wpdb->postmeta} WHERE meta_key LIKE '%s' AND post_id = '%s'",
				$this->post_name . '_%',
				$this->get_storage_post_id()
			) );
		}

		/**
		 * Generates a template ID based on its label.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @param $template_label
		 * @return mixed|string|void
		 */
		protected function generate_template_id( $template_label ) {
			$template_label = str_replace( ' ', '_', $template_label );
			$existing_template_ids = $this->get_template_ids();
			$template_id = sprintf( $this->post_name . '_%s', sanitize_key( str_replace( ' ', '_ ', $template_label ) ) );

			// Ensure that the template ID is unique
			$counter = 0;
			while ( in_array( $template_id, $existing_template_ids ) ) {
				if ( (int) $counter > 0 ) {
					$template_id = substr( $template_id, 0, ( strlen( $template_id ) - ( strlen( $counter ) + 1 ) ) );
				}
				$template_id .= ( '-' . ++ $counter );
			}

			return $template_id;
		}
		
		/**
		 * Creates a new template based on the provided template definition.
		 *
		 * @since 1.4.0
		 *
		 * @param array $template_definition The template definition
		 *
		 * @return bool|int The created template ID
		 */
		public function add_models( $template_definition ) {

			// Ensure a tag and label have been provided
			if ( empty( $template_definition['tag'] ) || empty( $template_definition['label'] ) ) {
				return false;
			}

			// Ensure the tag corresponds to a valid element
			$element = tailor_elements()->get_element( $template_definition['tag'] );
			if ( empty( $element ) ) {
				return false;
			}

			// Ensure a valid collection of models have been provided
			$sanitized_models = tailor_models()->sanitize_models( $template_definition['models'] );
			if ( empty( $sanitized_models ) ) {
				return false;
			}

			$template_label = tailor_sanitize_text( $template_definition['label'] );
			$template_id = $this->generate_template_id( $template_label );
			$template = array(
				'label'         =>  $template_label,
				'tag'           =>  $element->tag,
				'type'          =>  $element->type,
				'models'        =>  $sanitized_models,
			);

			if ( update_post_meta( $this->get_storage_post_id(), $template_id, $template ) ) {
				$template['id'] = $template_id;

				/**
				 * Fires after a template has been added.
				 *
				 * @since 1.4.0
				 */
				do_action( 'tailor_add_template', $template );
				
				return $template;
			}

			return false;
		}

		/**
		 * Returns a template based on the provided ID.
		 *
		 * @since 1.4.0
		 *
		 * @param int $template_id The template ID
		 *
		 * @return bool|array The template
		 */
		public function get_models( $template_id ) {
			if ( ! empty( $template_id ) ) {
				return get_post_meta( $this->get_storage_post_id(), wp_unslash( $template_id ), true );
			}
			return false;
		}

		/**
		 * Updates a template based on the provided template definition.
		 *
		 * @since 1.4.0
		 *
		 * @param array $template_definition The template definition
		 *
		 * @return bool|int The created template ID
		 */
		public function update_models( $template_definition ) {

			$template_id = $template_definition['id'];
			$template = $this->get_models( $template_id );
			if ( false == $template ) {
				return false;
			}

			// Validate the template tag
			if ( ! empty( $template_definition['tag'] ) ) {
				$element = tailor_elements()->get_element( $template_definition['tag'] );
				if ( $element ) {
					$template['tag'] = $element->tag;
					$template['type'] = $element->type;
				}
			}

			// Maybe update the template label
			if ( ! empty( $template_definition['label'] ) ) {
				$template['label'] = tailor_sanitize_text( $template_definition['label'] );
			}

			// Maybe update the template models
			if ( ! empty( $template_definition['models'] ) ) {

				foreach ( $template['models'] as &$model ) {
					foreach ( $template_definition['models'] as $model_definition ) {
						if ( ! empty( $model_definition['id'] ) && $model['id'] == $model_definition['id'] ) {
							$model = array_merge( $model, $model_definition );
						}
					}
				}

				$template['models'] = tailor_models()->sanitize_models( $template['models'] );
			}

			if ( update_post_meta( $this->get_storage_post_id(), $template_id, $template ) ) {

				/**
				 * Fires after a template has been updated.
				 *
				 * @since 1.4.0
				 */
				do_action( 'tailor_update_template', $template );
				
				return $template;
			}

			return false;
		}

		/**
		 * Deletes a template based on the provided ID.
		 *
		 * @since 1.4.0
		 *
		 * @param int $template_id The template ID
		 *
		 * @return bool
		 */
		public function delete_models( $template_id ) {
			
			if ( ! empty( $template_id ) && delete_post_meta( $this->get_storage_post_id(), $template_id ) ) {

				/**
				 * Fires after a template has been deleted.
				 *
				 * @since 1.4.0
				 */
				do_action( 'tailor_delete_template', $template_id );

				return true;
			}
			
			return false;
		}

		/**
		 * Saves the a collection of models as a template.
		 *
		 * @since 1.0.0
		 */
		public function save_template() {

			check_ajax_referer( 'tailor-save-template', 'nonce' );

			$unsanitized_models = json_decode( wp_unslash( $_POST['models'] ), true );
			if ( ! is_array( $unsanitized_models ) ) {
				wp_send_json_error( array(
					'message'           =>  _x( 'The collection provided does not contain any valid models', 'error message', 'tailor' )
				) );
			}

			$template = $this->add_models( array(
				'tag'               =>  $_POST['tag'],
				'label'             =>  $_POST['label'],
				'models'            =>  $unsanitized_models,
			) );

			if ( false == $template ) {
				wp_send_json_error( array(
					'message'           =>  _x( 'The template could not be saved', 'error message', 'tailor' )
				) );
			}

			/**
			 * Filter response data for a successful tailor_save_template AJAX request.
			 *
			 * This filter does not apply if there was a nonce or authentication failure.
			 *
			 * @since 1.4.0
			 *
			 * @param array $template The saved template
			 * @param int $template['id']
			 */
			$response = apply_filters( 'tailor_save_template_response', $template, $template['id'] );

			wp_send_json_success( $response );
		}

		/**
		 * Returns a JSON representation of a template with a given ID.
		 *
		 * @since 1.0.0
		 */
		public function load_template() {

			check_ajax_referer( 'tailor-load-template', 'nonce' );

			$template_id = $_POST['template_id'];
			if ( ! isset( $template_id ) ) {
				wp_send_json_error( array(
					'message'           =>  _x( 'Invalid template ID', 'error message', 'tailor' )
				) );
			}

			$template = $this->get_models( $template_id );
			if ( false == $template ) {
				wp_send_json_error( array(
					'message'           =>  _x( 'The template does not exist', 'error message', 'tailor' )
				) );
			}

			$sanitized_models = tailor_models()->sanitize_models( $template['models'] );
			$refreshed_models = tailor_models()->refresh_model_ids( $sanitized_models );
			$response = array(
				'models'            =>  $refreshed_models,
				'templates'         =>  tailor_elements()->generate_element_html( $refreshed_models ),
				'css'               =>  tailor_css()->generate_dynamic_css_rules( $refreshed_models ),
			);

			/**
			 * Filters the response data for a successful tailor_load_template AJAX request.
			 *
			 * This filter does not apply if there was a nonce or authentication failure.
			 *
			 * @since 1.0.0
			 *
			 * @param array $response
			 * @param string $template_id
			 */
			$response = apply_filters( 'tailor_load_template_response', $response, $template_id );

			wp_send_json_success( $response );
		}

		/**
		 * Deletes the template with a given ID.
		 *
		 * @since 1.0.0
		 */
		public function delete_template() {

			check_ajax_referer( 'tailor-delete-template', 'nonce' );

			$template_id = $_POST[ 'id' ];
			if ( ! isset( $template_id ) ) {
				wp_send_json_error( array(
					'message'           =>  _x( 'Invalid template ID', 'error message', 'tailor' )
				) );
			}

			if ( false == $this->delete_models( $template_id ) ) {
				wp_send_json_error( array(
					'message'           =>  _x( 'The template could not be deleted', 'error message', 'tailor' )
				) );
			}

			/**
			 * Filters the response data for a successful tailor_delete_template AJAX request.
			 *
			 * This filter does not apply if there was a nonce or authentication failure.
			 *
			 * @since 1.0.0
			 *
			 * @param array $data
			 * @param string $template_id
			 */
			$response = apply_filters( 'tailor_delete_template_response', array(), $template_id );

			wp_send_json_success( $response );
		}
		
		/**
		 * Prints the template ID/label combinations for all saved templates to the page.
		 *
		 * @since 1.0.0
		 */
		public function print_template_data() {
			$templates = array();

			foreach ( (array) $this->get_template_ids() as $template_id ) {

				// Do nothing if the template doesn't exist
				$template = $this->get_models( $template_id );
				if ( false == $template ) {
					continue;
				}

				$allowed = array( 'tag', 'label', 'type') ;
				$template = array_intersect_key( $template, array_flip( $allowed ) );
				$template['id'] = $template_id;
				$templates[] = $template;
			}

			wp_localize_script( 'tailor-sidebar', '_templates', $templates );
		}

		/**
		 * Replaces the post content with that of the template being previewed.
		 *
		 * @since 1.4.0
		 *
		 * @param string $content
		 * @return string
		 */
		public function template_preview_content( $content ) {
			$template = $this->get_models( $_GET['template_id'] );
			if ( false == $template ) {
				return $content;
			}

			$sanitized_models = tailor_models()->sanitize_models( $template['models'] );
			$ordered_sanitized_models = tailor_models()->order_models_by_parent( $sanitized_models );
			$template_preview_content = tailor_models()->generate_shortcodes( '', $ordered_sanitized_models );

			/**
			 * Filter the template preview content.
			 *
			 * @since 1.4.0
			 *
			 * @param string $template_preview_content
			 */
			apply_filters( 'get_template_preview', $template_preview_content );

			return $template_preview_content;
		}
	}
}

if ( ! function_exists( 'tailor_templates' ) ) {

	/**
	 * Returns the Tailor Templates instance.
	 *
	 * @since 1.0.0
	 *
	 * @return Tailor_Templates
	 */
	function tailor_templates() {
		return Tailor_Templates::get_instance();
	}
}

/**
 * Initializes the Tailor Templates module.
 *
 * @since 1.0.0
 */
tailor_templates();