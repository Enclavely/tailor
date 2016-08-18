<?php

/**
 * Section shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_section' ) ) {

    /**
     * Defines the shortcode rendering function for the Row element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_section( $atts, $content = null, $tag ) {

	    $atts = shortcode_atts( array(
		    'id'                        =>  '',
		    'class'                     =>  '',
		    'horizontal_alignment'      =>  '',
		    'vertical_alignment'        =>  '',
		    'background_image'          =>  '',
		    'parallax'                  =>  1,
	    ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-section {$atts['class']}" ) );

	    if ( ! empty( $atts['horizontal_alignment'] ) ) {
		    $class .= esc_attr( " u-text-{$atts['horizontal_alignment']}" );
	    }

	    if ( ! empty( $atts['vertical_alignment'] ) ) {
		    $class .= esc_attr( " u-align-{$atts['vertical_alignment']}" );
	    }

	    $data = '';
	    $section_content = '<div class="tailor-section__content">' . do_shortcode( $content ) . '</div>';
	    
	    if ( ( $atts['background_image'] && 1 == $atts['parallax'] ) ) {
		    $class .= ' is-parallax';
		    $section_content .= '<div class="tailor-section__background"></div>';
		    $data = ' ' . tailor_get_attributes( array( 'ratio' => '0.5' ), 'data-' );
	    }
	    
	    return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . "{$data}>" .
	                $section_content .
	            '</div>';
    }

    add_shortcode( 'tailor_section', 'tailor_shortcode_section' );
}