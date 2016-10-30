<?php

/**
 * Tailor Tab element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Tab_Element' ) ) {

    /**
     * Tailor Tab element class.
     *
     * @since 1.0.0
     */
    class Tailor_Tab_Element extends Tailor_Element {

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
                'title',
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
	     *
	     * @return array
	     */
	    public function generate_css( $atts ) {
		    $css_rules = array();
		    $excluded_control_types = array(
			    'background_color',
			    'padding',
			    'padding_tablet',
			    'padding_mobile',
			    'background_image',
			    'background_repeat',
			    'background_position',
			    'background_size',
			    'background_attachment',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    $selectors = array(
			    'background_color'          =>  array( '&.tailor-tabs__navigation-item', '&.tailor-tab' ),
		    );
		    $css_rules = tailor_generate_color_css_rules( $css_rules, $atts, $selectors );

		    $selectors = array(
			    'padding'                   =>  array( '&.tailor-tab' ),
			    'padding_tablet'            =>  array( '&.tailor-tab'),
			    'padding_mobile'            =>  array( '&.tailor-tab' ),
			    'background_image'          =>  array( '&.tailor-tab' ),
			    'background_repeat'         =>  array( '&.tailor-tab' ),
			    'background_position'       =>  array( '&.tailor-tab' ),
			    'background_size'           =>  array( '&.tailor-tab' ),
			    'background_attachment'     =>  array( '&.tailor-tab' ),
		    );
		    $css_rules = tailor_generate_attribute_css_rules( $css_rules, $atts, $selectors );

		    return $css_rules;
	    }
    }
}