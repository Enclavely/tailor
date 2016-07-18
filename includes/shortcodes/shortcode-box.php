<?php

/**
 * Box shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_box' ) ) {

	/**
	 * Defines the shortcode rendering function for the Box element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_box( $atts, $content = null, $tag ) {

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
		$class = trim( esc_attr( "tailor-element tailor-box tailor-box--{$atts['graphic_type']} {$atts['class']}" ) );
		
		if ( ! empty( $atts['horizontal_alignment'] ) ) {
			$class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
		}
		
		$title = ! empty( $atts['title'] ) ? '<h3 class="tailor-box__title">' . esc_html( (string) $atts['title'] ) . '</h3>' : '';

		if ( 'image' == $atts['graphic_type'] ) {
			$graphic = '';
			if ( is_numeric( $atts['image'] ) ) {
				$background_image_info = wp_get_attachment_image_src( $atts['image'], 'full' );
				$background_image_src = $background_image_info[0];
				$graphic = '<img src="' . $background_image_src . '">';
			}
		}
		else {
			$graphic = sprintf( '<span class="' . esc_attr( $atts['icon' ] ) . '"></span>' );
		}

        return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
                    '<div class="tailor-box__graphic">' . $graphic . '</div>' .
                    $title .
                    '<div class="tailor-box__content">' . do_shortcode( $content ) . '</div>' .
                '</div>';
	}

	add_shortcode( 'tailor_box', 'tailor_shortcode_box' );
}