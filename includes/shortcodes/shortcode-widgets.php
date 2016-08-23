<?php

/**
 * Widgets shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_widgets' ) ) {

    /**
     * Defines the shortcode rendering function for the Widget Area element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_widgets( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
	        'widget_area'               =>  '',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-widget-area {$atts['class']}" ) );

	    if ( empty( $atts['widget_area'] ) ) {
		    $content = sprintf( '<p class="tailor-notification tailor-notification--warning">%s</p>', __( 'Please select a widget area to display', 'tailor' ) );
	    }
	    else if ( is_active_sidebar( $atts['widget_area'] ) ) {
		    ob_start();
		    dynamic_sidebar( $atts['widget_area'] );
		    $content = ob_get_clean();
	    }
	    else {
		    $content = sprintf( '<p class="tailor-notification tailor-notification--warning">%s</p>', __( 'The selected widget area contains no widgets', 'tailor' ) );
	    }

        return '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' . do_shortcode( $content ) . '</div>';
    }

    add_shortcode( 'tailor_widgets', 'tailor_shortcode_widgets' );
}