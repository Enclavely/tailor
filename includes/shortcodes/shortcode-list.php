<?php

/**
 * List shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_list' ) ) {

    /**
     * Defines the shortcode rendering function for the List element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_list( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'type'                      =>  'icon',
            'style'                     =>  'default',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-list tailor-list--{$atts['type']} tailor-list--{$atts['style']} {$atts['class']}" ) );


	    return  '<ul ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
	                do_shortcode( $content ) .
	            '</ul>';
    }

    add_shortcode( 'tailor_list', 'tailor_shortcode_list' );
}

if ( ! function_exists( 'tailor_shortcode_list_item' ) ) {

	/**
	 * Defines the shortcode rendering function for the List Item element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_list_item( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'title'                     =>  '',
            'horizontal_alignment'      =>  '',
            'graphic_type'              =>  'icon',
            'icon'                      =>  'dashicons dashicons-wordpress',
            'image'                     =>  '',
        ), $atts, $tag );

		$id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
		$class = trim( esc_attr( "tailor-list__item tailor-list__item--{$atts['graphic_type']} {$atts['class']}" ) );

		if ( ! empty( $atts['horizontal_alignment'] ) ) {
			$class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
		}

		$title = ! empty( $atts['title'] ) ? '<h3 class="tailor-list__title">' . esc_html( (string) $atts['title'] ) . '</h3>' : '';

		$graphic = '<span></span>';

		if ( 'image' == $atts['graphic_type'] ) {
			$graphic = '';
			if ( is_numeric( $atts['image'] ) ) {
				$background_image_info = wp_get_attachment_image_src( $atts['image'], 'full' );
				$background_image_src = $background_image_info[0];
				$graphic = '<img src="' . $background_image_src . '">';
			}
		}
		else if ( 'icon' == $atts['graphic_type'] ) {
			$graphic = sprintf( '<span class="' . esc_attr( $atts['icon' ] ) . '"></span>' );
		}

        return  '<li ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
                    '<div class="tailor-list__graphic">' . $graphic . '</div>' .
                    '<div class="tailor-list__body">' .
                        $title .
                        '<div class="tailor-list__content">' . do_shortcode( $content ) . '</div>' .
                    '</div>' .
                '</li>';
	}

	add_shortcode( 'tailor_list_item', 'tailor_shortcode_list_item' );
}