<?php

/**
 * Tailor Posts element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Posts_Element' ) ) {

    /**
     * Tailor Posts element class.
     *
     * @since 1.0.0
     */
    class Tailor_Posts_Element extends Tailor_Element {

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
		        'style',
		        'layout',
		        'masonry',
		        'items_per_row',
		        'item_spacing',
		        'autoplay',
		        'autoplay_speed',
		        'arrows',
		        'dots',
		        'fade',
		        'meta',
                'image_link',
                'image_size',
                'aspect_ratio',
                'stretch',
		        'posts_per_page',
		        'pagination',
	        );
	        $general_control_arguments = array(
		        'style'                 =>  array(
			        'setting'               =>  array(
				        'default'               =>  'default',
			        ),
			        'control'               =>  array(
				        'choices'               =>  array(
					        'default'               =>  __( 'Default', 'tailor' ),
					        'boxed'                 =>  __( 'Boxed', 'tailor' ),
				        ),
			        ),
		        ),
		        'layout'                =>  array(
			        'setting'               =>  array(
				        'default'               =>  'list',
			        ),
                    'control'               =>  array(
                        'choices'               =>  array(
                            'list'                  =>  __( 'List', 'tailor' ),
                            'grid'                  =>  __( 'Grid', 'tailor' ),
                            'carousel'              =>  __( 'Carousel', 'tailor' ),
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
					        'items_per_row'         =>  array(
						        'condition'             =>  'greaterThan',
						        'value'                 =>  '1',
					        ),
				        ),
			        ),
		        ),
		        'items_per_row'         =>  array(
                    'setting'               =>  array(
                        'default'               =>  '1',
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
						        'condition'             =>  'contains',
						        'value'                 =>  array( 'carousel', 'slideshow' ),
					        ),
				        ),
			        ),
		        ),
		        'fade'                  =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'contains',
						        'value'                 =>  array( 'carousel', 'slideshow' ),
					        ),
					        'items_per_row'         =>  array(
						        'condition'             =>  'lessThan',
						        'value'                 =>  '2',
					        ),
				        ),
			        ),
		        ),
		        'meta'                  =>  array(
			        'setting'               =>  array(
				        'default'               =>  'date,excerpt',
			        ),
                    'control'               =>  array(
                        'choices'               =>  array(
                            'author'                =>  __( 'Author', 'tailor' ),
                            'category'              =>  __( 'Category', 'tailor' ),
                            'date'                  =>  __( 'Date', 'tailor' ),
                            'excerpt'               =>  __( 'Excerpt', 'tailor' ),
                            'thumbnail'             =>  __( 'Thumbnail', 'tailor' ),
                            'comment-number'        =>  __( 'Comment number', 'tailor' ),
                        ),
                    ),
		        ),
		        'posts_per_page'        =>  array(
			        'setting'               =>  array(
				        'default'               =>  '2',
			        ),
		        ),
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
		        'image_link'            =>  array(
			        'control'               =>  array(
				        'choices'               =>  array(
					        'post'                  =>  __( 'Post', 'tailor' ),
					        'file'                  =>  __( 'Image', 'tailor' ),
					        'none'                  =>  __( 'None', 'tailor' ),
				        ),
				        'dependencies'          =>  array(
					        'meta'                  =>  array(
						        'condition'             =>  'contains',
						        'value'                 =>  'thumbnail',
					        ),
				        ),
			        ),
		        ),
                'image_size'            =>  array(
                    'control'               =>  array(
	                    'dependencies'          =>  array(
		                    'meta'                  =>  array(
			                    'condition'             =>  'contains',
			                    'value'                 =>  'thumbnail',
		                    ),
	                    ),
                    ),
                ),
                'aspect_ratio'          =>  array(
                    'control'               =>  array(
	                    'dependencies'          =>  array(
		                    'meta'                  =>  array(
			                    'condition'             =>  'contains',
			                    'value'                 =>  'thumbnail',
		                    ),
	                    ),
                    ),
                ),
		        'stretch'               =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'meta'                  =>  array(
						        'condition'             =>  'contains',
						        'value'                 =>  'thumbnail',
					        ),
				        ),
			        ),
		        ),
		        'pagination'            =>  array(
                    'control'               =>  array(
                        'dependencies'          =>  array(
                            'layout'                =>  array(
                                'condition'             =>  'not',
                                'value'                 =>  'carousel',
                            ),
                        ),
                    ),
		        ),
	        );
	        tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

	        $priority = 0;
	        $query_control_types = array(
		        'categories',
		        'tags',
		        'order_by',
		        'order',
		        'offset',
	        );
	        $query_control_arguments = array();
	        tailor_control_presets( $this, $query_control_types, $query_control_arguments, $priority );

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