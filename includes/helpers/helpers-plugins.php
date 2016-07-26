<?php

/**
 * Plugin helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

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