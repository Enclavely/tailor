<?php

/**
 * Tailor Gallery element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Gallery_Element' ) ) {

    /**
     * Tailor Gallery element class.
     *
     * @since 1.0.0
     */
    class Tailor_Gallery_Element extends Tailor_Element {

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

	        $this->add_setting( 'ids', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( 'ids', array(
		        'label'                 =>  __( 'Images', 'tailor' ),
		        'type'                  =>  'gallery',
		        'priority'              =>  $priority += 10,
		        'section'               =>  'general',
	        ) );

	        $general_control_types = array(
		        'layout',
		        'masonry',
		        'items_per_row',
		        'item_spacing',
		        'autoplay',
		        'autoplay_speed',
		        'arrows',
		        'dots',
		        'thumbnails',
		        'fade',
		        'image_link',
		        'image_size',
		        'aspect_ratio',
		        'stretch',
		        'caption',
	        );
	        $general_control_arguments = array(
		        'layout'                =>  array(
			        'setting'               =>  array(
				        'default'               =>  'list',
			        ),
                    'control'               =>  array(
                        'choices'               =>  array(
                            'list'                  =>  __( 'List', 'tailor' ),
                            'grid'                  =>  __( 'Grid', 'tailor' ),
                            'carousel'              =>  __( 'Carousel', 'tailor' ),
                            'slideshow'             =>  __( 'Slideshow', 'tailor' ),
                        ),
                    ),
		        ),
		        'masonry'               =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  'grid',
					        ),
					        'aspect_ratio'          =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  '',
					        ),
				        ),
			        ),
		        ),
		        'items_per_row'         =>  array(
                    'setting'               =>  array(
                        'default'               =>  '2',
                    ),
                    'control'               =>  array(
                        'dependencies'          =>  array(
                            'layout'                =>  array(
                                'condition'             =>  'contains',
                                'value'                 =>  array( 'grid', 'carousel' ),
                            ),
                        ),
                    ),
		        ),
		        'item_spacing'          =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'not',
						        'value'                 =>  'slideshow',
					        ),
				        ),
			        ),
		        ),
		        'autoplay'              =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'contains',
						        'value'                 =>  array( 'carousel', 'slideshow' ),
					        ),
				        ),
			        ),
		        ),
		        'autoplay_speed'        =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'contains',
						        'value'                 =>  array( 'carousel', 'slideshow' ),
					        ),
					        'autoplay'              =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  '1',
					        ),
				        ),
			        ),
		        ),
		        'arrows'                =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'contains',
						        'value'                 =>  array( 'carousel', 'slideshow' ),
					        ),
				        ),
			        ),
		        ),
		        'dots'                  =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  'carousel',
					        ),
				        ),
			        ),
		        ),
                'thumbnails'            =>  array(
                    'control'               =>  array(
                        'dependencies'          =>  array(
                            'layout'                =>  array(
                                'condition'             =>  'equals',
                                'value'                 =>  'slideshow',
                            ),
                        ),
                    ),
                ),
		        'fade'                  =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  'carousel',
					        ),
					        'items_per_row'         =>  array(
						        'condition'             =>  'lessThan',
						        'value'                 =>  '2',
					        ),
				        ),
			        ),
		        ),
		        'image_link'            =>  array(
			        'setting'               =>  array(
				        'default'               =>  'none',
			        ),
		        ),
		        'image_size'            =>  array(
			        'setting'               =>  array(
				        'default'               =>  'large',
			        ),
		        ),
	        );
	        $priority = tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

	        $general_control_types = array();
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
		        'navigation_color',
	        );

	        $color_control_arguments = array(
		        'navigation_color'      =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  'carousel',
					        ),
				        ),
			        ),
		        ),
	        );
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