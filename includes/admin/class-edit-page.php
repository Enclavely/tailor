<?php

/**
 * Tailor Edit Page class.
 *
 * @package Tailor
 * @subpackage Admin
 * @since 1.8.0
 */

class Tailor_Edit_Page {

	static function add_actions() {
		add_action( 'admin_init', array( __CLASS__, 'delete_layout' ) );
		add_action( 'admin_notices', array( __CLASS__, 'tailor_notices' ) );
	}

	/**
	 * Restores the original post content.
	 *
	 * @since 1.0.0
	 */
	static function delete_layout() {
		if ( ! isset( $_GET['tailor-delete-layout'] ) || '1' !== $_GET['tailor-delete-layout'] ) {
			return;
		}

		check_admin_referer( 'tailor-delete-layout' );

		$post_id = wp_unslash( $_GET['post'] );
		$url = admin_url( sprintf( 'post.php?post=%s&action=edit', wp_unslash( $_GET['post'] ) ) );

		delete_post_meta( $post_id, '_tailor_layout' );

		$post = get_post( $post_id );
		wp_update_post( array(
			'ID'                =>  $post_id,
			'post_content'      =>  $post->post_content,
		) );

		wp_redirect( esc_url_raw( add_query_arg( array( 'tailor-layout-deleted' => '1' ), $url ) ) );
	}

	/**
	 * Displays admin notices.
	 *
	 * @since 1.7.5
	 */
	static function tailor_notices() {

		// Only show the notice on the Edit Post screen
		$screen = get_current_screen();
		if ( 'post' !== $screen->base ) {
			return;
		}

		tailor_partial( 'admin/html/notice', 'layout-deleted' );
		tailor_partial( 'admin/html/notice', 'tailored-content' );
	}
}

Tailor_Edit_Page::add_actions();