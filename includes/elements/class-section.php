<?php

/**
 * Tailor Section element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Section_Element' ) ) {

    /**
     * Tailor Section element class.
     *
     * @since 1.0.0
     */
    class Tailor_Section_Element extends Tailor_Element {

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
		        'max_width',
		        'max_width_tablet',
		        'max_width_mobile',
		        'min_height',
		        'min_height_tablet',
		        'min_height_mobile',
		        'vertical_alignment',
		        'vertical_alignment_tablet',
		        'vertical_alignment_mobile',
		        'horizontal_alignment',
		        'horizontal_alignment_tablet',
		        'horizontal_alignment_mobile',
		        'hidden',
	        );
	        $general_control_arguments = array(
		        'vertical_alignment'    =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'min_height'            =>  array(
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
		        'margin'                =>  array(
                    'control'               =>  array(
                        'choices'               =>  array(
                            'top'                   =>  __( 'Top', 'tailor' ),
                            'bottom'                =>  __( 'Bottom', 'tailor' ),
                        ),
                    ),
		        ),
		        'background_repeat'     =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'background_image'      => array(
						        'condition'             =>  'not',
						        'value'                 =>  '',
					        ),
					        'parallax'              => array(
						        'condition'             =>  'not',
						        'value'                 =>  '1',
					        ),
				        ),
			        ),
		        ),
		        'background_position'   =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'background_image'      => array(
						        'condition'             =>  'not',
						        'value'                 =>  '',
					        ),
					        'parallax'              => array(
						        'condition'             =>  'not',
						        'value'                 =>  '1',
					        ),
				        ),
			        ),
		        ),
		        'background_size'       =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'background_image'      => array(
						        'condition'             =>  'not',
						        'value'                 =>  '',
					        ),
					        'parallax'              => array(
						        'condition'             =>  'not',
						        'value'                 =>  '1',
					        ),
				        ),
			        ),
		        ),
		        'background_attachment' =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'background_image'      => array(
						        'condition'             =>  'not',
						        'value'                 =>  '',
					        ),
					        'parallax'              => array(
						        'condition'             =>  'not',
						        'value'                 =>  '1',
					        ),
				        ),
			        ),
		        ),
	        );
	        $priority = tailor_control_presets( $this, $attribute_control_types, $attribute_control_arguments, $priority );

	        $this->add_setting( 'parallax', array(
		        'sanitize_callback'     =>  'tailor_sanitize_number',
	        ) );
	        $this->add_control( 'parallax', array(
		        'label'                 =>  __( 'Enable parallax?', 'tailor' ),
		        'type'                  =>  'switch',
		        'priority'              =>  85,
		        'section'               =>  'attributes',
		        'dependencies'          =>  array(
			        'background_image'      => array(
				        'condition'             =>  'not',
				        'value'                 =>  '',
			        ),
			        'background_video'      => array(
				        'condition'             =>  'equals',
				        'value'                 =>  '',
			        ),
		        ),
	        ) );
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
			    'max_width',
			    'max_width_tablet',
			    'max_width_mobile',
			    'min_height',
			    'min_height_tablet',
			    'min_height_mobile',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    $selectors = array(
			    'max_width'                 =>  array( '.tailor-section__content' ),
			    'max_width_tablet'          =>  array( '.tailor-section__content' ),
			    'max_width_mobile'          =>  array( '.tailor-section__content' ),
			    'min_height'                =>  array( '.tailor-section__content' ),
			    'min_height_tablet'         =>  array( '.tailor-section__content' ),
			    'min_height_mobile'         =>  array( '.tailor-section__content' ),
		    );
		    $css_rules = tailor_generate_general_css_rules( $css_rules, $atts, $selectors );

		    // Parallax background image
		    if ( ! empty( $atts['background_image'] ) ) {
			    if (
				    ! empty( $atts['parallax'] ) && 1 == $atts['parallax'] &&
				    $background_image_url = wp_get_attachment_image_url( $atts['background_image'], 'full' )
			    ) {

				    // Prevent default background image styles from being applied
				    $excluded_control_types[] = 'background_image';

				    // Parallax background image with color
				    if ( ! empty( $atts['background_color'] ) ) {

					    // Semi-transparent color over image
					    if ( false !== strpos( $atts['background_color'], 'rgba' ) ) {
						    $background = "linear-gradient( {$atts['background_color']}, {$atts['background_color']} ), url({$background_image_url}) center center / cover no-repeat";
					    }

					    // Image displayed over solid color
					    else {
						    $background = "{$atts['background_color']} url({$background_image_url}) center center / cover no-repeat";
					    }
				    }

				    // Parallax background image with no color
				    else {
					    $background =  "url({$background_image_url}) center center / cover no-repeat";
				    }

				    $css_rules[] = array(
					    'setting'           =>  'parallax',
					    'selectors'         =>  array( '.tailor-section__background' ),
					    'declarations'      =>  array(
						    'background'        =>  esc_attr( $background ),
					    ),
				    );
			    }
		    }
		    
		    return $css_rules;
	    }
    }
}