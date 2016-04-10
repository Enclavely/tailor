<?php

/**
 * Color helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_adjust_color_brightness' ) ) {

	/**
	 * Adjusts the apparent brightness of a color value.
	 *
	 * @since 1.0.0
	 *
	 * @param $color
	 * @param $percent
	 * @return string
	 */
	function tailor_adjust_color_brightness( $color, $percent ) {

		$percent = max( -1, min( 1, $percent ) );
		$steps = max( -255, min( 255, $percent * 255 ) );

		if ( false !== stripos( $color, '#' ) ) {
			return tailor_adjust_hex_brightness( $color, $steps );
		}

		else if ( false !== stripos( $color, 'rgba' ) ) {
			return tailor_adjust_rgba_brightness( $color, $steps );
		}

		return $color;
	}
}

if ( ! function_exists( 'tailor_adjust_hex_brightness' ) ) {

	/**
	 * Adjusts the apparent brightness of a hexadecimal color value by a given percentage.
	 *
	 * The percent change can be positive or negative (e.g., -0.2 results in a color 20% darker).
	 *
	 * @since 1.0.0
	 *
	 * @see http://stackoverflow.com/questions/3512311/how-to-generate-lighter-darker-color-with-php
	 *
	 * @param string $hex
	 * @param int $steps
	 * @return string
	 */
	function tailor_adjust_hex_brightness( $hex, $steps ) {

		$hex = str_replace( '#', '', $hex );

		if ( 3 == strlen( $hex ) ) {
			$hex = str_repeat( substr( $hex, 0, 1 ), 2 ) .
			       str_repeat( substr( $hex, 1, 1 ), 2 ) .
			       str_repeat( substr( $hex, 2, 1 ), 2 );
		}

		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );

		$r = max( 0, min( 255, $r + $steps ) );
		$g = max( 0, min( 255, $g + $steps ) );
		$b = max( 0, min( 255, $b + $steps ) );

		return '#' .
		       str_pad( dechex( $r ), 2, '0', STR_PAD_LEFT ) .
		       str_pad( dechex( $g ), 2, '0', STR_PAD_LEFT ) .
		       str_pad( dechex( $b ), 2, '0', STR_PAD_LEFT );
	}
}

if ( ! function_exists( 'tailor_adjust_rgba_brightness' ) ) {

	/**
	 * Adjusts the apparent brightness of an RGBA color value.
	 *
	 * @since 1.0.0
	 *
	 * @param $rgba
	 * @param $steps
	 * @return string
	 */
	function tailor_adjust_rgba_brightness( $rgba, $steps ) {

		$rgba = tailor_rgba_to_rgba_array( $rgba );

		$r = max( 0, min( 255, $rgba['r'] + $steps ) );
		$g = max( 0, min( 255, $rgba['g'] + $steps ) );
		$b = max( 0, min( 255, $rgba['b'] + $steps ) );

		return sprintf( 'rgba(%d, %d, %d, %.2f)', $r, $g, $b, $rgba['a']);
	}
}

if ( ! function_exists( 'tailor_rgba_to_rgba_array' ) ) {

	/**
	 * Splits an RGBA color value into an array.
	 *
	 * @since 1.0.0
	 *
	 * @param string $rgba
	 * @return array
	 */
	function tailor_rgba_to_rgba_array( $rgba = '' ) {

		$rgba = trim( str_replace( ' ', '', $rgba ) );

		if ( false !== stripos($rgba, 'rgba' ) ) {
			$result = sscanf( $rgba, "rgba(%d, %d, %d, %f)" );
		}
		else {
			$result = sscanf( $rgba, "rgb(%d, %d, %d)" );
			$result[] = 1;
		}

		return array_combine( array( 'r', 'g', 'b', 'a' ), $result );
	}
}


if ( ! function_exists( 'tailor_rgba_array_to_hex' ) ) {

	/**
	 * Converts an array containing the RGBA color channel values into a hexadecimal color value.
	 *
	 * @since 1.0.0
	 *
	 * @param array $rgba
	 * @return string
	 */
	function tailor_rgba_array_to_hex( $rgba = array() ) {

		$x = 255;
		$y = 0;

		$r = ( is_int( $rgba[0] ) && $rgba[0] >= $y && $rgba[0] <= $x ) ? $rgba[0] : 0;
		$g = ( is_int( $rgba[1] ) && $rgba[1] >= $y && $rgba[1] <= $x ) ? $rgba[1] : 0;
		$b = ( is_int( $rgba[2] ) && $rgba[2] >= $y && $rgba[2] <= $x ) ? $rgba[2] : 0;

		return sprintf( '#%02X%02X%02X', $r, $g, $b );
	}
}

if ( ! function_exists( 'tailor_hex_to_rgb_array' ) ) {

	/**
	 * Converts a hexadecimal color value into an array containing values for each RGB color channel.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return array|string
	 */
	function tailor_hex_to_rgb_array( $color = '' ) {

		if ( false !== strpos( $color, '#' ) ) {
			$color = substr( $color, 1, strlen( $color ) );
		}

		$color = str_split( $color, 2 );

		foreach( $color as $key => $c ) {
			$color[ $key ] = hexdec( $c );
		}

		return $color;
	}
}