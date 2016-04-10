<?php

/**
 * Section shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_section' ) ) {

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
    function tailor_shortcode_section( $atts, $content = null, $tag ) {

	    $atts = shortcode_atts( array(
		    'id'                    =>  '',
		    'class'                 =>  '',
		    'horizontal_alignment'  =>  'left',
	    ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-section u-text-{$atts['horizontal_alignment']} {$atts['class']}" ) );

	    return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
	                '<div class="tailor-section__content">' . do_shortcode( $content ) . '</div>' .
	            '</div>';
    }

    add_shortcode( 'tailor_section', 'tailor_shortcode_section' );
}