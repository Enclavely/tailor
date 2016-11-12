<?php

/**
 * Tailor layout deleted notice template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.7.5
 */

defined( 'ABSPATH' ) or die();

if ( ! isset( $_GET['tailor-layout-deleted'] ) || '1' != $_GET['tailor-layout-deleted'] ) {
	return;
}

$alert_text = __( 'The Tailor layout was successfully deleted.', 'tailor' ); ?>

<div class="notice notice-success is-dismissible"><p><?php _e( $alert_text ); ?></p></div>