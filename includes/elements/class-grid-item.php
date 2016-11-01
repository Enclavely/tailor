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
			    'vertical_alignment',
			    'vertical_alignment_tablet',
			    'vertical_alignment_mobile',
			    'horizontal_alignment',
			    'horizontal_alignment_tablet',
			    'horizontal_alignment_mobile',
			    'hidden',
		    );
		    $general_control_arguments = array();
		    tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

		    $priority = 0;
		    $color_control_types = array(
			    'color',
			    'link_color',
			    'link_color_hover',
			    'heading_color',
			    'background_color',
		    );
		    $color_control_arguments = array();
		    tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

		    $priority = 0;
		    $attribute_control_types = array(
			    'class',
			    'padding',
			    'padding_tablet',
			    'padding_mobile',
			    'background_image',
			    'background_repeat',
			    'background_position',
			    'background_size',
			    'background_attachment',
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
		    $excluded_control_types = array(
			    'padding',
			    'padding_tablet',
			    'padding_mobile',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    $selectors = array(
			    'padding'                   =>  array( '&.tailor-grid__item' ),
			    'padding_tablet'            =>  array( '&.tailor-grid__item' ),
			    'padding_mobile'            =>  array( '&.tailor-grid__item' ),
		    );
		    $css_rules = tailor_generate_attribute_css_rules( $css_rules, $atts, $selectors );

		    return $css_rules;
	    }
    }
}