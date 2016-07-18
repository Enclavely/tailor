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

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'ids'                       =>  '',
            'layout'                    =>  'list',
            'items_per_row'             =>  2,
            'masonry'                   =>  false,
            //'lightbox'                  =>  false,
            'caption'                   =>  false,
            'autoplay'                  =>  '',
            'fade'                      =>  '',
            'arrows'                    =>  '',
            'dots'                      =>  '',
            'thumbnails'                =>  '',
            'image_link'                =>  'large',
            'image_size'                =>  'large',
            'aspect_ratio'              =>  '',
            'stretch'                   =>  false,
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-gallery tailor-{$atts['layout']} tailor-{$atts['layout']}--gallery {$atts['class']}" ) );

	    if ( 'lightbox' == $atts['image_link'] ) {
		    $class .= ' is-lightbox-gallery';
	    }

	    $items_per_row = (string) intval( $atts['items_per_row'] );
	    $dots = (
            ( 'carousel' == $atts['layout'] && boolval( $atts['dots'] ) ) ||
            ( 'slideshow' == $atts['layout'] && boolval( $atts['thumbnails'] ) )
        );

	    $data = tailor_get_attributes(
		    array(
			    'slides'            =>  $items_per_row,
			    'autoplay'          =>  boolval( $atts['autoplay'] ) ? 'true' : 'false',
			    'arrows'            =>  boolval( $atts['arrows'] ) ? 'true' : 'false',
			    'dots'              =>  $dots ? 'true' : 'false',
			    'thumbnails'        =>  boolval( $atts['thumbnails'] ) ? 'true' : 'false',
			    'fade'              =>  boolval( $atts['fade'] && '1' == $items_per_row ) ? 'true' : 'false',
		    ),
		    'data-'
	    );

	    $html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . " {$data}>";

	    if ( empty( $atts['ids'] ) ) {
		    return $html . sprintf( '<p class="tailor-notification tailor-notification--warning">%s</p>', __( 'Please select one or more images to display in this gallery' ) ) . '</div>';
	    }

	    $q = new WP_Query( array(
		    'post_type'             =>  'attachment',
		    'post_status'           =>  'any',
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

	    return $html . ob_get_clean() . '</div>';
    }

    add_shortcode( 'tailor_gallery', 'tailor_shortcode_gallery' );
}