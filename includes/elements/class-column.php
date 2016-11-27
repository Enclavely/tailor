<?php

/**
 * Tailor Column element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Column_Element' ) ) {

    /**
     * Tailor Column element class.
     *
     * @since 1.0.0
     */
    class Tailor_Column_Element extends Tailor_Element {

	    /**
	     * Sanitizes the column width value.
	     *
	     * @since 1.7.6
	     *
	     * @param string|int $value
	     *
	     * @return string
	     */
	    public function sanitize_column_width( $value ) {

		    // Convert a column-based width into a percentage
		    if ( false === strpos( $value, '%' ) ) {
			    $value = round( ( (int) $value / 12 ) * 100, 2 ) . '%';
		    }
		    return tailor_sanitize_text( $value );
        }

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

		    $this->add_setting( 'width', array(
			    'sanitize_callback'     =>  array( $this, 'sanitize_column_width' ),
			    'refresh'               =>  array(
				    'method'                =>  'js',
			    ),
			    'default'               =>  '50%',
		    ) );
		    $this->add_setting( 'width_tablet', array(
			    'sanitize_callback'     =>  array( $this, 'sanitize_column_width' ),
			    'refresh'               =>  array(
				    'method'                =>  'js',
			    ),
		    ) );
		    $this->add_setting( 'width_mobile', array(
			    'sanitize_callback'     =>  array( $this, 'sanitize_column_width' ),
			    'refresh'               =>  array(
				    'method'                =>  'js',
			    ),
		    ) );

		    $general_control_types = array(
			    'vertical_alignment',
			    'vertical_alignment_tablet',
			    'vertical_alignment_mobile',
			    'horizontal_alignment',
			    'horizontal_alignment_tablet',
			    'horizontal_alignment_mobile',
			    'hidden',
		    );
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
			    'border_radius',
			    'shadow',
			    'background_image',
			    'background_repeat',
			    'background_position',
			    'background_size',
			    'background_attachment',
		    );
		    $attribute_control_arguments = array(
			    'padding'               =>  array(
                    'control'               =>  array(
                        'choices'               =>  array(
                            'top'                   =>  __( 'Top', 'tailor' ),
                            'bottom'                =>  __( 'Bottom', 'tailor' ),
                        ),
                    ),
			    ),
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
		    $excluded_control_types = array(
			    'width',
			    'width_tablet',
			    'width_mobile',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    // Desktop width
		    $desktop_width = $atts['width'];
		    $unit = tailor_get_unit( $desktop_width, '%' );
		    $value = tailor_get_numeric_value( $desktop_width );
		    $css_rules[] = array(
			    'media'                 =>  'desktop',
			    'setting'               =>  ( 'width' ),
			    'selectors'             =>  array(),
			    'declarations'          =>  array(
				    'width'                 =>  esc_attr( ( $value . $unit ) ),
			    ),
		    );

		    // Tablet-specific width
		    $tablet_width = empty( $atts['width_tablet'] ) ? $desktop_width : $atts['width_tablet'];
		    $unit = tailor_get_unit( $tablet_width, '%' );
		    $value = tailor_get_numeric_value( $tablet_width );
		    $css_rules[] = array(
			    'media'                 =>  'tablet',
			    'setting'               =>  ( 'width_tablet' ),
			    'selectors'             =>  array( '.mobile-columns &', '.tablet-columns &' ),
			    'declarations'          =>  array(
				    'width'                 =>  esc_attr( ( $value . $unit ) ),
			    ),
		    );

		    // Mobile-specific width
		    $mobile_width = empty( $atts['width_mobile'] ) ? $desktop_width : $atts['width_mobile'];
		    $unit = tailor_get_unit( $mobile_width, '%' );
		    $value = tailor_get_numeric_value( $mobile_width );
		    $css_rules[] = array(
			    'media'                 =>  'mobile',
			    'setting'               =>  ( 'width_mobile' ),
			    'selectors'             =>  array( '.mobile-columns &' ),
			    'declarations'          =>  array(
				    'width'                 =>  esc_attr( ( $value . $unit ) ),
			    ),
		    );

		    return $css_rules;
	    }
    }
}