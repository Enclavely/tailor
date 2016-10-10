<?php

/**
 * Widgets class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.6.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Widgets' ) ) {

    /**
     * Tailor Widgets class.
     *
     * @since 1.6.0
     */
    class Tailor_Widgets {

        /**
         * Constructor.
         *
         * @since 1.6.0
         */
        public function __construct() {
            $this->add_actions();
        }

	    /**
	     * Adds required action hooks.
	     *
	     * @since 1.6.0
	     * @access protected
	     */
	    protected function add_actions() {
		    add_action( 'tailor_register_elements', array( $this, 'register_widgets' ) );
		    add_action( 'wp_loaded', array( $this, 'register_shortcodes' ) );
		    add_action( 'tailor_sidebar_footer', array( $this, 'print_widget_form_templates' ) );
	    }

	    /**
	     * Registers widget elements.
	     *
	     * @since 1.6.0
	     *
	     * @param Tailor_Elements $element_manager
	     */
	    public function register_widgets( $element_manager ) {
		    global $wp_widget_factory;
		    foreach ( $wp_widget_factory->widgets as $widget_class_name => $wp_widget ) {
			    $element_manager->add_element( 'tailor_widget_' . $wp_widget->id_base, array(
				    'label'                 =>  $wp_widget->name,
				    'description'           =>  $wp_widget->widget_options['description'],
				    'class_name'            =>  'Tailor_Widget_Element',
				    'widget_id_base'        =>  $wp_widget->id_base,
				    'widget_class_name'     =>  $widget_class_name,
				    'badge'                 =>  __( 'Widget', 'tailor' ),
				    'dynamic'               =>  true,
			    ) );
		    }
        }

	    /**
	     * Dynamically registers shortcodes for the widget elements.
	     *
	     * @since 1.6.0
	     */
        public function register_shortcodes() {
	        global $wp_widget_factory;
	        foreach ( $wp_widget_factory->widgets as $wp_widget ) {
		        add_shortcode( 'tailor_widget_' . $wp_widget->id_base, array( $this, 'render_widget' ) );
	        }
        }

	    /**
	     * Renders widgets within the Widget element.
	     *
	     * @since 1.6.0
	     *
	     * @param $atts
	     * @param null $content
	     * @param $tag
	     *
	     * @return string
	     */
	    public function render_widget( $atts, $content = null, $tag ) {

		    // Process widget attributes
		    $widget_atts = array();
		    foreach ( $atts as $attr => $value ) {
			    if ( substr( $attr, 0, 7 ) == 'widget-' ) {
				    if ( 'on' == $value ) {
					    $widget_atts[ substr( $attr, 7 ) ] = 1;
				    }
				    else {
					    $widget_atts[ substr( $attr, 7 ) ] = wp_slash( $value );
				    }
				    unset( $atts[ $attr ] );
			    }
		    }

		    // Process element attributes
		    $atts = shortcode_atts( array(
			    'id'                =>  '',
			    'class'             =>  '',
			    'widget_id_base'    =>  '',
		    ), $atts, $tag );
		    
		    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
		    $class = trim( esc_attr( "tailor-element tailor-widget {$atts['class']}" ) );
		    $html = '';

		    global $wp_widget_factory;
		    foreach ( $wp_widget_factory->widgets as $widget_class_name => $wp_widget ) {
			    if ( $wp_widget->id_base == $atts['widget_id_base'] ) {
				    ob_start();
				    @the_widget( $widget_class_name, $widget_atts );
				    $html .= ob_get_clean();
			    }
		    }

		    // Check if any content is returned by the widget
		    if ( empty( $html ) ) {
			    $html = sprintf(
				    '<p class="tailor-notification tailor-notification--warning">%s</p>',
				    __( 'Please configure this element as there is currently nothing to display', 'tailor' )
			    );
		    }

		    return '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' . $html .'</div>';
	    }

	    /**
	     * Prints the widget setting forms to the page.
	     *
	     * @since 1.6.0
	     */
	    public function print_widget_form_templates() {
		    global $wp_widget_factory;
		    foreach ( $wp_widget_factory->widgets as $widget_class_name => $wp_widget ) { ?>

			    <script id="tmpl-tailor-widget-form-<?php echo $wp_widget->id_base; ?>" type="text/html">
				    <?php $wp_widget->form_callback( -1 ); ?>
			    </script>
			    
			<?php
		    } 
	    }
    }
}

if ( tailor_get_setting( 'enable_widgets' ) ) {
	new Tailor_Widgets();
}