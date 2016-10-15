<?php

/**
 * User shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_user' ) ) {

    /**
     * Defines the shortcode rendering function for the User element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     *
     * @return string
     */
    function tailor_shortcode_user( $atts, $content = null, $tag ) {

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
	    $class = trim( esc_attr( "tailor-element tailor-author {$atts['class']}" ) );
	    if ( is_numeric( $atts['image'] ) ) {
		    $class .= ' has-header-image';
	    }
	    
	    ob_start();

	    tailor_partial( 'author', 'box', array(
		    'author_id'         =>  $atts['author_id'],
	    ) );
	    
	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

	    $inner_html = ob_get_clean();

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.6.3
	     *
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param array $atts
	     */
	    $html = apply_filters( 'tailor_shortcode_user_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

	    return $html;
    }

    add_shortcode( 'tailor_user', 'tailor_shortcode_user' );
}