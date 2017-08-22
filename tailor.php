<?php

/**
 * Plugin Name: Tailor
 * Plugin URI: http://www.gettailor.com
 * Description: Build beautiful page layouts quickly and easily using your favourite theme.
 * Version: 1.8.1
 * Author: The Tailor Team
 * Author URI:  http://www.gettailor.com
 * Text Domain: tailor
 *
 * @package Tailor
 */

use Leafo\ScssPhp\Compiler;

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor' ) ) {

    /**
     * Tailor class.
     *
     * @since 1.0.0
     */
    class Tailor {

        /**
         * Tailor instance.
         *
         * @since 1.0.0
         *
         * @access private
         * @var Tailor
         */
        private static $instance;

        /**
         * The plugin version number.
         *
         * @since 1.0.0
         *
         * @access private
         * @var string
         */
        private static $version;

	    /**
	     * The plugin basename.
	     *
	     * @since 1.0.0
	     *
	     * @access private
	     * @var string
	     */
	    private static $plugin_basename;

        /**
         * The plugin name.
         *
         * @since 1.0.0
         *
         * @access private
         * @var string
         */
        private static $plugin_name;

        /**
         * The plugin directory.
         *
         * @since 1.0.0
         *
         * @access private
         * @var string
         */
        private static $plugin_dir;

        /**
         * The plugin URL.
         *
         * @since 1.0.0
         *
         * @access private
         * @var string
         */
        private static $plugin_url;

        /**
         * Returns the Tailor instance.
         *
         * @since 1.0.0
         *
         * @return Tailor
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
		    $this->define_constants();
            $this->add_actions();
        }

	    /**
	     * Defines constants used by the plugin.
	     *
	     * @since 1.0.0
	     */
	    protected function define_constants() {

		    $plugin_data = get_file_data( __FILE__, array( 'Plugin Name', 'Version' ), 'tailor' );

		    self::$plugin_basename = plugin_basename( __FILE__ );
		    self::$plugin_name = array_shift( $plugin_data );
		    self::$version = array_shift( $plugin_data );
		    self::$plugin_dir = trailingslashit( plugin_dir_path( __FILE__ ) );
		    self::$plugin_url = trailingslashit( plugin_dir_url( __FILE__ ) );

		    /**
		     * Filters the settings ID.
		     *
		     * @since 1.0.0
		     *
		     * @param string
		     */
		    $setting_id = apply_filters( 'tailor_setting_id', 'tailor_settings' );

		    define( 'TAILOR_SETTING_ID', $setting_id );
	    }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {

            register_activation_hook( __FILE__, array( __CLASS__, 'activate' ) );
            register_deactivation_hook( __FILE__, array( __CLASS__, 'deactivate' ) );

            add_action( 'plugins_loaded', array( $this, 'init' ) );
	        add_action( 'admin_init', array( $this, 'admin_init' ) );
	        add_action( 'customize_save_after', array( $this, 'customize_save_after' ) );

            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_styles' ) );
            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_scripts' ), 99 );

	        add_action( 'wp_enqueue_scripts', array( $this, 'register_script_dependencies' ) );
            add_action( 'tailor_enqueue_sidebar_scripts', array( $this, 'register_script_dependencies' ) );

	        add_action( 'wp_ajax_tailor_save', array( $this, 'save' ) );
	        add_filter( 'heartbeat_received', array( $this, 'lock_post' ), 10, 2 );
	        add_action( 'wp_ajax_tailor_unlock_post', array( $this, 'unlock_post' ) );
        }

        /**
         * Initializes the plugin.
         *
         * @since 1.0.0
         */
        public function init() {
	        
            load_plugin_textdomain( 'tailor', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

	        add_filter( 'body_class', array( $this, 'body_class' ) );
	        add_filter( 'the_content', array( $this, 'remove_html_comments' ) );
	        add_filter( 'the_editor_content', array( $this, 'remove_html_comments' ) );

	        $this->load_directory( 'shortcodes' );
	        $this->load_directory( 'helpers' );
	        $this->load_directory( 'api' );

	        if ( is_admin() ) {
		        $this->load_directory( 'admin/helpers' );
		        $this->load_files( array(
			        'admin/class-compatibility',
			        'admin/class-revisions',
			        'admin/class-edit-page',
			        'admin/class-settings-page',
			        'class-icons',
			        'class-tinymce',
		        ) );
	        }

	        $this->load_directory( 'controls' );
	        $this->load_files( array(
		        'class-compatibility',
		        'abstract-manager',
		        'class-panels',
		        'class-models',
		        'class-elements',
		        'class-templates',
		        'class-sidebar',
		        'class-canvas',
		        'class-customizer',
		        'class-widgets',
		        'class-custom-css',
		        'class-custom-js',
		        'class-icons',
		        'class-tinymce',
	        ) );


	        /**
	         * Fires after all files have been loaded.
	         *
	         * @since 1.0.0
	         *
	         * @param Tailor
	         */
	        do_action( 'tailor_init', $this );
        }

	    /**
	     * Adds the Tailor class name to the body.
	     *
	     * @since 1.0.0
	     *
	     * @param array $classes
	     * @return array $classes
	     */
	    public function body_class( $classes ) {
		    $classes[] = 'tailor-ui';
		    return $classes;
	    }

	    /**
	     * Removes comments from HTML content.
	     *
	     * @since 1.8.0
	     *
	     * @param $content
	     *
	     * @return mixed
	     */
	    public function remove_html_comments( $content ) {

		    // No <p> around HTML comment
		    if ( strpos( $content, '<!-' ) !== false ) {
			    $content = preg_replace( '|<p>\s*<\!-|', '<!-', $content );

			    // Remove the tailing paragraph if this paragraph starts as a comment.
			    if ( 0 === strpos( $content, '<!-' ) ) {
				    $content = preg_replace( '|\-->\s*</p>|', '-->', $content );
			    }
		    }

		    return $content;
	    }

        /**
         * Records the editor styles registered by the theme for use in the front end.
         *
         * @since 1.0.0
         *
         * @global $editor_styles
         */
        public function admin_init() {
	        $this->apply_editor_styles();
        }

	    /**
	     * (Re)Compiles plugin SCSS using the new setting values.
	     *
	     * @since 1.8.0
	     */
	    public function customize_save_after() {
		    include_once tailor()->plugin_dir() . '/lib/scssphp/scss.inc.php';

		    $scss = new Compiler();
		    $scss->setImportPaths( tailor()->plugin_dir() . '/assets/scss' );

		    $section_width = get_theme_mod( 'tailor_section_width', '100%' );
		    $horizontal_spacing = get_theme_mod( 'tailor_column_spacing', '1rem' );
		    $vertical_spacing = get_theme_mod( 'tailor_element_spacing', '1rem' );
		    $mobile_breakpoint = intval( get_theme_mod( 'tailor_mobile_breakpoint', 320 ) );
		    $tablet_breakpoint = intval( get_theme_mod( 'tailor_tablet_breakpoint', 720 ) );

		    $scss->setVariables( array(
			    'global-class-prefix'               =>  'tailor-',
			    'global-section-width'              =>  $section_width,
			    'global-spacing-vertical'           =>  $vertical_spacing,
			    'global-spacing-horizontal'         =>  $horizontal_spacing,
			    'global-transition-duration'        =>  '150ms',
			    'global-font-family'                =>  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
			    'global-font-size'                  =>  '1em',
			    'global-line-height'                =>  1.5,
			    'global-primary-color'              =>  '#0f95ee',
			    'global-secondary-color'            =>  '#a0a5aa',
			    'global-text-color'                 =>  '#404040',
			    'global-background-color'           =>  '#fdfdfd',
			    'global-white-color'                =>  '#fff',
			    'global-success-color'              =>  '#7ad03a',
			    'global-warning-color'              =>  '#ffba00',
			    'global-error-color'                =>  '#dd3d36',
			    'global-border-width'               =>  '1px',
			    'global-border-style'               =>  'solid',
			    'global-border-color'               =>  '#efefef',
			    'global-border-radius'              =>  '2px',
			    'global-box-shadow'                 =>  '0 1px 1px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(0, 0, 0, 0.05)',
			    'text-color'                        =>  '#404040',
			    'background-color'                  =>  '#fdfdfd',
			    'border-color'                      =>  '#efefef',
			    'mobile'                            =>  "only screen and (max-width: {$mobile_breakpoint}px)",
			    'tablet'                            =>  "only screen and (min-width: " . ( $mobile_breakpoint + 1 ) . "px) and (max-width: {$tablet_breakpoint}px)",
			    'tablet-up'                         =>  'only screen and (min-width: ' . ( $mobile_breakpoint + 1 ) . 'px)',
			    'desktop'                           =>  'only screen and (min-width: ' . ( $tablet_breakpoint + 1 ) . 'px)',
		    ) );

		    // Generate the CSS
		    $scss->setFormatter( 'Leafo\ScssPhp\Formatter\Expanded' );
		    $css = $scss->compile( file_get_contents( tailor()->plugin_dir() . 'assets/scss/frontend.scss' ) );
		    $scss->setFormatter( 'Leafo\ScssPhp\Formatter\Compressed' );
		    $css_min = $scss->compile( file_get_contents( tailor()->plugin_dir() . 'assets/scss/frontend.scss' ) );

		    // Maybe create the directory
		    $wp_upload_dir = wp_upload_dir( null, false );
		    $tailor_css_dir = "{$wp_upload_dir['basedir']}/tailor/css";
		    if ( ! is_dir( $tailor_css_dir ) ) {
			    tailor_create_dir( $tailor_css_dir );
		    }

		    // Create the CSS files
		    tailor_create_file( "{$tailor_css_dir}/frontend.css", $css );
		    tailor_create_file( "{$tailor_css_dir}/frontend.min.css", $css_min );
	    }

	    /**
	     * Applies custom Tailor styles to the editor.
	     *
	     * @since 1.4.0
	     * @access protected
	     */
	    protected function apply_editor_styles() {
		    global $editor_styles;

		    /**
		     * Allow developers to prevent Tailor editor styles from being added.
		     *
		     * @since 1.4.0
		     *
		     * @param bool
		     */
		    if ( apply_filters( 'tailor_enable_editor_styles', true ) ) {
			    $extension = SCRIPT_DEBUG ? '.css' : '.min.css';
			    $editor_styles[] = $this->plugin_url() . 'assets/css/frontend' . $extension;
			    $editor_styles[] = $this->plugin_url() . 'assets/css/tinymce' . $extension;

			    /**
			     * Filter the editor styles.
			     *
			     * @since 1.7.5
			     */
			    $editor_styles = apply_filters( 'tailor_editor_styles', $editor_styles );
		    }

		    if ( ! empty( $editor_styles ) ) {
			    update_option( '_tailor_editor_styles', $editor_styles );
		    }
	    }

	    /**
	     * Registers script dependencies.
	     *
	     * @since 1.0.0
	     */
	    public function register_script_dependencies() {

		    wp_register_script(
			    'modernizr',
			    $this->plugin_url() . 'assets/js/dist/vendor/modernizr.min.js',
			    array(),
			    $this->version(),
			    true
		    );

		    if ( 'registered' != wp_script_is( 'imagesloaded' ) ) {
			    wp_register_script(
				    'imagesloaded',
				    $this->plugin_url() . 'assets/js/dist/vendor/imagesloaded.min.js',
				    array(),
				    $this->version(),
				    true
			    );
		    }

		    wp_register_script(
			    'sortable',
			    $this->plugin_url() . 'assets/js/dist/vendor/sortable.min.js',
			    array(),
			    $this->version(),
			    true
		    );

		    wp_register_script(
			    'slick-slider',
			    $this->plugin_url() . 'assets/js/dist/vendor/slick.min.js',
			    array( 'jquery' ),
			    $this->version(),
			    true
		    );

		    wp_register_script(
			    'shuffle',
			    $this->plugin_url() . 'assets/js/dist/vendor/shuffle.min.js',
			    array( 'jquery', 'modernizr', 'imagesloaded' ),
			    $this->version(),
			    true
		    );

		    wp_register_script(
			    'magnific-popup',
			    $this->plugin_url() . 'assets/js/dist/vendor/magnific-popup.min.js',
			    array( 'jquery' ),
			    $this->version(),
			    true
		    );

		    wp_register_script(
			    'backbone-marionette',
			    $this->plugin_url() . 'assets/js/dist/vendor/backbone.marionette' . ( SCRIPT_DEBUG ? '.js' : '.min.js' ),
			    array( 'backbone', 'jquery' ),
			    $this->version(),
			    true
		    );

		    // Google Maps script
		    $google_maps_api_key = trim( tailor_get_setting( 'google_maps_api_key', '' ) );
		    if ( ! empty( $google_maps_api_key ) ) {
			    wp_register_script(
				    'google-maps-api',
				    "https://maps.googleapis.com/maps/api/js?key={$google_maps_api_key}",
				    array()
			    );
		    }
	    }

        /**
         * Enqueues frontend styles.
         *
         * @since 1.0.0
         */
        public function enqueue_frontend_styles() {

	        /**
	         * Allow developers to prevent Tailor frontend styles from being enqueued.
	         *
	         * @since 1.4.0
	         *
	         * @param bool
	         */
	        if ( is_singular() && apply_filters( 'tailor_enable_frontend_styles', true ) ) {

		        $wp_upload_dir = wp_upload_dir( null, false );

		        // Enqueue frontend styles
		        $file_name = 'frontend' . ( SCRIPT_DEBUG ? '.css' : '.min.css' );
		        $stylesheet_path = @file_exists( "{$wp_upload_dir['basedir']}/tailor/css/{$file_name}" ) ? "{$wp_upload_dir['baseurl']}/tailor/css/{$file_name}" : $this->plugin_url() . "assets/css/{$file_name}";
		        
		        wp_enqueue_style(
			        'tailor-styles',
			        $stylesheet_path,
			        array(),
			        $this->version()
		        );

		        /**
		         * Load our IE stylesheet:
		         * <!--[if IE]> ... <![endif]-->
		         */
		        wp_enqueue_style(
			        'tailor-styles-ie',
			        $this->plugin_url() . 'assets/css/ie' . ( SCRIPT_DEBUG ? '.css' : '.min.css' ),
			        array( 'tailor-styles' ),
			        $this->version()
		        );

		        wp_style_add_data( 'tailor-styles-ie', 'conditional', 'IE' );
	        }
        }

	    /**
	     * Enqueues frontend scripts.
	     *
	     * @since 1.0.0
	     */
	    public function enqueue_frontend_scripts() {

		    /**
		     * Allow developers to prevent Tailor frontend scripts from being enqueued.
		     *
		     * @since 1.4.0
		     *
		     * @param bool
		     */
		    if ( apply_filters( 'tailor_enable_frontend_scripts', true ) ) {

				// Enqueue script dependencies
			    wp_enqueue_script( 'slick-slider' );
			    wp_enqueue_script( 'shuffle' );
			    wp_enqueue_script( 'magnific-popup' );
			    wp_enqueue_script( 'google-maps-api' );

			    if ( $this->is_canvas() ) {
				    return;
			    }

			    wp_enqueue_script(
				    'tailor-frontend',
				    $this->plugin_url() . 'assets/js/dist/frontend' . ( SCRIPT_DEBUG ? '.js' : '.min.js' ),
				    array( 'jquery', 'underscore', 'imagesloaded' ),
				    $this->version()
			    );
		    }
	    }

	    /**
	     * Locks the post when Tailoring using the Heartbeat API.
	     *
	     * @since 1.0.0
	     *
	     * @param array $response
	     * @param array $data
	     * @return array $response
	     */
	    public function lock_post( $response, $data ) {
		    if ( isset( $data['tailor_post_id'] ) && $post = get_post( $data['tailor_post_id'] ) ) {
			    $response['current_lock'] = wp_set_post_lock( $post->ID );
		    }
		    return $response;
	    }

	    /**
	     * Unlocks the post when no longer Tailoring.
	     *
	     * @since 1.0.0
	     */
	    public function unlock_post() {

		    check_ajax_referer( 'tailor-unlock-post', 'nonce' );

		    $post_id = (int) $_POST['post_id'];
		    if ( ! $post = get_post( $post_id ) ) {
			    wp_send_json_error();
		    }

		    if ( ! current_user_can( 'edit_post', $post->ID ) ) {
			    wp_send_json_error();
		    }

		    if ( ! $lock = get_post_meta( $post->ID, '_edit_lock', true ) ) {
			    wp_send_json_error();
		    }

		    $active_lock = get_post_meta( $post->ID, '_edit_lock', true );
		    $active_lock = array_map( 'absint', explode( ':', $active_lock ) );
		    if ( $active_lock[1] != get_current_user_id() ) {
			    wp_send_json_error();
		    }

		    /**
		     * Filter the post lock window duration.
		     *
		     * @since 1.0.0
		     *
		     * @param int $interval The interval in seconds the post lock duration should last, plus 5 seconds. Default 150.
		     */
		    $new_lock = ( time() - apply_filters( 'wp_check_post_lock_window', 150 ) + 5 ) . ':' . $active_lock[1];

		    $response = update_post_meta( $post_id, '_edit_lock', $new_lock, implode( ':', $active_lock ) );

		    wp_send_json_success( $response );
	    }

        /**
         * Saves the session data.
         *
         * @since 1.0.0
         */
        public function save() {

	        check_ajax_referer( 'tailor-save', 'nonce' );

	        if ( ! $post = get_post( $_POST['post_id'] ) ) {
		        wp_send_json_error();
	        }

	        /**
	         * Saves the session data.
	         *
	         * @since 1.0.0
	         *
	         * @param string $post_id
	         * @param Tailor $this
	         */
	        do_action( 'tailor_save', $post->ID, $this );

	        /**
	         * Fires after the session data has been saved.
	         *
	         * @since 1.0.0
	         *
	         * @param string $post_id
	         * @param Tailor $this
	         */
	        do_action( 'tailor_save_after', $post->ID, $this );

	        /**
	         * Filters the response data for a successful tailor_save AJAX request.
	         *
	         * This filter does not apply if there was a nonce or authentication failure.
	         *
	         * @since 1.0.0
	         *
	         * @param array $data
	         * @param string $post_id
	         * @param Tailor $this
	         */
	        $response = apply_filters( 'tailor_save_response', array(), $post->ID, $this );

	        wp_send_json_success( $response );
        }

        /**
         * Activates the plugin.
         *
         * @since 1.0.0
         * @static
         */
        static function activate() {

	        /**
	         * Fires when the plugin is activated.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_activated' );

            $previous_version = get_option( 'tailor_version', self::$version );

            if ( ! $previous_version ) {
                update_option( 'tailor_version', self::$version );
            }
            else {

                if ( version_compare( $previous_version, self::$version, '<' ) ) {

                    /**
                     * Fires after the plugin has been updated.
                     *
                     * @since 1.0.0
                     *
                     * @param string $previous_version
                     */
                    do_action( 'tailor_updated', $previous_version );

                    update_option( 'tailor_previous_version', $previous_version );
                }
            }
        }

        /**
         * Deactivates the plugin.
         *
         * @since 1.0.0
         * @static
         */
        static function deactivate() {

	        /**
	         * Fires when the plugin is deactivated.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_deactivated' );

	        // Remove the stored editor styles
	        delete_option( '_tailor_editor_styles' );
        }

        /**
         * Returns the version number of the plugin.
         *
         * @since 1.0.0
         *
         * @return string
         */
        public function version() {
            return self::$version;
        }

	    /**
	     * Returns the plugin basename.
	     *
	     * @since 1.0.0
	     *
	     * @return string
	     */
	    public function plugin_basename() {
		    return self::$plugin_basename;
	    }

        /**
         * Returns the plugin name.
         *
         * @since 1.0.0
         *
         * @return string
         */
        public function plugin_name() {
            return self::$plugin_name;
        }

        /**
         * Returns the plugin directory.
         *
         * @since 1.0.0
         *
         * @return string
         */
        public function plugin_dir() {

	        /**
	         * Filter the plugin directory.
	         *
	         * @since 1.0.0
	         *
	         * @param string $plugin_dir
	         */
	        $plugin_dir = apply_filters( 'tailor_plugin_dir', self::$plugin_dir );

            return $plugin_dir;
        }

        /**
         * Returns the plugin URL.
         *
         * @since 1.0.0
         *
         * @return string
         */
        public function plugin_url() {

	        /**
	         * Filter the plugin URL.
	         *
	         * @since 1.0.0
	         *
	         * @param string $plugin_url
	         */
	        $plugin_url = apply_filters( 'tailor_plugin_url', self::$plugin_url );

            return $plugin_url;
        }

	    /**
	     * Returns true if the current user has one of the roles required to use the plugin.
	     *
	     * @since 1.0.0
	     *
	     * @return bool
	     */
	    public function check_user_role() {

		    if ( ! is_user_logged_in() ) {
			    auth_redirect();
		    }
		    
		    // Check that the user can manage option and/or edit the post type
		    $user = wp_get_current_user();
		    $post_id = get_the_ID();
		    $post_type_object = get_post_type_object( get_post_type( $post_id ) );
		    if ( empty( $post_type_object ) ) {
			    return false;
		    }

		    $edit_post = $post_type_object->cap->edit_post;
		    if ( ! isset( $edit_post ) ) {
			    return false;
		    }

		    $allowable = current_user_can( 'manage_options' ) || current_user_can( $edit_post, $post_id );

		    // Check that the user doesn't have a restricted role type
		    $restricted_roles = array_keys( tailor_get_setting( 'restricted_roles', array() ) );
		    $allowable = $allowable && ( count( array_intersect( $restricted_roles, (array) $user->roles ) ) == 0 );

		    /**
		     * Filter the result of the user role check.
		     * 
		     * @since 1.3.1
		     * 
		     * @param bool $allowable
		     */
		    return apply_filters( 'tailor_check_user', $allowable );
	    }

        /**
         * Returns true if the current post type is supported by the plugin.
         *
         * @since 1.0.0
         *
         * @param string $post_id
         * @return bool
         */
        public function check_post( $post_id = '' ) {

	        if ( isset( $post_id->ID ) ) {
		        $post = $post_id;
	        }
	        else {
		        $post = $this->get_post( $post_id );
	        }

	        if ( ! $post ) {
		        return false;
	        }

	        if ( 'trash' == get_post_status( $post_id ) ) {
		        return false;
	        }

	        $allowable = true;

	        // Check if the post is configured to be the page for posts
	        if ( $post->ID == get_option( 'page_for_posts' ) ) {
		        $allowable = false;
	        }

	        // Check if the post is of an allowable type
	        $allowable_post_types = tailor_get_setting( 'post_types', array() );
	        if ( ! array_key_exists( $post->post_type, $allowable_post_types ) ) {
		        $allowable = false;
	        }

	        // Check if the post is locked
	        if ( $this->check_post_lock( $post->ID ) ) {
		        $allowable = false;
	        }

	        /**
	         * Filter the result of the post check.
	         *
	         * @since 1.3.0
	         *
	         * @param $allowable
	         * @param $post
	         */
	        $allowable = apply_filters( 'tailor_check_post', $allowable, $post );

	        return $allowable;
        }

	    /**
	     * Check to see if the post is currently being edited by another user.
	     *
	     * @since 1.0.0
	     *
	     * @param int $post_id ID of the post to check for editing
	     * @return integer False: not locked or locked by current user. Int: user ID of user with lock.
	     */
	    public function check_post_lock( $post_id ) {

		    if ( ! $post = get_post( $post_id ) ) {
			    return false;
		    }

		    if ( ! $lock = get_post_meta( $post->ID, '_edit_lock', true ) ) {
			    return false;
		    }

		    $lock = explode( ':', $lock );
		    $time = $lock[0];
		    $user = isset( $lock[1] ) ? $lock[1] : get_post_meta( $post->ID, '_edit_last', true );

		    $time_window = apply_filters( 'wp_check_post_lock_window', 150 );

		    if ( $time && $time > time() - $time_window && $user != get_current_user_id() ) {
			    return $user;
		    }

		    return false;
	    }

	    /**
	     * Returns the current post object, where possible.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @param string $post_id
	     * @return array|bool|null|WP_Post
	     */
	    protected function get_post( $post_id = '' ) {

		    if ( is_int( $post_id ) ) {
			    return get_post( $post_id );
		    }

		    if ( is_admin() && isset( $_GET['post'] ) ) {
			    return get_post( $_GET['post'] );
		    }

		    $post = get_queried_object();
		    if ( is_a( $post, 'WP_POST' ) ) {
			    return $post;
		    }

		    return false;
	    }

	    /**
	     * Returns the frontend edit URL.
	     *
	     * @since 1.0.0
	     *
	     * @param string $post_id
	     * @return array
	     */
	    public function get_edit_url( $post_id ) {

		    $query_args = array( 'tailor' => 1 );

		    /**
		     * Filters the edit URL query arguments.
		     *
		     * @since 1.0.0
		     *
		     * @param array $query_args
		     */
		    $query_args = apply_filters( 'tailor_edit_url_query_args', $query_args );

		    return add_query_arg( $query_args, get_permalink( $post_id ) );
	    }

	    /**
	     * Returns the frontend edit link.
	     *
	     * @since 1.0.0
	     *
	     * @param string $post_id
	     * @param string $post_type
	     * @return string
	     */
	    public function get_edit_link( $post_id = '', $post_type = '' ) {
		    $edit_label = sprintf( __( 'Tailor this %s', 'tailor' ), ucfirst( $post_type ) );
		    return '<a href="' . $this->get_edit_url( $post_id ) . '">' . $edit_label . '</a>';
	    }

	    /**
	     * Returns true if the given post has a Tailor layout.
	     *
	     * @since 1.5.7
	     *
	     * @param int|null $post_id
	     * @return bool
	     */
	    public function is_tailored( $post_id = null ) {
			$post = get_post( $post_id );
		    return $post && false != get_post_meta( $post->ID, '_tailor_layout', true );
	    }

	    /**
	     * Returns true if this is a Tailor page load.
	     *
	     * @since 1.0.0
	     *
	     * @return bool
	     */
	    public function is_tailoring() {
		    if ( $this->doing_AJAX() ) {
			    return ( isset( $_POST['tailor'] ) && 1 == $_POST['tailor'] );
		    }
		    return ( isset( $_GET['tailor'] ) && 1 == $_GET['tailor'] );
	    }

	    /**
	     * Returns true if this is a Tailor Canvas page load.
	     *
	     * @since 1.0.0
	     *
	     * @return bool
	     */
        public function is_canvas() {
	        if ( $this->doing_AJAX() ) {
		        return ( isset( $_POST['canvas'] ) && 1 == $_POST['canvas'] );
	        }
	        return ( isset( $_GET['canvas'] ) && 1 == $_GET['canvas'] );
        }

	    /**
	     * Returns true if this is a template preview.
	     *
	     * @since 1.0.0
	     *
	     * @return bool
	     */
	    public function is_template_preview() {
		    if ( $this->doing_AJAX() ) {
			    return ( isset( $_POST['template_preview'] ) && 1 == $_POST['template_preview'] );
		    }
		    return ( isset( $_GET['template_preview'] ) && 1 == $_GET['template_preview'] );
	    }

	    /**
	     * Returns true if this is an AJAX request.
	     *
	     * @since 1.0.0
	     * @access protected
	     */
	    protected function doing_AJAX() {
		    return defined( 'DOING_AJAX' ) && DOING_AJAX;
	    }

        /**
         * Loads all PHP files in a given directory.
         *
         * @since 1.0.0
         *
         * @param string $directory_name
         */
        public function load_directory( $directory_name ) {
            $path = trailingslashit( $this->plugin_dir() . 'includes/' . $directory_name );
	        $file_names = glob( $path . '*.php' );
            foreach ( $file_names as $filename ) {
                if ( file_exists( $filename ) ) {
                    require_once $filename;
                }
            }
        }

        /**
         * Loads specified PHP files from the plugin includes directory.
         *
         * @since 1.0.0
         *
         * @param array $file_names The names of the files to be loaded in the includes directory.
         */
        public function load_files( $file_names = array() ) {
            foreach ( $file_names as $file_name ) {
                if ( file_exists( $path = $this->plugin_dir() . 'includes/' . $file_name . '.php' ) ) {
                    require_once $path;
                }
            }
        }
    }
}

/**
 * Returns the Tailor application instance.
 *
 * @since 1.0.0
 *
 * @return Tailor
 */
function tailor() {
	return Tailor::get_instance();
}

/**
 * Initializes the Tailor application.
 *
 * @since 1.0.0
 */
tailor();