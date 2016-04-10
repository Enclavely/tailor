<?php

/**
 * Button shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_button' ) ) {

    /**
     * Defines the shortcode rendering function for the Button element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_button( $atts, $content = null, $tag ) {

	    $atts = shortcode_atts( array(
		    'id'                =>  '',
		    'class'             =>  '',
		    'style'             =>  'default',
		    'alignment'         =>  'left',
		    'size'              =>  '',
		    'icon'              =>  '',
		    'href'              =>  '',
		    'target'            =>  '',
	    ), $atts, $tag );

	    $class = esc_attr( trim( "tailor-element tailor-button tailor-button--{$atts['style']} tailor-button--{$atts['alignment']} tailor-button--{$atts['size']} {$atts['class']}" ) );

	    if ( ! empty( $atts['icon'] ) ) {

		    $icon = sprintf( '<i class="' . esc_attr( $atts['icon'] ) . '"></i>' );

		    $content = trim( $content );

		    if ( empty( $content ) ) {
			    $content = $icon;
		    }
		    else {
			    $content = $icon . '<span>' . esc_html( $content ) . '<span>';
		    }
	    }
	    else {
		    $content = esc_html( $content );
	    }

	    if ( ! empty( $atts['href'] ) ) {
		    $href = 'href="' . esc_url( $atts['href'] ) . '"';
		    $href .= ! empty( $atts['target'] ) ? ' target="_blank"' : '';
	    }
	    else {
		    $href = '';
	    }

        return  "<div class=\"{$class}\">" .
                    "<a class=\"tailor-button__inner\" {$href}>{$content}</a>" .
                '</div>';
    }

    add_shortcode( 'tailor_button', 'tailor_shortcode_button' );
}