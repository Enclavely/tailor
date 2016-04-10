<?php

/**
 * Settings page template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var string $page The page slug.
 */

defined( 'ABSPATH' ) or die(); ?>

<div class="wrap">

	<h1><?php _e( 'Tailor settings', tailor()->textdomain() ) ?></h1>

	<?php settings_errors( $page ); ?>

	<form method="post" action="options.php">

		<?php
		settings_fields( $page );
		do_settings_sections( $page );
		submit_button(); ?>

	</form>
</div>