<?php

/**
 * Gallery shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_gallery' ) ) {

    /**
     * Defines the shortcode rendering function for the Gallery element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_gallery( $atts, $content = null, $tag ) {

	    /**
	     * Filter the default shortcode attributes.
	     *
	     * @since 1.6.6
	     *
	     * @param array
	     */
	    $default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
	    $atts = shortcode_atts( $default_atts, $atts, $tag );
	    $class = explode( ' ', "tailor-element tailor-gallery tailor-{$atts['layout']} tailor-{$atts['layout']}--gallery {$atts['class']}" );
	    
	    if ( empty( $atts['ids'] ) ) {
		    $data = array();
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'Please select one or more images to display in this gallery', 'tailor' )
		    );
	    }
	    else {

		    if ( 'lightbox' == $atts['image_link'] ) {
			    $class[] = 'is-lightbox-gallery';
		    }

		    $items_per_row = (string) intval( $atts['items_per_row'] );
		    $dots = (
			    ( 'carousel' == $atts['layout'] && boolval( $atts['dots'] ) ) ||
			    ( 'slideshow' == $atts['layout'] && boolval( $atts['thumbnails'] ) )
		    );
		    
		    $data = array(
			    'slides'            =>  $items_per_row,
			    'autoplay'          =>  boolval( $atts['autoplay'] ) ? 'true' : 'false',
			    'autoplay-speed'    =>  intval( $atts['autoplay_speed'] ) ? intval( $atts['autoplay_speed'] ) : 3000,
			    'arrows'            =>  boolval( $atts['arrows'] ) ? 'true' : 'false',
			    'dots'              =>  $dots ? 'true' : 'false',
			    'thumbnails'        =>  boolval( $atts['thumbnails'] ) ? 'true' : 'false',
			    'fade'              =>  boolval( $atts['fade'] && '1' == $items_per_row ) ? 'true' : 'false',
		    );
		    
		    $q = new WP_Query( array(
			    'post_type'             =>  'attachment',
			    'post_status'           =>  'any',
			    'posts_per_page'        =>  -1,
			    'post__in'              =>  explode( ',', $atts['ids'] ),
			    'orderby'               =>  'post__in',
		    ) );

		    ob_start();
		    tailor_partial( 'loop', $atts['layout'], array(
			    'q'                 =>  $q,
			    'layout_args'       =>  array(
				    'items_per_row'     =>  $atts['items_per_row'],
				    'masonry'           =>  $atts['masonry'] && empty( $atts['aspect_ratio'] ),
				    'thumbnails'        =>  $atts['thumbnails'],
				    'pagination'        =>  false,
			    ),
			    'entry_args'        =>  array(
				    'image_link'        =>  $atts['image_link'],
				    'image_size'        =>  $atts['image_size'],
				    'aspect_ratio'      =>  $atts['aspect_ratio'],
				    'stretch'           =>  $atts['stretch'],
				    'caption'           =>  $atts['caption'],
			    ),
		    ) );
		    $content = ob_get_clean();
	    }

	    $html_atts = array(
		    'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
		    'class'         =>  $class,
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

    add_shortcode( 'tailor_gallery', 'tailor_shortcode_gallery' );
}