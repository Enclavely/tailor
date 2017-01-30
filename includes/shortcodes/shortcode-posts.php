<?php

/**
 * Posts shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_posts' ) ) {

    /**
     * Defines the shortcode rendering function for the Posts element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_posts( $atts, $content = null, $tag ) {

	    /**
	     * Filter the default shortcode attributes.
	     *
	     * @since 1.6.6
	     *
	     * @param array
	     */
	    $default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
	    $atts = shortcode_atts( $default_atts, $atts, $tag );

	    $items_per_row = (string) intval( $atts['items_per_row'] );
	    $data = array(
		    'slides'            =>  $items_per_row,
		    'autoplay'          =>  boolval( $atts['autoplay'] ) ? 'true' : 'false',
		    'autoplay-speed'    =>  intval( $atts['autoplay_speed'] ) ? intval( $atts['autoplay_speed'] ) : 3000,
		    'arrows'            =>  boolval( $atts['arrows'] ) ? 'true' : 'false',
		    'dots'              =>  boolval( $atts['dots'] ) ? 'true' : 'false',
		    'fade'              =>  boolval( $atts['fade'] && '1' == $items_per_row ) ? 'true' : 'false',
	    );
	    
	    $html_atts = array(
		    'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
		    'class'         =>  explode( ' ', "tailor-element tailor-posts tailor-posts--{$atts['style']} tailor-{$atts['layout']} tailor-{$atts['layout']}--posts {$atts['class']}" ),
		    'data'          =>  array_filter( $data ),
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
	    
	    $offset = intval( $atts['offset'] );
	    $paged = get_query_var( 'paged' ) ? absint( get_query_var( 'paged' ) ) : absint( get_query_var( 'page' ) );
	    $posts_per_page = intval( $atts['posts_per_page'] );

	    if ( $paged > 1 ) {
		    $offset = ( ( $paged - 1 ) * $posts_per_page ) + $offset;
	    }
	    
	    $query_args = array(
		    'post_type'             =>  'post',
		    'orderby'               =>  $atts['order_by'],
		    'order'                 =>  $atts['order'],
		    'posts_per_page'        =>  $posts_per_page,
		    'cat'                   =>  $atts['categories'],
		    'offset'                =>  $offset,
		    'paged'                 =>  $paged,
	    );

	    if ( ! empty( $atts['tags'] ) ) {
		    $query_args['tag__and'] = strpos( $atts['tags'], ',' ) ? explode( ',', $atts['tags'] ) : (array) $atts['tags'];
	    }

	    $q = new WP_Query( $query_args );
	    ob_start();
	    tailor_partial( 'loop', $atts['layout'], array(
		    'q'                     =>  $q,
		    'layout_args'           =>  array(
			    'items_per_row'         =>  $atts['items_per_row'],
			    'masonry'               =>  $atts['masonry'],
			    'pagination'            =>  $atts['pagination'],
		    ),
		    'entry_args'            =>  array(
			    'meta'                  =>  explode( ',', $atts['meta'] ),
                'image_link'            =>  $atts['image_link'],
                'image_size'            =>  $atts['image_size'],
                'aspect_ratio'          =>  $atts['aspect_ratio'],
                'stretch'               =>  $atts['stretch'],
		    ),
	    ) );

	    $outer_html = "<div {$html_atts}>%s</div>";
	    $inner_html = '%s';
	    $content = ob_get_clean();
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

    add_shortcode( 'tailor_posts', 'tailor_shortcode_posts' );
}