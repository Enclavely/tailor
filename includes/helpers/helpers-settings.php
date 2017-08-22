<?php

/**
 * Setting and sanitization helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_get_setting' ) ) {

    /**
     * Returns the value of a given setting.
     *
     * @since 1.0.0
     *
     * @param string $id
     * @param mixed $default
     * @return mixed
     */
    function tailor_get_setting( $id = '', $default = false ) {
	    $settings = get_option( TAILOR_SETTING_ID );

	    if ( false === $settings ) {
		    $setting_defaults = array(
			    'post_types'                =>  array(
				    'page'                      =>  'on',
			    ),
			    'content_placeholder'       =>  tailor_do_shakespeare(),
			    'show_element_descriptions' =>  array(
				    'on'                        =>  'on',
			    ),
			    'icon_kits'                 =>  array(
				    'dashicons'                 =>  'on',
			    ),
			    'mobile_breakpoint'         =>  320,
			    'tablet_breakpoint'         =>  720,
		    );

		    /**
		     * Filters the default setting values.
		     *
		     * @since 1.0.0
		     *
		     * @param array $setting_defaults
		     */
		    $settings = apply_filters( 'tailor_default_settings', $setting_defaults );
	    }

	    if ( ! isset( $settings[ $id ] ) ) {
		    return $default;
	    }

	    return $settings[ $id ];
    }
}

if ( ! function_exists( 'tailor_sanitize_text' ) ) {

	/**
	 * Sanitizes a simple text string.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The string to sanitize.
	 * @return string The sanitized string.
	 */
	function tailor_sanitize_text( $value ) {
		return strip_tags( stripslashes( $value ) );
	}
}

if ( ! function_exists( 'tailor_sanitize_html' ) ) {

	/**
	 * Sanitizes content that could contain HTML.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The HTML string to sanitize.
	 * @return string The sanitized string.
	 */
	function tailor_sanitize_html( $value ) {
		return balanceTags( wp_kses_post( $value ), true );
	}
}

if ( ! function_exists( 'tailor_sanitize_number' ) ) {

	/**
	 * Sanitizes a number value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The value to sanitize.
	 * @param mixed $setting The associated setting.
	 * @return int The sanitized value.
	 */
	function tailor_sanitize_number( $value, $setting ) {
		if ( ! is_numeric( (int) $value ) ) {
			return $setting->default;
		}

		return $value < 0 ? abs( $value ) : $value;
	}
}

if ( ! function_exists( 'tailor_sanitize_color' ) ) {

	/**
	 * Sanitizes a color value.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color The value to sanitize.
	 * @param mixed $setting The associated setting.
	 * @return string The sanitized RGBA color value.
	 */
	function tailor_sanitize_color( $color, $setting ) {
		if ( ! is_string( $color ) ) {
			return $setting->default;
		}
		if ( '' === $color ) {
			return '';
		}

		if ( false !== stripos( $color, '#' ) ) {
			return sanitize_hex_color( $color );
		}

		if ( false !== stripos( $color, 'rgba' ) ) {
			return tailor_sanitize_rgba( $color );
		}
		return $setting->default;
	}
}

if ( ! function_exists( 'tailor_sanitize_rgba' ) ) {

	/**
	 * Sanitizes an RGBA color value.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color The RGBA color value to sanitize.
	 * @return string The sanitized RGBA color value.
	 */
	function tailor_sanitize_rgba( $color ) {
		$color = str_replace( ' ', '', $color );
		sscanf( $color, 'rgba(%d,%d,%d,%f)', $red, $green, $blue, $alpha );
		return 'rgba(' . $red . ',' . $green . ',' . $blue . ',' . $alpha . ')';
	}
}

if ( ! function_exists( 'sanitize_hex_color' ) ) {

	/**
	 * Sanitizes a hex color.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return string|null
	 */
	function sanitize_hex_color( $color ) {
		if ( '' === $color ) {
			return '';
		}

		if ( preg_match('|^#([A-Fa-f0-9]{3}){1,2}$|', $color ) ) {
			return $color;
		}

		return null;
	}
}

if ( ! function_exists( 'sanitize_hex_color_no_hash' ) ) {

	/**
	 * Sanitizes a hex color without a hash. Use sanitize_hex_color() when possible.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return string|null
	 */
	function sanitize_hex_color_no_hash( $color ) {
		$color = ltrim( $color, '#' );
		if ( '' === $color ) {
			return '';
		}

		return sanitize_hex_color( '#' . $color ) ? $color : null;
	}
}

if ( ! function_exists( 'maybe_hash_hex_color' ) ) {

	/**
	 * Ensures that any hex color is properly hashed.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return string|null
	 */
	function maybe_hash_hex_color( $color ) {
		if ( $unhashed = sanitize_hex_color_no_hash( $color ) ) {
			return '#' . $unhashed;
		}

		return $color;
	}
}

if ( ! function_exists( 'tailor_to_json' ) ) {

	/**
	 * Converts an array to a JSON string.
	 *
	 * @since 1.6.4
	 *
	 * @param mixed $value
	 * @return string
	 */
	function tailor_to_json( $value ) {
		if ( is_array( $value ) ) {
			$value = json_encode( $value );
		}
		return $value;
	}
}