<?php

/**
 * Custom CSS class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Custom_CSS' ) ) {

    /**
     * Tailor Custom CSS class.
     *
     * @since 1.0.0
     */
    class Tailor_Custom_CSS {

        /**
         * The custom CSS instance.
         *
         * @since 1.0.0
         * @access private
         * @var Tailor_Custom_CSS
         */
        private static $instance;

	    /**
	     * The post meta key used to store custom CSS.
	     *
	     * @since 1.4.0
	     *
	     * @var mixed|void
	     */
	    private $custom_css_key;

	    /**
	     * The post meta key used to store dynamic CSS data.
	     *
	     * @since 1.4.0
	     *
	     * @var mixed|void
	     */
	    private $dynamic_css_key;

        /**
         * Returns a singleton instance.
         *
         * @since 1.0.0
         *
         * @return Tailor_Custom_CSS
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

	        /**
	         * Filter the meta key used to store custom CSS.
	         * 
	         * @since 1.4.0
	         *
	         * @param string
	         */
	        $this->custom_css_key = (string) apply_filters( 'tailor_custom_css_key', '_tailor_page_css' );

	        /**
	         * Filter the meta key used to store dynamic CSS.
	         * 
	         * @since 1.4.0
	         *
	         * @param string
	         */
	        $this->dynamic_css_key = (string) apply_filters( 'tailor_dynamic_css_key', '_tailor_element_css' );

            $this->add_actions();
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {

	        // Print CSS
            //add_action( 'wp_head', array( $this, 'print_customizer_css' ) );
            add_action( 'wp_head', array( $this, 'print_custom_css' ) );
            add_action( 'wp_head', array( $this, 'print_dynamic_css' ) );

	        // Print CSS rule sets
	        add_action( 'tailor_canvas_footer', array( $this, 'print_dynamic_css_rules' ) );
	        add_action( 'tailor_canvas_footer', array( $this, 'print_setting_css_rules' ) );

	        // Save CSS rule sets
	        add_action( 'tailor_save_models', array( $this, 'save_dynamic_css_rules' ), 10, 2 );

	        // Update CSS rule sets when the model collection changes
	        add_action( 'tailor_change_collection', array( $this, 'save_dynamic_css_rules' ), 10, 2 );

	        add_filter( 'tailor_get_custom_css', array( $this, 'add_dynamic_css' ) );
        }

	    /**
	     * Returns the saved custom CSS rules for the current page or post.
	     *
	     * @since 1.4.0
	     * @access private
	     *
	     * @param int $post_id
	     *
	     * @return array|mixed|void
	     */
	    private function get_dynamic_css_rules( $post_id = null ) {

		    if ( empty( $post_id ) ) {
			    $post_id = get_the_ID();
		    }

		    $dynamic_css_rules = get_post_meta( $post_id, $this->dynamic_css_key, true );
		    if ( false == $dynamic_css_rules ) {
			    $dynamic_css_rules = array();
		    }

		    /**
		     * Filter the dynamic CSS rules.
		     *
		     * @since 1.4.0
		     *
		     * @param string $dynamic_css_rules
		     * @param int $post_id
		     */
		    $dynamic_css_rules = apply_filters( 'tailor_get_dynamic_css_rules', $dynamic_css_rules, $post_id );

		    return $dynamic_css_rules;
	    }

	    /**
	     * Generates CSS rules for a collection of models.
	     *
	     * @since 1.4.0
	     *
	     * @param array $sanitized_models
	     * @return array $collection_css_rules
	     */
	    public function generate_dynamic_css_rules( $sanitized_models ) {

		    $collection_css_rules = array();

		    if ( ! empty( $sanitized_models ) ) {
			    foreach ( (array) $sanitized_models as $sanitized_model ) {
				    $element = tailor_elements()->get_element( $sanitized_model['tag'] );
				    if ( ! method_exists( $element, 'generate_css' ) ) {
					    continue;
				    }

				    $css_rule_sets = $element->generate_css( $sanitized_model['atts'] );

				    /**
				     * Filter the element CSS rule sets.
				     *
				     * @since 1.3.6
				     */
				    $css_rule_sets = apply_filters( 'tailor_element_css_rule_sets', $css_rule_sets, $sanitized_model['atts'], $element );

				    /**
				     * Filter the element CSS rule sets.
				     *
				     * @since 1.3.6
				     */
				    $css_rule_sets = apply_filters( 'tailor_element_css_rule_sets_' . $sanitized_model['tag'], $css_rule_sets, $sanitized_model['atts'], $element );

				    // Organize into media queries
				    foreach ( $css_rule_sets as $css_rule_set ) {
					    $media = empty( $css_rule_set['media'] ) ? 'all' : $css_rule_set['media'];

					    if ( ! array_key_exists( $media, $collection_css_rules ) ) {
						    $collection_css_rules[ $media ] = array();
					    }

					    if ( ! array_key_exists( $sanitized_model['id'], $collection_css_rules[ $media ] ) ) {
						    $collection_css_rules[ $media ][ $sanitized_model['id'] ] = array();
					    }

					    $setting_id = empty( $css_rule_set['setting'] ) ? '' : $css_rule_set['setting'];

					    $collection_css_rules[ $media ][ $sanitized_model['id'] ][] = array(
						    'setting'           =>  $setting_id,
						    'selectors'         =>  $css_rule_set['selectors'],
						    'declarations'      =>  $css_rule_set['declarations'],
					    );
				    }
			    }
		    }

		    /**
		     * Filter the dynamic CSS rules.
		     *
		     * @since 1.4.0
		     *
		     * @param string $collection_css_rules
		     */
		    $collection_css_rules = apply_filters( 'tailor_generate_dynamic_css_rules', $collection_css_rules );

		    return $collection_css_rules;
	    }

	    /**
	     * Generates CSS rules for a template's collection of models.
	     *
	     * @since 1.4.0
	     * @access private
	     *
	     * @return array|mixed|void
	     */
	    private function generate_template_dynamic_css_rules() {

		    $template_css_rules = array();

		    // Do nothing if a template ID is not provided
		    if ( empty( $_GET['template_id'] ) ) {
			    return $template_css_rules;
		    }

		    $template = tailor_templates()->get_models( $_GET['template_id'] );
		    if ( false == $template || empty( $template['models'] ) ) {
			    return $template_css_rules;
		    }

		    $template_css_rules = $this->generate_dynamic_css_rules( $template['models'] );

		    /**
		     * Filter the template CSS data.
		     *
		     * @since 1.4.0
		     *
		     * @param string $template_css_rules
		     */
		    $template_css_rules = apply_filters( 'tailor_generate_template_dynamic_css_rules', $template_css_rules );

		    return $template_css_rules;
	    }

	    /**
	     * Returns CSS rules for Customizer/page settings.
	     *
	     * @since 1.4.0
	     *
	     * @return array $setting_css_rules
	     */
	    public function get_setting_css_rules() {

		    $setting_css_rules = array(
			    '_tailor_section_width'     =>  array(),
			    '_tailor_column_spacing'    =>  array(),
			    '_tailor_element_spacing'   =>  array(),
			    '_tailor_mobile_breakpoint' =>  array(),
			    '_tailor_tablet_breakpoint' =>  array(),
		    );

		    $setting_css_rules['_tailor_section_width'][] = array(
			    'media'                 =>  array( 'tablet' ),
			    'selectors'             =>  array( '.tailor-ui .tailor-section .tailor-section__content' ),
			    'declarations'          =>  array(
				    'max-width'             =>  '{{value}}',
			    ),
		    );

		    $setting_css_rules['_tailor_column_spacing'][] = array(
			    'selectors'             =>  array( '.tailor-ui .tailor-row' ),
			    'declarations'          =>  array(
				    'margin-left'           =>  'calc( -{{value}} / 2 )',
				    'margin-right'          =>  'calc( -{{value}} / 2 )',
			    ),
		    );

		    $setting_css_rules['_tailor_column_spacing'][] = array(
			    'selectors'             =>  array( '.tailor-ui .tailor-row .tailor-column' ),
			    'declarations'          =>  array(
				    'padding-left'          =>  'calc( {{value}} / 2 )',
				    'padding-right'         =>  'calc( {{value}} / 2 )',
			    ),
		    );

		    $setting_css_rules['_tailor_element_spacing'][] = array(
			    'selectors'             =>  array( '.tailor-ui .tailor-element' ),
			    'declarations'          =>  array(
				    'margin-bottom'         =>  '{{value}}',
			    ),
		    );

		    $setting_css_rules['_tailor_mobile_breakpoint'][] = array(
			    'selectors'             =>  array( '.tailor-ui .tailor-element' ),
			    'media'                 =>  'mobile',
			    'declarations'          =>  array(
				    'margin-bottom'         =>  '{{value}}',
			    ),
		    );

		    return $setting_css_rules;
	    }

	    /**
	     * Saves custom CSS for the post or page.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param array $sanitized_models
	     */
	    public function save_dynamic_css_rules( $post_id, $sanitized_models ) {

		    // Get the dynamically generated CSS
		    $element_css_rules = $this->generate_dynamic_css_rules( $sanitized_models );

		    // Save the dynamically generated CSS to the post
		    update_post_meta( $post_id, $this->dynamic_css_key, $element_css_rules );
	    }

	    /**
	     * Prints CSS rule data to the page.
	     *
	     * @since 1.4.0
	     */
	    public function print_dynamic_css_rules() {
		    if ( did_action( 'tailor_print_dynamic_css_rules' ) ) {
			    return;
		    }

		    $sanitized_models = tailor_models()->get_sanitized_models( get_the_ID() );
		    $css_rule_sets = $this->generate_dynamic_css_rules( $sanitized_models );

		    if ( false != $css_rule_sets && is_array( $css_rule_sets ) ) {
			    $css_rule_sets = wp_json_encode( $css_rule_sets );
			    echo "<script type=\"text/javascript\">\n var _css_rules = {$css_rule_sets}; \n</script>\n";
		    }

		    /**
		     * Fires after the CSS data has been printed to the screen.
		     *
		     * @since 1.4.0
		     */
		    do_action( 'tailor_print_dynamic_css_rules' );
	    }

	    /**
	     * Prints page CSS rule data to the page.
	     *
	     * @since 1.4.0
	     */
	    public function print_setting_css_rules() {
		    $css_rule_sets = $this->get_setting_css_rules();
		    if ( ! empty( $css_rule_sets ) ) {
			    $css_rule_sets = wp_json_encode( $css_rule_sets );
			    echo "<script type=\"text/javascript\">\n var _pageRules = {$css_rule_sets}; \n</script>\n";
		    }

		    /**
		     * Fires after the CSS data has been printed to the screen.
		     *
		     * @since 1.4.0
		     */
		    do_action( 'tailor_print_setting_css_rules' );
	    }
	    
	    /**
	     * Generates CSS from a collection of CSS rules.
	     *
	     * @since 1.4.0
	     *
	     * @param array $css_rule_sets
	     *
	     * @return string $css
	     */
	    protected function generate_css( $css_rule_sets ) {

		    $css = '';

		    // Generate CSS based on the CSS rule sets
		    if ( ! empty( $css_rule_sets ) ) {
			    $t = '';
			    $n = "\n";
			    $css = $n;
			    $available_media_queries = tailor_get_registered_media_queries( true );

			    foreach ( $css_rule_sets as $media_query_id => $element_rule_sets ) {
				    $media_query_type = str_replace( '-up', '', $media_query_id );

				    if ( ! array_key_exists( $media_query_type, $available_media_queries ) ) {
					    continue;
				    }

				    if ( 'all' != $media_query_id ) {
					    $t = "\t";
					    $query_string = "{$n}@media only screen";

					    if ( ! empty( $available_media_queries[ $media_query_type ]['min'] ) ) {
						    $query_string .= ' and (min-width: ' . $available_media_queries[ $media_query_type ]['min'] . ')';

						    if ( ! empty( $available_media_queries[ $media_query_type ]['max'] ) && false == strpos( $media_query_id, '-up' ) ) {
							    $query_string .= ' and (max-width: ' . $available_media_queries[ $media_query_type ]['max'] . ')';
						    }
					    }
					    else if ( ! empty( $available_media_queries[ $media_query_type ]['max'] ) ) {
						    $query_string .= ' and (max-width: ' . $available_media_queries[ $media_query_type ]['max'] . ')';
					    }

					    $css .= $query_string . " {{$n}";
				    }

				    foreach ( $element_rule_sets as $element_id => $rule_set ) {
					    foreach ( $rule_set as $rule ) {
						    $css .= $this->parse_selectors( $element_id, $rule['selectors'], $t ) . ' {' . $n;
						    $css .= $this->parse_declarations( $rule['declarations'], $t );
						    $css .= $t . '}' . $n;
					    }
				    }

				    if ( 'all' != $media_query_id ) {
					    $css .= '}' . $n;
				    }
			    }

		    }

		    return $css;
	    }
	    
	    /**
	     * Returns the custom CSS for a post.
	     *
	     * @since 1.4.0
	     * @access private
	     *
	     * @param int $post_id
	     *
	     * @return string $custom_page_css
	     */
	    private function get_custom_css( $post_id = null ) {

		    $post = get_post( $post_id );
		    if ( ! $post ) {
			    return '';
		    }

		    $custom_css = get_post_meta( $post_id , $this->custom_css_key, true );
		    if ( empty( $custom_css ) ) {
			    return '';
		    }

		    /**
		     * Filter the custom CSS for the page or post.
		     *
		     * @since 1.4.0
		     *
		     * @param string $custom_css
		     * @param int $post_id
		     */
		    $custom_css = apply_filters( 'tailor_get_custom_css', $custom_css, $post_id );

		    return $custom_css;
	    }

	    /**
	     * Adds CSS based on Customizer/page settings to the custom page CSS.
	     *
	     * @since 1.7.2
	     *
	     * @param $custom_page_css
	     *
	     * @return string
	     */
	    public function add_dynamic_css( $custom_page_css ) {
		    $post_id = get_the_ID();
		    $css_rule_sets = tailor_css()->get_setting_css_rules();

		    if ( ! empty( $css_rule_sets ) ) {
			    foreach ( $css_rule_sets as $setting_id => $css_rules ) {
				    $setting_value = get_post_meta( $post_id, $setting_id, true );
				    if ( empty( $setting_value ) ) {
					    continue;
				    }

				    if ( ! empty( $css_rules ) ) {
					    foreach ( $css_rules as $css_rule ) {
						    $selectors = implode(  ",\n", $css_rule['selectors'] );
						    $declarations = tailor_css()->parse_declarations( $css_rule['declarations'], '' );
						    $custom_page_css .= str_replace( '{{value}}', $setting_value, "{$selectors} {\n{$declarations}}\n" );
					    }
				    }
			    }
		    }

		    return $custom_page_css;
	    }

	    /**
	     * Prints Customizer CSS.
	     *
	     * @since 1.4.0
	     */
	    public function print_customizer_css() {

		    if ( did_action( 'tailor_print_customizer_css' ) ) {
			    return;
		    }

		    /**
		     * Allow developers to prevent Customizer CSS from being printed.
		     *
		     * @since 1.4.0
		     *
		     * @param bool
		     */
		    if ( ! apply_filters( 'tailor_enable_customizer_css', true ) ) {
			    return;
		    }

		    $customizer_css = '';
		    $css_rule_sets = tailor_css()->get_setting_css_rules();

		    if ( ! empty( $css_rule_sets ) ) {
			    foreach ( $css_rule_sets as $setting_id => $css_rules ) {
				    $setting_value = get_theme_mod( ltrim( $setting_id, '_' ), false );

				    if ( empty( $setting_value ) ) {
					    continue;
				    }

				    if ( ! empty( $css_rules ) ) {
					    foreach ( $css_rules as $css_rule ) {
						    $selectors = implode(  ",\n", $css_rule['selectors'] );
						    $declarations = tailor_css()->parse_declarations( $css_rule['declarations'], '' );
						    $customizer_css .= str_replace( '{{value}}', $setting_value, "{$selectors} {\n{$declarations}}\n" );
					    }
				    }
			    }
		    }
		    
		    $customizer_css = $this->clean_css( $customizer_css );

		    // Do nothing if there is no Customizer CSS
		    if ( ! empty( $customizer_css ) ) {
			    echo "<style id=\"tailor-customizer-css\" type=\"text/css\">\n{$customizer_css}\n</style>\n";
		    }

		    /**
		     * Fires after Customizer CSS has been printed.
		     *
		     * @since 1.0.0
		     */
		    do_action( 'tailor_print_customizer_css' );
	    }
	    
	    /**
	     * Prints custom CSS.
	     *
	     * @since 1.4.0
	     */
	    public function print_custom_css() {

		    // Do nothing if this is a canvas page load
		    if ( tailor()->is_canvas() ) {
			    return;
		    }

		    // Do nothing if this action has already been performed
		    if ( did_action( 'tailor_print_custom_css' ) ) {
			    return;
		    }

		    /**
		     * Allow developers to prevent CSS from being printed.
		     *
		     * @since 1.4.0
		     *
		     * @param bool
		     */
		    if ( ! apply_filters( 'tailor_enable_custom_css', true ) ) {
			    return;
		    }

		    $post_id = get_the_ID();
		    $custom_css = $this->clean_css( $this->get_custom_css( $post_id ) );

		    // Do nothing if there is no custom CSS
		    if ( empty( $custom_css ) ) {
			    return;
		    }

		    echo "<style id=\"tailor-custom-page-css\" type=\"text/css\">\n{$custom_css}\n</style>\n";

		    /**
		     * Fires after custom page CSS has been printed.
		     *
		     * @since 1.4.0
		     */
		    do_action( 'tailor_print_custom_css' );
	    }

	    /**
	     * Prints dynamic CSS.
	     *
	     * @since 1.0.0
	     */
	    public function print_dynamic_css() {

		    // Do nothing if this is a canvas page load
		    if ( tailor()->is_canvas() ) {
			    return;
		    }

		    // Do nothing if this action has already been performed
		    if ( did_action( 'tailor_print_dynamic_css' ) ) {
			    return;
		    }

		    /**
		     * Allow developers to prevent custom element CSS from being printed.
		     *
		     * @since 1.4.0
		     *
		     * @param bool
		     */
		    if ( ! apply_filters( 'tailor_enable_dynamic_css', true ) ) {
			    return;
		    }

		    if ( tailor()->is_template_preview() ) {
			    $css_rule_sets = $this->generate_template_dynamic_css_rules();
		    }
		    else {
			    $post_id = get_the_ID();
			    $css_rule_sets = $this->get_dynamic_css_rules( $post_id );
		    }
		    
		    $dynamic_css = $this->clean_css( $this->generate_css( $css_rule_sets ) );

		    // Do nothing if there is no dynamic CSS
		    if ( empty( $dynamic_css ) ) {
			    return;
		    }

		    echo "<style id=\"tailor-dynamic-css\" type=\"text/css\">\n{$dynamic_css}\n</style>\n";

		    /**
		     * Fires after dynamic CSS has been printed.
		     *
		     * @since 1.4.0
		     */
		    do_action( 'tailor_print_dynamic_css' );
	    }

	    /**
	     * Parses CSS selector string(s) for a given element.
	     *
	     * @since 1.0.0
	     *
	     * @param $element_id
	     * @param $selectors
	     * @param string $tab
	     *
	     * @return string
	     */
	    private function parse_selectors( $element_id, $selectors, $tab = '' ) {
		    $element_class = ! empty( $element_id ) ? '.tailor-' . $element_id : '';
		    $n = "\n";
		    $prefix = "{$n}{$tab}.tailor-ui ";
		    
		    if ( empty( $selectors ) ) {
			    return "{$prefix} {$element_class}";
		    }
		    
		    foreach ( $selectors as $key => &$selector ) {
			    if ( $break = strpos( $selector, '&' ) !== false ) {
				    $selector = str_replace( '&', $element_class, $selector );
			    }
			    else {
				    $first_character = substr( $selector, 0, 1 );
				    if ( ':' == $first_character || '::' == $first_character ) {
					    $selector = "{$element_class}{$selector}";
				    }
				    else {
					    $selector = "{$element_class} {$selector}";
				    }
			    }
			    $selector = $prefix . $selector;
		    }

		    return $tab . implode( ',', $selectors );
	    }

	    /**
	     * Parses CSS declarations.
	     *
	     * @since 1.0.0
	     *
	     * @param $declarations
	     * @param string $tab
	     *
	     * @return string
	     */
	    public function parse_declarations( $declarations, $tab = '' ) {
		    $n = "\n";
		    $t = "\t" . $tab;
		    $output = '';

		    foreach ( $declarations as $property => $value ) {
			    if ( empty( $value ) ) {
				    continue;
			    }

			    $parsed_value = "{$t}{$property}:{$value};$n";
			    $output .= $parsed_value;
		    }

		    return $output;
	    }

	    /**
	     * Removes comments and whitespace from CSS.
	     *
	     * @since 1.0.0
	     * @access private
	     *
	     * @param string $css
	     *
	     * @return string $css
	     */
	    private function clean_css( $css = '' ) {
		    $css = preg_replace( '#/\*.*?\*/#s', '', $css );          // Remove comments
		    $css = preg_replace( '/\s*([{}|:;,])\s+/', '$1', $css );  // Remove whitespace
		    $css = preg_replace( '/\s\s+(.*)/', '$1', $css );         // Remove starting whitespace

		    return trim( $css );
	    }
    }
}

if ( ! function_exists( 'tailor_css' ) ) {

	/**
	 * Returns a singleton instance of the custom CSS manager.
	 *
	 * @since 1.0.0
	 *
	 * @return Tailor_Custom_CSS
	 */
	function tailor_css() {
		return Tailor_Custom_CSS::get_instance();
	}
}

tailor_css();