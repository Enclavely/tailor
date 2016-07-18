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
                'item_spacing',
                'min_item_height',
	            'hidden',
            );
            $general_control_arguments = array(
                'items_per_row'         =>  array(
                    'control'               =>  array(
                        'choices'               =>  tailor_get_range( 2, 6, 1 ),
                    ),
                ),
            );
            $priority = tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

	        
	        $this->add_setting( 'collapse', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
		        'default'               =>  'tablet',
	        ) );
	        $this->add_control( 'collapse', array(
		        'label'             =>  __( 'Minimum screen size', 'tailor' ),
		        'description'       =>  __( 'Select the smallest screen size on which items are displayed in a grid layout', 'tailor' ),
		        'type'              =>  'select',
		        'choices'           =>  tailor_get_media_queries(),
		        'priority'          =>  $priority += 10,
		        'section'           =>  'general',
	        ) );

	        $general_control_types = array();
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
		        'border_width',
		        'shadow',
		        'background_image',
		        'background_repeat',
		        'background_position',
		        'background_size',
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
			    'item_spacing',
			    'border_style',
			    'border_color',
			    'border_width',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );
		    
		    $media_query = ( ! $atts['collapse'] || 'mobile' == $atts['collapse'] ) ? '' : "{$atts['collapse']}-up";

		    if ( ! empty( $atts['min_item_height'] ) ) {
			    $css_rules[] = array(
				    'media'             =>  $media_query,
				    'selectors'         =>  array( '.tailor-grid__item' ),
				    'declarations'      =>  array(
					    'min-height'        =>  esc_attr( $atts['min_item_height'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['item_spacing'] ) ) {
			    $value = preg_replace( "/[^0-9\.]/", "", $atts['item_spacing'] );
			    $unit = str_replace( $value, '', $atts['item_spacing'] );

			    if ( is_numeric( $value ) ) {
				    $css_rules[] = array(
					    'media'             =>  $media_query,
					    'selectors'         =>  array( ".tailor-grid__item-up" ),
					    'declarations'      =>  array(
						    'padding-left'      =>  esc_attr( ( $value / 2 ) . $unit ),
						    'padding-right'     =>  esc_attr( ( $value / 2 ) . $unit ),
					    ),
				    );
			    }
		    }

		    if ( ! empty( $atts['border_color'] ) ) {
			    $css_rules[] = array(
				    'media'             =>  $media_query,
				    'selectors'         =>  array( '.tailor-grid__item' ),
				    'declarations'      =>  array(
					    'border-color'      =>  esc_attr( $atts['border_color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['border_width'] )  ) {
			    $css_rules[] = array(
				    'media'             =>  $media_query,
				    'selectors'         =>  array( '.tailor-grid__item' ),
				    'declarations'      =>  array(
					    'border-width'      =>  esc_attr( $atts['border_width'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['shadow'] ) ) {
			    $css_rules[] = array(
				    'media'             =>  $media_query,
				    'selectors'         =>  array(),
				    'declarations'      =>  array(
					    'box-shadow'        =>  '0 2px 6px rgba(0, 0, 0, 0.1)',
				    ),
			    );
		    }

		    return $css_rules;
	    }
    }
}