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
	     * The collection of meta keys to synchronize between posts and revisions.
	     *
	     * @since 1.0.0
	     * @access protected
	     * @var array
	     */
	    protected $meta_keys;

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {

	        $this->meta_keys = array(
		        '_tailor_layout',
		        '_tailor_original_content',
		        '_tailor_saved_content',
	        );

	        add_action( 'init', array( $this, 'add_actions' ) );
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         */
        public function add_actions() {

	        if ( ! apply_filters( 'tailor_supports_revisions', true ) ) {
		        return;
	        }

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

	        if ( $revision_id = wp_is_post_revision( $post_id ) && is_array( $this->meta_keys ) ) {

		        $revision = get_post( $revision_id );

		        foreach ( $this->meta_keys as $meta_key ) {
			        if ( false != $meta_data = get_post_meta( $revision->ID, $meta_key, true ) ) {
				        add_metadata( 'post', $post_id, $meta_key, $meta_data );
			        }
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

		    if ( ! is_array( $this->meta_keys ) ) {
			    return;
		    }

		    $revision = get_post( $revision_id );

		    foreach ( $this->meta_keys as $meta_key ) {
			    if ( false != $meta_data = get_post_meta( $revision->ID, $meta_key, true ) ) {
				    update_post_meta( $post_id, $meta_key, $meta_data );
			    }
			    else {
				    delete_post_meta( $post_id, $meta_key );
			    }
		    }
	    }
    }
}

new Tailor_Revisions;