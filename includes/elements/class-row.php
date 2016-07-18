<?php

/**
 * Tailor Row element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Row_Element' ) ) {

    /**
     * Tailor Row element class.
     *
     * @since 1.0.0
     */
    class Tailor_Row_Element extends Tailor_Element {

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

	        $this->add_setting( 'column_spacing', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( 'column_spacing', array(
		        'label'                 =>  __( 'Column spacing', 'tailor' ),
		        'type'                  =>  'text',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $this->add_setting( 'min_column_height', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( 'min_column_height', array(
		        'label'                 =>  __( 'Minimum height', 'tailor' ),
		        'type'                  =>  'text',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $this->add_setting( 'collapse', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
		        'default'               =>  'tablet',
	        ) );
	        $this->add_control( 'collapse', array(
		        'label'                 =>  __( 'Minimum screen size', 'tailor' ),
		        'description'           =>  __( 'Select the smallest screen size on which columns are displayed', 'tailor' ),
		        'type'                  =>  'select',
		        'choices'               =>  tailor_get_media_queries(),
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $general_control_types = array(
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
		        'border_color',
	        );
	        $color_control_arguments = array();
	        tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

	        $priority = 0;
	        $attribute_control_types = array(
		        'class',
		        'padding',
		        'margin',
		        'border_style',
		        'border_width',
		        'border_radius',
		        'shadow',
		        'background_image',
		        'background_repeat',
		        'background_position',
		        'background_size',
	        );
	        $attribute_control_arguments = array(
		        'margin'                =>  array(
                    'control'               =>  array(
                        'choices'               =>  array(
                            'top'                   =>  __( 'Top', 'tailor' ),
                            'bottom'                =>  __( 'Bottom', 'tailor' ),
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

		    $media_query = ( ! $atts['collapse'] || 'mobile' == $atts['collapse'] ) ? '' : "{$atts['collapse']}-up";

		    if ( ! empty( $atts['column_spacing'] ) ) {
			    $value = preg_replace( "/[^0-9\.]/", "", $atts['column_spacing'] );
			    $unit = str_replace( $value, '', $atts['column_spacing'] );

			    if ( is_numeric( $value ) ) {
				    $css_rules[] = array(
					    'media'             =>  $media_query,
					    'selectors'         =>  array(),
					    'declarations'      =>  array(
						    'margin-left'       =>  '-' . esc_attr( ( $value / 2 ) . $unit ),
						    'margin-right'      =>  '-' . esc_attr( ( $value / 2 ) . $unit ),
					    ),
				    );
				    $css_rules[] = array(
					    'media'             =>  $media_query,
					    'selectors'         =>  array( '.tailor-column' ),
					    'declarations'      =>  array(
						    'padding-left'      =>  esc_attr( ( $value / 2 ) . $unit ),
						    'padding-right'     =>  esc_attr( ( $value / 2 ) . $unit ),
					    ),
				    );
			    }
		    }

		    if ( ! empty( $atts['min_column_height'] ) ) {
			    $css_rules[] = array(
				    'media'             =>  $media_query,
				    'selectors'         =>  array( '.tailor-column' ),
				    'declarations'      =>  array(
					    'min-height'        =>  esc_attr( $atts['min_column_height'] ),
				    ),
			    );
		    }

		    return $css_rules;
	    }
    }
}