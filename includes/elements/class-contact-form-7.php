<?php

/**
 * Tailor Contact Form 7 element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Form_CF7_Element' ) ) {

    /**
     * Tailor Contact Form 7 element class.
     *
     * @since 1.0.0
     */
    class Tailor_Form_CF7_Element extends Tailor_Element {

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

	        $contact_forms = WPCF7_ContactForm::find();
			$choices = array();
	        $choices[0] = __( '&mdash; Select &mdash;', 'tailor' );
	        foreach ( $contact_forms as $contact_form ) {
		        $choices[ $contact_form->id() ] = $contact_form->title();
	        }

	        $this->add_setting( 'form', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( 'form', array(
		        'label'                 =>  __( 'Contact form', 'tailor' ),
		        'type'                  =>  'select',
		        'choices'               =>  $choices,
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

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

		    return $css_rules;
	    }
    }
}