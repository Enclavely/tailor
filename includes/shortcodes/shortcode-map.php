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

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
            'address'                   =>  'Melbourne, Australia',
            'latitude'                  =>  '',
            'longitude'                 =>  '',
	        'controls'                  =>  0,
            'zoom'                      =>  '13',
            'saturation'                =>  '-50',
            'hue'                       =>  '',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-map {$atts['class']}" ) );
        $data = tailor_get_attributes( array(
            'address'           =>  $atts['address'],
            'latitude'          =>  $atts['latitude'],
            'longitude'         =>  $atts['longitude'],
	        'controls'          =>  $atts['controls'],
            'zoom'              =>  $atts['zoom'],
            'saturation'        =>  $atts['saturation'],
            'hue'               =>  $atts['hue'],
        ), 'data-' );
	    
	    if ( false == tailor_get_setting( 'google_maps_api_key', false ) ) {
		    $content = sprintf( '<p class="tailor-notification tailor-notification--warning">%s</p>', __( 'Please create and add a Google Maps API key in the admin settings', 'tailor' ) );
	    }
	    else {
		    $content = '<div class="tailor-map__canvas"></div>' . do_shortcode( $content );
	    }

	    return  '<div ' . trim( "{$id} class=\"{$class}\"" ) . ' ' . $data . '>' .
	                $content .
	            '</div>';
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

		$atts = shortcode_atts( array(
			'title'             =>  '',
			'address'           =>  '',
			'latitude'          =>  '',
			'longitude'         =>  '',
		), $atts, $tag );

		return  '<div class="tailor-map__marker" ' . tailor_get_attributes( $atts, 'data-' ) . '>' .
		            do_shortcode( wpautop( $content ) ) .
		        '</div>';
	}

	add_shortcode( 'tailor_map_marker', 'tailor_shortcode_map_marker' );
}