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
			    'link_color_hover',
			    'heading_color',
			    'background_color',
			    'border_color',
			    'title_color',
			    'title_background_color',
		    );
		    $color_control_arguments = array();
		    $priority = tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

		    $priority = 0;
		    $attribute_control_types = array(
			    'class',
			    'padding',
			    'padding_tablet',
			    'padding_mobile',
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
			    'border_width'          =>  array(
				    'setting'               =>  array(
					    'refresh'               =>  '',
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
	     *
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array(
			    'border_color',
			    'border_style',
			    'border_width',
			    'border_width_tablet',
			    'border_width_mobile',
			    'border_radius',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    $selectors = array(
			    'border_color'              =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
		    );
		    $css_rules = tailor_generate_color_css_rules( $css_rules, $atts, $selectors );

		    if ( ! empty( $atts['title_color'] ) ) {
			    $css_rules[] = array(
				    'setting'           =>  'title_color',
				    'selectors'         =>  array( '.tailor-toggle__title' ),
				    'declarations'      =>  array(
					    'color'             =>  esc_attr( $atts['title_color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['title_background_color'] ) ) {
			    $css_rules[] = array(
				    'setting'           =>  'title_background_color',
				    'selectors'         =>  array( '.tailor-toggle__title' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( $atts['title_background_color'] ),
				    ),
			    );
		    }

		    $selectors = array(
			    'border_style'              =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
			    'border_radius'             =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
		    );
		    $css_rules = tailor_generate_attribute_css_rules( $css_rules, $atts, $selectors );

		    $border_width_settings = array(
			    'border_width',
			    'border_width_tablet',
			    'border_width_mobile',
		    );
		    foreach ( $border_width_settings as $border_width_setting ) {
			    if ( ! empty( $atts[ $border_width_setting ] ) ) {
				    $styles = tailor_get_style_values( $atts[ $border_width_setting ] );
				    $media = ( 19 == strlen( $border_width_setting ) ) ? substr( $border_width_setting, 13, 19 ) : '';

				    $declarations = array();
				    foreach ( (array) $styles as $position => $value ) {
					    $unit = tailor_get_unit( $value );
					    $value = tailor_get_numeric_value( $value );

					    if ( 'top' == $position ) {
						    $css_rules[] = array(
							    'media'                 =>  $media,
							    'setting'               =>  $border_width_setting,
							    'selectors'             =>  array( '.tailor-toggle__title' ),
							    'declarations'          =>  array(
								    'border-top-width'      =>  esc_attr( $value . $unit ),
							    ),
						    );
					    }
					    else {
						    $declarations[ sprintf( 'border-%s-width', $position ) ] = esc_attr( $value . $unit );
					    }
				    }

				    // Add rule
				    if ( ! empty( $declarations ) ) {
					    $css_rules[] = array(
						    'media'                 =>  $media,
						    'setting'               =>  $border_width_setting,
						    'selectors'             =>  array( '.tailor-toggle__title', '.tailor-toggle__body' ),
						    'declarations'          =>  $declarations,
					    );
				    }
			    }
		    }

		    return $css_rules;
	    }
    }
}