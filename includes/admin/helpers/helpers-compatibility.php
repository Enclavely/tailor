<?php

/**
 * Tailor compatibility helpers.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_compatibility_notice' ) ) {

	/**
	 * Displays a compatibility notice when using an old, unsupported version of WordPress.
	 *
	 * @since 1.0.0
	 */
	function tailor_compatibility_notice() {
		$message = sprintf(
			__( 'Tailor requires at least WordPress version 4.3. You are running version %s. Please upgrade and try again.', 'tailor' ),
			$GLOBALS['wp_version']
		);
		printf( '<div class="error"><p>%s</p></div>', $message );
	}

	add_action( 'admin_notices', array( $this, 'display_compatibility_notice' ) );
}