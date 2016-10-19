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

	    $html_atts = array(
		    'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
		    'class'         =>  explode( ' ', "tailor-element tailor-jetpack-testimonials {$atts['class']}" ),
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
	   
	    // Generate the inner shortcode
	    if ( is_jetpack_testimonials_active() ) {
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
		    $content = do_shortcode( "[testimonials {$attr_string}][/testimonials]" );
	    }

	    // Display a notification
	    else {
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'Please enable Jetpack and the Testimonial custom post type', 'tailor' )
		    );
	    }

	    $outer_html = "<div {$html_atts}>%s</div>";
	    $inner_html = '%s';
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

    add_shortcode( 'tailor_jetpack_testimonials', 'tailor_shortcode_jetpack_testimonials' );
}