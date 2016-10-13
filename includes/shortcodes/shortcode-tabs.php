<?php

/**
 * Tabs shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_tabs' ) ) {

    /**
     * Defines the shortcode rendering function for the Tabs element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_tabs( $atts, $content = null, $tag ) {

	    $atts = shortcode_atts( array(
		    'id'                        =>  '',
		    'class'                     =>  '',
		    'position'                  =>  'top',
	    ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-tabs tailor-tabs--{$atts['position']} {$atts['class']}" ) );

	    global $tailor_tab_navigation;
	    $tailor_tab_navigation = array();

        $tabs = do_shortcode( $content );

	    $navigation_items = '';
	    foreach ( $tailor_tab_navigation as $navigation_item_id => $navigation_item ) {
		    $navigation_items .=    '<li class="tailor-tabs__navigation-item ' . esc_attr( $navigation_item['class'] ). '" data-id="' . esc_attr( $navigation_item_id ) . '">' .
		                                esc_attr( $navigation_item['title'] ) .
		                            '</li>';
	    }

	    $outer_html = '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>%s</div>';

	    $inner_html = '<ul class="tailor-tabs__navigation">' . $navigation_items . '</ul>' .
	                  '<div class="tailor-tabs__content">' . $tabs . '</div>';

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.6.3
	     *
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param array $atts
	     */
	    $html = apply_filters( 'tailor_shortcode_tabs_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

	    return $html;
    }

    add_shortcode( 'tailor_tabs', 'tailor_shortcode_tabs' );
}

if ( ! function_exists( 'tailor_shortcode_tab' ) ) {

	/**
	 * Defines the shortcode rendering function for the Tab element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_tab( $atts, $content = null, $tag ) {

		$atts = shortcode_atts( array(
			'id'                =>  'tab' . rand(),
			'class'             =>  '',
			'title'             =>  '',
		), $atts, $tag );

		$id = esc_attr( $atts['id'] );
		$class = trim( esc_attr( "tailor-tab {$atts['class']}" ) );
		
		global $tailor_tab_navigation;
		$tailor_tab_navigation[ $id ] = array(
			'class'         =>  $atts['class'],
			'title'         =>  empty( $atts['title'] ) ? __( 'Tab', 'tailor' ) : $atts['title'],
		);

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
		$html = apply_filters( 'tailor_shortcode_tab_html', sprintf( $outer_html, $inner_html ), $outer_html, $inner_html, $atts );

		return $html;
	}

	add_shortcode( 'tailor_tab', 'tailor_shortcode_tab' );
}