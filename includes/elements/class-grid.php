<?php

/**
 * Tailor Grid element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Grid_Element' ) ) {

    /**
     * Tailor Grid element class.
     *
     * @since 1.0.0
     */
    class Tailor_Grid_Element extends Tailor_Element {

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
                'items_per_row',
	            'min_item_height',
	            'min_item_height_tablet',
	            'min_item_height_mobile',
	            'hidden',
            );
            $general_control_arguments = array(
                'items_per_row'         =>  array(
	                'setting'               =>  array(
		                'default'               =>  '2',
	                ),
                    'control'               =>  array(
                        'choices'               =>  tailor_get_range( 2, 6, 1 ),
                    ),
                ),
                'min_item_height'       =>  array(
	                'setting'               =>  array(
		                'refresh'               =>  array(
			                'method'                =>  'js',
		                ),
	                ),
                ),
                'min_item_height_tablet'    =>  array(
	                'setting'               =>  array(
		                'refresh'               =>  array(
			                'method'                =>  'js',
		                ),
	                ),
                ),
	            'min_item_height_mobile'    =>  array(
		            'setting'               =>  array(
			            'refresh'               =>  array(
				            'method'                =>  'js',
			            ),
		            ),
	            ),
            );
            $priority = tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

	        $this->add_setting( 'collapse', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
		        'default'               =>  'tablet',
	        ) );
	        $this->add_control( 'collapse', array(
		        'label'                 =>  __( 'Minimum screen size', 'tailor' ),
		        'description'           =>  __( 'Select the smallest screen size on which items are displayed in a grid layout', 'tailor' ),
		        'type'                  =>  'select',
		        'choices'               =>  tailor_get_media_queries(),
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
				        'type'                  =>  'text',
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
		    $excluded_control_types = array(
			    'min_item_height',
			    'min_item_height_tablet',
			    'min_item_height_mobile',
			    'border_style',
			    'border_color',
			    'border_width',
			    'border_width_tablet',
			    'border_width_mobile',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    $selectors = array(
			    'min_item_height'               =>  array( '.tailor-grid__item' ),
			    'min_item_height_tablet'        =>  array( '.tailor-grid__item' ),
			    'min_item_height_mobile'        =>  array( '.tailor-grid__item' ),
		    );
		    $css_rules = tailor_generate_general_css_rules( $css_rules, $atts, $selectors );

		    $selectors = array(
			    'border_color'                  =>  array( '.tailor-grid__item' ),
		    );
		    $css_rules = tailor_generate_color_css_rules( $css_rules, $atts, $selectors );

		    if ( ! empty( $atts['border_style'] ) ) {
			    $css_rules[] = array(
				    'setting'               =>  'border_style',
				    'selectors'             =>  array( '&.tailor-grid.tailor-grid--bordered .tailor-grid__item' ),
				    'declarations'          =>  array(
					    'border-style'          =>  esc_attr( $atts['border_style'] . '!important' ),
				    ),
			    );
		    }
		    
		    $screen_sizes = array(
			    '',
			    'tablet',
			    'mobile',
		    );

		    // Border width
		    foreach ( $screen_sizes as $screen_size ) {
			    $postfix = empty( $screen_size ) ? '' : "_{$screen_size}";
			    if ( array_key_exists( ( 'border_width' . $postfix ), $atts ) ) {
				    $border_width = $atts[ ( 'border_width' . $postfix ) ];
				    $unit = tailor_get_unit( $border_width );
				    $value = (string) tailor_get_numeric_value( $border_width );
				    $css_rules[] = array(
					    'setting'               =>  ( 'border_width' . $postfix ),
					    'media'                 =>  $screen_size,
					    'selectors'             =>  array( '.tailor-grid__item' ),
					    'declarations'          =>  array(
						    'border-width'          =>  esc_attr( ( $value . $unit ) ),
					    ),
				    );
			    }
		    }

		    return $css_rules;
	    }
    }
}