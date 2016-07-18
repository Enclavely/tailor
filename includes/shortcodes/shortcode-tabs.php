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

	    return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' .
	                '<ul class="tailor-tabs__navigation">' . $navigation_items . '</ul>' .
	                '<div class="tailor-tabs__content">' . $tabs . '</div>' .
	            '</div>';
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

		$html = "<div id=\"{$id}\" class=\"{$class}\">" . do_shortcode( $content ) . '</div>';

		global $tailor_tab_navigation;
		$tailor_tab_navigation[ $id ] = array(
			'class'         =>  $atts['class'],
			'title'         =>  empty( $atts['title'] ) ? __( 'Tab', 'tailor' ) : $atts['title'],
		);

		return $html;
	}

	add_shortcode( 'tailor_tab', 'tailor_shortcode_tab' );
}