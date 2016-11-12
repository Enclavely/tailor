<?php

/**
 * Deprecated helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.7.2
 */

if ( ! function_exists( 'tailor_strip_unit' ) ) {

	/**
	 * Returns the numerical value and unit in a given CSS declaration.
	 *
	 * @since 1.0.0
	 * @deprecated
	 *
	 * @param string $string
	 * @return array
	 */
	function tailor_strip_unit( $string = '' ) {
		$unit = preg_replace( "/[^a-z]/", '', $string );
		$value = str_replace( $unit, '', $string );
		return array( $value, $unit );
	}
}

if ( ! function_exists( 'tailor_get_previewable_devices' ) ) {

	/**
	 * Returns a list of devices to allow previewing.
	 *
	 * @since 1.1.3
	 * @deprecated
	 * 
	 * @return array|mixed|void
	 */
	function tailor_get_previewable_devices() {
		$devices = array(
			'desktop' => array(
				'label' => __( 'Enter desktop preview mode', 'tailor' ),
				'default' => true,
			),
			'tablet' => array(
				'label' => __( 'Enter tablet preview mode', 'tailor' ),
			),
			'mobile' => array(
				'label' => __( 'Enter mobile preview mode', 'tailor' ),
			),
		);

		/**
		 * Filter the available devices to allow previewing in the Customizer.
		 *
		 * @since 1.1.3
		 *
		 * @param array $devices List of devices with labels and default setting.
		 */
		$devices = apply_filters( 'customize_previewable_devices', $devices );

		return $devices;
	}
}

if ( ! function_exists( 'tailor_pluralize_string' ) ) {

	/**
	 * Pluralizes a given string.
	 *
	 * @since 1.0.0
	 *
	 * @access private
	 * @param $string
	 * @return string
	 */
	function tailor_pluralize_string( $string ) {
		$last = $string[ strlen( $string ) - 1 ];
		if ( 'y' == $last ) {
			$cut = substr( $string, 0, -1 );
			$plural = $cut . 'ies';
		}
		else {
			$plural = $string . 's';
		}
		return $plural;
	}
}