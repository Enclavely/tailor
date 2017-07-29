<?php

/**
 * Admin Compatibility class.
 *
 * @package Tailor
 * @subpackage Admin
 * @since 1.8.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Admin_Compatibility' ) ) {

    /**
     * Tailor Admin Compatibility class.
     *
     * @since 1.8.0
     */
    class Tailor_Admin_Compatibility {

        /**
         * Constructor.
         *
         * @since 1.8.0
         */
        public function __construct() {
	        add_action( 'admin_init', array( $this, 'add_admin_actions' ) );
        }

        /**
         * Adds required admin action hooks.
         *
         * @since 1.8.0
         */
        public function add_admin_actions() {
	        if ( version_compare( $GLOBALS['wp_version'], '4.3', '<' ) ) {
		        add_action( 'admin_notices', array( $this, 'display_compatibility_notice' ) );
	        }
        }

	    /**
	     * Displays a compatibility notice when using an old, unsupported version of WordPress.
	     *
	     * @since 1.8.0
	     */
	    public function display_compatibility_notice() {
		    $message = sprintf(
			    __( 'Tailor requires at least WordPress version 4.3. You are running version %s. Please upgrade and try again.', 'tailor' ),
			    $GLOBALS['wp_version']
		    );
		    printf( '<div class="error"><p>%s</p></div>', $message );
	    }
    }
}

new Tailor_Admin_Compatibility;