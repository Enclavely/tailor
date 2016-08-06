<?php

/**
 * Revisions class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Revisions' ) ) {

    /**
     * Tailor Revisions class.
     *
     * @since 1.0.0
     */
    class Tailor_Revisions {

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
         */
        public function add_actions() {
	        add_action( 'save_post', array( $this, 'save_revision' ) );
	        add_action( 'wp_restore_post_revision', array( $this, 'restore_revision' ), 10, 2 );
        }

	    /**
	     * Saves the element collection against a post revision.
	     *
	     * @since 1.0.0
	     *
	     * @param string $post_id
	     */
        public function save_revision( $post_id ) {
	        if ( $revision_id = wp_is_post_revision( $post_id ) ) {
		        $revision = get_post( $revision_id );
		        $meta_data = get_post_meta( $revision->ID, '_tailor_layout', true );
		        if ( false != $meta_data ) {
			        add_metadata( 'post', $post_id, '_tailor_layout', $meta_data );
		        }
	        }
        }

	    /**
	     * Restores the element collection saved against a given revision.
	     *
	     * @since 1.0.0
	     *
	     * @param string $post_id
	     * @param string $revision_id
	     */
	    public function restore_revision( $post_id, $revision_id ) {
		    $revision = get_post( $revision_id );
		    $meta_data = get_post_meta( $revision->ID, '_tailor_layout', true );
		    if ( false == $meta_data ) {
			    delete_post_meta( $post_id, '_tailor_layout' );
		    }
		    else {
			    update_post_meta( $post_id, '_tailor_layout', $meta_data );
		    }
	    }
    }
}

new Tailor_Revisions;