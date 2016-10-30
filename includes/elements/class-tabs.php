<?php

/**
 * Tailor Tabs element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Tabs_Element' ) ) {

    /**
     * Tailor Tabs element class.
     *
     * @since 1.0.0
     */
    class Tailor_Tabs_Element extends Tailor_Element {

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

	        $this->add_setting( 'position', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
		        'default'               =>  'top',
	        ) );
	        $this->add_control( 'position', array(
		        'label'                 =>  __( 'Tabs position', 'tailor' ),
		        'type'                  =>  'select',
		        'choices'               =>  array(
			        'top'                   =>  __( 'Top', 'tailor' ),
			        'left'                  =>  __( 'Left', 'tailor' ),
			        'right'                 =>  __( 'Right', 'tailor' ),
		        ),
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
		        'border_style'          =>  array(
			        'control'               =>  array(
				        'choices'               =>  array(
					        ''                      =>  __( 'Default', 'tailor' ),
					        'solid'                 =>  __( 'Solid', 'tailor' ),
					        'dashed'                =>  __( 'Dashed', 'tailor' ),
					        'dotted'                =>  __( 'Dotted', 'tailor' ),
					        'none'                  =>  __( 'None', 'tailor' ),
				        ),
			        ),
		        ),
		        'border_width'          =>  array(
			        'setting'               =>  array(
				        'refresh'               =>  '',
			        ),
			        'control'               =>  array(
				        'type'                  =>  'text',
			        ),
		        ),
		        'border_width_tablet'   =>  array(
			        'setting'               =>  array(
				        'refresh'               =>  '',
			        ),
		        ),
		        'border_width_mobile'   =>  array(
			        'setting'               =>  array(
				        'refresh'               =>  '',
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
			    'border_style',
			    'border_width',
			    'border_radius',
			    'shadow',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    if ( ! empty( $atts['border_style'] ) ) {

			    $css_rules[] = array(
				    'selectors'                 =>  array( '.tailor-tabs__navigation-item', '.tailor-tab' ),
				    'declarations'              =>  array(
					    'border-style'              =>  esc_attr( $atts['border_style'] ),
				    ),
			    );

			    if ( ! empty( $atts['position'] ) ) {
				    switch ( $atts['position'] ) {
					    case 'top':
						    $css_rules[] = array(
							    'media'                     =>  'tablet-up',
							    'selectors'                 =>  array( '.tailor-tabs__navigation-item' ),
							    'declarations'              =>  array(
								    'border-bottom'             =>  'none',
							    ),
						    );
						    break;

					    case 'left':
						    $css_rules[] = array(
							    'media'                     =>  'tablet-up',
							    'selectors'                 =>  array( '.tailor-tabs__navigation-item' ),
							    'declarations'              =>  array(
								    'border-right'              =>  'none',
							    ),
						    );
						    break;

					    case 'right':
						    $css_rules[] = array(
							    'media'                     =>  'tablet-up',
							    'selectors'                 =>  array( '.tailor-tabs__navigation-item' ),
							    'declarations'              =>  array(
								    'border-left'               =>  'none',
							    ),
						    );
						    break;
				    }
			    }

			    if ( 'none' !== $atts['border_style'] ) {
				    if ( ! empty( $atts['border_width'] ) ) {

					    $css_rules[] = array(
						    'selectors'                 =>  array( '.tailor-tabs__navigation-item', '.tailor-tab' ),
						    'declarations'              =>  array(
							    'border-width'              =>  esc_attr( $atts['border_width'] ),
						    ),
					    );

					    $css_rules[] = array(
						    'media'                     =>  'tablet-up',
						    'selectors'                 =>  array( '&.tailor-tabs--top .tailor-tabs__navigation-item:not( :last-child )' ),
						    'declarations'              =>  array(
							    'margin-right'              =>  esc_attr( '-' . $atts['border_width'] ),
						    ),
					    );

					    $css_rules[] = array(
						    'selectors'                 =>  array( '&.tailor-tabs--top .tailor-tab' ),
						    'declarations'              =>  array(
							    'margin-top'                =>  esc_attr( '-' . $atts['border_width'] ),
						    ),
					    );

					    $css_rules[] = array(
						    'selectors'                 =>  array( '&.tailor-tabs--left .tailor-tabs__navigation' ),
						    'declarations'              =>  array(
							    'margin-right'              =>  esc_attr( '-' . $atts['border_width'] ),
						    ),
					    );

					    $css_rules[] = array(
						    'media'                     =>  'tablet-up',
						    'selectors'                 =>  array( '&.tailor-tabs--right .tailor-tabs__navigation' ),
						    'declarations'              =>  array(
							    'margin-left'               =>  esc_attr( '-' . $atts['border_width'] ),
						    ),
					    );

					    $css_rules[] = array(
						    'media'                     =>  'tablet-up',
						    'setting'                   =>  'border_color',
						    'selectors'                 =>  array(
							    '&.tailor-tabs--left .tailor-tabs__navigation-item:not( :first-child )',
							    '&.tailor-tabs--right .tailor-tabs__navigation-item:not( :first-child )'
						    ),
						    'declarations'              =>  array(
							    'margin-top'                =>  esc_attr( '-' . $atts['border_width'] ),
						    ),
					    );
				    }

				    if ( ! empty( $atts['border_color'] ) ) {
					    $css_rules[] = array(
						    'setting'                   =>  'border_color',
						    'selectors'                 =>  array( '.tailor-tabs__navigation-item', '.tailor-tab' ),
						    'declarations'              =>  array(
							    'border-color'              =>  esc_attr( $atts['border_color'] ),
						    ),
					    );
				    }

				    if ( ! empty( $atts['shadow'] ) ) {
					    $css_rules[] = array(
						    'setting'                   =>  'shadow',
						    'selectors'                 =>  array( '.tailor-tab' ),
						    'declarations'              =>  array(
							    'box-shadow'                =>  '0 2px 6px rgba(0, 0, 0, 0.1)',
						    ),
					    );
				    }
			    }
		    }

		    return $css_rules;
	    }
    }
}