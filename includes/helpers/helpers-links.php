<?php

/**
 * Edit link helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_admin_bar_edit_link' ) ) {

	/**
	 * Adds an edit link to the Admin Bar.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Admin_Bar $wp_admin_bar
	 */
	function tailor_admin_bar_edit_link( $wp_admin_bar ) {
		
		if ( tailor()->is_canvas() ) {
			return;
		}

		// Only add the Admin Bar link when editing a post or page
		if ( is_admin() ) {

			$screen = get_current_screen();
			if ( 'post' !== $screen->base ) {
				return;
			}
		}

		// Do not display link on archive pages
		else if ( ! is_singular() ) {
			return;
		}

		$post = get_post();
		if ( ! $post || 'auto-draft' == get_post_status( $post->ID ) ) {
			return;
		}

		if ( tailor()->check_user_role() && tailor()->check_post( $post ) ) {
			$wp_admin_bar->add_node( array(
				'id'            =>  'edit-with-tailor',
				'meta'          =>  array(),
				'title'         =>  sprintf( __( 'Tailor this %s', 'tailor' ), ucfirst( $post->post_type ) ),
				'href'          =>  tailor()->get_edit_url( $post->ID ),
			) );
		}
	}

	add_action( 'admin_bar_menu', 'tailor_admin_bar_edit_link', 99 );
}

if ( ! function_exists( 'tailor_inline_edit_link' ) ) {

	/**
	 * Adds an inline edit link to posts and pages.
	 *
	 * @since 1.0.0
	 *
	 * @param array $actions
	 * @param object $page_object The post type object.
	 * @return array $actions
	 */
	function tailor_inline_edit_link( $actions, $page_object ) {
		$post = $page_object;
		if ( tailor()->check_user_role() && tailor()->check_post( $post ) ) {
			$actions['tailor'] = tailor()->get_edit_link( $post->ID, $post->post_type );
		}

		return $actions;
	}

	add_filter( 'page_row_actions', 'tailor_inline_edit_link', 10, 2 );
	add_filter( 'post_row_actions', 'tailor_inline_edit_link', 10, 2 );
}

if ( ! function_exists( 'tailor_frontend_edit_link' ) ) {

	/**
	 * Adds an edit link in the front end when the user is logged in.
	 *
	 * @since 1.0.0
	 *
	 * @param $links
	 * @return string
	 */
	function tailor_frontend_edit_link( $links ) {
		$post = get_post();
		if ( ! tailor()->is_canvas() && tailor()->check_user_role() && tailor()->check_post( $post ) ) {
			$links .= ' ' . tailor()->get_edit_link( $post->ID, $post->post_type );
		}

		return $links;
	}

	//add_filter( 'edit_post_link', 'tailor_frontend_edit_link' );
}
