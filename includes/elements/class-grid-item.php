<?php

/**
 * Tailor Grid Item element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Grid_Item_Element' ) ) {

    /**
     * Tailor Grid Item element class.
     *
     * @since 1.0.0
     */
    class Tailor_Grid_Item_Element extends Tailor_Element {

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

		    $priority = 0;
		    $general_control_types = array(
			    'horizontal_alignment',
			    'vertical_alignment',
			    'hidden',
		    );
		    $general_control_arguments = array();
		    tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

		    $priority = 0;
		    $color_control_types = array(
			    'color',
			    'link_color',
			    'heading_color',
			    'background_color',
		    );
		    $color_control_arguments = array();
		    tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

		    $priority = 0;
		    $attribute_control_types = array(
			    'class',
			    'padding',
			    'background_image',
			    'background_repeat',
			    'background_position',
			    'background_size',
		    );
		    $attribute_control_arguments = array();
		    tailor_control_presets( $this, $attribute_control_types, $attribute_control_arguments, $priority );
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
		    $excluded_control_types = array( 'padding' );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    if ( ! empty( $atts['padding'] ) ) {
			    $padding = explode( '-', $atts['padding'] );
			    $padding_values = array_combine( array( 'top', 'right', 'bottom', 'left' ), $padding );
			    foreach ( $padding_values as $position => $padding_value ) {
				    if ( ! empty( $padding_value ) ) {
					    $css_rules[] = array(
						    'selectors'                 =>  array( '&.tailor-grid__item' ),
						    'declarations'              =>  array(
							    "padding-{$position}"       =>  esc_attr( $padding_value ),
						    ),
					    );
				    }
			    }
		    }

		    return $css_rules;
	    }
    }
}