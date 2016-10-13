<?php

/**
 * Card shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_card' ) ) {

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
    function tailor_shortcode_card( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'title'                     =>  '',
            'horizontal_alignment'      =>  '',
            'image'                     =>  '',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-card {$atts['class']}" ) );
	    if ( ! empty( $atts['horizontal_alignment'] ) ) {
		    $class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
	    }
	    
	    if ( is_numeric( $atts['image'] ) ) {
		    $class .= ' has-header-image';
	    }

	    $title = ! empty( $atts['title'] ) ? '<h3 class="tailor-card__title">' . esc_html( (string) $atts['title'] ) . '</h3>' : '';

	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

	    $inner_html = '<header class="tailor-card__header">' . $title . '</header>' .
	                  '<div class="tailor-card__content">' . do_shortcode( $content ) . '</div>';

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.6.3
	     *
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param array $atts
	     */
	    $html = apply_filters( 'tailor_shortcode_card_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

	    return $html;
    }

    add_shortcode( 'tailor_card', 'tailor_shortcode_card' );
}