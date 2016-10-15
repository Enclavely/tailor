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

		/**
		 * Filter the default shortcode attributes.
		 * 
		 * @since 1.6.6
		 * 
		 * @param array
		 */
		$default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
		$atts = shortcode_atts( $default_atts, $atts, $tag );

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

		$outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';
		
		$inner_html = '<div class="tailor-box__graphic">' . $graphic . '</div>' .
		              $title .
		              '<div class="tailor-box__content">' . do_shortcode( $content ) . '</div>';
		
		/**
		 * Filter the HTML for the element.
		 *
		 * @since 1.6.3
		 *
		 * @param string $outer_html
		 * @param string $inner_html
		 * @param array $atts
		 */
		$html = apply_filters( 'tailor_shortcode_box_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

		return $html;
	}

	add_shortcode( 'tailor_box', 'tailor_shortcode_box' );
}