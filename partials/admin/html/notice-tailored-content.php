<?php

/**
 * Tailored content notice template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.4.0
 */

defined( 'ABSPATH' ) or die();

$post = get_post();
if ( false == get_post_meta( $post->ID, '_tailor_layout', true ) ) {
	return;
}

$post_type_object = get_post_type_object( get_post_type( $post ) );
$alert_text = sprintf(
	__( 'This %1$s\'s layout was created by Tailor.  You can modify content in the Editor and the changes will appear in both Tailor and the frontend.', 'tailor' ),
	lcfirst( $post_type_object->labels->singular_name )
);

$url = wp_nonce_url( admin_url( 'post.php?post=' . $post->ID . '&action=edit&tailor-delete-layout=1' ), 'tailor-delete-layout' ); ?>

<div class="notice notice-warning is-dismissible">
	<p><?php _e( $alert_text ); ?>
		<a href="<?php echo $url; ?>"><?php _e( 'Delete layout', 'tailor' ); ?></a>
	</p>
</div>