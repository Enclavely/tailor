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

	    return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
	                do_shortcode( wpautop( $content ) ) .
	            '</div>';
    }

    add_shortcode( 'tailor_content', 'tailor_shortcode_content' );
}