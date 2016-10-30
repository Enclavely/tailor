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
			    'horizontal_alignment_tablet',
			    'horizontal_alignment_mobile',
			    'size',
			    'size_tablet',
			    'size_mobile',
			    'icon',
			    'href',
			    'target',
		    );
		    $general_control_arguments = array(
			    'style'                 =>  array(
				    'setting'               =>  array(
					    'default'               =>  'default',
				    ),
				    'control'               =>  array(
					    'choices'               =>  array(
						    'default'               =>  __( 'Default', 'tailor' ),
						    'primary'               =>  __( 'Primary', 'tailor' ),
					    ),
				    ),
			    ),
			    'horizontal_alignment'  =>  array(
				    'control'               =>  array(
					    'choices'               =>  array(
						    'left'                  =>  '<i class="tailor-icon tailor-align-left"></i>',
						    'center'                =>  '<i class="tailor-icon tailor-align-center"></i>',
						    'right'                 =>  '<i class="tailor-icon tailor-align-right"></i>',
						    'justify'               =>  '<i class="tailor-icon tailor-align-justify"></i>',
					    ),
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
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    $selectors = array(
			    'color'                     =>  array( '.tailor-button__inner' ),
			    'color_hover'               =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
			    'background_color'          =>  array( '.tailor-button__inner' ),
			    'background_color_hover'    =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
			    'border_color'              =>  array( '.tailor-button__inner' ),
			    'border_color_hover'        =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
		    );
		    $css_rules = tailor_generate_color_css_rules( $css_rules, $atts, $selectors );

		    $selectors = array(
			    'padding'                   =>  array( '.tailor-button__inner' ),
			    'padding_tablet'            =>  array( '.tailor-button__inner' ),
			    'padding_mobile'            =>  array( '.tailor-button__inner' ),
			    'margin'                    =>  array( '.tailor-button__inner' ),
			    'margin_tablet'             =>  array( '.tailor-button__inner' ),
			    'margin_mobile'             =>  array( '.tailor-button__inner' ),
			    'border_style'              =>  array( '.tailor-button__inner' ),
			    'border_width'              =>  array( '.tailor-button__inner' ),
			    'border_width_tablet'       =>  array( '.tailor-button__inner' ),
			    'border_width_mobile'       =>  array( '.tailor-button__inner' ),
			    'border_radius'             =>  array( '.tailor-button__inner' ),
			    'shadow'                    =>  array( '.tailor-button__inner' ),
		    );
		    $css_rules = tailor_generate_attribute_css_rules( $css_rules, $atts, $selectors );

		    // Automatic hover and active color if one is not selected
		    if ( ! empty( $atts['color'] ) && empty( $atts['color_hover'] ) ) {
			    $css_rules[] = array(
				    'setting'           =>  'color_hover',
				    'selectors'         =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
				    'declarations'      =>  array(
					    'color'             =>  esc_attr( tailor_adjust_color_brightness( $atts['color'], -0.05 ) ),
				    ),
			    );
		    }

		    // Automatic background hover and active color if one is not selected
		    if ( ! empty( $atts['background_color'] ) && empty( $atts['background_color_hover'] ) ) {
			    $css_rules[] = array(
				    'setting'           =>  'background_color_hover',
				    'selectors'         =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( tailor_adjust_color_brightness( $atts['background_color'], -0.02 ) ),
				    ),
			    );
			    $css_rules[] = array(
				    'setting'           =>  'background_color_hover',
				    'selectors'         =>  array( '.tailor-button__inner:active' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( tailor_adjust_color_brightness( $atts['background_color'], -0.05 ) ),
				    ),
			    );
		    }

		    // Automatic border hover and active color if one is not selected
		    if ( ! empty( $atts['border_color'] ) && empty( $atts['border_color_hover'] ) ) {
			    $css_rules[] = array(
				    'setting'           =>  'border_color_hover',
				    'selectors'         =>  array( '.tailor-button__inner:hover', '.tailor-button__inner:focus' ),
				    'declarations'      =>  array(
					    'border-color'      =>  esc_attr( tailor_adjust_color_brightness( $atts['border_color'], -0.02 ) ),
				    ),
			    );
			    $css_rules[] = array(
				    'setting'           =>  'border_color_hover',
				    'selectors'         =>  array( '.tailor-button__inner:active' ),
				    'declarations'      =>  array(
					    'border-color'      =>  esc_attr( tailor_adjust_color_brightness( $atts['border_color'], -0.05 ) ),
				    ),
			    );
		    }
		    
		    return $css_rules;
	    }
    }
}