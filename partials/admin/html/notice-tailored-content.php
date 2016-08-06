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
	__( 'Changes made to this %s within the editor will not be displayed in Tailor', 'tailor' ),
	lcfirst( $post_type_object->labels->singular_name )
); ?>

<div class="notice notice-warning is-dismissible">
	<p><?php esc_html_e( $alert_text ); ?></p>
	<button type="button" class="notice-dismiss">
		<span class="screen-reader-text"><?php esc_html_e( 'Dismiss this notice.', 'tailor' ); ?></span>
	</button>
</div>