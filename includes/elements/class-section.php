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
		        'min_height',
		        'horizontal_alignment',
                'vertical_alignment',
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
		        'margin',
		        'border_style',
		        'border_width',
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
						        'value'                 =>  1,
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
						        'value'                 =>  1,
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
						        'value'                 =>  1,
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
						        'value'                 =>  1,
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

	        $this->add_setting( 'background_video', array(
		        'sanitize_callback'     =>  'tailor_sanitize_number',
	        ) );
	        $this->add_control( 'background_video', array(
		        'label'                 =>  __( 'Background video', 'tailor' ),
		        'type'                  =>  'video',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'attributes',
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
		    $excluded_control_types = array();

		    if ( ! empty( $atts['max_width'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array( '.tailor-section__content' ),
				    'declarations'      =>  array(
					    'max-width'         =>  esc_attr( $atts['max_width'] ),
				    ),
				    'setting'           =>  'max_width',
			    );
		    }

		    if ( ! empty( $atts['min_height'] ) ) {
			    $css_rules[] = array(
				    'selectors'         =>  array(),
				    'declarations'      =>  array(
					    'min-height'        =>  esc_attr( $atts['min_height'] ),
				    ),
				    'setting'           =>  'min_height',
			    );
		    }

		    // Background video
		    if ( ! empty( $atts['background_video'] ) ) {
			    if ( ! empty( $atts['overlay_color'] ) ) {
				    $css_rules[] = array(
					    'selectors'         =>  array( '.tailor-video-overlay' ),
					    'declarations'      =>  array(
						    'background-color'  =>  esc_attr( $atts['overlay_color'] ),
					    ),
				    );
			    }
		    }

		    // Parallax background image
		    else if ( ! empty( $atts['background_image'] ) ) {
			    if ( 1 == $atts['parallax'] && $background_image_url = wp_get_attachment_image_url( $atts['background_image'], 'full' ) ) {

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
					    $background =  "url('{$background_image_url}') center center / cover no-repeat";
				    }

				    $css_rules[] = array(
					    'selectors'    => array( '.tailor-section__background' ),
					    'declarations' => array(
						    'background' => esc_attr( $background ),
					    ),
				    );
			    }
		    }

		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );
		    
		    return $css_rules;
	    }
    }
}