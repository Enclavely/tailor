<?php

/**
 * Content shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_content' ) ) {

    /**
     * Defines the shortcode rendering function for the Content element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_content( $atts, $content = null, $tag ) {

	    $atts = shortcode_atts( array(
		    'id'                        =>  '',
		    'class'                     =>  '',
	    ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-content {$atts['class']}" ) );

	    if ( empty( $content ) ) {
		    $class .= ' tailor-content--placeholder';
		    $content = tailor_get_setting( 'content_placeholder', tailor_do_shakespeare() );
	    }

	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

	    $inner_html = do_shortcode( wpautop( $content ) );

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.6.3
	     *
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param array $atts
	     */
	    $html = apply_filters( 'tailor_shortcode_content_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

	    return $html;
    }

    add_shortcode( 'tailor_content', 'tailor_shortcode_content' );
}