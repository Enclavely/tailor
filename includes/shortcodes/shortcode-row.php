<?php

/**
 * Row shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_row' ) ) {

    /**
     * Defines the shortcode rendering function for the Row element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_row( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'collapse'                  =>  'tablet',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-row {$atts['collapse']}-columns {$atts['class']}" ) );

        return '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' . do_shortcode( $content ) . '</div>';
    }

    add_shortcode( 'tailor_row', 'tailor_shortcode_row' );
}