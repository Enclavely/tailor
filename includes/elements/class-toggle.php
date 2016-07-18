<?php

/**
 * Tailor Toggle element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Toggle_Element' ) ) {

    /**
     * Tailor Toggle element class.
     *
     * @since 1.0.0
     */
    class Tailor_Toggle_Element extends Tailor_Element {

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
		        'icon',
			);
		    $general_control_arguments = array(
			    'title'                 =>  array(
				    'setting'               =>  array(
					    'default'               =>  $this->label,
				    ),
			    ),
		    );
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
		    $priority = tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

		    $this->add_setting( 'title_color', array(
			    'sanitize_callback'     =>  'tailor_sanitize_color',
		    ) );
		    $this->add_control( 'title_color', array(
			    'label'                 =>  __( 'Title color', 'tailor' ),
			    'type'                  =>  'colorpicker',
			    'priority'              =>  $priority += 10,
			    'section'               =>  'colors',
		    ) );

		    $this->add_setting( 'title_background_color', array(
			    'sanitize_callback'     =>  'tailor_sanitize_color',
		    ) );
		    $this->add_control( 'title_background_color', array(
			    'label'                 =>  __( 'Title background color', 'tailor' ),
			    'type'                  =>  'colorpicker',
			    'rgba'                  =>  1,
			    'priority'              =>  $priority += 10,
			    'section'               =>  'colors',
		    ) );

		    $priority = 0;
		    $attribute_control_types = array(
			    'class',
			    'padding',
			    'border_style',
			    'border_width',
			    'border_radius',
			    'shadow',
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
	     *
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array(
			    'border_style',
			    'border_width',
			    'border_radius',
			    'border_color',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    if ( ! empty( $atts['border_radius'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
				    'declarations'      =>  array(
					    'border-radius'     =>  esc_attr( $atts['border_radius'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['border_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
				    'declarations'      =>  array(
					    'border-color'      =>  esc_attr( $atts['border_color'] ),
				    ),
			    );
		    }

		    if ( array_key_exists( 'title_color', $atts ) && ! empty( $atts['title_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-toggle__title' ),
				    'declarations'      =>  array(
					    'color'             =>  esc_attr( $atts['title_color'] ),
				    ),
			    );
		    }

		    if ( array_key_exists( 'title_background_color', $atts ) && ! empty( $atts['title_background_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-toggle__title' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( $atts['title_background_color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['border_style'] ) ) {

			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
				    'declarations'      =>  array(
					    'border-style'      =>  esc_attr( $atts['border_style'] ),
				    ),
			    );

			    if ( 'none' !== $atts['border_style'] ) {

				    if ( ! empty( $atts['border_width'] ) ) {
					    $borders = array_combine( array( 'top', 'right', 'bottom', 'left' ), explode( '-', $atts['border_width'] ) );

					    if ( count( array_unique( $borders ) ) === 1 && end( $borders ) == '0' ) {
						    $css_rules[] = array(
							    'selectors'                 =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
							    'declarations'              =>  array(
								    'border'                    =>  'none',
								    'box-shadow'                =>  'none',
							    ),
						    );

					    }
					    else {
						    foreach ( $borders as $position => $border_width ) {
							    if ( ! empty( $border_width ) ) {
								    if ( 'top' == $position ) {
									    $css_rules[] = array(
										    'selectors'                 =>  array( '.tailor-toggle__title' ),
										    'declarations'              =>  array(
											    "border-{$position}-width"  =>  esc_attr( $border_width ),
										    ),
									    );
								    }
								    else {
									    $css_rules[] = array(
										    'selectors'                 =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
										    'declarations'              =>  array(
											    "border-{$position}-width"  =>  esc_attr( $border_width ),
										    ),
									    );
								    }
							    }
						    }
					    }
				    }

				    if ( ! empty( $atts['border_radius'] ) ) {
					    $css_rules[] = array(
						    'selectors'         =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
						    'declarations'      =>  array(
							    'border-radius'     =>  esc_attr( $atts['border_radius'] ),
						    ),
					    );
				    }

				    if ( ! empty( $atts['shadow'] ) ) {
					    $css_rules[] = array(
						    'selectors'         =>  array(),
						    'declarations'      =>  array(
							    'box-shadow'        =>  '0 2px 6px rgba(0, 0, 0, 0.1)',
						    ),
					    );
				    }
			    }
		    }

		    return $css_rules;
	    }
    }
}