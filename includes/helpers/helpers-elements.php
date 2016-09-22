<?php

/**
 * Element helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_empty_list' ) ) {

	/**
	 * Returns a message to display when a list contains no items.
	 *
	 * @since 1.0.0
	 *
	 * @param string $list_type
	 * @return string
	 */
	function tailor_empty_list( $list_type ) {
		return sprintf( _x( 'No %1$s to display', 'expected item type', 'tailor' ), $list_type );
	}
}

if ( ! function_exists( 'tailor_get_widget_areas' ) ) {

	/**
	 * Returns an array containing the registered widget areas.
	 *
	 * @since 1.0.0
	 * @uses $wp_registered_sidebars
	 *
	 * @param array $widget_areas
	 * @return array
	 */
	function tailor_get_widget_areas( $widget_areas = array() ) {

		global $wp_registered_sidebars;

		if ( empty( $wp_registered_sidebars ) ) {
			$widget_areas = array( '' => tailor_empty_list( __( 'widget areas', 'tailor' ) ) );
		}

		foreach ( $wp_registered_sidebars as $sidebar ) {
			$widget_areas[ $sidebar['id'] ] = $sidebar['name'];
		}

		return $widget_areas;
	}
}

if ( ! function_exists( 'tailor_control_presets' ) ) {

	/**
	 * Registers the settings and controls based.
	 *
	 * @since 1.0.0
	 *
	 * @param Tailor_Element $element
	 * @param array $control_ids
	 * @param array $control_arguments
	 * @param int $priority
	 * @return int $priority
	 */
	function tailor_control_presets( $element, $control_ids = array(), $control_arguments = array(), $priority = 10 ) {

		$choices = array(
			'top'                   =>  __( 'Top', 'tailor' ),
			'right'                 =>  __( 'Right', 'tailor' ),
			'bottom'                =>  __( 'Bottom', 'tailor' ),
			'left'                  =>  __( 'Left', 'tailor' ),
		);

		$control_definitions = array(

			'hidden'                =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Hide on', 'tailor' ),
					'type'                  =>  'select-multi',
					'choices'               =>  tailor_get_media_queries(),
					'section'               =>  'general',
				),
			),

			'title'                 =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Title', 'tailor' ),
					'type'                  =>  'text',
					'section'               =>  'general',
				),
			),
			'alignment'             =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Alignment', 'tailor' ),
					'type'                  =>  'select',
					'section'               =>  'general',
				),
			),
            'max_width'             =>  array(
                'setting'               =>  array(
                    'sanitize_callback'     =>  'tailor_sanitize_text',
                    'refresh'               =>  array(
	                    'method'                =>  'js',
                    ),
                ),
                'control'               =>  array(
                    'label'                 =>  __( 'Maximum width', 'tailor' ),
                    'type'                  =>  'text',
                    'section'               =>  'general',
                ),
            ),
            'min_height'            =>  array(
                'setting'               =>  array(
                    'sanitize_callback'     =>  'tailor_sanitize_text',
                    'refresh'               =>  array(
	                    'method'                =>  'js',
                    ),
                ),
                'control'               =>  array(
                    'label'                 =>  __( 'Minimum height', 'tailor' ),
                    'type'                  =>  'text',
                    'section'               =>  'general',
                ),
            ),
			'style'                 =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Style', 'tailor' ),
					'type'                  =>  'select',
					'section'               =>  'general',
				),
			),
			'layout'                =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Layout', 'tailor' ),
					'type'                  =>  'select',
					'section'               =>  'general',
				),
			),
            'items_per_row'         =>  array(
                'setting'               =>  array(
                    'sanitize_callback'     =>  'tailor_sanitize_number',
                ),
                'control'               =>  array(
                    'label'                 =>  __( 'Items per row', 'tailor' ),
                    'type'                  =>  'select',
                    'choices'               =>  tailor_get_range( 1, 6, 1 ),
                    'section'               =>  'general',
                ),
            ),
			'min_item_height'       =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Minimum item height', 'tailor' ),
					'type'                  =>  'text',
					'section'               =>  'general',
				),
			),
			'autoplay'              =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Autoplay', 'tailor' ),
					'type'                  =>  'switch',
					'section'               =>  'general',
				),
			),
			'fade'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Fade', 'tailor' ),
					'type'                  =>  'switch',
					'section'               =>  'general',
				),
			),
			'arrows'                =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Arrows', 'tailor' ),
					'type'                  =>  'switch',
					'section'               =>  'general',
				),
			),
			'dots'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
					'default'               =>  '1',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Dots', 'tailor' ),
					'type'                  =>  'switch',
					'section'               =>  'general',
				),
			),
            'thumbnails'            =>  array(
                'setting'               =>  array(
                    'sanitize_callback'     =>  'tailor_sanitize_number',
                    'default'               =>  '1',
                ),
                'control'               =>  array(
                    'label'                 =>  __( 'Thumbnails', 'tailor' ),
                    'type'                  =>  'switch',
                    'section'               =>  'general',
                ),
            ),
			'item_spacing'          =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Item spacing', 'tailor' ),
					'type'                  =>  'text',
					'section'               =>  'general',
				),
			),
			'masonry'               =>  array(
                'setting'               =>  array(
                    'sanitize_callback'     =>  'tailor_sanitize_number',
                ),
                'control'               =>  array(
	                'label'                 =>  __( 'Masonry', 'tailor' ),
	                'type'                  =>  'switch',
	                'choices'               =>  array(
		                '1'                     =>  __( 'Apply masonry layout?', 'tailor' ),
	                ),
	                'section'               =>  'general',
                ),
            ),
			'lightbox'              =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Lightbox', 'tailor' ),
					'type'                  =>  'switch',
					'choices'               =>  array(
						'1'                     =>  __( 'Open images in lightbox?', 'tailor' ),
					),
					'section'               =>  'general',
				),
			),
			'meta'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Meta', 'tailor' ),
					'type'                  =>  'select-multi',
					'section'               =>  'general',
				),
			),
			'posts_per_page'        =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'default'               =>  '4',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Posts per page', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  tailor_get_range( 1, 12, 1 ),
					'section'               =>  'general',
				),
			),
			'pagination'            =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Pagination', 'tailor' ),
					'choices'               =>  array(
						'1'                     =>  __( 'Show pagination links?', 'tailor' ),
					),
					'type'                  =>  'switch',
					'section'               =>  'general',
				),
			),
			'type'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Type', 'tailor' ),
					'type'                  =>  'select',
					'section'               =>  'general',
				),
			),
			'graphic_type'          =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Graphic type', 'tailor' ),
					'type'                  =>  'select',
					'section'               =>  'general',
				),
			),
			'graphic_size'          =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Graphic size', 'tailor' ),
					'type'                  =>  'text',
					'section'               =>  'general',
				),
			),
			'image'                 =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Image', 'tailor' ),
					'type'                  =>  'image',
					'section'               =>  'general',
				),
			),
			'image_width'           =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Image width', 'tailor' ),
					'type'                  =>  'text',
					'section'               =>  'general',
				),
			),
			'image_link'            =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Image link', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'post'                  =>  __( 'Post', 'tailor' ),
						'file'                  =>  __( 'Image', 'tailor' ),
						'lightbox'              =>  __( 'Lightbox', 'tailor' ),
						'none'                  =>  __( 'None', 'tailor' ),
					),
					'section'               =>  'general',
				),
			),
			'image_size'            =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Image size', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  tailor_get_image_sizes(),
					'section'               =>  'general',
				),
			),
            'aspect_ratio'          =>  array(
                'setting'               =>  array(
                    'sanitize_callback'     =>  'tailor_sanitize_text',
                ),
                'control'               =>  array(
                    'label'                 =>  __( 'Aspect ratio', 'tailor' ),
                    'type'                  =>  'select',
                    'choices'               =>  array(
                        ''                      =>  __( 'Original', 'tailor' ),
                        '1:1'                   =>  __( 'Square', 'tailor' ),
                        '3:2'                   =>  __( 'Horizontal 3:2', 'tailor' ),
                        '4:3'                   =>  __( 'Horizontal 4:3', 'tailor' ),
                        '16:9'                  =>  __( 'Horizontal 16:9', 'tailor' ),
                        '2:3'                   =>  __( 'Vertical 2:3', 'tailor' ),
                        '3:4'                   =>  __( 'Vertical 3:4', 'tailor' ),
                    ),
                    'section'               =>  'general',
                ),
            ),
            'horizontal_alignment'  =>  array(
                'setting'               =>  array(
                    'sanitize_callback'     =>  'tailor_sanitize_text',
                    'refresh'               =>  array(
	                    'method'                =>  'js',
                    ),
                ),
                'control'               =>  array(
                    'label'                 =>  __( 'Horizontal alignment', 'tailor' ),
                    'type'                  =>  'button-group',
                    'choices'               =>  array(
                        'left'                  =>  '<i class="tailor-icon tailor-align-left"></i>',
                        'center'                =>  '<i class="tailor-icon tailor-align-center"></i>',
                        'right'                 =>  '<i class="tailor-icon tailor-align-right"></i>',
                    ),
                    'section'               =>  'general',
                ),
            ),
			'vertical_alignment'    =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Vertical alignment', 'tailor' ),
					'type'                  =>  'button-group',
					'choices'               =>  array(
						'top'                   =>  '<i class="tailor-icon tailor-align-top"></i>',
						'middle'                =>  '<i class="tailor-icon tailor-align-middle"></i>',
						'bottom'                =>  '<i class="tailor-icon tailor-align-bottom"></i>',
					),
					'section'               =>  'general',
				),
			),
			'stretch'               =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Stretch-to-fit image', 'tailor' ),
					'type'                  =>  'switch',
					'section'               =>  'general',
				),
			),
			'caption'               =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Caption', 'tailor' ),
					'type'                  =>  'switch',
					'section'               =>  'general',
				),
			),
			'icon'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Icon', 'tailor' ),
					'type'                  =>  'icon',
					'section'               =>  'general',
				),
			),
			'size'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'default'               =>  'medium',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Size', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'small'                 =>  __( 'Small', 'tailor' ),
						'medium'                =>  __( 'Medium', 'tailor' ),
						'large'                 =>  __( 'Large', 'tailor' ),
					),
					'section'               =>  'general',
				),
			),
			'href'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Link', 'tailor' ),
					'type'                  =>  'link',
					'placeholder'           =>  'http://',
					'section'               =>  'general',
				),
			),
			'target'         =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Link behavior', 'tailor' ),
					'type'                  =>  'checkbox',
					'choices'               =>  array(
						'_blank'                =>  __( 'Open in a new window?', 'tailor' ),
					),
					'section'               =>  'general',
				),
			),

			'categories'            =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Categories', 'tailor' ),
					'type'                  =>  'select-multi',
					'choices'               =>  tailor_get_terms(),
					'section'               =>  'query',
				),
			),
			'tags'                  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Tags', 'tailor' ),
					'type'                  =>  'select-multi',
					'choices'               =>  tailor_get_terms( 'post_tag' ),
					'section'               =>  'query',
				),
			),
			'order_by'              =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Order by', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'date'                  =>  __( 'Date', 'tailor' ),
						'author'                =>  __( 'Author', 'tailor' ),
						'title'                 =>  __( 'Title', 'tailor' ),
						'comment_count'         =>  __( 'Number of comments', 'tailor' ),
					),
					'section'               =>  'query',
				),
			),
			'order'                 =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Order by', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'DESC'                  =>  __( 'Descending', 'tailor' ),
						'ASC'                   =>  __( 'Ascending', 'tailor' ),
					),
					'dependencies'          =>  array(
						'order'                 => array(
							'condition'             =>  'not',
							'value'                 =>  'none',
						),
					),
					'section'               =>  'query',
				),
			),
			'offset'                =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Offset', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  tailor_get_range( 0, 20, 1 ),
					'section'               =>  'query',
				),
			),

			'color'                 =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Text color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'color_hover'           =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Text hover color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'link_color'            =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Link color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'link_color_hover'      =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Link hover color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'dependencies'          =>  array(
						'link_color'            => array(
							'condition'             =>  'not',
							'value'                 =>  '',
						),
					),
					'section'               =>  'colors',
				),
			),
			'heading_color'         =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Heading color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'background_color'      =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
						'dependencies'          =>  array(
							'background_image'      => array(
								'condition'             =>  'equals',
								'value'                 =>  '',
							),
						),
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'rgba'                  =>  1,
					'section'               =>  'colors',
				),
			),
			'background_color_hover'=>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background hover color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'rgba'                  =>  1,
					'section'               =>  'colors',
				),
			),
			'border_color'          =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Border color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'border_color_hover'    =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Border hover color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'navigation_color'      =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Navigation color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'graphic_color'         =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Graphic color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'graphic_color_hover'   =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Graphic hover color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'section'               =>  'colors',
				),
			),
			'graphic_background_color'  =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Graphic background color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'rgba'                  =>  1,
					'section'               =>  'colors',
				),
			),
			'graphic_background_color_hover'   =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_color',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Graphic hover background color', 'tailor' ),
					'type'                  =>  'colorpicker',
					'rgba'                  =>  1,
					'section'               =>  'colors',
				),
			),

			'class'                 =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Class name', 'tailor' ),
					'type'                  =>  'text',
					'section'               =>  'attributes',
				),
			),
			'padding'               =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Padding', 'tailor' ),
					'type'                  =>  'style',
					'choices'               =>  array(
						'top'                   =>  $choices['top'],
						'right'                 =>  $choices['right'],
						'bottom'                =>  $choices['bottom'],
						'left'                  =>  $choices['left'],
					),
					'section'               =>  'attributes',
				),
			),
			'margin'                =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Margin', 'tailor' ),
					'type'                  =>  'style',
					'choices'               =>  array(
						'top'                   =>  $choices['top'],
						'right'                 =>  $choices['right'],
						'bottom'                =>  $choices['bottom'],
						'left'                  =>  $choices['left'],
					),
					'section'               =>  'attributes',
				),
			),
			'border_style'          =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Border style', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						''                      =>  __( 'Default', 'tailor' ),
						'solid'                 =>  __( 'Solid', 'tailor' ),
						'dashed'                =>  __( 'Dashed', 'tailor' ),
						'dotted'                =>  __( 'Dotted', 'tailor' ),
						'double'                =>  __( 'Double', 'tailor' ),
						'groove'                =>  __( 'Groove', 'tailor' ),
						'ridge'                 =>  __( 'Ridge', 'tailor' ),
						'inset'                 =>  __( 'Inset', 'tailor' ),
						'outset'                =>  __( 'Outset', 'tailor' ),
						'none'                  =>  __( 'None', 'tailor' ),
					),
					'section'               =>  'attributes',
				),
			),
			'border_width'          =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Border width', 'tailor' ),
					'type'                  =>  'style',
					'choices'               =>  array(
						'top'                   =>  $choices['top'],
						'right'                 =>  $choices['right'],
						'bottom'                =>  $choices['bottom'],
						'left'                  =>  $choices['left'],
					),
					'dependencies'          =>  array(
						'border_style'          =>  array(
							'condition'             =>  'not',
							'value'                 =>  array( '', 'none' ),
						),
					),
					'section'               =>  'attributes',
				),
			),
			'border_radius'         =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Border radius', 'tailor' ),
					'type'                  =>  'text',
					'choices'               =>  array(
						'top'                   =>  $choices['top'],
						'right'                 =>  $choices['right'],
						'bottom'                =>  $choices['bottom'],
						'left'                  =>  $choices['left'],
					),
					'dependencies'          =>  array(
						'border_style'          =>  array(
							'condition'             =>  'not',
							'value'                 =>  array( '', 'none' ),
						),
					),
					'section'               =>  'attributes',
				),
			),
			'shadow'                =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Shadow ', 'tailor' ),
					'type'                  =>  'switch',
					'dependencies'          =>  array(
						'border_style'          =>  array(
							'condition'             =>  'not',
							'value'                 =>  array( '', 'none' ),
						),
					),
					'section'               =>  'attributes',
				),
			),

			'background_image'      =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background image', 'tailor' ),
					'type'                  =>  'image',
					'section'               =>  'attributes',
				),
			),
			'background_repeat'     =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background repeat', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'no-repeat'             =>  __( 'No repeat', 'tailor' ),
						'repeat'                =>  __( 'Repeat', 'tailor' ),
						'repeat-x'              =>  __( 'Repeat horizontally', 'tailor' ),
						'repeat-yx'             =>  __( 'Repeat vertically', 'tailor' ),
					),
					'dependencies'          =>  array(
						'background_image'      =>  array(
							'condition'             =>  'not',
							'value'                 =>  '',
						),
					),
					'section'               =>  'attributes',
				),
			),
			'background_position'   =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background position', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'left top'              =>  __( 'Left top', 'tailor' ),
						'left center'           =>  __( 'Left center', 'tailor' ),
						'left bottom'           =>  __( 'Left bottom', 'tailor' ),
						'right top'             =>  __( 'Right top', 'tailor' ),
						'right center'          =>  __( 'Right center', 'tailor' ),
						'right bottom'          =>  __( 'Right bottom', 'tailor' ),
						'center top'            =>  __( 'Center top', 'tailor' ),
						'center center'         =>  __( 'Center center', 'tailor' ),
						'center bottom'         =>  __( 'Center bottom', 'tailor' ),
					),
					'dependencies'          =>  array(
						'background_image'      =>  array(
							'condition'             =>  'not',
							'value'                 =>  '',
						),
					),
					'section'               =>  'attributes',
				),
			),
			'background_size'       =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background size', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'auto'                  =>  __( 'Auto', 'tailor' ),
						'cover'                 =>  __( 'Cover', 'tailor' ),
						'contain'               =>  __( 'Contain', 'tailor' ),
					),
					'dependencies'          =>  array(
						'background_image'      =>  array(
							'condition'             =>  'not',
							'value'                 =>  '',
						),
					),
					'section'               =>  'attributes',
				),
			),
			'background_attachment' =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_text',
					'refresh'               =>  array(
						'method'                =>  'js',
					),
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background attachment', 'tailor' ),
					'type'                  =>  'select',
					'choices'               =>  array(
						'scroll'                =>  __( 'Scroll', 'tailor' ),
						'fixed'                 =>  __( 'Fixed', 'tailor' ),
					),
					'dependencies'          =>  array(
						'background_image'      =>  array(
							'condition'             =>  'not',
							'value'                 =>  '',
						),
					),
					'section'               =>  'attributes',
				),
			),
			'background_video'      =>  array(
				'setting'               =>  array(
					'sanitize_callback'     =>  'tailor_sanitize_number',
				),
				'control'               =>  array(
					'label'                 =>  __( 'Background video', 'tailor' ),
					'type'                  =>  'video',
					'section'               =>  'attributes',
				),
			),
		);

		foreach ( $control_ids as $control_id ) {
			if ( array_key_exists( $control_id, $control_definitions ) ) {
                if ( array_key_exists( $control_id, $control_arguments ) ) {
                    if ( array_key_exists( 'control', $control_arguments[ $control_id ] ) ) {
                        $control_definitions[ $control_id ]['control'] = array_merge(
                            $control_definitions[ $control_id ]['control'],
                            $control_arguments[ $control_id ]['control']
                        );
                    }
                    if ( array_key_exists( 'setting', $control_arguments[ $control_id ] ) ) {
                        $control_definitions[ $control_id ]['setting'] = array_merge(
                            $control_definitions[ $control_id ]['setting'],
                            $control_arguments[ $control_id ]['setting']
                        );
                    }
                }

				$setting_args = $control_definitions[ $control_id ]['setting'];

				/**
				 * Filter the setting arguments.
				 *
				 * @since 1.4.0
				 *
				 * @param array $setting_args
				 * @param Tailor_Element $element
				 */
				$setting_args= apply_filters( 'tailor_setting_args_' . $element->tag, $setting_args, $element );

				/**
				 * Filter the setting arguments.
				 *
				 * @since 1.4.0
				 *
				 * @param array $setting_args
				 * @param Tailor_Element $element
				 */
				$setting_args = apply_filters( 'tailor_setting_args_' . $element->tag . '_' . $control_id, $setting_args, $element );

                $control_definitions[ $control_id ]['control']['priority'] = $priority += 10;
				$control_args = $control_definitions[ $control_id ]['control'];

				/**
				 * Filter the control arguments by control type.
				 *
				 * @since 1.5.6
				 *
				 * @param array $control_args
				 * @param Tailor_Element $element
				 */
				$control_args = apply_filters( 'tailor_control_args_' . $control_args['type'], $control_args, $element );
				
				/**
				 * Filter the control arguments by element tag.
				 *
				 * @since 1.4.0
				 *
				 * @param array $control_args
				 * @param Tailor_Element $element
				 */
				$control_args = apply_filters( 'tailor_control_args_' . $element->tag, $control_args, $element );

				/**
				 * Filter the control arguments by element tag and control ID.
				 *
				 * @since 1.4.0
				 *
				 * @param array $control_args
				 * @param Tailor_Element $element
				 */
				$control_args = apply_filters( 'tailor_control_args_' . $element->tag . '_' . $control_id, $control_args, $element );

				// Register the element setting and control
				$element->add_setting( $control_id, $setting_args );
				$element->add_control( $control_id, $control_args );
			}
		}

		return $priority;
	}
}

