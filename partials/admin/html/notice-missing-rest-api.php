<?php

/**
 * Tailor REST API notice template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.4.0
 */

defined( 'ABSPATH' ) or die(); ?>

<div class="notice error is-dismissible">
	<p><?php esc_html_e( 'The Tailor REST API is dependent on the WordPress API being available', 'tailor' ); ?></p>
	<button type="button" class="notice-dismiss">
		<span class="screen-reader-text"><?php esc_html_e( 'Dismiss this notice.', 'tailor' ); ?></span>
	</button>
</div>