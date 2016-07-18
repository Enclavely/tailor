<?php

/**
 * Column shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_column' ) ) {

    /**
     * Defines the shortcode rendering function for the Column element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_column( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'width'                     =>  6,
            'horizontal_alignment'      =>  '',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-column columns-{$atts['width']} {$atts['class']}" ) );
	    if ( ! empty( $atts['horizontal_alignment'] ) ) {
		    $class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
	    }

        return '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' . do_shortcode( $content ) . '</div>';
    }

    add_shortcode( 'tailor_column', 'tailor_shortcode_column' );
}