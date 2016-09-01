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

			$post_type_object = get_post_type_object( get_post_type( $post ) );

			$wp_admin_bar->add_node( array(
				'id'            =>  'edit-with-tailor',
				'meta'          =>  array(),
				'title'         =>  sprintf( __( 'Tailor this %s', 'tailor' ), $post_type_object->labels->singular_name ),
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
			$post_type_object = get_post_type_object( get_post_type( $post ) );
			$actions['tailor'] = tailor()->get_edit_link( $post->ID, $post_type_object->labels->singular_name );
		}

		return $actions;
	}

	add_filter( 'page_row_actions', 'tailor_inline_edit_link', 10, 2 );
	add_filter( 'post_row_actions', 'tailor_inline_edit_link', 10, 2 );
}

if ( ! function_exists( 'tailor_content_editor_link' ) ) {

    /**
     * Adds an edit link above content editor, next to the 'Add Media' button
     *
     * @since 1.5.4
     */
    function tailor_content_editor_link() {

		if ( tailor()->is_canvas() || tailor()->is_tailoring() ) {
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

			$post_type_object = get_post_type_object( get_post_type( $post ) );

			$link = array(
				'href'  => tailor()->get_edit_url( $post->ID ),
				'id'    => 'edit-with-tailor',
				'title' => sprintf( __( 'Tailor this %s', 'tailor' ), $post_type_object->labels->singular_name ),
			);

			echo vsprintf( '<a href="%s" id="%s" class="button">%s</a>', $link );
		}
	}

	add_action( 'media_buttons', 'tailor_content_editor_link', 99 );
}