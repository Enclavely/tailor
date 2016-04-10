<?php

/**
 * Custom JavaScript class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Custom_JS' ) ) {

    /**
     * Tailor Custom JavaScript class.
     *
     * @since 1.0.0
     */
    class Tailor_Custom_JS {

        /**
         * The custom JavaScript instance.
         *
         * @since 1.0.0
         * @access private
         * @var Tailor_Custom_JS
         */
        private static $instance;

        /**
         * Returns a singleton instance.
         *
         * @since 1.0.0
         *
         * @return Tailor_Custom_JS
         */
        public static function get_instance() {
            if ( is_null( self::$instance ) ) {
                self::$instance = new self();
            }
            return self::$instance;
        }

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
            add_action( 'wp_head', array( $this, 'print_page_js' ) );
        }

        /**
         * Prints custom JavaScript for the post or page.
         *
         * @since 1.0.0
         */
        public function print_page_js() {

	        if ( did_action( 'tailor_print_page_js' ) ) {
		        return;
	        }

	        /**
	         * Allow developers to prevent custom page JavaScript from being printed.
	         *
	         * @since 1.0.0
	         *
	         * @param bool
	         */
	        if ( apply_filters( 'tailor_print_page_js', true ) ) {

		        $custom_page_js = $this->get_page_js();
		        $custom_page_js = $this->clean_js( $custom_page_js );

		        if ( ! empty( $custom_page_js ) ) {
			        printf( "\n<script id=\"tailor-custom-page-js\" type=\"text/javascript\">%s</script>\n", $custom_page_js );
		        }
	        }

	        /**
	         * Fires after custom page JavaScript has been printed.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_print_page_js' );
        }

	    /**
	     * Returns the saved custom JavaScript for the page or post.
	     *
	     * @since 1.0.0
	     * @access private
	     *
	     * @return string $custom_page_js
	     */
	    private function get_page_js() {

		    $custom_page_js = get_post_meta( get_the_ID(), '_tailor_page_js', true );

		    if ( false == $custom_page_js ) {
			    $custom_page_js = '';
		    }

		    /**
		     * Filter the custom JavaScript for the page or post.
		     *
		     * @since 1.0.0
		     *
		     * @param string $custom_css
		     */
		    $custom_page_js = apply_filters( 'tailor_get_page_js', $custom_page_js );

		    return $custom_page_js;
	    }

	    /**
	     * Removes comments and whitespace from JavaScript.
	     *
	     * @since 1.0.0
	     * @access private
	     *
	     * @param string $js
	     * @return string $js
	     */
	    private function clean_js( $js = '' ) {

		    $js = preg_replace( '~//<!\[CDATA\[\s*|\s*//\]\]>~', '', $js );
		    $js = preg_replace( '/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\)\/\/[^"\'].*))/', '', $js );    // Remove comments
		    $js = preg_replace( '/\s*([{}|:;,])\s+/', '$1', $js );                                                      // Remove whitespace
		    $js = preg_replace( '/\s\s+(.*)/', '$1', $js );                                                             // Remove starting whitespace

		    return trim( $js );
	    }
    }
}

new Tailor_Custom_JS;