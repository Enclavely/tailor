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
	        add_action( 'admin_notices', array( $this, 'tailored_content_notice' ) );
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
	     * Displays a notice when editing a post or page that has been Tailored.
	     *
	     * @since 1.0.0
	     */
	    public function tailored_content_notice() {
		    
		    // Only show the notice on the Edit Post screen
		    $screen = get_current_screen();
		    if ( 'post' !== $screen->base ) {
			    return;
		    }

		    tailor_partial( 'admin/html/notice', 'tailored-content' );
	    }
    }
}

new Tailor_Admin;