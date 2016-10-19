<?php

/**
 * Map shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_map' ) ) {

    /**
     * Defines the shortcode rendering function for the Map element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_map( $atts, $content = null, $tag ) {

	    /**
	     * Filter the default shortcode attributes.
	     *
	     * @since 1.6.6
	     *
	     * @param array
	     */
	    $default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
	    $atts = shortcode_atts( $default_atts, $atts, $tag );

	    $data = array(
		    'address'           =>  $atts['address'],
		    'latitude'          =>  $atts['latitude'],
		    'longitude'         =>  $atts['longitude'],
		    'controls'          =>  $atts['controls'],
		    'zoom'              =>  $atts['zoom'],
		    'saturation'        =>  $atts['saturation'],
		    'hue'               =>  $atts['hue'],
	    );
	    
	    $html_atts = array(
		    'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
		    'class'         =>  explode( ' ', "tailor-element tailor-map {$atts['class']}" ),
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

	    $inner_html = '%s';

	    if ( false == tailor_get_setting( 'google_maps_api_key', false ) ) {
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'Please create and add a Google Maps API key in the admin settings', 'tailor' )
		    );
	    }
	    else if ( empty( $atts['address'] ) ) {
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'Please enter an address to display on this map', 'tailor' )
		    );
	    }
	    else {
		    $inner_html = '<div class="tailor-map__canvas"></div>%s';
		    $content = do_shortcode( $content );
	    }

	    $outer_html = "<div {$html_atts}>%s</div>";
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

    add_shortcode( 'tailor_map', 'tailor_shortcode_map' );
}

if ( ! function_exists( 'tailor_shortcode_map_marker' ) ) {

	/**
	 * Defines the shortcode rendering function for the Map Marker element.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts
	 * @param string $content
	 * @param string $tag
	 * @return string
	 */
	function tailor_shortcode_map_marker( $atts, $content = null, $tag ) {

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
			'id'            => null,
			'class'         =>  array( 'tailor-map__marker' ),
			'data'          =>  $atts,
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
		$inner_html = do_shortcode( wpautop( $content ) );
		$html = sprintf( $outer_html, $inner_html );

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

	add_shortcode( 'tailor_map_marker', 'tailor_shortcode_map_marker' );
}