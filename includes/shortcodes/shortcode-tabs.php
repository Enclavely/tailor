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

	    /**
	     * Filter the default shortcode attributes.
	     *
	     * @since 1.6.6
	     *
	     * @param array
	     */
	    $default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
	    $atts = shortcode_atts( $default_atts, $atts, $tag );

	    $position = ! empty( $atts['position'] ) ? $atts['position'] : 'top';
	    $class = explode( ' ', "tailor-element tailor-tabs tailor-tabs--{$position} {$atts['class']}" );

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
	    
	    global $tailor_tab_navigation;
	    $tailor_tab_navigation = array();
	    $navigation_items = '';
	    $content = do_shortcode( $content );
	    foreach ( $tailor_tab_navigation as $navigation_item_id => $navigation_item ) {
		    $navigation_items .=    '<li class="tailor-tabs__navigation-item ' . esc_attr( $navigation_item['class'] ). '" data-id="' . esc_attr( $navigation_item_id ) . '">' .
		                                esc_attr( $navigation_item['title'] ) .
		                            '</li>';
	    }

	    $outer_html = "<div {$html_atts}>%s</div>";
	    $inner_html = '<ul class="tailor-tabs__navigation">' . $navigation_items . '</ul>' .
	                  '<div class="tailor-tabs__content">%s</div>';
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

		/**
		 * Filter the default shortcode attributes.
		 *
		 * @since 1.6.6
		 *
		 * @param array
		 */
		$default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
		$atts = shortcode_atts( $default_atts, $atts, $tag );

		$tab_id = 'tab' . rand();

		$html_atts = array(
			'id'            =>  $tab_id,
			'class'         =>  explode( ' ', "tailor-tab {$atts['class']}" ),
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

		global $tailor_tab_navigation;
		$tailor_tab_navigation[ $tab_id ] = array(
			'class'         =>  $atts['class'],
			'title'         =>  empty( $atts['title'] ) ? __( 'Tab', 'tailor' ) : $atts['title'],
		);

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

	add_shortcode( 'tailor_tab', 'tailor_shortcode_tab' );
}