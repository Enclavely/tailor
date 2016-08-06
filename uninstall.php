`<?php

/**
 * Uninstalls the Tailor plugin.
 *
 * @package Tailor
 * @since 1.0.0
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Check user permissions
if ( ! current_user_can( 'activate_plugins' ) ) {
	return;
}

delete_option( 'tailor_version' );
delete_option( 'tailor_previous_version' );