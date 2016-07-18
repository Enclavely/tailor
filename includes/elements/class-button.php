<?php

/**
 * Tailor Button element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Button_Element' ) ) {

    /**
     * Tailor Button element class.
     *
     * @since 1.0.0
     */
    class Tailor_Button_Element extends Tailor_Element {

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

		    $this->add_setting( 'content', array(
			    'sanitize_callback'     =>  'tailor_sanitize_text',
			    'default'               =>  $this->label,
		    ) );
		    $this->add_control( 'content', array(
			    'label'                 =>  __( 'Label', 'tailor' ),
			    'type'                  =>  'text',
			    'priority'              =>  $priority += 10,
			    'section'               =>  'general',
		    ) );

		    $general_control_types = array(
			    'style',
			    'horizontal_alignment',
			    'size',
			    'icon',
			    'href',
			    'target',
		    );
		    $general_control_arguments = array(
			    'style'                 =>  array(
				    'control'               =>  array(
					    'choices'               =>  array(
						    'default'               =>  __( 'Default', 'tailor' ),
						    'primary'               =>  __( 'Primary', 'tailor' ),
						    'block'                 =>  __( 'Block', 'tailor' ),
					    ),
				    ),
			    ),
			    'horizontal_alignment'  =>  array(
				    'control'               =>  array(
					    'dependencies'          =>  array(
						    'style'                 =>  array(
							    'condition'             =>  'not',
							    'value'                 =>  'block',
						    ),
					    ),
				    ),
			    ),
			    'target'                =>  array(
				    'control'               =>  array(
					    'dependencies'          =>  array(
						    'href'                  =>  array(
							    'condition'             =>  'not',
							    'value'                 =>  '',
						    ),
					    ),
				    ),
			    ),
		    );
		    tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

		    $priority = 0;
		    $color_control_types = array(
			    'color',
			    'color_hover',
			    'background_color',
			    'background_color_hover',
			    'border_color',
			    'border_color_hover',
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
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array(
			    'color',
			    'color_hover',
			    'background_color',
			    'background_color_hover',
			    'border_color',
			    'border_color_hover',
			    'padding',
			    'border_style',
			    'border_width',
			    'border_radius',
			    'shadow',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    if ( ! empty( $atts['color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner' ),
				    'declarations'      =>  array(
					    'color'             =>  esc_attr( $atts['color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['color_hover'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( ':hover .tailor-button__inner' ),
				    'declarations'      =>  array(
					    'color'             =>  esc_attr( $atts['color_hover'] ),
				    ),
			    );
		    }
		    else if ( ! empty( $atts['color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( ':hover .tailor-button__inner' ),
				    'declarations'      =>  array(
					    'color'             =>  esc_attr( tailor_adjust_color_brightness( $atts['color'], -0.05 ) ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['background_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( $atts['background_color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['background_color_hover'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( $atts['background_color_hover'] ),
				    ),
			    );
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner:active' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( tailor_adjust_color_brightness( $atts['background_color_hover'], -0.02 ) ),
				    ),
			    );
		    }
		    else if ( ! empty( $atts['background_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( tailor_adjust_color_brightness( $atts['background_color'], -0.02 ) ),
				    ),
			    );
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner:active' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( tailor_adjust_color_brightness( $atts['background_color'], -0.05 ) ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['border_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner' ),
				    'declarations'      =>  array(
					    'border-color'      =>  esc_attr( $atts['border_color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['border_color_hover'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
				    'declarations'      =>  array(
					    'border-color'      =>  esc_attr( $atts['border_color_hover'] ),
				    ),
			    );
		    }
		    else if ( ! empty( $atts['border_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
				    'declarations'      =>  array(
					    'border-color'      =>  esc_attr( tailor_adjust_color_brightness( $atts['border_color'], -0.02 ) ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['padding'] ) ) {
			    $values = array_combine( array( 'top', 'right', 'bottom', 'left' ), explode( '-', $atts['padding'] ) );
			    foreach ( $values as $position => $value ) {
				    if ( ! empty( $value ) ) {
					    $css_rules[] = array(
						    'selectors'                 =>  array( '.tailor-button__inner' ),
						    'declarations'              =>  array(
							    "padding-{$position}"       =>  esc_attr( $value ),
						    ),
					    );
				    }
			    }
		    }

		    if ( ! empty( $atts['border_style'] ) ) {

			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-button__inner' ),
				    'declarations'      =>  array(
					    'border-style'      =>  esc_attr( $atts['border_style'] ),
				    ),
			    );

			    if ( 'none' !== $atts['border_style'] ) {

				    if ( ! empty( $atts['border_width'] )  ) {

					    $borders = array_combine( array( 'top', 'right', 'bottom', 'left' ), explode( '-', $atts['border_width'] ) );

					    if ( count( array_unique( $borders ) ) === 1 && end( $borders ) == '0' ) {
						    $css_rules[] = array(
							    'selectors'                 =>  array( '.tailor-button__inner' ),
							    'declarations'              =>  array(
								    'border'                    =>  'none',
								    'box-shadow'                =>  'none',
							    ),
						    );

					    }
					    else {
						    foreach ( $borders as $position => $border_width ) {
							    if ( ! empty( $border_width ) ) {
								    $css_rules[] = array(
									    'selectors'                 =>  array( '.tailor-button__inner' ),
									    'declarations'              =>  array(
										    "border-{$position}-width"  =>  esc_attr( $border_width ),
									    ),
								    );
							    }
						    }
					    }
				    }

				    if ( ! empty( $atts['border_radius'] ) ) {
					    $css_rules[] = array(
						    'selectors'         =>  array( '.tailor-button__inner' ),
						    'declarations'      =>  array(
							    'border-radius'     =>  esc_attr( $atts['border_radius'] ),
						    ),
					    );
				    }

				    if ( ! empty( $atts['shadow'] ) ) {
					    $css_rules[] = array(
						    'selectors'         =>  array( '.tailor-button__inner' ),
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