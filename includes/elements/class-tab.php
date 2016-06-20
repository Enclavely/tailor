<?php

/**
 * Tailor Tab element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Tab_Element' ) ) {

    /**
     * Tailor Tab element class.
     *
     * @since 1.0.0
     */
    class Tailor_Tab_Element extends Tailor_Element {

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
            );
	        $general_control_arguments = array();
	        tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

	        $priority = 0;
	        $color_control_types = array(
		        'color',
		        'link_color',
		        'heading_color',
		        'background_color',
		        //'border_color',
	        );
	        $color_control_arguments = array();
	        tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

	        $priority = 0;
	        $attribute_control_types = array(
		        'class',
		        'padding',
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
	    public function generate_css( $atts ) {
		    $css_rules = array();
		    $excluded_control_types = array(
			    'padding',
			    'background_image',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    if ( ! empty( $atts['heading_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '&.tailor-tabs__navigation-item' ),
				    'declarations'      =>  array(
					    'color'             =>  esc_attr( $atts['heading_color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['background_color'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '&.tailor-tabs__navigation-item', '&.tailor-tab' ),
				    'declarations'      =>  array(
					    'background-color'  =>  esc_attr( $atts['background_color'] ),
				    ),
			    );
		    }

		    if ( ! empty( $atts['padding'] ) ) {
			    $values = array_combine( array( 'top', 'right', 'bottom', 'left' ), explode( '-', $atts['padding'] ) );

			    foreach ( $values as $position => $value ) {
				    if ( ! empty( $value ) ) {
					    $css_rules[] = array(
						    'selectors'                 =>  array( '&.tailor-tab' ),
						    'declarations'              =>  array(
							    "padding-{$position}"       =>  esc_attr( $value ),
						    ),
					    );
				    }
			    }
		    }

		    if (  ! empty( $atts['background_image'] ) && is_numeric( $atts['background_image'] ) ) {
			    $background_image_info = wp_get_attachment_image_src( $atts['background_image'], 'full' );
			    $background_image_src = $background_image_info[0];

			    $css_rules[] = array(
				    'selectors'         =>  array( '&.tailor-tab' ),
				    'declarations'      =>  array(
					    'background'        =>  "url('{$background_image_src}') center center no-repeat",
					    //'background-size'   =>  'cover',
				    ),
			    );
		    }

		    if ( ! empty( $atts['background_repeat'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '&.tailor-tab' ),
				    'declarations'      =>  array(
					    'background-repeat' =>  $atts['background_repeat'],
				    ),
			    );
		    }

		    if ( ! empty( $atts['background_position'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '&.tailor-tab' ),
				    'declarations'      =>  array(
					    'background-position'   =>  $atts['background_position'],
				    ),
			    );
		    }

		    if ( ! empty( $atts['background_size'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '&.tailor-tab' ),
				    'declarations'      =>  array(
					    'background-size'   =>  $atts['background_size'],
				    ),
			    );
		    }

		    return $css_rules;
	    }
    }
}