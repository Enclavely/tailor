<?php

/**
 * List shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_list' ) ) {

    /**
     * Defines the shortcode rendering function for the List element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_list( $atts, $content = null, $tag ) {

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
		    'class'         =>  explode( ' ', "tailor-element tailor-list {$atts['class']}" ),
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

    add_shortcode( 'tailor_list', 'tailor_shortcode_list' );
}

if ( ! function_exists( 'tailor_shortcode_list_item' ) ) {

	/**
	 * Defines the shortcode rendering function for the List Item element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_list_item( $atts, $content = null, $tag ) {

		/**
		 * Filter the default shortcode attributes.
		 *
		 * @since 1.6.6
		 *
		 * @param array
		 */
		$default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
		$atts = shortcode_atts( $default_atts, $atts, $tag );

		$graphic_type = empty( $atts['graphic_type'] ) ? 'icon' : $atts['graphic_type'];
		$class = explode( ' ', "tailor-list__item tailor-list__item--{$graphic_type} {$atts['class']}" );

		$html_atts = array(
			'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
			'class'         =>  $class,
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

		$title = ! empty( $atts['title'] ) ? '<h3 class="tailor-list__title">' . esc_html( (string) $atts['title'] ) . '</h3>' : '';
		$graphic = '';
		if ( 'image' == $graphic_type ) {
			if ( is_numeric( $atts['image'] ) ) {
				$background_image_info = wp_get_attachment_image_src( $atts['image'], 'full' );
				$background_image_src = $background_image_info[0];
				$graphic = '<img src="' . $background_image_src . '" alt="">';
			}
		}
		else if ( 'icon' == $graphic_type && ! empty( $atts['icon' ] ) ) {
			$graphic = sprintf( '<span class="' . esc_attr( $atts['icon'] ) . '"></span>' );
		}
		else if ( 'number' == $graphic_type ) {
			$graphic = sprintf( '<span></span>' );
		}

		if ( ! empty( $graphic ) ) {
			$graphic = '<div class="tailor-list__graphic">' . $graphic . '</div>';
		}

		$outer_html = "<div {$html_atts}>%s</div>";
		$inner_html = $graphic .
		              '<div class="tailor-list__body">' .
		                $title .
		                '<div class="tailor-list__content">%s</div>' .
		              '</div>';
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

	add_shortcode( 'tailor_list_item', 'tailor_shortcode_list_item' );
}