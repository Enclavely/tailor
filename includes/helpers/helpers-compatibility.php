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

if ( ! function_exists( 'require_if_plugin_active' ) ) {

	/**
	 * Loads a PHP file if a given plugin is active.
	 *
	 * @since 1.0.0
	 *
	 * @param string $plugin.
	 * @param string $path
	 * @return bool
	 */
	function require_if_plugin_active( $plugin, $path ) {
		$function_name = "is_{$plugin}_active";
		if ( function_exists( $function_name ) && $function_name() ) {
			require_once $path;
			return true;
		}
		return false;
	}
}

if ( ! function_exists( 'is_contact_form_7_active' ) ) {

	/**
	 * Returns true if the Contact Form 7 plugin is active.
	 *
	 * @since  1.0.0
	 *
	 * @return bool
	 */
	function is_contact_form_7_active() {
		return class_exists( 'WPCF7_ContactForm' );
	}
}

if ( ! function_exists( 'is_bbpress_active' ) ) {

	/**
	 * Returns true if the bbPress plugin is active.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	function is_bbpress_active() {
		return class_exists( 'bbPress' ) ? true : false;
	}
}

if ( ! function_exists( 'is_woocommerce_active' ) ) {

	/**
	 * Returns true if the WooCommerce plugin is active.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	function is_woocommerce_active() {
		return class_exists( 'woocommerce' ) ? true : false;
	}
}


if ( ! function_exists( 'is_revolution_slider_active' ) ) {

	/**
	 * Returns true if the Revolution Slider plugin is active.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	function is_revolution_slider_active() {
		return class_exists( 'RevSlider' ) ? true : false;
	}
}

if ( ! function_exists( 'is_jetpack_active' ) ) {

	/**
	 * Returns true if the Jetpack plugin is active.
	 *
	 * @since  1.0.0
	 *
	 * @return bool
	 */
	function is_jetpack_active() {
		return class_exists( 'Jetpack' );
	}
}

if ( ! function_exists( 'is_jetpack_portfolio_active' ) ) {

	/**
	 * Returns true if the Jetpack Portfolio module is active.
	 *
	 * @since  1.3.4
	 *
	 * @return bool
	 */
	function is_jetpack_portfolio_active() {
		return is_jetpack_active() && ( ( get_option( 'jetpack_portfolio', '0' ) || current_theme_supports( 'jetpack-portfolio' ) ) );
	}
}

if ( ! function_exists( 'is_jetpack_testimonials_active' ) ) {

	/**
	 * Returns true if the Jetpack Testimonials module is active.
	 *
	 * @since  1.3.5
	 *
	 * @return bool
	 */
	function is_jetpack_testimonials_active() {
		return is_jetpack_active() && ( ( get_option( 'jetpack_testimonial', '0' ) || current_theme_supports( 'jetpack-testimonial' ) ) );
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