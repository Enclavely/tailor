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
	     * The post meta key used to store custom JavaScript.
	     *
	     * @since 1.4.0
	     *
	     * @var mixed|void
	     */
	    private $custom_js_key;
	    
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

	        /**
	         * Filter the meta key used to store custom JavaScript.
	         * 
	         * @since 1.4.0
	         */
	        $this->custom_js_key = (string) apply_filters( 'tailor_custom_js_key', '_tailor_page_js' );
	        
            $this->add_actions();
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {
            add_action( 'wp_head', array( $this, 'print_custom_js' ) );
        }

	    /**
	     * Returns custom JavaScript for the current post.
	     *
	     * @since 1.0.0
	     * @access private
	     *
	     * @return string $custom_js
	     */
	    private function get_custom_js() {
		    
		    $post_id = get_the_ID();
		    $custom_js = get_post_meta( $post_id, $this->custom_js_key, true );
		    if ( false == $custom_js ) {
			    $custom_js = '';
		    }

		    /**
		     * Filter the custom JavaScript for the page or post.
		     *
		     * @since 1.4.0
		     *
		     * @param string $custom_js
		     * @param int $post_id
		     */
		    $custom_js = apply_filters( 'tailor_get_custom_js', $custom_js, $post_id );

		    return $custom_js;
	    }
	    
	    /**
	     * Prints custom JavaScript for the post or page.
	     *
	     * @since 1.0.0
	     */
	    public function print_custom_js() {
		    
		    if ( did_action( 'tailor_print_custom_js' ) ) {
			    return;
		    }

		    /**
		     * Allow developers to prevent custom page JavaScript from being printed.
		     *
		     * @since 1.0.0
		     *
		     * @param bool
		     */
		    if ( ! apply_filters( 'tailor_enable_custom_js', true ) ) {
			    return;
		    }

		    $custom_page_js = $this->clean_js( $this->get_custom_js() );
		    if ( ! empty( $custom_page_js ) ) {
			    echo "<script id=\"tailor-custom-page-js\" type=\"text/javascript\">\n{$custom_page_js}\n</script>\n";
		    }

		    /**
		     * Fires after custom page JavaScript has been printed.
		     *
		     * @since 1.0.0
		     */
		    do_action( 'tailor_print_custom_js' );
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