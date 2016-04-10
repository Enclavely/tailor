<?php

/**
 * Canvas class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Canvas' ) ) {

    /**
     * Tailor Canvas class.
     *
     * @since 1.0.0
     */
    class Tailor_Canvas {

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {

            if ( ! tailor()->is_canvas() ) {
	            return;
            }

            // Hide the Admin Bar
	        define( 'IFRAME_REQUEST', true );

	        $this->add_actions();
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {
            add_action( 'wp_head', array( $this, 'canvas_head' ) );
	        add_filter( 'the_content', array( $this, 'canvas_content' ), -1 );
	        add_action( 'wp_footer', array( $this, 'canvas_footer' ) );

            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), 999999 );

            add_action( 'tailor_canvas_footer', array( $this, 'print_templates' ), 999 );
        }

	    /**
	     * Fires the tailor_canvas_head action.
	     *
	     * @since 1.0.0
	     */
	    public function canvas_head() {

		    /**
		     * Print scripts or data in the head tag on a Canvas page load.
		     *
		     * @since 1.0.0
		     */
		    do_action( 'tailor_canvas_head' );
	    }

	    /**
	     * Wraps the post content with the required Canvas HTML.
	     *
	     * @since 1.0.0
	     *
	     * @param string $content
	     * @return string
	     */
	    public function canvas_content( $content ) {

		    if ( did_action( 'tailor_canvas_content' ) ) {
			    return $content;
		    }

		    $content =  '<div id="canvas"></div>' .
		                '<div class="tools" id="tools">' .
		                    '<div class="guide-container" id="guide"></div>' .
		                    '<div class="select-container" id="select"></div>' .
		                '</div>';

		    /**
		     * Filters the post content on a Canvas page load.
		     *
		     * @since 1.0.0
		     *
		     * @param string $content
		     */
		    $content = apply_filters( 'tailor_canvas_content', $content );

		    /**
		     * Fires when the Canvas markup is added to the content.
		     *
		     * @since 1.0.0
		     */
		    do_action( 'tailor_canvas_content' );

		    return $content;
	    }

	    /**
	     * Fires the tailor_canvas_footer action.
	     *
	     * @since 1.0.0
	     */
	    public function canvas_footer() {

		    /**
		     * Print scripts or data before the closing body tag on a Canvas page load.
		     *
		     * @since 1.0.0
		     */
		    do_action( 'tailor_canvas_footer' );
	    }

        /**
         * Enqueues Canvas styles.
         *
         * @since 1.0.0
         */
        public function enqueue_styles() {

	        if ( did_action( 'tailor_enqueue_canvas_styles' ) ) {
		        return;
	        }

	        if ( apply_filters( 'tailor_enqueue_canvas_stylesheets', true ) ) {
		        $open_sans_font_url = '';
		        $extension = SCRIPT_DEBUG ? '.css' : '.min.css';

		        /**
		         * Translators: If there are characters in your language that are not supported
		         * by Open Sans, translate this to 'off'. Do not translate into your own language.
		         */
		        if ( 'off' !== _x( 'on', 'Open Sans font: on or off' ) ) {
			        $subsets = 'latin,latin-ext';

			        /**
			         * Translators: To add an additional Open Sans character subset specific to your language,
			         * translate this to 'greek', 'cyrillic' or 'vietnamese'. Do not translate into your own language.
			         */
			        $subset = _x( 'no-subset', 'Open Sans font: add new subset (greek, cyrillic, vietnamese)' );

			        if ( 'cyrillic' == $subset ) {
				        $subsets .= ',cyrillic,cyrillic-ext';
			        }
			        else if ( 'greek' == $subset ) {
				        $subsets .= ',greek,greek-ext';
			        }
			        else if ( 'vietnamese' == $subset ) {
				        $subsets .= ',vietnamese';
			        }

			        $open_sans_font_url = "//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&subset=$subsets";
		        }

		        wp_enqueue_style( 'open-sans', $open_sans_font_url );
		        wp_enqueue_style(
			        'tailor-canvas-styles',
			        tailor()->plugin_url() . 'assets/css/canvas' . $extension,
			        array(),
			        tailor()->version()
		        );
	        }

	        /**
	         * Fires after canvas styles have been enqueued.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_enqueue_canvas_styles' );
        }

        /**
         * Enqueues Canvas scripts.
         *
         * @since 1.0.0
         */
        public function enqueue_scripts() {

	        if ( did_action( 'tailor_canvas_enqueue_scripts' ) ) {
		        return;
	        }

	        $extension = SCRIPT_DEBUG ? '.js' : '.min.js';
	        $canvas_script_name = 'tailor-canvas';

	        wp_enqueue_script(
		        $canvas_script_name,
		        tailor()->plugin_url() . 'assets/js/dist/canvas' . $extension,
		        array( 'backbone-marionette', 'sortable', 'slick-slider' ),
		        tailor()->version(),
		        true
	        );

	        $allowed_urls = array( home_url( '/' ) );
	        $is_cross_domain = $this->is_cross_domain();
	        if ( is_ssl() && ! $is_cross_domain ) {
		        $allowed_urls[] = home_url( '/', 'https' );
	        }

	        wp_localize_script( $canvas_script_name, 'ajaxurl', esc_url_raw( admin_url( 'admin-ajax.php', 'relative' ) ) );

	        wp_localize_script( $canvas_script_name, '_urls', array(
		        'ajax'              =>  esc_url_raw( admin_url( 'admin-ajax.php', 'relative' ) ),
		        'home'              =>  esc_url_raw( home_url( '/' ) ),
		        'edit'              =>  esc_url_raw( get_edit_post_link() ),
		        'view'              =>  esc_url_raw( get_permalink() ),
		        'allowed'           =>  array_map( 'esc_url_raw', $allowed_urls ),
		        'isCrossDomain'     =>  $is_cross_domain,
	        ) );

	        wp_localize_script( $canvas_script_name, '_l10n', array(
		        'edit'              =>  __( 'Edit', tailor()->textdomain() ),
		        'delete'            =>  __( 'Delete', tailor()->textdomain() ),
		        'preview'           =>  __( 'Preview', tailor()->textdomain() ),
		        'save'              =>  __( 'Save', tailor()->textdomain() ),
		        'initialized'       =>  __( 'Initialized', tailor()->textdomain() ),
		        'added'             =>  __( 'Added', tailor()->textdomain() ),
		        'deleted'           =>  __( 'Deleted', tailor()->textdomain() ),
		        'edited'            =>  __( 'Edited', tailor()->textdomain() ),
		        'copied'            =>  __( 'Copied', tailor()->textdomain() ),
		        'moved'             =>  __( 'Moved', tailor()->textdomain() ),
		        'resized'           =>  __( 'Resized', tailor()->textdomain() ),
		        'reordered'         =>  __( 'Reordered', tailor()->textdomain() ),
		        'template'          =>  __( 'Template', tailor()->textdomain() ),
	        ) );

	        wp_localize_script( $canvas_script_name, '_nonces', $this->create_nonces() );
	        wp_localize_script( $canvas_script_name, '_media_queries', tailor_get_registered_media_queries() );

	        /**
	         * Fires after canvas scripts have been enqueued.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_canvas_enqueue_scripts' );
        }

	    /**
	     * Returns true if this is a cross domain site.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @return bool
	     */
	    protected function is_cross_domain() {
		    $admin_origin = parse_url( admin_url() );
		    $home_origin  = parse_url( home_url() );
		    return ( strtolower( $admin_origin[ 'host' ] ) != strtolower( $home_origin[ 'host' ] ) );
	    }

	    /**
	     * Refreshes nonces.
	     *
	     * @since 1.0.0
	     */
	    public function refresh_nonces() {

		    if ( ! tailor()->is_tailoring() ) {
			    wp_send_json_error();
		    }

		    $nonces = $this->create_nonces();

		    /**
		     * Filter nonces for a tailor_refresh_nonces AJAX request.
		     *
		     * @since 1.0.0
		     *
		     * @param array $nonces
		     * @param Tailor_Sidebar $manager
		     */
		    $nonces = apply_filters( 'tailor_refresh_nonce', $nonces, $this );

		    wp_send_json_success( $nonces );
	    }

	    /**
	     * Returns the set of nonces.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @return array
	     */
	    protected function create_nonces() {

		    $nonces = array(
			    'render'                =>  wp_create_nonce( 'tailor-render' ),
			    'reset'                 =>  wp_create_nonce( 'tailor-reset' ),
			    'loadTemplate'          =>  wp_create_nonce( 'tailor-load-template' ),
		    );

		    return $nonces;
	    }

	    /**
	     * Prints the Underscore templates required for the Canvas.
	     *
	     * @since 1.0.0
	     */
	    function print_templates() {
		    tailor_partial( 'underscore/canvas', 'tools' );
	    }
    }
}

new Tailor_Canvas;