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

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'style'                     =>  'default',
            'items_per_row'             =>  '1',
            'autoplay'                  =>  '',
            'fade'                      =>  '',
            'arrows'                    =>  '',
            'dots'                      =>  '',
        ), $atts, $tag );

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

	    return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . " {$data}>" .
	                '<div class="tailor-carousel__wrap">' .
	                    do_shortcode( $content ) .
	                '</div>' .
	            '</div>';
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

		$atts = shortcode_atts( array(
			'id'                        =>  '',
			'class'                     =>  '',
			'horizontal_alignment'      =>  'left',
			'vertical_alignment'        =>  '',
		), $atts, $tag );

		$id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
		$class = trim( esc_attr( "tailor-carousel__item {$atts['class']}" ) );
		
		if ( ! empty( $atts['horizontal_alignment'] ) ) {
			$class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
		}
		
		if ( ! empty( $atts['vertical_alignment'] ) ) {
			$class .= " has-custom-height u-align-{$atts['vertical_alignment']}";
		}

		return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
		            do_shortcode( $content ) .
		        '</div>';
	}

	add_shortcode( 'tailor_carousel_item', 'tailor_shortcode_carousel_item' );
}