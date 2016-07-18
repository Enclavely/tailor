<?php

/**
 * Hero shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_hero' ) ) {

    /**
     * Defines the shortcode rendering function for the Hero element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_hero( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'horizontal_alignment'      =>  '',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-hero {$atts['class']}" ) );
	    
	    if ( ! empty( $atts['horizontal_alignment'] ) ) {
		    $class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
	    }
	    
        return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
                    '<div class="tailor-hero__content">' . do_shortcode( $content ) . '</div>' .
                '</div>';
    }

    add_shortcode( 'tailor_hero', 'tailor_shortcode_hero' );
}