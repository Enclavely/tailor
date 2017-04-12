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

defined( 'ABSPATH' ) or die();

$version = tailor()->version(); ?>

<div class="wrap">

	<h1><?php _e( 'Tailor settings', 'tailor' ) ?></h1>

	<div class="settings-information">
		<h2><?php _e( 'Tailor', 'tailor' ); ?> <?php echo $version; ?></h2>
		<p><?php printf( __( 'See what\'s new in %1$sversion %2$s%3$s','tailor' ), '<a href="https://wordpress.org/plugins/tailor/changelog/" target="_blank">', $version,'</a>' ); ?></p>

		<h3><?php _e( 'Resources', 'tailor' ); ?></h3>
		<ul>
			<li><a href="https://support.gettailor.com/hc/en-us/categories/202586427" target="_blank"><?php _e( 'Getting started', 'tailor' ); ?></a></li>
			<li><a href="https://support.gettailor.com/hc/en-us/categories/203117247" target="_blank"><?php _e( 'Extending', 'tailor' ); ?></a></li>
		</ul>
		<p>
			<?php printf(
				__( 'If you like Tailor, please consider %1$srating it!%2$s','tailor' ),
				'<a href="https://wordpress.org/support/view/plugin-reviews/tailor?rate=5#postform" target="_blank">', '</a>'
			); ?>
		</p>
	</div>

	<div class="settings-form">
		<?php settings_errors( $page ); ?>

		<form method="post" action="options.php">

			<?php
			settings_fields( $page );
			do_settings_sections( $page );
			submit_button(); ?>

		</form>
	</div>
</div>

