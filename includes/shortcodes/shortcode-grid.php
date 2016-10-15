<?php

/**
 * Grid shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_grid' ) ) {

    /**
     * Defines the shortcode rendering function for the Grid element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_grid( $atts, $content = null, $tag ) {

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
	    $class = trim( esc_attr( "tailor-element tailor-grid tailor-grid--{$atts['collapse']} tailor-grid--{$atts['items_per_row']} tailor-grid--bordered {$atts['class']}" ) );

	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

	    $inner_html = do_shortcode( $content );

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.6.3
	     *
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param array $atts
	     */
	    $html = apply_filters( 'tailor_shortcode_grid_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

	    return $html;
    }

    add_shortcode( 'tailor_grid', 'tailor_shortcode_grid' );
}

if ( ! function_exists( 'tailor_shortcode_grid_item' ) ) {

	/**
	 * Defines the shortcode rendering function for the Grid Item element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_grid_item( $atts, $content = null, $tag ) {
		
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
		$class = trim( esc_attr( "tailor-grid__item {$atts['class']}" ) );

		if ( ! empty( $atts['horizontal_alignment'] ) ) {
			$class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
		}
		
		if ( ! empty( $atts['vertical_alignment'] ) ) {
			$class .= esc_attr( " u-align-{$atts['vertical_alignment']}" );
		}

		$outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

		$inner_html = do_shortcode( $content );

		/**
		 * Filter the HTML for the element.
		 *
		 * @since 1.6.3
		 *
		 * @param string $outer_html
		 * @param string $inner_html
		 * @param array $atts
		 */
		$html = apply_filters( 'tailor_shortcode_grid_item_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

		return $html;
	}

	add_shortcode( 'tailor_grid_item', 'tailor_shortcode_grid_item' );
}