if ( ! function_exists( 'tailor_css_presets' ) ) {

	/**
	 * Returns the CSS rules associated with the default controls.
	 *
	 * @since 1.0.0
	 *
	 * @param array $css_rules
	 * @param array $atts
	 * @param array $excluded_settings
	 * @return array $css_rules
	 */
	function tailor_css_presets( $css_rules = array(), $atts = array(), $excluded_settings = array() ) {

		// Remove values for excluded settings
		if ( ! empty( $excluded_settings ) ) {
			$atts = array_diff_key( $atts, array_flip( $excluded_settings ) );
		}

		if ( ! empty( $atts['item_spacing'] ) ) {
			$value = preg_replace( "/[^0-9\.]/", "", $atts['item_spacing'] );
			$unit = str_replace( $value, '', $atts['item_spacing'] );

			if ( is_numeric( $value ) ) {
				if ( 'carousel' == $atts['layout'] ) {
					$css_rules[] = array(
						'setting'               =>  'item_spacing',
						'selectors'             =>  array( ".tailor-{$atts['layout'] }__item" ),
						'declarations'          =>  array(
							'padding-left'          =>  esc_attr( ( $value / 2 ) . $unit ),
							'padding-right'         =>  esc_attr( ( $value / 2 ) . $unit ),
						),
					);
				}
				else if ( 'grid' == $atts['layout'] ) {
					$css_rules[] = array(
						'setting'               =>  'item_spacing',
						'selectors'             =>  array( ".tailor-{$atts['layout'] }__item" ),
						'declarations'          =>  array(
							'padding'               =>  esc_attr( ( $value / 2 ) . $unit ),
						),
					);
				}
				else {
					$css_rules[] = array(
						'setting'               =>  'item_spacing',
						'selectors'             =>  array( '.entry:not(:last-child)', '.tailor-attachment:not(:last-child)' ),
						'declarations'          =>  array(
							'margin-bottom'         =>  esc_attr( $value . $unit ),
						),
					);
				}
			}
		}

		if ( ! empty( $atts['color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'color',
				'selectors'             =>  array(),
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['color'] ),
				),
			);
		}

		if ( ! empty( $atts['link_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'link_color',
				'selectors'             =>  array( 'a' ),
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['link_color'] ),
				),
			);

			if ( ! empty( $atts['link_color_hover'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'link_color_hover',
					'selectors'             =>  array( 'a:hover' ),
					'declarations'          =>  array(
						'color'                 =>  esc_attr( $atts['link_color_hover'] ),
					),
				);
			}
		}
		
		if ( ! empty( $atts['heading_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'heading_color',
				'selectors'             =>  array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ),
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['heading_color'] ),
				),
			);
		}

		if ( ! empty( $atts['border_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'border_color',
				'selectors'             =>  array(),
				'declarations'          =>  array(
					'border-color'          =>  esc_attr( $atts['border_color'] ),
				),
			);
		}

		if ( ! empty( $atts['navigation_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'navigation_color',
				'selectors'             =>  array( '.slick-active button:before' ),
				'declarations'          =>  array(
					'background-color'      =>  esc_attr( $atts['navigation_color'] ),
				),
			);

			$css_rules[] = array(
				'setting'               =>  'navigation_color',
				'selectors'             =>  array( '.slick-arrow:not( .slick-disabled )' ),
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['navigation_color'] ),
				),
			);
		}

		if ( ! empty( $atts['padding'] ) ) {
			$padding = explode( '-', $atts['padding'] );
			$positions = ( 2 == count( $padding ) ) ? array( 'top', 'bottom' ) : array( 'top', 'right', 'bottom', 'left' );
			$padding_values = array_combine( $positions, $padding );
			foreach ( $padding_values as $position => $padding_value ) {
				if ( ! empty( $padding_value ) ) {
					$css_rules[] = array(
						'setting'               =>  'padding',
						'selectors'             =>  array(),
						'declarations'          =>  array(
							"padding-{$position}"   =>  esc_attr( $padding_value ),
						),
					);
				}
			}
		}

		if ( ! empty( $atts['margin'] ) ) {
			$margin = explode( '-', $atts['margin'] );
			$positions = ( 2 == count( $margin ) ) ? array( 'top', 'bottom' ) : array( 'top', 'right', 'bottom', 'left' );
			$margin_values = array_combine( $positions, $margin );

			foreach ( $margin_values as $position => $margin_value ) {
				if ( ! empty( $margin_value ) ) {
					$css_rules[] = array(
						'setting'               =>  'margin',
						'selectors'             =>  array(),
						'declarations'          =>  array(
							"margin-{$position}"    =>  esc_attr( $margin_value ),
						),
					);
				}
			}
		}

		if ( ! empty( $atts['border_style'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'border_style',
				'selectors'             =>  array(),
				'declarations'          =>  array(
					'border-style'          =>  esc_attr( $atts['border_style'] ),
				),
			);

			if ( 'none' !== $atts['border_style'] ) {
				
				if ( ! empty( $atts['border_width'] ) ) {
					$border = explode( '-', $atts['border_width'] );
					$positions = array( 'top', 'right', 'bottom', 'left' );
					$borders = array_combine( $positions, $border );

					if ( count( array_unique( $borders ) ) === 1 && end( $borders ) == '0' ) {
						$css_rules[] = array(
							'setting'               =>  'border_width',
							'selectors'             =>  array(),
							'declarations'          =>  array(
								'border'                =>  'none',
								'box-shadow'            =>  'none',
							),
						);

					}
					else {
						foreach ( $borders as $position => $border_width ) {
							if ( ! empty( $border_width ) ) {
								$css_rules[] = array(
									'setting'               =>  'border_width',
									'selectors'             =>  array(),
									'declarations'          =>  array(
										"border-{$position}-width"  =>  esc_attr( $border_width ),
									),
								);
							}
						}
					}
				}

				if ( ! empty( $atts['border_radius'] ) ) {
					$css_rules[] = array(
						'setting'               =>  'border_radius',
						'selectors'             =>  array(),
						'declarations'          =>  array(
							'border-radius'         =>  esc_attr( $atts['border_radius'] ),
						),
					);
				}

				if ( ! empty( $atts['shadow'] ) ) {
					$css_rules[] = array(
						'setting'               =>  'shadow',
						'selectors'             =>  array(),
						'declarations'          =>  array(
							'box-shadow'            =>  '0 2px 6px rgba(0, 0, 0, 0.1)',
						),
					);
				}
			}
		}

		if ( ! empty( $atts['background_image'] ) && is_numeric( $atts['background_image'] ) ) {
			$background_image_info = wp_get_attachment_image_src( trim( $atts['background_image'] ), 'full' );
			$background_image_src = $background_image_info[0];

			if ( ! empty( $atts['background_color'] ) ) {
				if ( false !== strpos( $atts['background_color'], 'rgba' ) ) {

					// Tint the background image with a transparent color
					// @see: https://css-tricks.com/tinted-images-multiple-backgrounds/
					$css_rules[] = array(
						'setting'               =>  'background_image',
						'selectors'             =>  array(),
						'declarations'          =>  array(
							'background'        =>  esc_attr(
								"linear-gradient( {$atts['background_color']}, {$atts['background_color']} ), 
								url({$background_image_src}) center center no-repeat"
							),
						),
					);
				}
				else {

					// Possibly semi-transparent image over color
					$css_rules[] = array(
						'setting'               =>  'background_image',
						'selectors'             =>  array(),
						'declarations'          =>  array(
							'background'            =>  esc_attr(
								"{$atts['background_color']} url({$background_image_src}) center center no-repeat"
							),
						),
					);
				}
			}
			else {
				$css_rules[] = array(
					'setting'               =>  'background_image',
					'selectors'             =>  array(),
					'declarations'          =>  array(
						'background'            =>  "url('{$background_image_src}') center center no-repeat",
					),
				);
			}

			if ( ! empty( $atts['background_repeat'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_repeat',
					'selectors'             =>  array(),
					'declarations'          =>  array(
						'background-repeat'     =>  esc_attr( $atts['background_repeat'] ),
					),
				);
			}

			if ( ! empty( $atts['background_position'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_position',
					'selectors'             =>  array(),
					'declarations'          =>  array(
						'background-position'   =>  esc_attr( $atts['background_position'] ),
					),
				);
			}

			if ( ! empty( $atts['background_size'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_size',
					'selectors'             =>  array(),
					'declarations'          =>  array(
						'background-size'       =>  esc_attr( $atts['background_size'] ),
					),
				);
			}

			if ( ! empty( $atts['background_attachment'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_attachment',
					'selectors'             =>  array(),
					'declarations'          =>  array(
						'background-attachment'     =>  esc_attr( $atts['background_attachment'] ),
					),
				);
			}
		}

		else if ( ! empty( $atts['background_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'background_color',
				'selectors'             =>  array(),
				'declarations'          =>  array(
					'background-color'      =>  esc_attr( $atts['background_color'] ),
				),
			);
		}

		if ( ! empty( $atts['hidden'] ) ) {
			$preview_sizes = array_keys( tailor_get_registered_media_queries() );
			$hidden_screen_sizes = explode( ',', $atts['hidden'] );

			if ( count( array_intersect( $preview_sizes, $hidden_screen_sizes ) ) != count( $preview_sizes ) ) {
				foreach ( (array) $hidden_screen_sizes as $hidden_screen_size ) {
					if ( in_array( $hidden_screen_size, $preview_sizes ) ) {
						$css_rules[] = array(
							'setting'               =>  'hidden',
							'media'                 =>  $hidden_screen_size,
							'selectors'             =>  array(),
							'declarations'          =>  array(
								'display'           =>  'none!important',
							),
						);
					}
				}
			}
			else {
				$css_rules[] = array(
					'setting'               =>  'hidden',
					'selectors'             =>  array(),
					'declarations'          =>  array(
						'display'               =>  'none',
					),
				);
				$css_rules[] = array(
					'setting'               =>  'hidden',
					'selectors'             =>  array( '#canvas &' ),
					'declarations'          =>  array(
						'display'               =>  'block',
						'background'            =>  'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVQYV2NkIAKckTrzn5GQOpAik2cmjHgVwhSBDMOpEFkRToXoirAqxKYIQyEuRSgK8SmCKySkCKyQGEUghQD+Nia8BIDCEQAAAABJRU5ErkJggg==)',
					),
				);
			}
		}

		return $css_rules;
	}
}