<?php

/**
 * Tailor Admin class.
 *
 * @package Tailor
 * @subpackage Admin
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Admin' ) ) {

    /**
     * Tailor Admin class.
     *
     * @since 1.0.0
     */
    class Tailor_Admin {

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {
            $this->add_actions();
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {
	        add_action( 'admin_init', array( $this, 'delete_layout' ) );
	        add_action( 'admin_notices', array( $this, 'tailor_notices' ) );
	        add_action( 'plugin_action_links_' . tailor()->plugin_basename(), array( $this, 'add_settings_page_link' ) );
        }

	    /**
	     * Adds a link to the Tailor Settings page in the plugin actions menu.
	     *
	     * @since 1.0.0
	     *
	     * @param array $links
	     * @return array $links
	     */
	    public function add_settings_page_link( $links ) {
		    $links[] = '<a href="' . admin_url( 'options-general.php?page=' . TAILOR_SETTING_ID ) . '" title="' . __( 'Tailor Settings', 'tailor' ) . '">' .
		                    __( 'Settings', 'tailor' ) .
		               '</a>';
		    return $links;
	    }

	    /**
	     * Restores the original post content.
	     *
	     * @since 1.0.0
	     */
	    public function delete_layout() {
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
	    public function tailor_notices() {
		    
		    // Only show the notice on the Edit Post screen
		    $screen = get_current_screen();
		    if ( 'post' !== $screen->base ) {
			    return;
		    }

		    tailor_partial( 'admin/html/notice', 'layout-deleted' );
		    tailor_partial( 'admin/html/notice', 'tailored-content' );
	    }
    }
}

new Tailor_Admin;