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
	        add_action( 'admin_init', array( $this, 'restore_content' ) );
	        add_action( 'admin_notices', array( $this, 'content_notice' ) );
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
	    public function restore_content() {
		    
		    if ( ! isset( $_GET['tailor-restore'] ) || '1' !== $_GET['tailor-restore'] ) {
			   return;
		    }

		    check_admin_referer( 'tailor-restore-content' );

		    $post_id = wp_unslash( $_GET['post'] );
		    $url = admin_url( sprintf( 'post.php?post=%s&action=edit', wp_unslash( $_GET['post'] ) ) );
		    if ( false == ( $original_content = get_post_meta( $post_id, '_tailor_original_content', true ) ) ) {
			    wp_redirect( esc_url_raw( $url ) );
		    }

            delete_post_meta( $post_id, '_tailor_layout' );
            delete_post_meta( $post_id, '_tailor_original_content' );
            delete_post_meta( $post_id, '_tailor_saved_content' );

		    wp_update_post( array(
			    'ID'                => $post_id,
			    'post_content'      => wp_kses_post( $original_content ),
		    ) );

		    wp_redirect( esc_url_raw( add_query_arg( array( 'tailor-restored' => '1' ), $url ) ) );
	    }

	    /**
	     * Displays a notice when editing a post or page that has been Tailored.
	     *
	     * @since 1.0.0
	     */
	    public function content_notice() {
		    
		    $screen = get_current_screen();
		    if ( 'post' !== $screen->base ) {
			    return;
		    }

		    $post = get_post();
		    $post_id = $post->ID;

		    if ( isset( $_GET['tailor-restored'] ) && '1' == $_GET['tailor-restored'] ) {
			    $alert_text =  __( 'Original content restored.', 'tailor' );
			    $action_text = __( 'View page', 'tailor' );
			    $action_url = get_permalink( $post_id );
                $this->print_notice( $alert_text, $action_url, $action_text, 'success' );
		    }
		    if ( false != get_post_meta( $post_id, '_tailor_layout', true ) ) {

			    $saved_content = get_post_meta( $post_id, '_tailor_saved_content', true );

			    if ( wpautop( $post->post_content ) != wpautop( $saved_content ) ) {
				    $alert_text = sprintf( __( 'This is a Tailored %s that has been modified.', 'tailor' ), get_post_type( $post_id ) );
				    $action_text = __( 'Restore the original content', 'tailor' );
				    $action_url = wp_nonce_url( admin_url( 'post.php?post=' . $post_id . '&action=edit&tailor-restore=1' ), 'tailor-restore-content' );
				    $this->print_notice( $alert_text, $action_url, $action_text );
			    }
			    else {
				    $original_content = get_post_meta( $post_id, '_tailor_original_content' );
				    if ( $original_content && $post->post_content != $original_content ) {
					    $alert_text = sprintf( __( 'This is a Tailored %s.', 'tailor' ), get_post_type( $post_id ) );
					    $action_text = __( 'Restore the original content', 'tailor' );
					    $action_url = wp_nonce_url( admin_url( 'post.php?post=' . $post_id . '&action=edit&tailor-restore=1' ), 'tailor-restore-content' );
					    $this->print_notice( $alert_text, $action_url, $action_text );
				    }
			    }
		    }
	    }

	    /**
	     * Prints an admin notice.
	     *
	     * @since 1.0.0
	     *
	     * @param $alert_text
	     * @param $action_url
	     * @param $action_text
	     * @param string $type
	     */
        protected function print_notice( $alert_text, $action_url, $action_text, $type = 'warning' ) {
            echo    "<div class=\"notice notice-{$type} is-dismissible\">" .
                        '<p>' . $alert_text . ' <a href="' . $action_url . '">' . $action_text . '</a></p>' .
                        '<button type="button" class="notice-dismiss">' .
                            '<span class="screen-reader-text">' . __( 'Dismiss this notice.', 'tailor' ) . '</span>' .
                        '</button>' .
                    '</div>';
        }
    }
}

new Tailor_Admin;