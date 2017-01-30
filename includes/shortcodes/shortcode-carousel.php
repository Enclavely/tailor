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
		    'class'         =>  explode( ' ', "tailor-element tailor-carousel tailor-carousel--{$atts['style']} tailor-carousel--outline {$atts['class']}" ),
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
	    $inner_html = '<div class="tailor-carousel__wrap">%s</div>';
	    $content = do_shortcode( $content );
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
		$html_atts = array(
			'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
			'class'         =>  explode( ' ', "tailor-carousel__item {$atts['class']}" ),
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

		$outer_html = "<div {$html_atts}>%s</div>";
		$inner_html = '%s';
		$content = do_shortcode( $content );
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

	add_shortcode( 'tailor_carousel_item', 'tailor_shortcode_carousel_item' );
}