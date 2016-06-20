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

		        add_filter( 'the_content', array( $this, 'replace_content' ), -1 );
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
				'public'            =>  true,
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
			add_action( 'tailor_enqueue_scripts', array( $this, 'print_template_data' ) );

			add_action( 'wp_ajax_tailor_save_template', array( $this, 'save_template' ) );
			add_action( 'wp_ajax_tailor_load_template', array( $this, 'load_template' ) );
			add_action( 'wp_ajax_tailor_delete_template', array( $this, 'delete_template' ) );
		}

		/**
		 * Prints the template ID/label combinations for all saved templates to the page.
		 *
		 * @since 1.0.0
		 */
		public function print_template_data() {

			$templates = array();
			$storage_post_id = $this->get_storage_post_id();

			foreach ( (array) $this->get_template_ids() as $template_id ) {
				if ( $template = get_post_meta( $storage_post_id, $template_id, true ) ) {
					$templates[] = array(
						'id'            =>  $template_id,
						'label'         =>  $template['label'],
						'tag'           =>  $template['tag'],
						'type'          =>  $template['type'],
					);
				}
			}

			wp_localize_script( 'tailor-sidebar', '_templates', $templates );
		}

		/**
		 * Replaces the post content with that of the template being previewed.
		 *
		 * @since 1.0.0
		 *
		 * @param string $content
		 * @return string
		 */
		public function replace_content( $content ) {

			if ( empty( $_GET['template_id'] ) || false == $template = $this->get_template( $_GET['template_id'] ) ) {
				return $content;
			}

			$sanitized_models = tailor_elements()->sanitize_models( $template['models'] );
			$ordered_sanitized_models = tailor_elements()->order_models_by_parent( $sanitized_models );

			return tailor_elements()->get_shortcodes( '', $ordered_sanitized_models );
		}

		public function get_template( $template_id ) {
			return get_post_meta( $this->get_storage_post_id(), wp_unslash( $template_id ), true );
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
		 * Returns the IDs for all saved templates.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @return array
		 */
		protected function get_template_ids() {

			global $wpdb;

			return $wpdb->get_col( $wpdb->prepare(
				"SELECT meta_key FROM {$wpdb->postmeta} WHERE meta_key LIKE '%s' AND post_id = '%s'",
				$this->post_name . '_%',
				$this->get_storage_post_id()
			) );
		}

        /**
         * Saves the current layout as a template.
         *
         * @since 1.0.0
         */
		public function save_template() {

			check_ajax_referer( 'tailor-save-template', 'nonce' );

			$unsanitized_models = json_decode( wp_unslash( $_POST['models'] ), true );

			if ( ! is_array( $unsanitized_models ) ) {
				wp_send_json_error( array(
					'message'           =>  __( 'Invalid template', 'tailor' )
				) );
			}

			$sanitized_models = tailor_elements()->sanitize_models( $unsanitized_models );

			$element = tailor_elements()->get_element( $_POST['tag'] );

			$storage_post_id = $this->get_storage_post_id();
			$template_label = tailor_sanitize_text( $_POST['label'] );
			$template_id = $this->generate_template_id( $template_label );

			$update = update_post_meta( $storage_post_id, $template_id, array(
				'label'         =>  $template_label,
				'tag'           =>  $element->tag,
				'type'          =>  $element->type,
				'models'        =>  $sanitized_models,
			) );

			if ( false == $update ) {
				wp_send_json_error( array(
					'message'           =>  __( 'The template could not be saved', 'tailor' )
				) );
			}

			$response = array(
				'id'            =>  $template_id,
				'label'         =>  $template_label,
				'tag'           =>  $element->tag,
				'type'          =>  $element->type,
			);

			/**
			 * Filter response data for a successful tailor_save_template AJAX request.
			 *
			 * This filter does not apply if there was a nonce or authentication failure.
			 *
			 * @since 1.0.0
			 *
			 * @param array $response
			 * @param string $storage_post_id
			 * @param Tailor_Templates $this
			 */
			$response = apply_filters( 'tailor_save_template_response', $response, $storage_post_id, $this );

			wp_send_json_success( $response );
		}

        /**
         * Returns a JSON representation of a template with a given ID.
         *
         * @since 1.0.0
         */
		public function load_template() {

			check_ajax_referer( 'tailor-load-template', 'nonce' );

			if ( ! isset( $_POST['template_id'] ) ) {
				wp_send_json_error( array(
					'message'           =>  __( 'Invalid template', 'tailor' )
				) );
			}

			$template_id = wp_unslash( $_POST['template_id'] );
			$template = get_post_meta( $this->get_storage_post_id(), $template_id, true );

			if ( false == $template ) {
				wp_send_json_error( array(
					'message'           =>  __( 'The template does not exist', 'tailor' )
				) );
			}

			$sanitized_models = tailor_elements()->sanitize_models( $template['models'] );
			$sanitized_models = tailor_elements()->refresh_ids( $sanitized_models );

			$response = array(
				'models'            =>  $sanitized_models,
				'templates'         =>  tailor_elements()->get_templates_html( $sanitized_models ),
				'css'               =>  tailor_css()->generate_element_css( $sanitized_models ),
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

			if ( ! isset( $_POST[ 'id' ] ) ) {
				wp_send_json_error( array(
					'message'           =>  __( 'Invalid template', 'tailor' )
				) );
			}

			$template_id = wp_unslash( $_POST[ 'id' ] );
			if ( ! delete_post_meta( $this->get_storage_post_id(), $template_id ) ) {
				wp_send_json_error( array(
					'message'           =>  __( 'The template could not be deleted', 'tailor' )
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