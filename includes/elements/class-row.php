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
	        $general_control_types = array(
		        'min_column_height',
		        'min_column_height_tablet',
		        'min_column_height_mobile',
		        'column_spacing',
		        'column_spacing_tablet',
		        'column_spacing_mobile',
		        'hidden',
	        );
	        $general_control_arguments = array();
	        $priority = tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

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
		        'background_image',
		        'background_repeat',
		        'background_position',
		        'background_size',
		        'background_attachment',
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

		    $screen_sizes = array(
			    '',
			    'tablet',
			    'mobile',
		    );

		    foreach ( $screen_sizes as $screen_size ) {
			    $postfix = empty( $screen_size ) ? '' : "_{$screen_size}";
			    
			    // Minimum column height
			    if ( ! empty( $atts[ ( 'min_column_height' . $postfix ) ] ) ) {
				    $min_column_height = $atts[ ( 'min_column_height' . $postfix ) ];
				    $unit = tailor_get_unit( $min_column_height );
				    $value = tailor_get_numeric_value( $min_column_height );
				    $css_rules[] = array(
					    'setting'               =>  ( 'min_column_height' . $postfix ),
					    'media'                 =>  $screen_size,
					    'selectors'             =>  array( '.tailor-column' ),
					    'declarations'          =>  array(
						    'min-height'            =>  esc_attr( ( $value . $unit ) ),
					    ),
				    );
			    }

			    // Column spacing
			    if ( ! empty( $atts[ ( 'column_spacing' . $postfix ) ] ) ) {
				    $column_spacing = $atts[ ( 'column_spacing' . $postfix ) ];
				    $unit = tailor_get_unit( $column_spacing );
				    $value = tailor_get_numeric_value( $column_spacing );

				    if ( ! empty( $atts['collapse'] ) ) {
					    if ( 'tablet' == $atts['collapse'] && 'mobile' == $screen_size ) {
						    continue;
					    }
					    if ( 'desktop' == $atts['collapse'] && ( 'mobile' == $screen_size || 'tablet' == $screen_size ) ) {
						    continue;
					    }
				    }

				    $css_rules[] = array(
					    'setting'               =>  ( 'column_spacing' . $postfix ),
					    'media'                 =>  $screen_size,
					    'selectors'             =>  array(),
					    'declarations'          =>  array(
						    'margin-left'       =>  '-' . esc_attr( ( $value / 2 ) . $unit ),
						    'margin-right'      =>  '-' . esc_attr( ( $value / 2 ) . $unit ),
					    ),
				    );
				    $css_rules[] = array(
					    'setting'               =>  ( 'column_spacing' . $postfix ),
					    'media'                 =>  $screen_size,
					    'selectors'             =>  array( '.tailor-column' ),
					    'declarations'          =>  array(
						    'padding-left'      =>  esc_attr( ( $value / 2 ) . $unit ),
						    'padding-right'     =>  esc_attr( ( $value / 2 ) . $unit ),
					    ),
				    );
			    }
		    }
		    
		    return $css_rules;
	    }
    }
}