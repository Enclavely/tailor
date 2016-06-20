<?php

/**
 * Elements class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Elements' ) ) {

    /**
     * Tailor Elements class.
     *
     * @since 1.0.0
     */
    class Tailor_Elements {

	    /**
	     * Tailor Elements instance.
	     *
	     * @since 1.0.0
	     * @access private
	     * @var Tailor_Elements
	     */
	    private static $instance;

        /**
         * The collection of registered elements.
         *
         * @since 1.0.0
         * @access private
         * @var array
         */
        private $elements = array();

	    /**
	     * Returns the Tailor Elements instance.
	     *
	     * @since 1.0.0
	     *
	     * @return Tailor_Elements
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
            $this->add_actions();
        }

	    /**
	     * Adds required action hooks.
	     *
	     * @since 1.0.0
	     * @access protected
	     */
	    protected function add_actions() {
		    add_action( 'tailor_init', array( $this, 'load_elements' ) );
		    add_action( 'tailor_register_elements', array( $this, 'register_elements' ) );

		    add_action( 'tailor_sidebar_footer', array( $this, 'print_library_data' ) );

		    add_action( 'tailor_canvas_footer', array( $this, 'print_element_data' ) );
		    add_action( 'tailor_canvas_footer', array( $this, 'print_default_template_html' ) );

		    add_action( 'wp_ajax_tailor_render', array( $this, 'render_element' ) );
		    add_action( 'wp_ajax_tailor_reset', array( $this, 'render_elements' ) );

		    add_action( 'tailor_save', array( $this, 'save_elements' ) );
        }

	    /**
         * Loads elements during initialization.
         *
         * @since 1.0.0
         */
	    public function load_elements() {

		    if ( did_action( 'tailor_register_elements' ) ) {
			    return;
		    }

		    tailor()->load_directory( 'elements' );

            /**
             * Fires during initialization, allowing elements to be registered.
             *
             * @since 1.0.0
             *
             * @param Tailor_Elements $this
             */
            do_action( 'tailor_register_elements', $this );

		    /**
		     * Fires after the elements have been registered.
		     *
		     * @since 1.0.0
		     *
		     * @param Tailor_Elements $this
		     */
		    do_action( 'tailor_register_elements_after', $this );
        }

        /**
         * Registers the default set of elements.
         *
         * @since 1.0.0
         */
        public function register_elements() {

            $this->add_element( 'tailor_section', array(
                'label'             =>  __( 'Section', 'tailor' ),
                'description'       =>  __( 'Group and style content.', 'tailor' ),
                'type'              =>  'wrapper',
            ) );

	        $this->add_element( 'tailor_tabs', array(
		        'label'             =>  __( 'Tabs', 'tailor' ),
		        'description'       =>  __( 'Display content in tabs.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_tab',
	        ) );

	        $this->add_element( 'tailor_toggles', array(
		        'label'             =>  __( 'Toggles', 'tailor' ),
		        'description'       =>  __( 'Display content in toggles.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_toggle',
	        ) );

	        $this->add_element( 'tailor_carousel', array(
		        'label'             =>  __( 'Carousel', 'tailor' ),
		        'description'       =>  __( 'Display content in a carousel.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_carousel_item',
	        ) );

	        $this->add_element( 'tailor_list', array(
		        'label'             =>  __( 'List', 'tailor' ),
		        'type'              =>  'container',
		        'description'       =>  __( 'Display content in list items.', 'tailor' ),
		        'child'             =>  'tailor_list_item',
	        ) );

	        $this->add_element( 'tailor_grid', array(
		        'label'             =>  __( 'Grid', 'tailor' ),
		        'description'       =>  __( 'Display content in a grid.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_grid_item',
	        ) );

	        $this->add_element( 'tailor_row', array(
                'label'             =>  __( 'Row', 'tailor' ),
                'type'              =>  'container',
                'child'             =>  'tailor_column',
            ) );

	        $this->add_element( 'tailor_map', array(
		        'label'             =>  __( 'Map', 'tailor' ),
		        'description'       =>  __( 'A Google map.', 'tailor' ),
		        'child'             =>  'tailor_map_marker',
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_column', array(
                'label'             =>  __( 'Column', 'tailor' ),
                'type'              =>  'child',
            ) );

	        $this->add_element( 'tailor_tab', array(
                'label'             =>  __( 'Tab', 'tailor' ),
                'type'              =>  'child',
            ) );

            $this->add_element( 'tailor_toggle', array(
                'label'             =>  __( 'Toggle', 'tailor' ),
                'type'              =>  'child',
            ) );

	        $this->add_element( 'tailor_carousel_item', array(
		        'label'             =>  __( 'Carousel item', 'tailor' ),
		        'type'              =>  'child',
	        ) );

	        $this->add_element( 'tailor_map_marker', array(
		        'label'             =>  __( 'Map marker', 'tailor' ),
		        'type'              =>  'child',
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_list_item', array(
                'label'             =>  __( 'List item', 'tailor' ),
                'type'              =>  'child',
            ) );

	        $this->add_element( 'tailor_grid_item', array(
		        'label'             =>  __( 'Grid item', 'tailor' ),
		        'type'              =>  'child',
	        ) );

	        $this->add_element( 'tailor_form_cf7', array(
		        'label'             =>  __( 'Contact form', 'tailor' ),
		        'description'       =>  __( 'A contact form.', 'tailor' ),
		        'badge'             =>  __( 'Contact Form 7', 'tailor' ),
		        'active_callback'   =>  'is_contact_form_7_active',
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_posts', array(
		        'label'             =>  __( 'Posts', 'tailor' ),
		        'description'   =>  __( 'Your site\'s posts.', 'tailor' ),
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_gallery', array(
		        'label'             =>  __( 'Gallery', 'tailor' ),
		        'description'       =>  __( 'A flexible image gallery.', 'tailor' ),
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_button', array(
		        'label'             =>  __( 'Button', 'tailor' ),
		        'description'       =>  __( 'A simple button.', 'tailor' ),
	        ) );

	        $this->add_element( 'tailor_content', array(
		        'label'             =>  __( 'Content', 'tailor' ),
		        'description'       =>  __( 'HTML and multimedia content.', 'tailor' ),
		        'icon'              =>  'dashicons-wordpress',
	        ) );

	        $this->add_element( 'tailor_user', array(
		        'label'             =>  __( 'User', 'tailor' ),
		        'description'       =>  __( 'A user profile box.', 'tailor' ),
	        ) );

	        $this->add_element( 'tailor_card', array(
		        'label'             =>  __( 'Card', 'tailor' ),
		        'description'       =>  __( 'Display content inside a card.', 'tailor' ),
		        'type'              =>  'wrapper',
	        ) );

	        $this->add_element( 'tailor_hero', array(
		        'label'             =>  __( 'Hero', 'tailor' ),
		        'description'       =>  __( 'Emphasize content in a hero pane.', 'tailor' ),
		        'type'              =>  'wrapper',
	        ) );

	        $this->add_element( 'tailor_box', array(
		        'label'             =>  __( 'Box', 'tailor' ),
		        'description'       =>  __( 'Display content inside a box.', 'tailor' ),
		        'type'              =>  'wrapper',
	        ) );

	        $this->add_element( 'tailor_widgets', array(
		        'label'             =>  __( 'Widgets', 'tailor' ),
		        'description'       =>  __( 'A widget area from your site.', 'tailor' ),
		        'dynamic'           =>  true,
	        ) );
        }

        /**
         * Prints the data for all registered elements to the page.
         *
         * @since 1.0.0
         */
        public function print_library_data() {

	        if ( did_action( 'tailor_print_library_data' ) ) {
		        return;
	        }

            $library_items = array();
            foreach ( $this->get_elements() as $element ) { /* @var $element Tailor_Element */
	            $library_items[] = $element->to_json();
            }

	        echo "<script type=\"text/javascript\">\n var _library = " . wp_json_encode( $library_items ) . ";\n</script>\n";

	        /**
	         * Fires after the data for all registered elements has been printed to the screen.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_print_library_data' );
        }

        /**
         * Prints the data and templates for all element instances to the page.
         *
         * @since 1.0.0
         */
        public function print_element_data() {

	        if ( did_action( 'tailor_print_element_data' ) ) {
		        return;
	        }

	        $sanitized_models = $this->sanitize_models( $this->get_saved_models() );

	        echo $this->get_templates_html( $sanitized_models );

	        echo "<script type=\"text/javascript\">\n var _elements = " . wp_json_encode( $sanitized_models ) . ";\n</script>\n";

	        /**
	         * Fires after the element data and templates have been printed to the screen.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_print_element_data' );
        }

	    /**
	     * Prints the default Underscore templates to the page.
	     *
	     * @since 1.0.0
	     */
	    public function print_default_template_html() {

		    if ( did_action( 'tailor_print_default_template_html' ) ) {
			    return;
		    }

		    foreach ( $this->get_elements() as $element ) { /* @var $element Tailor_Element */

			    $tag = $element->tag;
			    $default_atts = array();
			    foreach ( $element->settings() as $setting ) { /* @var $setting Tailor_Setting */
				    $default_atts[ $setting->id ] = $setting->default;
			    }

			    $content = array_key_exists( 'content', $default_atts ) ? $default_atts['content'] : '';
			    unset( $default_atts['content'] );

			    $shortcode = $element->generate_shortcode( '', $default_atts, $content );
			    echo $this->get_template_html( $tag . '-default', $shortcode );
		    }

		    /**
		     * Fires after the default element templates have been printed to the screen.
		     *
		     * @since 1.0.0
		     */
		    do_action( 'tailor_print_default_template_html' );
	    }

	    /**
	     * Returns the template HTML for a given set of elements.
	     *
	     * @since 1.0.0
	     *
	     * @param $sanitized_models
	     * @return string
	     */
	    public function get_templates_html( $sanitized_models ) {

		    $template_html = '';

		    if ( ! empty( $sanitized_models ) ) {
			    foreach ( $sanitized_models as $sanitized_model ) {

				    $element = $this->get_element( $sanitized_model['tag'] );
				    $content = $this->get_content( $sanitized_model['atts'] );

				    $shortcode = $element->generate_shortcode( $sanitized_model['id'], $sanitized_model['atts'], $content );
				    $template_html .= $this->get_template_html( $sanitized_model['id'], $shortcode );
			    }
		    }

		    return $template_html;
	    }

	    /**
	     * Returns the template for an individual element.
	     *
	     * @since 1.0.0
	     *
	     * @param $element_id
	     * @param $shortcode
	     * @return string
	     */
	    protected function get_template_html( $element_id, $shortcode ) {

		    return  '<script id="tmpl-tailor-' . $element_id . '" type="text/html">' .
		                do_shortcode( $shortcode ) .
		            '</script>';
	    }

	    /**
	     * Renders a given set of elements and returns the generated templates.
	     *
	     * @since 1.0.0
	     */
	    public function render_elements() {

		    check_ajax_referer( 'tailor-reset', 'nonce' );

		    $unsanitized_models = json_decode( wp_unslash( $_POST['models'] ), true );
		    if ( ! is_array( $unsanitized_models ) ) {
			    wp_send_json_error( array(
				    'message'           =>  __( 'Tailor Elements: Valid models was not provided', 'tailor' )
			    ) );
		    }

		    $sanitized_models = $this->sanitize_models( $unsanitized_models );
		    $sanitized_models = $this->refresh_ids( $sanitized_models );
		    $templates_html = $this->get_templates_html( $sanitized_models );

		    wp_send_json_success( array(
			    'models'            =>  $sanitized_models,
			    'templates'         =>  $templates_html,
			    'css'               =>  tailor_css()->generate_element_css( $sanitized_models ),
		    ) );
	    }

	    /**
	     * Returns the content containing oEmbeds from the element attributes array.
	     *
	     * @since 1.0.0
	     *
	     * @global $wp_embed
	     *
	     * @param array $atts
	     * @return string
	     */
	    protected function get_content( &$atts = array() ) {

		    if ( array_key_exists( 'content', $atts ) ) {

			    global $wp_embed;

			    $wp_embed->post_ID = 1;
			    $content = $wp_embed->autoembed( $atts['content'] );
			    unset( $atts['content'] );
		    }
		    else {
			    $content = '';
		    }

		    return $content;
	    }

        /**
         * Renders a given element.
         *
         * @since 1.0.0
         */
        public function render_element() {

	        check_ajax_referer( 'tailor-render', 'nonce' );

	        $unsanitized_model = json_decode( wp_unslash( $_POST['model'] ), true );
            if ( ! is_array( $unsanitized_model ) ) {
	            wp_send_json_error( array(
		            'message'           =>  __( 'Tailor Elements: A valid model was not provided', 'tailor' )
	            ) );
            }

	        $sanitized_model = $this->sanitize_model( $unsanitized_model );
	        $element = $this->get_element( $sanitized_model['tag'] );
	        $content = $this->get_content( $sanitized_model['atts'] );

	        wp_send_json_success( array(
		        'html'          =>  do_shortcode( $element->generate_shortcode( $sanitized_model['id'], $sanitized_model['atts'], $content ) ),
		        'css'           =>  tailor_css()->generate_element_css( array( $sanitized_model ) ),
	        ) );
        }

	    /**
	     * Sanitizes a given set of element models.
	     *
	     * @since 1.0.0
	     *
	     * @param array $unsanitized_models
	     * @return array
	     */
	    public function sanitize_models( $unsanitized_models ) {
		    $sanitized_models = array();

		    foreach ( $unsanitized_models as $unsanitized_model ) {
			    if ( ! $sanitized_model = $this->sanitize_model( $unsanitized_model ) ) {
				    continue;
			    }

			    $element = $this->get_element( $sanitized_model['tag'] );
			    $sanitized_model['type'] = $element->type;

			    if ( property_exists( $element, 'child' ) && ! empty( $element->child ) ) {
				    $sanitized_model['child'] = $element->child;
			    }

			    $sanitized_models[] = $sanitized_model;
		    }

		    return $sanitized_models;
	    }

	    /**
	     * Refreshes the ids (and parent references) for a given set of models.
	     *
	     * @since 1.0.0
	     *
         * @param array $models
	     * @return array $models
	     */
	    public function refresh_ids( $models ) {
		    $model_ids = $updated_models = array();
            $id_base = uniqid();

		    foreach ( $models as $model ) {
			    if ( ! array_key_exists( $model['id'], $model_ids ) ) {
				    $model_ids[ $model['id'] ] = 't' . $id_base++;
			    }

                $model['id'] = $model_ids[ $model['id'] ];

			    if ( ! empty( $model['parent'] ) ) {
				    if ( ! array_key_exists( $model['parent'], $model_ids ) ) {
					    $model_ids[ $model['parent'] ] = 't' . $id_base++;
				    }

				    $model['parent'] = $model_ids[ $model['parent'] ];
			    }

			    $updated_models[] = $model;
		    }

		    return $updated_models;
	    }

	    /**
	     * Sanitizes a given element model.
	     *
	     * @since 1.0.0
	     *
	     * @param $unsanitized_model
	     * @return array|bool
	     */

	    /**
	     * @param $unsanitized_model
	     *
	     * @return array|mixed|void
	     */
	    protected function sanitize_model( $unsanitized_model ) {

		    $sanitized_atts = array();

		    if ( $element = $this->get_element( $unsanitized_model['tag'] ) ) {
			    foreach ( $element->settings() as $setting ) { /* @var $setting Tailor_Setting */

				    if ( ! array_key_exists( $setting->id, $unsanitized_model['atts'] ) ) {
					    $sanitized_atts[ $setting->id ] = $setting->sanitize( $setting->default );
				    }
				    else {
					    $sanitized_atts[ $setting->id ] = $setting->sanitize( $unsanitized_model['atts'][ $setting->id ] );
				    }
			    }
		    }
		    else {
			    $element = $this->get_element( 'tailor_content' );
			    $sanitized_atts['content'] = sprintf(
				    __( 'The element associated with shortcode %s could not be found.', 'tailor' ),
				    '<code>'  . esc_attr( $unsanitized_model['tag'] ) . '</code>'
			    );

			    $sanitized_atts['content'] = "<p class=\"error\">{$sanitized_atts['content']}</p>";
		    }

		    $sanitized_model = array(
			    'id'            =>  $unsanitized_model['id'],
			    'tag'           =>  $element->tag,
			    'label'         =>  $element->label,
			    'atts'          =>  $sanitized_atts,
			    'parent'        =>  $unsanitized_model['parent'],
			    'order'         =>  $unsanitized_model['order'],
		    );

		    /**
		     * Filters the sanitized model.
		     *
		     * @since 1.0.0
		     *
		     * @param array $sanitized_model
		     */
		    $sanitized_model = apply_filters( 'tailor_sanitize_model', $sanitized_model );

		    return $sanitized_model;
	    }

        /**
         * Returns the registered elements.
         *
         * @since 1.0.0
         * @access public
         *
         * @return array
         */
        public function get_elements() {
            return $this->elements;
        }

        /**
         * Returns a registered element.
         *
         * @since 1.0.0
         *
         * @param string $tag Element tag.
         * @return Tailor_Element|void The element, if set.
         */
        public function get_element( $tag ) {
            if ( isset( $this->elements[ $tag ] ) ) {
                return $this->elements[ $tag ];
            }
        }

        /**
         * Adds an element.
         *
         * @since 1.0.0
         *
         * @param Tailor_Element|string $tag Element object, or tag.
         * @param array $args Element arguments; passed to Tailor_Element constructor.
         */
        public function add_element( $tag, $args = array() ) {

            if ( $tag instanceof Tailor_Element ) {
                $element = $tag;
            }
            else if ( isset( $args['class_name'] ) && class_exists( $args['class_name' ] ) ) {
	            $element = new $args['class_name']( $tag, $args );
            }
            else {
                $type = str_replace( '-', '_', $tag );
                $type = preg_replace_callback( "/_[a-z]?/", array( __CLASS__, 'capitalize_word' ), $type );
                $class_name = "{$type}_Element";
	            if ( class_exists( $class_name ) ) {
		            $element = new $class_name( $tag, $args );
	            }
            }

	        if ( isset( $element ) ) {
		        $this->elements[ $element->tag ] = $element;
	        }
        }

        /**
         * Removes an element.
         *
         * @since 1.0.0
         *
         * @param string $tag Element tag.
         */
        public function remove_element( $tag ) {
            unset( $this->elements[ $tag ] );
        }

        /**
         * Capitalizes the first letter of each word in an array.
         *
         * @since 1.0.0
         *
         * @param $matches array
         * @return array
         */
        static function capitalize_word( $matches ) {
            return ucfirst( $matches[ 0 ] );
        }

	    /**
	     * Returns the saved set of elements.
	     *
	     * @since 1.0.0
	     *
	     * @return array
	     */
	    protected function get_saved_models() {

		    $unsanitized_models = get_post_meta( get_the_ID(), '_tailor_layout', true );
		    if ( empty( $unsanitized_models ) ) {
			    $unsanitized_models = $this->get_default_models();
		    }

		    /**
		     * Filters the collection of unsanitized saved models.
		     *
		     * @since 1.0.0
		     *
		     * @param array $unsanitized_models
		     */
		    $unsanitized_models = apply_filters( 'tailor_get_saved_models', $unsanitized_models );

		    return $unsanitized_models;
	    }

	    /**
	     * Returns the default set of elements.
	     *
	     * @since 1.0.0
	     *
	     * @return array
	     */
	    protected function get_default_models() {

		    $section_element = $this->get_element( 'tailor_section' );
		    $content_element = $this->get_element( 'tailor_content' );

		    $default_elements = array(
			    array(
				    'id'            =>  'section-element-1',
				    'tag'           =>  $section_element->tag,
				    'label'         =>  $section_element->label,
				    'atts'          =>  array(),
				    'parent'        =>  '',
				    'order'         =>  0,
			    ),
			    array(
				    'id'            =>  'content-element-1',
				    'tag'           =>  $content_element->tag,
				    'label'         =>  $content_element->label,
				    'atts'          =>  array(
					    'content'       =>  wpautop( get_the_content() ),
				    ),
				    'parent'        =>  'section-element-1',
				    'order'         =>  0,
			    ),
		    );

		    /**
		     * Filters the collection of default models.
		     *
		     * @since 1.0.0
		     *
		     * @param array $default_elements
		     */
		    $default_elements = apply_filters( 'tailor_get_default_models', $default_elements );

		    return $default_elements;
	    }

	    /**
	     * Saves the current collection of elements.
	     *
	     * @since 1.0.0
	     *
	     * @see Tailor::save()
         *
	     * @param string $post_id
	     */
	    public function save_elements( $post_id = '' ) {

		    $post = get_post( $post_id );

            $unsanitized_models = json_decode( wp_unslash( $_POST['models'] ), true );
		    if ( ! is_array( $unsanitized_models ) ) {
			    wp_send_json_error( array(
				    'message'           =>  __( 'Tailor Elements: Valid models was not provided', 'tailor' )
			    ) );
		    }

		    $sanitized_models = $this->sanitize_models( $unsanitized_models );
		    $sanitized_models = $this->refresh_ids( $sanitized_models );

		    /**
		     * Fires before the sanitized model data has been saved to the database.
		     *
		     * @since 1.0.0
		     *
		     * @param string $post_id
		     * @param array $sanitized_models
		     */
		    do_action( 'tailor_save_models', $post_id, $sanitized_models );

		    update_post_meta( $post_id, '_tailor_layout', $sanitized_models );

		    remove_all_shortcodes();

		    foreach ( $this->get_elements() as $element ) {
			    if ( true != (bool) $element->dynamic ) {
				    $type = str_replace( 'tailor_', '', $element->tag );
				    add_shortcode( $element->tag, "tailor_shortcode_{$type}" );
			    }
		    }

		    $ordered_sanitized_models = $this->order_models_by_parent( $sanitized_models );
		    $shortcodes = $this->get_shortcodes( '', $ordered_sanitized_models );
		    $updated_post_content = $this->unautop( do_shortcode( $shortcodes ) );

		    /**
		     * Fires before the post content has been updated.
		     *
		     * @since 1.0.0
		     *
		     * @param string $post_id
		     * @param string $post->post_content
		     * @param string $updated_post_content
		     */
		    do_action( 'tailor_save_post_content', $post_id, $post->post_content, $updated_post_content );

		    if ( false == get_post_meta( $post_id, '_tailor_original_content', true ) ) {
			    add_post_meta( $post_id, '_tailor_original_content', $post->post_content );
		    }

		    update_post_meta( $post_id, '_tailor_saved_content', $updated_post_content );

		    $data = array(
			    'ID'                =>  $post_id,
			    'post_content'      =>  $updated_post_content,
		    );

		    wp_update_post( $data );

		    /**
		     * Fires after the post content has been updated.
		     *
		     * @since 1.0.0
		     *
		     * @param string $post_id
		     * @param string $post->post_content
		     */
		    do_action( 'tailor_save_post_content_after', $post_id, $updated_post_content );
	    }

	    /**
	     * Formats post content before it's saved to ensure consistency with standard WordPress post content.
	     *
	     * @since 1.0.0
	     *
	     * @param $content
	     *
	     * @return mixed
	     */
	    public function unautop( $content ) {

		    // Ensure divs are on their own line
		    $content = preg_replace( '/(<\/?div[^>]*>)[\s]+/', "$1\n", $content );

		    // Replace p tags with \n's
		    $content = preg_replace( '/\s*<p>\s*(.*?)\s*<\/p>\s*/', "\n\n$1\n\n", $content );

		    // Remove spaces from remaining p tags
		    $content = preg_replace( '/(<p[^>]*>)\s*(.*?)\s*(<\/p>)/', '$1$2$3', $content );

		    // Remove trailing spaces from remaining p tags
		    $content = preg_replace( '/(<\/p>)\s*(<\/\w+>)/', "$1\n\n$2", $content );

		    $content = preg_replace( '/\n\n{2,}/', "\n\n", $content );

		    return $content;
	    }

	    /**
	     * Returns an array of models sorted by parent and order.
	     *
	     * @since 1.0.0
	     *
	     * @param $models
	     * @return array $css_rules
	     */
	    public function order_models_by_parent( $models ) {

		    $ordered_models = array();
		    foreach ( $models as $model ) {
			    $ordered_models[ $model['parent'] ][ $model['order'] ] = $model;
		    }

		    return $ordered_models;
	    }

	    /**
	     * Returns all child (and grandchild) shortcodes for an given model.
	     *
	     * @since 1.0.0
	     *
	     * @param $parent_id
	     * @param $ordered_sanitized_models
	     * @return string
	     */
        public function get_shortcodes( $parent_id, $ordered_sanitized_models ) { //, $dynamic_only = false ) {

	        $shortcodes = '';

            if ( ! isset( $ordered_sanitized_models[ $parent_id ] ) ) {
                return $shortcodes;
            }

            foreach ( $ordered_sanitized_models[ $parent_id ] as $sanitized_model ) {

                $element = $this->get_element( $sanitized_model['tag'] );
	            $content = $this->get_shortcodes( $sanitized_model['id'], $ordered_sanitized_models ); //, $dynamic_only );

	            if ( empty( $content ) && array_key_exists( 'content', $sanitized_model['atts'] ) ) {
		            $content = $sanitized_model['atts']['content'];
	            }
	            unset( $sanitized_model['atts']['content'] );

	            $shortcode = $element->generate_shortcode( $sanitized_model['id'], $sanitized_model['atts'], $content );
	            $shortcodes .= $shortcode;
            }

            return $shortcodes;
        }
    }
}

if ( ! function_exists( 'tailor_elements' ) ) {

	/**
	 * Returns the Tailor Elements instance.
	 *
	 * @since 1.0.0
	 *
	 * @return Tailor_Elements
	 */
	function tailor_elements() {
		return Tailor_Elements::get_instance();
	}
}

/**
 * Initializes the Tailor Elements module.
 *
 * @since 1.0.0
 */
tailor_elements();