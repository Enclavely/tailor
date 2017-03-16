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
		    add_action( 'wp_loaded', array( $this, 'load_elements' ) );
		    add_action( 'tailor_sidebar_footer', array( $this, 'print_element_data' ) );
		    add_action( 'tailor_canvas_footer', array( $this, 'print_element_html' ) );
		    add_action( 'tailor_canvas_footer', array( $this, 'print_default_element_html' ) );
		    add_action( 'wp_ajax_tailor_render', array( $this, 'render_element' ) );
	    }

	    /**
         * Loads elements during initialization.
         *
         * @since 1.0.0
         */
	    public function load_elements() {

		    tailor()->load_directory( 'elements' );
		    
		    /**
		     * Fires after default elements have been loaded.
		     *
		     * @since 1.4.0
		     *
		     * @param Tailor_Elements $this
		     */
		    do_action( 'tailor_load_elements', $this );

		    $this->register_elements();
        }

        /**
         * Registers the default set of elements.
         *
         * @since 1.0.0
         */
        public function register_elements() {

	        /**
	         * Container and child elements.
	         *
	         * These have a parent-child relationship (e.g., a tabs container can contain one or more tabs). Child
	         * elements, in turn, can contain a combination of wrapper and content elements.
	         */
	        $this->add_element( 'tailor_carousel', array(
		        'label'             =>  __( 'Carousel', 'tailor' ),
		        'description'       =>  __( 'Display content in a carousel.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_carousel_item',
		        'child_container'   =>  '.tailor-carousel__wrap',
	        ) );

	        $this->add_element( 'tailor_carousel_item', array(
		        'label'             =>  __( 'Carousel item', 'tailor' ),
		        'type'              =>  'child',
	        ) );

	        $this->add_element( 'tailor_grid', array(
		        'label'             =>  __( 'Grid', 'tailor' ),
		        'description'       =>  __( 'Display content in a grid.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_grid_item',
	        ) );

	        $this->add_element( 'tailor_grid_item', array(
		        'label'             =>  __( 'Grid item', 'tailor' ),
		        'type'              =>  'child',
	        ) );

	        $this->add_element( 'tailor_list', array(
		        'label'             =>  __( 'List', 'tailor' ),
		        'type'              =>  'container',
		        'description'       =>  __( 'Display content in list items.', 'tailor' ),
		        'child'             =>  'tailor_list_item',
	        ) );

	        $this->add_element( 'tailor_list_item', array(
		        'label'             =>  __( 'List item', 'tailor' ),
		        'type'              =>  'child',
		        'child_container'   =>  '.tailor-list__content',
	        ) );

	        $this->add_element( 'tailor_map', array(
		        'label'             =>  __( 'Map', 'tailor' ),
		        'description'       =>  __( 'A Google map.', 'tailor' ),
		        'child'             =>  'tailor_map_marker',
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_map_marker', array(
		        'label'             =>  __( 'Map marker', 'tailor' ),
		        'type'              =>  'child',
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_row', array(
		        'label'             =>  __( 'Row', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_column',
	        ) );

	        $this->add_element( 'tailor_column', array(
		        'label'             =>  __( 'Column', 'tailor' ),
		        'type'              =>  'child',
	        ) );

	        $this->add_element( 'tailor_tabs', array(
		        'label'             =>  __( 'Tabs', 'tailor' ),
		        'description'       =>  __( 'Display content in tabs.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_tab',
		        'child_container'   =>  '.tailor-tabs__content',
	        ) );

	        $this->add_element( 'tailor_tab', array(
		        'label'             =>  __( 'Tab', 'tailor' ),
		        'type'              =>  'child',
	        ) );

	        $this->add_element( 'tailor_toggles', array(
		        'label'             =>  __( 'Toggles', 'tailor' ),
		        'description'       =>  __( 'Display content in toggles.', 'tailor' ),
		        'type'              =>  'container',
		        'child'             =>  'tailor_toggle',
	        ) );

	        $this->add_element( 'tailor_toggle', array(
		        'label'             =>  __( 'Toggle', 'tailor' ),
		        'type'              =>  'child',
		        'child_container'   =>  '.tailor-toggle__body',
	        ) );


	        /**
	         * Wrapper elements.
	         *
	         * These contain one or more content elements.
	         */
	        $this->add_element( 'tailor_section', array(
		        'label'             =>  __( 'Section', 'tailor' ),
		        'description'       =>  __( 'Group and style content.', 'tailor' ),
		        'type'              =>  'wrapper',
		        'child_container'   =>  '.tailor-section__content',
	        ) );

	        $this->add_element( 'tailor_card', array(
		        'label'             =>  __( 'Card', 'tailor' ),
		        'description'       =>  __( 'Display content inside a card.', 'tailor' ),
		        'type'              =>  'wrapper',
		        'child_container'   =>  '.tailor-card__content',
	        ) );

	        $this->add_element( 'tailor_hero', array(
		        'label'             =>  __( 'Hero', 'tailor' ),
		        'description'       =>  __( 'Emphasize content in a hero pane.', 'tailor' ),
		        'type'              =>  'wrapper',
		        'child_container'   =>  '.tailor-hero__content',
	        ) );

	        $this->add_element( 'tailor_box', array(
		        'label'             =>  __( 'Box', 'tailor' ),
		        'description'       =>  __( 'Display content inside a box.', 'tailor' ),
		        'type'              =>  'wrapper',
		        'child_container'   =>  '.tailor-box__content',
	        ) );


	        /**
	         * Content elements.
	         *
	         * These are responsible for rendering content and do not contain child elements.
	         */
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
	        ) );

	        $this->add_element( 'tailor_user', array(
		        'label'             =>  __( 'User', 'tailor' ),
		        'description'       =>  __( 'A user profile box.', 'tailor' ),
	        ) );

	        $this->add_element( 'tailor_widgets', array(
		        'label'             =>  __( 'Widgets', 'tailor' ),
		        'description'       =>  __( 'A widget area from your site.', 'tailor' ),
		        'dynamic'           =>  true,
	        ) );


	        /**
	         * Plugin dependent elements.
	         *
	         * These will only become active when the plugin on which they depend is active.
	         */
	        $this->add_element( 'tailor_form_cf7', array(
		        'label'             =>  __( 'Contact form', 'tailor' ),
		        'description'       =>  __( 'A contact form.', 'tailor' ),
		        'badge'             =>  __( 'Contact Form 7', 'tailor' ),
		        'active_callback'   =>  'is_contact_form_7_active',
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_jetpack_portfolio', array(
		        'label'             =>  __( 'Portfolio', 'tailor' ),
		        'description'       =>  __( 'Your site\'s projects.', 'tailor' ),
		        'badge'             =>  __( 'Jetpack', 'tailor' ),
		        'active_callback'   =>  'is_jetpack_portfolio_active',
		        'dynamic'           =>  true,
	        ) );

	        $this->add_element( 'tailor_jetpack_testimonials', array(
		        'label'             =>  __( 'Testimonals', 'tailor' ),
		        'description'       =>  __( 'Your site\'s testimonials.', 'tailor' ),
		        'badge'             =>  __( 'Jetpack', 'tailor' ),
		        'active_callback'   =>  'is_jetpack_testimonials_active',
		        'dynamic'           =>  true,
	        ) );

	        
	        /**
	         * Fires after default elements have been registered.
	         *
	         * @since 1.0.0
	         *
	         * @param Tailor_Elements $this
	         */
	        do_action( 'tailor_register_elements', $this );
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
         * Prints the data for all registered elements to the page.
         *
         * @since 1.0.0
         */
        public function print_element_data() {

	        if ( did_action( 'tailor_print_element_data' ) ) {
		        return;
	        }

            $library_items = array();
            foreach ( $this->get_elements() as $element ) { /* @var $element Tailor_Element */
	            $library_items[] = $element->to_json();
            }
	        
	        $library_items = wp_json_encode( $library_items );
	        
	        echo "<script type=\"text/javascript\">\n var _library = {$library_items}; \n</script>\n";
	        
	        /**
	         * Fires after the data for all registered elements has been printed to the screen.
	         *
	         * @since 1.4.0
	         */
	        do_action( 'tailor_print_element_data' );
        }

	    /**
	     * Returns the HTML for a given set of elements.
	     *
	     * @since 1.0.0
	     *
	     * @param $sanitized_models
	     * @return string
	     */
	    public function generate_element_html( $sanitized_models ) {

		    $element_html = '';

		    if ( ! empty( $sanitized_models ) ) {
			    foreach ( $sanitized_models as $sanitized_model ) {
				    $element = $this->get_element( $sanitized_model['tag'] );
				    $content = $this->get_oembed_content( $sanitized_model['atts'] );
				    $shortcode = $element->generate_shortcode( $sanitized_model['id'], $sanitized_model['atts'], $content );
				    $element_html .= $this->wrap_element_html( $sanitized_model['id'], $shortcode );
			    }
		    }

		    return $element_html;
	    }

	    /**
	     * Returns the HTML for the default set of elements.
	     *
	     * @since 1.0.0
	     *
	     * @return string
	     */
	    public function generate_default_element_html() {
		    $default_element_html = '';

		    foreach ( $this->get_elements() as $element ) { /* @var $element Tailor_Element */
			    if ( ! $element->active() ) {
				    continue;
			    }

			    $atts = array();
			    $content = '';

			    foreach ( $element->settings() as $setting ) { /* @var $setting Tailor_Setting */

				    // Do not save content as an attribute
				    if ( 'content' == $setting->id ) {
					    $content = $setting->default;
					    continue;
				    }
				    $atts[ $setting->id ] = $setting->default;
			    }

			    $shortcode = $element->generate_shortcode( '', $atts, $content );
			    $default_element_html .= $this->wrap_element_html( $element->tag . '-default', $shortcode );
		    }

		    return $default_element_html;
	    }
	    
	    /**
	     * Prints the element HTML (Underscore templates) to the page.
	     *
	     * @since 1.4.0
	     */
	    public function print_element_html() {

		    if ( did_action( 'tailor_print_element_html' ) ) {
			    return;
		    }

		    // Print the element HTML to the screen
		    $post_id = get_the_ID();
		    $sanitized_models = tailor_models()->get_sanitized_models( $post_id, true );
		    $element_html = $this->generate_element_html( $sanitized_models );

		    /**
		     * Filter the element HTML.
		     *
		     * @since 1.4.0
		     *
		     * @param string $element_html
		     * @param int $post_id
		     */
		    $element_html = apply_filters( 'tailor_print_element_html', $element_html, $post_id );

		    echo $element_html;

		    /**
		     * Fires after the element templates have been printed to the screen.
		     *
		     * @since 1.4.0
		     */
		    do_action( 'tailor_print_element_html' );
	    }

	    /**
	     * Prints the default element HTML (Underscore templates) to the page.
	     *
	     * @since 1.4.0
	     */
	    public function print_default_element_html() {

		    if ( did_action( 'tailor_print_default_element_html' ) ) {
			    return;
		    }

		    $post_id = get_the_ID();
		    $default_element_html = $this->generate_default_element_html();

		    /**
		     * Filter the element HTML.
		     *
		     * @since 1.4.0
		     *
		     * @param string $default_element_html
		     * @param int $post_id
		     */
		    $default_element_html = apply_filters( 'tailor_print_default_element_html', $default_element_html, $post_id );

		    echo $default_element_html;

		    /**
		     * Fires after the default element templates have been printed to the screen.
		     *
		     * @since 1.4.0
		     */
		    do_action( 'tailor_print_default_element_html' );
	    }

	    /**
	     * Wraps the HTML for a given element in a script tag.
	     *
	     * @since 1.4.0
	     *
	     * @param $element_id
	     * @param $shortcode
	     * @return string
	     */
	    protected function wrap_element_html( $element_id, $shortcode ) {
		    return  '<script id="tmpl-tailor-' . $element_id . '" type="text/html">' .
		                do_shortcode( $shortcode ) .
		            '</script>';
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
		            'message'           =>  __( 'A valid model was not provided', 'tailor' )
	            ) );
            } 

	        $sanitized_model = tailor_models()->sanitize_model( $unsanitized_model );
	        $element = $this->get_element( $sanitized_model['tag'] );
	        $content = $this->get_oembed_content( $sanitized_model['atts'] );
	        $shortcode = $element->generate_shortcode( $sanitized_model['id'], $sanitized_model['atts'], $content );

	        wp_send_json_success( array(
		        'html'          =>  do_shortcode( $shortcode ),
		        'css'           =>  tailor_css()->generate_dynamic_css_rules( array( $sanitized_model ) ),
	        ) );
        }

	    /**
	     * Returns the content containing oEmbeds from the element attributes array.
	     *
	     * @since 1.4.0
	     *
	     * @global $wp_embed
	     *
	     * @param array $atts
	     * @return string
	     */
	    protected function get_oembed_content( &$atts = array() ) {
		    
		    if ( ! array_key_exists( 'content', $atts ) ) {
			    return '';
		    }

		    global $wp_embed;
		    $wp_embed->post_ID = 1;
		    $content = $wp_embed->autoembed( $atts['content'] );

		    unset( $atts['content'] );

		    return $content;
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