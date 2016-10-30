<?php

/**
 * Tailor Jetpack Testimonials element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.3.5
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Jetpack_Testimonials_Element' ) ) {

    /**
     * Tailor Jetpack Testimonials element class.
     *
     * @since 1.3.5
     */
    class Tailor_Jetpack_Testimonials_Element extends Tailor_Element {

	    /**
	     * Registers element settings, sections and controls.
	     *
	     * @since 1.3.5
	     * @access protected
	     */
	    protected function register_controls() {

		    $this->add_section( 'general', array(
			    'title'                 =>  __( 'General', 'tailor' ),
			    'priority'              =>  10,
		    ) );

		    $this->add_section( 'query', array(
			    'title'                 =>  __( 'Query', 'tailor' ),
			    'priority'              =>  20,
		    ) );

		    $this->add_section( 'colors', array(
			    'title'                 =>  __( 'Colors', 'tailor' ),
			    'priority'              =>  30,
		    ) );

		    $this->add_section( 'attributes', array(
			    'title'                 =>  __( 'Attributes', 'tailor' ),
			    'priority'              =>  40,
		    ) );

		    $priority = 0;

		    $general_control_types = array(
			    'items_per_row',
			    'meta',
			    'posts_per_page',
		    );
		    $general_control_arguments = array(
			    'items_per_row'         =>  array(
				    'setting'               =>  array(
					    'default'               =>  '3',
				    ),
			    ),
			    'meta'                  =>  array(
				    'setting'               =>  array(
					    'default'               =>  'image',
				    ),
				    'control'               =>  array(
					    'choices'               =>  array(
						    'image'                 =>  __( 'Image', 'tailor' ),
					    ),
				    ),
			    ),
			    
		    );
		    tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

		    $priority = 0;
		    $query_control_types = array(
			    'order_by',
			    'order',
		    );
		    $query_control_arguments = array(
			    'order_by'              =>  array(
				    'setting'               =>  array(
					    'default'               =>  'date',
				    ),
			    ),
			    'order'                 =>  array(
				    'setting'               =>  array(
					    'default'               =>  'DESC',
				    ),
			    ),
		    );
		    tailor_control_presets( $this, $query_control_types, $query_control_arguments, $priority );

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
			    'background_attachment',
		    );
		    $attribute_control_arguments = array();
		    tailor_control_presets( $this, $attribute_control_types, $attribute_control_arguments, $priority );
	    }

	    /**
	     * Returns custom CSS rules for the element.
	     *
	     * @since 1.3.5
	     *
	     * @param array $atts
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array();
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    return $css_rules;
	    }
    }
}