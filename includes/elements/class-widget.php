<?php

/**
 * Tailor Widget element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.6.0
 */

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Widget_Element' ) ) {

    /**
     * Tailor Widget element class.
     *
     * @since 1.6.0
     */
    class Tailor_Widget_Element extends Tailor_Element {

	    public $widget_id_base;
	    public $widget_class_name;

	    /**
	     * Constructor.
	     *
	     * Any supplied $args override class property defaults.
	     *
	     * @since 1.0.0
	     *
	     * @param string $tag
	     * @param array $args
	     */
	    public function __construct( $tag, $args = array() ) {

		    $this->widget_id_base = $args['widget_id_base'];
		    $this->widget_class_name = $args['widget_class_name'];

		    parent::__construct(  $tag, $args );
	    }

        /**
         * Registers element settings, sections and controls.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function register_controls() {

	        $this->add_section( 'general', array(
		        'title'                 =>  __( 'General', 'tailor' ),
		        'priority'              =>  10,
	        ) );

	        $this->add_section( 'colors', array(
		        'title'                 =>  __( 'Colors', 'tailor' ),
		        'priority'              =>  20,
	        ) );

	        $this->add_section( 'attributes', array(
		        'title'                 =>  __( 'Attributes', 'tailor' ),
		        'priority'              =>  30,
	        ) );

	        $this->add_setting( 'content', array(
		        'sanitize_callback'     =>  'tailor_to_json',
	        ) );
	        $this->add_control( 'content', array(
		        'label'                 =>  __( 'Widget settings', 'tailor' ),
		        'type'                  =>  'widget-form',
		        'widget_id_base'        =>  $this->widget_id_base,
		        'widget_class_name'     =>  $this->widget_class_name,
		        'priority'              =>  0,
		        'section'               =>  'general',
	        ) );

	        $priority = 0;
	        $color_control_types = array(
		        'color',
		        'link_color',
		        'link_color_hover',
		        'heading_color',
		        'background_color',
		        'border_color',
	        );
	        $color_control_arguments = array();
	        tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

	        $priority = 0;
	        $attribute_control_types = array(
		        'class',
		        'padding',
		        'padding_tablet',
		        'padding_mobile',
		        'margin',
		        'margin_tablet',
		        'margin_mobile',
		        'border_style',
		        'border_width',
		        'border_width_tablet',
		        'border_width_mobile',
		        'border_radius',
		        'shadow',
	        );
	        $attribute_control_arguments = array();
	        tailor_control_presets( $this, $attribute_control_types, $attribute_control_arguments, $priority );
        }

	    /**
	     * Returns a text shortcode representing the element.
	     *
	     * @since 1.6.0
	     *
	     * @param string $id
	     * @param array $atts
	     * @param string $content
	     * @return string
	     */
	    public function generate_shortcode( $id, $atts = array(), $content = '' ) {

		    if ( ! empty( $id ) ) {
			    if ( array_key_exists( 'class', $atts ) ) {
				    $atts['class'] = trim( $atts['class'] . ' ' . " tailor-{$id}" );
			    }
			    else {
				    $atts['class'] = "tailor-{$id}";
			    }
		    }

		    $shortcode = '[' . $this->tag;

		    // Add the widget ID base as an attribute
		    $atts['widget_id_base'] = $this->widget_id_base;

		    // Add the widget settings as prefixed attributes
		    $content = json_decode( $content, true );
		    foreach ( (array) $content as $id => $value ) {
			    $atts[ 'widget-' . $id ] = $value;
		    }

		    // Convert the attribute array into an attribute string
		    if ( '' !== ( $atts = tailor_get_attributes( $atts ) ) ) {
			    $shortcode .= " {$atts}";
		    }

		    return $shortcode . '/]';
	    }

	    /**
	     * Returns custom CSS rules for the element.
	     *
	     * @since 1.0.0
	     *
	     * @param $atts
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array();
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    return $css_rules;
	    }
    }
}