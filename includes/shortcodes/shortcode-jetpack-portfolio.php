<?php

/**
 * Jetpack Portfolio shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.3.4
 */

if ( ! function_exists( 'tailor_shortcode_jetpack_portfolio' ) ) {

    /**
     * Defines the shortcode rendering function for the Jetpack Portfolio element.
     *
     * @since 1.3.4
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_jetpack_portfolio( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
	        'items_per_row'             =>  '3',
            'meta'                      =>  '',
            'posts_per_page'            =>  '6',
            'types'                     =>  '',
            'tags'                      =>  '',
            'order_by'                  =>  'date',
            'order'                     =>  'DESC',
        ), $atts, $tag );
	    
	    $html_atts = array(
		    'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
		    'class'         =>  explode( ' ', "tailor-element tailor-jetpack-portfolio {$atts['class']}" ),
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
	    if ( is_jetpack_portfolio_active() ) {
		    $attr_string = '';
		    $items_per_row = $atts['items_per_row'];
		    $posts_per_page = $atts['posts_per_page'];
		    $meta = explode( ',', $atts['meta'] );

		    /**
		     * Portfolio shortcode arguments
		     *
		     * @see https://en.support.wordpress.com/portfolios/portfolio-shortcode/
		     */
		    $args = array(
			    'display_types'             =>  tailor_bool_to_string( in_array( 'type', $meta ) ),
			    'display_tags'              =>  tailor_bool_to_string( in_array( 'tag', $meta ) ),
			    'display_content'           =>  tailor_bool_to_string( in_array( 'excerpt', $meta ) ),
			    'columns'                   =>  $items_per_row,
			    'showposts'                 =>  $posts_per_page,
			    'order'                     =>  $atts['order'],
			    'orderby'                   =>  $atts['order_by'],
		    );

		    $type_ids = explode( ',', $atts['types'] );
		    $type_slugs = array();
		    foreach ( $type_ids as $type_id ) {
			    $term = get_term( $type_id, 'jetpack-portfolio-type' );
			    if ( ! is_wp_error( $term ) ) {
				    $type_slugs[] = $term->slug;
			    }
		    }

		    $tag_ids = explode( ',', $atts['tags'] );
		    $tag_slugs = array();
		    foreach ( $tag_ids as $tag_id ) {
			    $term = get_term( $tag_id, 'jetpack-portfolio-tag' );
			    if ( ! is_wp_error( $term ) ) {
				    $tag_slugs[] = $term->slug;
			    }
		    }

		    if ( ! empty( $type_slugs ) ) {
			    $args['include_type'] = implode( ',', $type_slugs );
		    }
		    if ( ! empty( $tag_slugs ) ) {
			    $args['include_tag'] = implode( ',', $tag_slugs );
		    }

		    foreach ( $args as $key => $arg ) {
			    $attr_string .= " {$key}={$arg}";
		    }

		    $attr_string = trim( esc_attr( $attr_string ) );
		    $content = do_shortcode( "[portfolio {$attr_string}][/portfolio]" );
	    }
	    
	    // Display a notification
	    else {
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'Please enable Jetpack and the Portfolio custom post type', 'tailor' )
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

    add_shortcode( 'tailor_jetpack_portfolio', 'tailor_shortcode_jetpack_portfolio' );
}