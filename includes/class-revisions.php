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
	     * Post meta keys to manage.
	     *
	     * @since 1.4.1
	     * @var array
	     */
	    private $meta_keys = array();

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {
	        $this->meta_keys = $this->get_meta_keys();
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

	    public function get_meta_keys() {

		    $meta_keys = array(
			    '_tailor_page_css',
			    '_tailor_page_js',
			    '_tailor_section_width',
			    '_tailor_column_spacing',
			    '_tailor_element_spacing',
			    '_tailor_layout',
		    );

		    /**
		     * Filter the tracked meta keys.
		     *
		     * @since 1.4.1
		     *
		     * @param array $meta_keys
		     */
		    $meta_keys = apply_filters( 'tailor_revision_meta_keys', $meta_keys );

		    return $meta_keys;
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

		        // Save tracked post meta
		        if ( ! empty( $this->meta_keys ) ) {
			        foreach( $this->meta_keys as $meta_key ) {
				        $meta_data = get_post_meta( $revision->ID, $meta_key, true );
				        if ( false != $meta_data ) {
					        add_metadata( 'post', $post_id, $meta_key, $meta_data );
				        }
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
		    if ( ! empty( $this->meta_keys ) ) {
			    foreach( $this->meta_keys as $meta_key ) {

				    $restore_value = get_metadata( 'post', $revision_id, $meta_key, true );
				    if ( ! empty( $restore_value ) ) {
					    update_post_meta( $post_id, $meta_key, $restore_value );
				    }
				    else {
					    delete_post_meta( $post_id, $meta_key );
				    }
			    }
		    }
	    }
    }
}

new Tailor_Revisions;