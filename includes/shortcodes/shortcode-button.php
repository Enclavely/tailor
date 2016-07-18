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
		    'id'                        =>  '',
		    'class'                     =>  '',
		    'style'                     =>  'default',
		    'horizontal_alignment'      =>  '',
		    'size'                      =>  '',
		    'icon'                      =>  '',
		    'href'                      =>  '',
		    'target'                    =>  '',
	    ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-button tailor-button--{$atts['style']} tailor-button--{$atts['size']} {$atts['class']}" ) );
	    
	    if ( ! empty( $atts['horizontal_alignment'] ) ) {
		    $class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
	    }
	    
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

        return '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
                    "<a class=\"tailor-button__inner\" {$href}>{$content}</a>" .
                '</div>';
    }

    add_shortcode( 'tailor_button', 'tailor_shortcode_button' );
}