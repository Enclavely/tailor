<?php

/**
 * Tailor Map element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Map_Element' ) ) {

    /**
     * Tailor Map element class.
     *
     * @since 1.0.0
     */
    class Tailor_Map_Element extends Tailor_Element {

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

            $this->add_setting( 'address', array(
	            'sanitize_callback'     =>  'tailor_sanitize_text',
	            'default'               =>  'Melbourne, Australia',
            ) );
            $this->add_control( 'address', array(
                'label'                 =>  __( 'Address', 'tailor' ),
                'type'                  =>  'text',
                'priority'              =>  $priority += 10,
                'section'               =>  'general',
            ) );

            $this->add_setting( 'latitude', array(
                'sanitize_callback'     =>  'tailor_sanitize_number',
            ) );
            $this->add_control( 'latitude', array(
                'label'                 =>  __( 'Latitude (optional)', 'tailor' ),
                'type'                  =>  'number',
                'priority'              =>  $priority += 10,
                'section'               =>  'general',
            ) );

            $this->add_setting( 'longitude', array(
                'sanitize_callback'     =>  'tailor_sanitize_number',
            ) );
            $this->add_control( 'longitude', array(
                'label'                 =>  __( 'Longitude (optional)', 'tailor' ),
                'type'                  =>  'number',
                'priority'              =>  $priority += 10,
                'section'               =>  'general',
            ) );

	        $this->add_setting( 'zoom', array(
		        'sanitize_callback'     =>  'tailor_sanitize_number',
		        'default'               =>  '13',
	        ) );
	        $this->add_control( 'zoom', array(
		        'label'                 =>  __( 'Zoom level', 'tailor' ),
		        'type'                  =>  'number',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $this->add_setting( 'controls', array(
		        'sanitize_callback'     =>  'tailor_sanitize_number',
		        'default'               =>  '0',
	        ) );
	        $this->add_control( 'controls', array(
		        'label'                 =>  __( 'Show controls', 'tailor' ),
		        'type'                  =>  'switch',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $this->add_setting( 'content', array(
		        'sanitize_callback'     =>  'tailor_sanitize_html',
	        ) );
	        $this->add_control( 'content', array(
		        'label'                 =>  __( 'Markers', 'tailor' ),
		        'type'                  =>  'list',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $general_control_types = array();
	        $general_control_arguments = array();
	        tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

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
	        $priority = tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

	        $this->add_setting( 'hue', array(
		        'sanitize_callback'     =>  'tailor_sanitize_color',
	        ) );
	        $this->add_control( 'hue', array(
		        'label'                 =>  __( 'Hue', 'tailor' ),
		        'type'                  =>  'colorpicker',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'colors',
	        ) );

	        $this->add_setting( 'saturation', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
		        'default'               =>  '-50',
	        ) );
	        $this->add_control( 'saturation', array(
		        'label'                 =>  __( 'Saturation', 'tailor' ),
		        'type'                  =>  'number',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'colors',
	        ) );

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
		        'background_image',
		        'background_repeat',
		        'background_position',
		        'background_size',
		        'background_attachment',
	        );
	        $attribute_control_arguments = array(
		        'border_width'          =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'border_style'          =>  array(
						        'condition'             =>  'not',
						        'value'                 =>  array( '', 'none' ),
					        ),
				        ),
			        ),
		        ),
		        'border_radius'         =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'border_style'          =>  array(
						        'condition'             =>  'not',
						        'value'                 =>  array( '', 'none' ),
					        ),
				        ),
			        ),
		        ),
	        );
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
		    $excluded_control_types = array();
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    return $css_rules;
	    }
    }
}