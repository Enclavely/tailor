<?php

/**
 * Carousel shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_carousel' ) ) {

    /**
     * Defines the shortcode rendering function for the Carousel element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_carousel( $atts, $content = null, $tag ) {

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
        $class = trim( esc_attr( "tailor-element tailor-carousel tailor-carousel--{$atts['style']} tailor-carousel--outline {$atts['class']}" ) );

	    $items_per_row = (string) intval( $atts['items_per_row'] );
	    $data = tailor_get_attributes(
		    array(
			    'slides'            =>  $items_per_row,
			    'autoplay'          =>  boolval( $atts['autoplay'] ) ? 'true' : 'false',
			    'arrows'            =>  boolval( $atts['arrows'] ) ? 'true' : 'false',
			    'dots'              =>  boolval( $atts['dots'] ) ? 'true' : 'false',
			    'fade'              =>  boolval( $atts['fade'] && '1' == $items_per_row ) ? 'true' : 'false',
		    ),
		    'data-'
	    );

	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\" {$data}" ) . '>%s</div>';

	    $inner_html = '<div class="tailor-carousel__wrap">' . do_shortcode( $content ) . '</div>';

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.6.3
	     *
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param array $atts
	     */
	    $html = apply_filters( 'tailor_shortcode_carousel_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );
	    
	    return $html;
    }

    add_shortcode( 'tailor_carousel', 'tailor_shortcode_carousel' );
}

if ( ! function_exists( 'tailor_shortcode_carousel_item' ) ) {

	/**
	 * Defines the shortcode rendering function for the Toggle element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_carousel_item( $atts, $content = null, $tag ) {

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
		$class = trim( esc_attr( "tailor-carousel__item {$atts['class']}" ) );
		
		if ( ! empty( $atts['horizontal_alignment'] ) ) {
			$class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
		}
		
		if ( ! empty( $atts['vertical_alignment'] ) ) {
			$class .= " has-custom-height u-align-{$atts['vertical_alignment']}";
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
		$html = apply_filters( 'tailor_shortcode_carousel_item_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

		return $html;
	}

	add_shortcode( 'tailor_carousel_item', 'tailor_shortcode_carousel_item' );
}