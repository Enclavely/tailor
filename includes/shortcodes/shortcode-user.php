<?php

/**
 * User shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_user' ) ) {

    /**
     * Defines the shortcode rendering function for the User element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     *
     * @return string
     */
    function tailor_shortcode_user( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'author_id'                 =>  '',
            'image'                     =>  '',

        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-author {$atts['class']}" ) );
	    if ( is_numeric( $atts['image'] ) ) {
		    $class .= ' has-header-image';
	    }

	    $html = "<div {$id} class=\"{$class}\">";

	    ob_start();

	    tailor_partial( 'author', 'box', array(
		    'author_id'         =>  $atts['author_id'],
	    ) );

	    return $html . ob_get_clean() . '</div>';
    }

    add_shortcode( 'tailor_user', 'tailor_shortcode_user' );
}