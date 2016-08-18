<?php

/**
 * Grid shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_grid' ) ) {

    /**
     * Defines the shortcode rendering function for the Grid element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_grid( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'items_per_row'             =>  2,
            'collapse'                  =>  'tablet',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-grid tailor-grid--{$atts['collapse']} tailor-grid--{$atts['items_per_row']} tailor-grid--bordered {$atts['class']}" ) );
	    
	    return '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' . do_shortcode( $content ) . '</div>';
    }

    add_shortcode( 'tailor_grid', 'tailor_shortcode_grid' );
}

if ( ! function_exists( 'tailor_shortcode_grid_item' ) ) {

	/**
	 * Defines the shortcode rendering function for the Grid Item element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_grid_item( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'horizontal_alignment'      =>  '',
            'vertical_alignment'        =>  '',
        ), $atts, $tag );

		$id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
		$class = trim( esc_attr( "tailor-grid__item {$atts['class']}" ) );

		if ( ! empty( $atts['horizontal_alignment'] ) ) {
			$class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
		}
		
		if ( ! empty( $atts['vertical_alignment'] ) ) {
			$class .= esc_attr( " u-align-{$atts['vertical_alignment']}" );
		}
		
		return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' . do_shortcode( $content ) . '</div>';

	}

	add_shortcode( 'tailor_grid_item', 'tailor_shortcode_grid_item' );
}