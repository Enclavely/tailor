<?php

/**
 * Jetpack Testimonials shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.3.5
 */

if ( ! function_exists( 'tailor_shortcode_jetpack_testimonials' ) ) {

    /**
     * Defines the shortcode rendering function for the Jetpack Testimonials element.
     *
     * @since 1.3.5
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_jetpack_testimonials( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
	        'items_per_row'             =>  '3',
            'meta'                      =>  '',
            'posts_per_page'            =>  '',
            'types'                     =>  '',
            'tags'                      =>  '',
            'order_by'                  =>  'date',
            'order'                     =>  'DESC',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-jetpack-testimonials {$atts['class']}" ) );

	    // Get the attribute string
	    $attr_string = '';
	    $items_per_row = intval( $atts['items_per_row'] );
	    $posts_per_page = intval( $atts['posts_per_page'] );
	    $meta = explode( ',', $atts['meta'] );

	    /**
	     * Testimonials shortcode arguments
	     *
	     * @see https://en.support.wordpress.com/testimonials-shortcode/
	     */
	    $args = array(
		    'image'                     =>  tailor_bool_to_string( in_array( 'image', $meta ) ),
		    'display_content'           =>  'true',
		    'columns'                   =>  $items_per_row,
		    'showposts'                 =>  $posts_per_page,
		    'order'                     =>  $atts['order'],
		    'orderby'                   =>  $atts['order_by'],
	    );

	    foreach ( $args as $key => $arg ) {
		    $attr_string .= " {$key}={$arg}";
	    }

	    $attr_string = trim( esc_attr( $attr_string ) );

	    // Generate the HTML
	    $html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>';

	    if ( is_jetpack_testimonials_active() ) {
		    $content = do_shortcode( "[testimonials {$attr_string}][/testimonials]" );
	    }
	    else {
		    $content = sprintf( '<p class="tailor-notification tailor-notification--warning">%s</p>', __( 'Please enable Jetpack and the Testimonial custom post type', 'tailor' ) );
	    }

	    return $html . $content . '</div>';
    }

    add_shortcode( 'tailor_jetpack_testimonials', 'tailor_shortcode_jetpack_testimonials' );
}