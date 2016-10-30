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

	    /**
	     * Filter the default shortcode attributes.
	     *
	     * @since 1.6.6
	     *
	     * @param array
	     */
	    $default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
	    $atts = shortcode_atts( $default_atts, $atts, $tag );

	    $class = explode( ' ', "tailor-element tailor-button tailor-button--{$atts['style']} {$atts['class']}" );
	    $screen_sizes = array( '', 'mobile', 'tablet' );
	    foreach ( $screen_sizes as $screen_size ) {
		    $setting_postfix = empty( $screen_size ) ? '' : "_{$screen_size}";
		    $class_postfix = empty( $screen_size ) ? '' : "-{$screen_size}";
		    if ( ! empty( $atts["size{$setting_postfix}"] ) ) {
			    $class[] = "tailor-button--{$atts["size{$setting_postfix}"]}{$class_postfix}";
		    }
	    }

	    $html_atts = array(
		    'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
		    'class'         =>  $class,
		    'data'          =>  array(),
	    );


	    /**
	     * Filter the HTML attributes for the element.
	     *
	     * @since 1.7.0
	     *
	     * @param array $html_attributes
	     * @param array $atts
	     * @param string $tag
	     */
	    $html_atts = apply_filters( 'tailor_shortcode_html_attributes', $html_atts, $atts, $tag );
	    $html_atts['class'] = implode( ' ', (array) $html_atts['class'] );
	    $html_atts = tailor_get_attributes( $html_atts );
	    
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
	    
	    $outer_html = "<div {$html_atts}>%s</div>";
	    $inner_html = "<a class=\"tailor-button__inner\" {$href}>%s</a>";
	    $html = sprintf( $outer_html, sprintf( $inner_html, $content ) );

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.7.0
	     *
	     * @param string $html
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param string $html_atts
	     * @param array $atts
	     * @param string $content
	     * @param string $tag
	     */
	    $html = apply_filters( 'tailor_shortcode_html', $html, $outer_html, $inner_html, $html_atts, $atts, $content, $tag );

	    return $html;
    }

    add_shortcode( 'tailor_button', 'tailor_shortcode_button' );
}