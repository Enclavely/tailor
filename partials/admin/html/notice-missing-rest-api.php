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
	<p>
		<?php printf(
			__( 'The Tailor REST API is dependent on the %1$sWordPress REST API v2%2$s.', 'tailor' ),
			'<a href="https://wordpress.org/plugins/rest-api/" target="_blank">',
			'</a>'
		); ?>
	</p>
	<button type="button" class="notice-dismiss">
		<span class="screen-reader-text"><?php esc_html_e( 'Dismiss this notice.', 'tailor' ); ?></span>
	</button>
</div>