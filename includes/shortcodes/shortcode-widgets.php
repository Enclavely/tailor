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
	    $class = trim( esc_attr( "tailor-element tailor-widget-area {$atts['class']}" ) );

	    if ( empty( $atts['widget_area'] ) ) {
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'Please select a widget area to display', 'tailor' )
		    );
	    }
	    else if ( is_active_sidebar( $atts['widget_area'] ) ) {
		    ob_start();
		    dynamic_sidebar( $atts['widget_area'] );
		    $content = ob_get_clean();
	    }
	    else {
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'The selected widget area contains no widgets', 'tailor' )
		    );
	    }

	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

	    $inner_html = do_shortcode( $content );

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.6.3
	     *
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param array $atts
	     */
	    $html = apply_filters( 'tailor_shortcode_widgets_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

	    return $html;
    }

    add_shortcode( 'tailor_widgets', 'tailor_shortcode_widgets' );
}