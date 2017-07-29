<?php

/**
 * Hook-related helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.7.2
 */

if ( ! function_exists( 'tailor_show_attributes_section' ) ) {

	/**
	 * Shows the element attributes section only if it's not disabled from the admin backend.
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_show_attributes_section() {
		return ! tailor_get_setting( 'hide_attributes_panel' );
	}

	add_filter( 'tailor_enable_element_section_attributes', 'tailor_show_attributes_section', 10 );
}

if ( ! function_exists( 'tailor_show_custom_css_control' ) ) {

	/**
	 * Shows the custom CSS control only if it's not disabled from the admin backend.
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_show_custom_css_control() {
		return ! tailor_get_setting( 'hide_css_editor' );
	}

	add_filter( 'tailor_enable_sidebar_control_custom_css', 'tailor_show_custom_css_control', 10 );
}

if ( ! function_exists( 'tailor_show_custom_js_control' ) ) {

	/**
	 * Shows the custom JavaScript control only if it's not disabled from the admin backend.
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_show_custom_js_control() {
		return ! tailor_get_setting( 'hide_css_editor' );
	}

	add_filter( 'tailor_enable_sidebar_control_custom_js', 'tailor_show_custom_js_control', 10 );
}

if ( ! function_exists( 'tailor_maybe_enable_scripts' ) ) {

	/**
	 * Enables styles and scripts if the current page or post has been (or is being) Tailored
	 * (or the admin override is set to active).
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_maybe_enable_scripts() {
		if ( ! is_singular() ) {
			return false;
		}

		if ( tailor()->is_canvas() || tailor()->is_template_preview() ) {
			return true;
		}

		$enable_scripts = tailor_get_setting( 'enable_scripts_all_pages' );
		if ( ! empty( $enable_scripts ) ) {
			return true;
		}

		$post_id = get_the_ID();
		$tailor_layout = get_post_meta( $post_id, '_tailor_layout' );
		return ! empty( $tailor_layout );
	}

	add_filter( 'tailor_enable_frontend_styles', 'tailor_maybe_enable_scripts' );
	add_filter( 'tailor_enable_frontend_scripts', 'tailor_maybe_enable_scripts' );
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
			if ( ! function_exists( 'get_current_screen' ) ) {
				return;			
			}
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
			echo vsprintf( '<a href="%s" id="%s" class="button button-primary">%s</a>', $link );
		}
	}

	add_action( 'media_buttons', 'tailor_content_editor_link', 99 );
}

if ( ! function_exists( 'tailor_kses_allowed_html' ) ) {

	/**
	 * Specifies additional allowable HTML tag types for Tailor content.
	 *
	 * @since 1.5.6
	 *
	 * @param array $tags
	 * @return array $tags
	 */
	function tailor_kses_allowed_html( $tags, $context ) {
		if ( is_array( $tags ) && ! array_key_exists( 'input', $tags ) ) {
			$tags['input'] = array(
				'autocomplete'      =>  1,
				'autofocus'         =>  1,
				'checked'           =>  1,
				'disabled'          =>  1,
				'name'              =>  1,
				'placeholder'       =>  1,
				'readonly'          =>  1,
				'required'          =>  1,
				'size'              =>  1,
				'src'               =>  1,
				'step'              =>  1,
				'type'              =>  1,
				'value'             =>  1,
				'width'             =>  1,
			);
		}
		return $tags;
	}

	add_filter( 'wp_kses_allowed_html', 'tailor_kses_allowed_html', 10, 2 );
}
