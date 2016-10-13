<?php

/**
 * Toggles shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_toggles' ) ) {

    /**
     * Defines the shortcode rendering function for the Toggles element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_toggles( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'initial'                   =>  0,
            'accordion'                 =>  0,
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-toggles {$atts['class']}" ) );
	    $data = tailor_get_attributes(
		    array(
			    'accordion'         =>  boolval( $atts['accordion'] ),
			    'initial'           =>  boolval( $atts['initial'] ),
		    ),
		    'data-'
	    );

	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\" {$data}" ) . '>%s</div>';

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
	    $html = apply_filters( 'tailor_shortcode_toggles_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

	    return $html;
    }

    add_shortcode( 'tailor_toggles', 'tailor_shortcode_toggles' );
}

if ( ! function_exists( 'tailor_shortcode_toggle' ) ) {

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
	function tailor_shortcode_toggle( $atts, $content = null, $tag ) {

		$atts = shortcode_atts( array(
			'id'                =>  '',
			'class'             =>  '',
			'title'             =>  '',
			'icon'              =>  '',
		), $atts, $tag );

		$id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
		$class = trim( esc_attr( "tailor-toggle {$atts['class']}" ) );

		if ( empty( $atts['title'] ) ) {
			$atts['title'] = _x( 'Toggle', 'Default toggle title', 'tailor' );
		}

		$icon = empty( $atts['icon'] ) ? '' : sprintf( '<i class="' . esc_attr( $atts['icon' ] ) . '"></i>' );

		$outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

		$inner_html = '<h3 class="tailor-toggle__title">' . $icon . esc_attr( $atts['title'] ) . '</h3>' .
		              '<div class="tailor-toggle__body">' . do_shortcode( $content ) . '</div>';

		/**
		 * Filter the HTML for the element.
		 *
		 * @since 1.6.3
		 *
		 * @param string $outer_html
		 * @param string $inner_html
		 * @param array $atts
		 */
		$html = apply_filters( 'tailor_shortcode_toggle_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

		return $html;
	}

	add_shortcode( 'tailor_toggle', 'tailor_shortcode_toggle' );
}