<?php

defined( 'ABSPATH' ) or die();

$choices = array(
	'top'                   =>  __( 'Top', 'tailor' ),
	'right'                 =>  __( 'Right', 'tailor' ),
	'bottom'                =>  __( 'Bottom', 'tailor' ),
	'left'                  =>  __( 'Left', 'tailor' ),
);

$control_definitions = array(

	//
	// General
	//
	'horizontal_alignment_mobile'   =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'horizontal_alignment_tablet'   =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'horizontal_alignment'      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Horizontal alignment', 'tailor' ),
			'type'                      =>  'button-group',
			'choices'                   =>  array(
				'left'                      =>  '<i class="tailor-icon tailor-align-left"></i>',
				'center'                    =>  '<i class="tailor-icon tailor-align-center"></i>',
				'right'                     =>  '<i class="tailor-icon tailor-align-right"></i>',
			),
			'section'                   =>  'general',
		),
	),
	'vertical_alignment_mobile' =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'vertical_alignment_tablet' =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'vertical_alignment'        =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Vertical alignment', 'tailor' ),
			'type'                      =>  'button-group',
			'choices'                   =>  array(
				'top'                       =>  '<i class="tailor-icon tailor-align-top"></i>',
				'middle'                    =>  '<i class="tailor-icon tailor-align-middle"></i>',
				'bottom'                    =>  '<i class="tailor-icon tailor-align-bottom"></i>',
			),
			'section'                   =>  'general',
		),
	),
	'max_width_mobile'          =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'max_width_tablet'          =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'max_width'                 =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Maximum width', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'min_height_mobile'         =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'min_height_tablet'         =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'min_height'                =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Minimum height', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'min_item_height_mobile'    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
	),
	'min_item_height_tablet'    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
	),
	'min_item_height'           =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Minimum item height', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'min_column_height_mobile'  =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
	),
	'min_column_height_tablet'  =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
	),
	'min_column_height'         =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Column height', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'column_spacing_mobile'     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
	),
	'column_spacing_tablet'     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
	),
	'column_spacing'            =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Column spacing', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'item_spacing'              =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Item spacing', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'size_mobile'               =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
			'default'                   =>  'medium',
		),
	),
	'size_tablet'               =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
			'default'                   =>  'medium',
		),
	),
	'size'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
			'default'                   =>  'medium',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Size', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'small'                 =>  __( 'Small', 'tailor' ),
				'medium'                =>  __( 'Medium', 'tailor' ),
				'large'                 =>  __( 'Large', 'tailor' ),
			),
			'section'                   =>  'general',
		),
	),
	'title'                     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Title', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'style'                     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Style', 'tailor' ),
			'type'                      =>  'select',
			'section'                   =>  'general',
		),
	),
	'type'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Type', 'tailor' ),
			'type'                      =>  'select',
			'section'                   =>  'general',
		),
	),
	'graphic_type'              =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Graphic type', 'tailor' ),
			'type'                      =>  'select',
			'section'                   =>  'general',
		),
	),
	'graphic_size'              =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Graphic size', 'tailor' ),
			'type'                      =>  'text',
			'section'                   =>  'general',
		),
	),
	'image'                     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Image', 'tailor' ),
			'type'                      =>  'image',
			'section'                   =>  'general',
		),
	),
	'icon'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Icon', 'tailor' ),
			'type'                      =>  'icon',
			'section'                   =>  'general',
		),
	),
	'href'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Link', 'tailor' ),
			'type'                      =>  'link',
			'placeholder'               =>  'http://',
			'section'                   =>  'general',
		),
	),
	'target'                    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'type'                      =>  'checkbox',
			'choices'                   =>  array(
				'_blank'                =>  __( 'Open in a new window?', 'tailor' ),
			),
			'section'                   =>  'general',
		),
	),
	'hidden'                    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Hide on', 'tailor' ),
			'type'                      =>  'select-multi',
			'choices'                   =>  tailor_get_media_queries(),
			'section'                   =>  'general',
		),
	),

	//
	// Layout-related
	//
	'layout'                    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Layout', 'tailor' ),
			'type'                      =>  'select',
			'section'                   =>  'general',
		),
	),
	'items_per_row'             =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Items per row', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  tailor_get_range( 1, 6, 1 ),
			'section'                   =>  'general',
		),
	),
	'masonry'                   =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Masonry', 'tailor' ),
			'type'                      =>  'switch',
			'choices'                   =>  array(
				'1'                         =>  __( 'Apply masonry layout?', 'tailor' ),
			),
			'section'                   =>  'general',
		),
	),
	'autoplay'                  =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Autoplay', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),
	'autoplay_speed'            =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
			'default'                   =>  '3000',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Autoplay Speed', 'tailor' ),
			'description'               =>  'In milliseconds',
			'type'                      =>  'number',
			'section'                   =>  'general',
		),
	),
	'fade'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Fade', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),
	'arrows'                    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Arrows', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),
	'dots'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'default'                   =>  '1',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Dots', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),
	'thumbnails'                =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'default'                   =>  '1',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Thumbnails', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),
	'image_link'                =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Image link', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'none'                      =>  __( 'None', 'tailor' ),
				'post'                      =>  __( 'Post', 'tailor' ),
				'file'                      =>  __( 'Image', 'tailor' ),
				'lightbox'                  =>  __( 'Lightbox', 'tailor' ),
			),
			'section'                   =>  'general',
		),
	),
	'image_size'                =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Image size', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  tailor_get_image_sizes(),
			'section'                   =>  'general',
		),
	),
	'aspect_ratio'              =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Aspect ratio', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				''                          =>  __( 'Original', 'tailor' ),
				'1:1'                       =>  __( 'Square', 'tailor' ),
				'3:2'                       =>  __( 'Horizontal 3:2', 'tailor' ),
				'4:3'                       =>  __( 'Horizontal 4:3', 'tailor' ),
				'16:9'                      =>  __( 'Horizontal 16:9', 'tailor' ),
				'2:3'                       =>  __( 'Vertical 2:3', 'tailor' ),
				'3:4'                       =>  __( 'Vertical 3:4', 'tailor' ),
			),
			'section'                   =>  'general',
		),
	),
	'stretch'                   =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Stretch-to-fit image', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),
	'caption'                   =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Caption', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),

	//
	// Query-related
	//
	'posts_per_page'            =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Posts per page', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  tailor_get_range( 1, 12, 1 ),
			'section'                   =>  'general',
		),
	),
	'categories'                =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Categories', 'tailor' ),
			'type'                      =>  'select-multi',
			'choices'                   =>  tailor_get_terms(),
			'section'                   =>  'query',
		),
	),
	'tags'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Tags', 'tailor' ),
			'type'                      =>  'select-multi',
			'choices'                   =>  tailor_get_terms( 'post_tag' ),
			'section'                   =>  'query',
		),
	),
	'order_by'                  =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Order by', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'date'                      =>  __( 'Date', 'tailor' ),
				'author'                    =>  __( 'Author', 'tailor' ),
				'title'                     =>  __( 'Title', 'tailor' ),
				'comment_count'             =>  __( 'Number of comments', 'tailor' ),
			),
			'section'                   =>  'query',
		),
	),
	'order'                     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Order by', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'DESC'                      =>  __( 'Descending', 'tailor' ),
				'ASC'                       =>  __( 'Ascending', 'tailor' ),
			),
			'dependencies'              =>  array(
				'order'                     => array(
					'condition'                 =>  'not',
					'value'                     =>  'none',
				),
			),
			'section'                   =>  'query',
		),
	),
	'offset'                    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Offset', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  tailor_get_range( 0, 20, 1 ),
			'section'                   =>  'query',
		),
	),
	'pagination'                =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Pagination', 'tailor' ),
			'choices'                   =>  array(
				'1'                         =>  __( 'Show pagination links?', 'tailor' ),
			),
			'type'                      =>  'switch',
			'section'                   =>  'general',
		),
	),
	'meta'                      =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Meta', 'tailor' ),
			'type'                      =>  'select-multi',
			'section'                   =>  'general',
		),
	),

	//
	// Colors
	//
	'color'                     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Text color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'color_hover'               =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Text hover color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'link_color'                =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Link color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'link_color_hover'          =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Link hover color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'dependencies'              =>  array(
				'link_color'                => array(
					'condition'                 =>  'not',
					'value'                     =>  '',
				),
			),
			'section'                   =>  'colors',
		),
	),
	'heading_color'             =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Heading color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'background_color'          =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'rgba'                      =>  1,
			'section'                   =>  'colors',
		),
	),
	'background_color_hover'    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background hover color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'rgba'                      =>  1,
			'section'                   =>  'colors',
		),
	),
	'border_color'              =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Border color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'border_color_hover'        =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Border hover color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'navigation_color'          =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Navigation color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'graphic_color'             =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Graphic color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'title_color'               =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Title color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'title_background_color'    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'               =>  array(
				'method'                =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Title background color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'rgba'                      =>  1,
			'section'                   =>  'colors',
		),
	),
	'graphic_color_hover'       =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Graphic hover color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'section'                   =>  'colors',
		),
	),
	'graphic_background_color'  =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Graphic background color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'rgba'                      =>  1,
			'section'                   =>  'colors',
		),
	),
	'graphic_background_color_hover'   =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_color',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Graphic hover background color', 'tailor' ),
			'type'                      =>  'colorpicker',
			'rgba'                      =>  1,
			'section'                   =>  'colors',
		),
	),

	//
	// Attributes
	//
	'class'                     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'     =>  'tailor_sanitize_text',
			'refresh'               =>  array(
				'method'                =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                 =>  __( 'Class name', 'tailor' ),
			'type'                  =>  'text',
			'section'               =>  'attributes',
		),
	),
	'padding_mobile'            =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'padding_tablet'            =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'padding'                   =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Padding', 'tailor' ),
			'type'                      =>  'style',
			'choices'                   =>  array(
				'top'                       =>  $choices['top'],
				'right'                     =>  $choices['right'],
				'bottom'                    =>  $choices['bottom'],
				'left'                      =>  $choices['left'],
			),
			'section'                   =>  'attributes',
		),
	),
	'margin_mobile'             =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'margin_tablet'             =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'margin'                    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Margin', 'tailor' ),
			'type'                      =>  'style',
			'choices'                   =>  array(
				'top'                       =>  $choices['top'],
				'right'                     =>  $choices['right'],
				'bottom'                    =>  $choices['bottom'],
				'left'                      =>  $choices['left'],
			),
			'section'                   =>  'attributes',
		),
	),
	'border_style'              =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Border style', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				''                          =>  __( 'Default', 'tailor' ),
				'solid'                     =>  __( 'Solid', 'tailor' ),
				'dashed'                    =>  __( 'Dashed', 'tailor' ),
				'dotted'                    =>  __( 'Dotted', 'tailor' ),
				'double'                    =>  __( 'Double', 'tailor' ),
				'groove'                    =>  __( 'Groove', 'tailor' ),
				'ridge'                     =>  __( 'Ridge', 'tailor' ),
				'inset'                     =>  __( 'Inset', 'tailor' ),
				'outset'                    =>  __( 'Outset', 'tailor' ),
				'none'                      =>  __( 'None', 'tailor' ),
			),
			'section'                   =>  'attributes',
		),
	),
	'border_width_mobile'       =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'border_width_tablet'       =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
	),
	'border_width'              =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Border width', 'tailor' ),
			'type'                      =>  'style',
			'choices'                   =>  array(
				'top'                       =>  $choices['top'],
				'right'                     =>  $choices['right'],
				'bottom'                    =>  $choices['bottom'],
				'left'                      =>  $choices['left'],
			),
			'dependencies'              =>  array(
				'border_style'              =>  array(
					'condition'                 =>  'not',
					'value'                     =>  array( '', 'none' ),
				),
			),
			'section'                   =>  'attributes',
		),
	),
	'border_radius'             =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Border radius', 'tailor' ),
			'type'                      =>  'text',
			'choices'                   =>  array(
				'top'                       =>  $choices['top'],
				'right'                     =>  $choices['right'],
				'bottom'                    =>  $choices['bottom'],
				'left'                      =>  $choices['left'],
			),
			'dependencies'              =>  array(
				'border_style'              =>  array(
					'condition'                 =>  'not',
					'value'                     =>  array( '', 'none' ),
				),
			),
			'section'                   =>  'attributes',
		),
	),
	'shadow'                    =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Shadow ', 'tailor' ),
			'type'                      =>  'switch',
			'section'                   =>  'attributes',
		),
	),
	'background_image'          =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background image', 'tailor' ),
			'type'                      =>  'image',
			'section'                   =>  'attributes',
		),
	),
	'background_repeat'         =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background repeat', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'no-repeat'                 =>  __( 'No repeat', 'tailor' ),
				'repeat'                    =>  __( 'Repeat', 'tailor' ),
				'repeat-x'                  =>  __( 'Repeat horizontally', 'tailor' ),
				'repeat-yx'                 =>  __( 'Repeat vertically', 'tailor' ),
			),
			'dependencies'              =>  array(
				'background_image'          =>  array(
					'condition'                 =>  'not',
					'value'                     =>  '',
				),
			),
			'section'                   =>  'attributes',
		),
	),
	'background_position'       =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background position', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'left top'                  =>  __( 'Left top', 'tailor' ),
				'left center'               =>  __( 'Left center', 'tailor' ),
				'left bottom'               =>  __( 'Left bottom', 'tailor' ),
				'right top'                 =>  __( 'Right top', 'tailor' ),
				'right center'              =>  __( 'Right center', 'tailor' ),
				'right bottom'              =>  __( 'Right bottom', 'tailor' ),
				'center top'                =>  __( 'Center top', 'tailor' ),
				'center center'             =>  __( 'Center center', 'tailor' ),
				'center bottom'             =>  __( 'Center bottom', 'tailor' ),
			),
			'dependencies'              =>  array(
				'background_image'          =>  array(
					'condition'                 =>  'not',
					'value'                     =>  '',
				),
			),
			'section'                   =>  'attributes',
		),
	),
	'background_size'           =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background size', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'auto'                      =>  __( 'Auto', 'tailor' ),
				'cover'                     =>  __( 'Cover', 'tailor' ),
				'contain'                   =>  __( 'Contain', 'tailor' ),
			),
			'dependencies'              =>  array(
				'background_image'          =>  array(
					'condition'                 =>  'not',
					'value'                     =>  '',
				),
			),
			'section'                   =>  'attributes',
		),
	),
	'background_attachment'     =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_text',
			'refresh'                   =>  array(
				'method'                    =>  'js',
			),
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background attachment', 'tailor' ),
			'type'                      =>  'select',
			'choices'                   =>  array(
				'scroll'                    =>  __( 'Scroll', 'tailor' ),
				'fixed'                     =>  __( 'Fixed', 'tailor' ),
			),
			'dependencies'              =>  array(
				'background_image'      =>  array(
					'condition'             =>  'not',
					'value'                 =>  '',
				),
			),
			'section'                   =>  'attributes',
		),
	),
	'background_video'          =>  array(
		'setting'                   =>  array(
			'sanitize_callback'         =>  'tailor_sanitize_number',
		),
		'control'                   =>  array(
			'label'                     =>  __( 'Background video', 'tailor' ),
			'type'                      =>  'video',
			'section'                   =>  'attributes',
		),
	),
);

/**
 * Filter the control definitions.
 * 
 * @since 1.8.0
 */
$control_definitions = apply_filters( 'tailor_control_definitions', $control_definitions );

return $control_definitions;