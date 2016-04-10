<?php

/**
 * Welcome page template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<div class="wrap about-wrap tailor-getting-started">

	<h1><?php esc_attr_e( tailor()->plugin_name() ); ?></h1>

	<?php printf( '<p class="about-text">%1$s</p>', __( 'Congratulations!  You are now able to Tailor posts and pages to you liking quickly and easily.', tailor()->textdomain() ) ); ?>

	<div class="feature-section two-col">
		<div class="col"></div>
		<div class="col"></div>
	</div>

	<div class="return-to-dashboard">
		<?php if ( current_user_can( 'update_core' ) && isset( $_GET['updated'] ) ) : ?>
			<a href="<?php echo esc_url( self_admin_url( 'update-core.php' ) ); ?>">
				<?php is_multisite() ? _e( 'Return to Updates' ) : _e( 'Return to Dashboard &rarr; Updates' ); ?>
			</a> |
		<?php endif; ?>
		<a href="<?php echo esc_url( self_admin_url() ); ?>"><?php is_blog_admin() ? _e( 'Go to Dashboard &rarr; Home' ) : _e( 'Go to Dashboard' ); ?></a>
	</div>
</div>