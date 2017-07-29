<?php

/**
 * Compatibility class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.3.4
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Compatibility' ) ) {

    /**
     * Tailor Compatibility class.
     *
     * @since 1.3.4
     */
    class Tailor_Compatibility {

        /**
         * Constructor.
         *
         * @since 1.3.4
         */
        public function __construct() {
	        add_action( 'tailor_sidebar_init', array( $this, 'add_sidebar_actions' ) );
	        add_action( 'tailor_canvas_init', array( $this, 'add_canvas_actions' ) );
        }
	    
	    /**
	     * Adds required sidebar action hooks.
	     *
	     * @since 1.3.4
	     * @access protected
	     */
	    public function add_sidebar_actions() {
		    
		    remove_all_filters( 'template_include' );

		    // NextGEN gallery compatibility
		    add_filter( 'run_ngg_resource_manager', '__return_false' );
	    }

	    /**
	     * Adds required canvas action hooks.
	     *
	     * @since 1.3.4
	     * @access protected
	     */
	    public function add_canvas_actions() {

		    remove_all_filters( 'the_content' );

		    // Jetpack compatibility
		    if ( is_jetpack_active() ) {
			    remove_filter( 'the_content', 'sharing_display', 19 );
			    remove_filter( 'the_excerpt', 'sharing_display', 19 );
			    add_filter( 'sharing_show', '__return_false', 999 );
		    }

		    // WPSEO compatibility
		    if ( function_exists( 'wpseo_frontend_head_init' ) ) {
			    remove_action( 'template_redirect', 'wpseo_frontend_head_init', 999 );
		    }
	    }
    }
}

new Tailor_Compatibility;