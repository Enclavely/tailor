<?php

/**
 * Tailor User element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_User_Element' ) ) {

    /**
     * Tailor User element class.
     *
     * @since 1.0.0
     */
    class Tailor_User_Element extends Tailor_Element {

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

	        $this->add_setting( 'author_id', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( 'author_id', array(
		        'label'                 =>  __( 'User', 'tailor' ),
		        'type'                  =>  'select',
		        'choices'               =>  tailor_get_users(),
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $general_control_types = array(
		        'image',
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
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array();
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    if ( ! empty( $atts['image'] ) && is_numeric( $atts['image'] ) ) {
			    $background_image_info = wp_get_attachment_image_src( $atts['image'], 'full' );
			    $background_image_src = $background_image_info[0];

			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-author__header' ),
				    'declarations'      =>  array(
					    'background'        =>  "url('{$background_image_src}') center center no-repeat",
					    'background-size'   =>  'cover',
				    ),
			    );
		    }

		    return $css_rules;
	    }
    }
}