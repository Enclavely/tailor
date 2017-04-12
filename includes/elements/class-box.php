<?php

/**
 * Tailor Box element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Box_Element' ) ) {

    /**
     * Tailor Box element class.
     *
     * @since 1.0.0
     */
    class Tailor_Box_Element extends Tailor_Element {

        /**
         * Registers element settings, sections and controls.
         *
         * @since 1.0.0
         *
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
		        'horizontal_alignment',
		        'horizontal_alignment_tablet',
		        'horizontal_alignment_mobile',
		        'graphic_type',
		        'icon',
		        'image',
		        'graphic_size',
	        );
	        $general_control_arguments = array(
		        'title'                 =>  array(
			        'setting'               =>  array(
				        'default'               =>  $this->label,
			        ),
		        ),
		        'graphic_type'          =>  array(
			        'setting'               =>  array(
				        'default'               =>  'icon',
			        ),
			        'control'               =>  array(
				        'choices'               =>  array(
					        'icon'                  =>  __( 'Icon', 'tailor' ),
					        'image'                 =>  __( 'Image', 'tailor' ),
				        ),
			        ),
		        ),
		        'icon'                  =>  array(
			        'setting'               =>  array(
				        'default'               =>  'dashicons dashicons-wordpress',
			        ),
                    'control'               =>  array(
                        'dependencies'          =>  array(
                            'graphic_type'          =>  array(
                                'condition'             =>  'not',
                                'value'                 =>  'image',
                            ),
                        ),
                    ),
		        ),
		        'image'                 =>  array(
                    'control'               =>  array(
                        'dependencies'          =>  array(
                            'graphic_type'          =>  array(
                                'condition'             =>  'equals',
                                'value'                 =>  'image',
                            ),
                        ),
                    ),
		        ),
	        );
	        tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

	        $priority = 0;
	        $color_control_types = array(
		        'color',
		        'link_color',
		        'link_color_hover',
		        'heading_color',
		        'background_color',
		        'border_color',
		        'graphic_color',
		        'graphic_color_hover',
		        'graphic_background_color',
		        'graphic_background_color_hover',
	        );
	        $color_control_arguments = array(
		        'graphic_color'         =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'graphic_type'          =>  array(
						        'condition'             =>  'not',
						        'value'                 =>  'image',
					        ),
				        ),
			        ),
		        ),
		        'graphic_color_hover'   =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'graphic_type'          =>  array(
						        'condition'             =>  'not',
						        'value'                 =>  'image',
					        ),
				        ),
			        ),
		        ),
		        'graphic_background_color'  =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'graphic_type'          =>  array(
						        'condition'             =>  'not',
						        'value'                 =>  'image',
					        ),
				        ),
			        ),
		        ),
		        'graphic_background_color_hover'    =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'graphic_type'          =>  array(
						        'condition'             =>  'not',
						        'value'                 =>  'image',
					        ),
				        ),
			        ),
		        ),
	        );
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
	        $attribute_control_arguments = array();
	        tailor_control_presets( $this, $attribute_control_types, $attribute_control_arguments, $priority );
        }
	    
	    /**
	     * Returns custom CSS rules for the element.
	     *
	     * @since 1.0.0
	     *
	     * @param array $atts
	     *
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array();
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    // Image box
		    if ( 'image' == $atts['graphic_type'] ) {
			    if ( !empty( $atts['graphic_size'] ) ) {
				    $unit = tailor_get_unit( $atts['graphic_size'] );
				    $value = tailor_get_numeric_value( $atts['graphic_size'] );
				    $css_rules[] = array(
					    'setting'           =>  'graphic_size',
					    'selectors'         =>  array( '.tailor-box__graphic' ),
					    'declarations'      =>  array(
						    'width'             =>  esc_attr( ( $value . $unit ) ),
						    'max-width'         =>  '100%',
					    ),
				    );
			    }
		    }

		    // Icon box
		    else {
			    if ( ! empty( $atts['graphic_color'] ) ) {
				    $css_rules[] = array(
					    'setting'           =>  'graphic_color',
					    'selectors'         =>  array( '.tailor-box__graphic' ),
					    'declarations'      =>  array(
						    'color'             =>  esc_attr( $atts['graphic_color'] ),
					    ),
				    );
			    }

			    if ( ! empty( $atts['graphic_color_hover'] ) ) {
				    $css_rules[] = array(
					    'setting'           =>  'graphic_color_hover',
					    'selectors'         =>  array( '.tailor-box__graphic:hover ' ),
					    'declarations'      =>  array(
						    'color'             =>  esc_attr( $atts['graphic_color_hover'] ),
					    ),
				    );
			    }

			    if ( ! empty( $atts['graphic_background_color'] ) ) {
				    $css_rules[] = array(
					    'setting'           =>  'graphic_background_color',
					    'selectors'         =>  array( '.tailor-box__graphic' ),
					    'declarations'      =>  array(
						    'background-color'  =>  esc_attr( $atts['graphic_background_color'] ),
					    ),
				    );
			    }

			    if ( ! empty( $atts['graphic_background_color_hover'] ) ) {
				    $css_rules[] = array(
					    'setting'           =>  'graphic_background_color_hover',
					    'selectors'         =>  array( '.tailor-box__graphic:hover' ),
					    'declarations'      =>  array(
						    'background-color'  =>  esc_attr( $atts['graphic_background_color_hover'] ),
					    ),
				    );
			    }

			    if ( ! empty( $atts['graphic_background_color'] ) || ! empty( $atts['graphic_background_color_hover'] ) ) {
				    $css_rules[] = array(
					    'setting'           =>  'graphic_background_color',
					    'selectors'         =>  array( '.tailor-box__graphic' ),
					    'declarations'      =>  array(
						    'margin-bottom'     =>  '1em',
						    'text-align'        =>  'center',
					    ),
				    );
			    }

			    if ( ! empty( $atts['graphic_size'] ) ) {
					$unit = tailor_get_unit( $atts['graphic_size'] );
				    $value = tailor_get_numeric_value( $atts['graphic_size'] );
				    $css_rules[] = array(
					    'setting'           =>  'graphic_size',
					    'selectors'         =>  array( '.tailor-box__graphic' ),
					    'declarations'      =>  array(
						    'width'             =>  esc_attr( ( ( $value * 2 ) . $unit ) ),
						    'height'            =>  esc_attr( ( ( $value * 2 ) . $unit ) ),
						    'margin-bottom'     =>  '1em',
					    ),
				    );
				    $css_rules[] = array(
					    'setting'           =>  'graphic_size',
					    'selectors'         =>  array( '.tailor-box__graphic span' ),
					    'declarations'      =>  array(
						    'font-size'         =>  esc_attr( ( $value . $unit ) ),
					    ),
				    );
			    }
		    }

		    return $css_rules;
	    }
    }
}
