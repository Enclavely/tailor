<?php

/**
 * Compatibility helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.1
 */

if ( ! function_exists( 'boolval' ) ) {

	/**
	 * Get the boolean value of a variable.
	 *
	 * @param mixed $var The scalar value being converted to a boolean.
	 * @return boolean The boolean value of var.
	 */
	function boolval( $val ) {
		return (bool) $val;
	}
}

if ( ! function_exists( 'array_combine' ) ) {

	/**
	 * Creates an array by using one array for keys and another for its values.
	 *
	 * @link http://php.net/manual/en/function.array-combine.php
	 *
	 * @param array $keys Array of keys to be used. Illegal values for key will be converted to string.
	 * @param array $values Array of values to be used
	 * @return array the combined array, false if the number of elements for each array isn't equal or if the arrays are empty.
	 */
	function array_combine( $arr1, $arr2 ) {
		$out = array();
		foreach ( $arr1 as $key1 => $value1 ) {
			$out[ $value1]  = $arr2[ $key1 ];
		}
		return $out;
	}
}

if ( ! function_exists( 'custom_thesis_body_class' ) ) {

	/**
	 * Adds the required Tailor body class to pages when the Thesis theme is used.
	 *
	 * @since 1.3.0
	 *
	 * @param $classes
	 *
	 * @return array
	 */
	function custom_thesis_body_class( $classes ) {
		$classes[] = 'tailor-ui';
		return $classes;
	}

	add_filter( 'thesis_html_body_class', 'custom_thesis_body_class' );
}