<?php

/**
 * Sidebar class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Sidebar' ) ) {

    /**
     * Tailor Sidebar class.
     *
     * @since 1.0.0
     */
    class Tailor_Sidebar {

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {

            if ( ! tailor()->is_tailoring() ) {
                return;
            }
	        
	        $this->add_actions();
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {
	        
	        /**
	         * Fires before the sidebar is initialized.
	         * 
	         * @since 1.3.4
	         */
	        do_action( 'tailor_sidebar_init' );

	        add_filter( 'template_include', array( $this, 'render_page' ) );

	        // Print WordPress related stuff
	        add_action( 'tailor_sidebar_head', array( $this, 'enqueue_styles' ) );
	        add_action( 'tailor_sidebar_head', 'wp_print_styles' );
            add_action( 'tailor_sidebar_head', 'wp_print_head_scripts' );
            add_action( 'tailor_sidebar_head', 'print_admin_styles' );

            add_action( 'tailor_sidebar_head', 'print_head_scripts' );
	        add_action( 'tailor_sidebar_head', array( $this, 'enqueue_scripts' ) );

            add_action( 'tailor_sidebar_content', array( $this, 'render_markup' ) );

	        add_action( 'tailor_sidebar_footer', array( $this, 'print_js_templates' ) );
            add_action( 'tailor_sidebar_footer', 'wp_print_footer_scripts' );
            add_action( 'tailor_sidebar_footer', 'wp_auth_check_html' );
	        add_action( 'tailor_sidebar_footer', 'wp_print_media_templates' );
	        add_action( 'tailor_sidebar_footer', 'wp_underscore_playlist_templates' );

            add_action( 'wp_ajax_tailor_refresh_nonces', array( $this, 'refresh_nonces' ) );
        }
	    
	    /**
	     * Renders a blank page.
	     *
	     * @since 1.0.0
	     *
	     * @param string $template
	     * @return bool|string
	     */
        public function render_page( $template = '' ) {

	        if ( is_customize_preview() ) {
		        return $template;
	        }
	        
	        if ( ! tailor()->check_user_role() || ! tailor()->check_post() ) {
	            return $template;
	        }

            @header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) ); ?>

            <!DOCTYPE html>

            <html <?php language_attributes(); ?>>

                <head>
                    <base href="<?php echo home_url( '/' ); ?>" />
                    <meta http-equiv="Content-Type" content="<?php bloginfo( 'html_type'); ?>; charset="<?php echo get_option( 'blog_charset' ); ?>">

                    <?php
                    if ( wp_is_mobile() ) {
                        echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
                    }
                    echo '<title>' . sprintf( __( 'Tailoring: %s', 'tailor' ), get_the_title() ) . '</title>';

                    /**
                     * Fires after the document head of the Sidebar frame has been loaded.
                     *
                     * Can be used to print scripts or data in the head tag.
                     *
                     * @since 1.0.0
                     */
                    do_action( 'tailor_sidebar_head' ); ?>

                </head>

                <body class="<?php echo $this->get_body_class(); ?>" id="tailor">

                    <?php

                    /**
                     * Fires before the Sidebar content is loaded.
                     *
                     * @since 1.0.0
                     */
                    do_action( 'tailor_sidebar_content' );

                    /**
                     * Fires after the Sidebar content has been loaded.
                     *
                     * Can be used to print scripts or data before the closing body tag.
                     *
                     * @since 1.0.0
                     */
                    do_action( 'tailor_sidebar_footer' ); ?>

                </body>
            </html>

            <?php
            return false;
        }

	    /**
	     * Returns the appropriate body class on a Sidebar page load.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @return string
	     */
	    protected function get_body_class() {

		    $body_class = 'wp-core-ui tailor-ui js';

		    if ( wp_is_mobile() ) {
			    $body_class .= ' mobile';

			    if ( preg_match( '/iPad|iPod|iPhone/', $_SERVER['HTTP_USER_AGENT'] ) ) {
				    $body_class .= ' ios';
			    }
		    }

		    if ( is_rtl() ) {
			    $body_class .= ' rtl';
		    }

		    $body_class .= ' locale-' . sanitize_html_class( strtolower( str_replace( '_', '-', get_locale() ) ) );

		    return $body_class;
	    }

        /**
         * Renders the application markup on a Sidebar page load.
         *
         * @since 1.0.0
         */
	    public function render_markup() {
		    tailor_partial( 'sidebar/sidebar', 'frame' );
		    tailor_partial( 'sidebar/sidebar', 'tools' );
        }

        /**
         * Prints the Underscore template for the modal window.
         *
         * @since 1.0.0
         */
        function print_js_templates() {
	        tailor_partial( 'underscore/dialog', 'layout' );
	        tailor_partial( 'underscore/dialog', 'save-template' );
	        tailor_partial( 'underscore/dialog', 'import-template' );

	        tailor_partial( 'underscore/control', 'icon-select' );

	        tailor_partial( 'underscore/modal', 'layout' );
	        tailor_partial( 'underscore/modal', 'item' );
	        tailor_partial( 'underscore/modal', 'empty' );

	        tailor_partial( 'underscore/sidebar', 'layout' );
	        tailor_partial( 'underscore/sidebar', 'home' );
	        tailor_partial( 'underscore/sidebar', 'home-empty' );
        }
	    
        /**
         * Enqueues styles for the Tailor Sidebar.
         *
         * @since 1.0.0
         */
        public function enqueue_styles() {

	        if ( apply_filters( 'tailor_enable_sidebar_styles', true ) && ! did_action( 'tailor_enqueue_sidebar_styles' ) ) {
		        $handle = 'tailor-sidebar-styles';
		        $min = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

		        wp_register_style(
			        $handle,
			        tailor()->plugin_url() . "assets/css/sidebar{$min}.css",
			        array( 'wp-auth-check', 'dashicons', 'buttons' ),
			        tailor()->version()
		        );

		        wp_enqueue_style( $handle );

		        /**
		         * Fires after sidebar styles have been enqueued.
		         *
		         * @since 1.4.0
		         *
		         * @param string $handle
		         */
		        do_action( 'tailor_enqueue_sidebar_styles', $handle );
	        }
        }

        /**
         * Enqueues scripts for the Tailor Sidebar.
         *
         * @since 1.0.0
         */
        public function enqueue_scripts() {

	        if ( did_action( 'tailor_enqueue_sidebar_scripts' ) ) {
		        return;
	        }

	        wp_enqueue_media();

	        $handle = 'tailor-sidebar';
	        $extension = SCRIPT_DEBUG ? '.js' : '.min.js';

	        wp_enqueue_script(
		        $handle,
		        tailor()->plugin_url() . 'assets/js/dist/sidebar' . $extension,
		        array( 'wp-auth-check', 'media-views', 'media-editor', 'media-audiovideo', 'mce-view', 'modernizr', 'backbone-marionette' ),
		        tailor()->version(),
		        true
	        );

	        $allowed_urls = array( home_url( '/' ) );
	        $is_cross_domain = $this->is_cross_domain();
	        if ( is_ssl() && ! $is_cross_domain ) {
		        $allowed_urls[] = home_url( '/', 'https' );
	        }

	        $post_id = get_the_ID();
	        $post_type = get_post_type( $post_id );

	        wp_localize_script( $handle, 'post', array(
		        'id'                =>  $post_id,
		        'type'              =>  $post_type,
	        ) );

	        wp_localize_script( $handle, 'ajaxurl', esc_url_raw( admin_url( 'admin-ajax.php', 'relative' ) ) );

	        wp_localize_script( $handle, '_urls', array(
		        'ajax'              =>  esc_url_raw( admin_url( 'admin-ajax.php', 'relative' ) ),
		        'home'              =>  esc_url_raw( home_url( '/' ) ),
		        'edit'              =>  esc_url_raw( get_edit_post_link() ),
		        'view'              =>  esc_url_raw( get_permalink() ),
		        'allowed'           =>  array_map( 'esc_url_raw', $allowed_urls ),
		        'isCrossDomain'     =>  $is_cross_domain,
	        ) );

	        wp_localize_script( $handle, '_l10n', array(
		        'tailoring'         =>  __( 'Tailoring: ', 'tailor' ),
		        'select'            =>  __( 'Select', 'tailor' ),
		        'saveTemplate'      =>  __( 'Save template', 'tailor' ),
		        'saved'             =>  __( 'Saved', 'tailor' ),
		        'publish'           =>  'publish' == get_post_status( $post_id ) ? __( 'Save & Publish', 'tailor' ) : __( 'Save', 'tailor' ),
		        'import'            =>  __( 'Import', 'tailor' ),
		        'importTemplate'    =>  __( 'Import template', 'tailor' ),
		        'close'             =>  __( 'Close', 'tailor' ),
		        'error'             =>  __( 'An error occurred, please try again', 'tailor' ),
		        'expired'           =>  __( 'The session has expired', 'tailor' ),
		        'invalid'           =>  __( 'The request made was invalid', 'tailor' ),
		        'savedPage'         =>  sprintf( __( '%s saved successfully', 'tailor' ), ucfirst( $post_type ) ),
		        'restoreElements'   =>  __( 'History entry restored successfully', 'tailor' ),
		        'deletedElement'    =>  __( 'Element deleted successfully', 'tailor' ),
		        'savedTemplate'     =>  __( 'Template saved successfully', 'tailor' ),
		        'importedTemplate'  =>  __( 'Template imported successfully', 'tailor' ),
		        'addedTemplate'     =>  __( 'Template added successfully', 'tailor' ),
		        'deletedTemplate'   =>  __( 'Template deleted successfully', 'tailor' ),
		        'dragElement'       =>  __( 'To add an element, drag it into the desired position on the page', 'tailor' ),
		        'dragTemplate'      =>  __( 'To add a template, drag it into the desired position on the page', 'tailor' ),
		        'confirmPage'       =>  __( 'The changes you made will be lost if you navigate away from this page', 'tailor' ),
		        'confirmElement'    =>  __( 'You have made changes to this element. Would you like to save them?', 'tailor' ),

		        'edit'              =>  __( 'Edit', 'tailor' ),
		        'delete'            =>  __( 'Delete', 'tailor' ),
		        'preview'           =>  __( 'Preview', 'tailor' ),
		        'save'              =>  __( 'Save', 'tailor' ),
		        'initialized'       =>  __( 'Initialized', 'tailor' ),
		        'added'             =>  __( 'Added', 'tailor' ),
		        'deleted'           =>  __( 'Deleted', 'tailor' ),
		        'edited'            =>  __( 'Edited', 'tailor' ),
		        'copied'            =>  __( 'Copied', 'tailor' ),
		        'moved'             =>  __( 'Moved', 'tailor' ),
		        'resized'           =>  __( 'Resized', 'tailor' ),
		        'reordered'         =>  __( 'Reordered', 'tailor' ),
		        'template'          =>  __( 'Template', 'tailor' ),
	        ) );

	        wp_localize_script( $handle, '_nonces', $this->create_nonces() );

	        wp_localize_script( $handle, '_media_queries', tailor_get_registered_media_queries( ) );

	        /**
	         * Fires after sidebar scripts have been enqueued.
	         *
	         * @since 1.4.0
	         *
	         * @param string $handle
	         */
	        do_action( 'tailor_enqueue_sidebar_scripts', $handle );
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
         * Returns a refreshed set of nonces.
         *
         * @since 1.0.0
         */
        public function refresh_nonces() {
            if ( ! tailor()->is_tailoring() ) {
                wp_send_json_error();
            }

            $nonces = $this->create_nonces();
            wp_send_json_success( $nonces );
        }

        /**
         * Returns a set of nonces.
         *
         * @since 1.0.0
         * @access protected
         *
         * @return array
         */
        protected function create_nonces() {
	        $nonces = array(
		        'save'                  =>  wp_create_nonce( 'tailor-save' ),
		        'render'                =>  wp_create_nonce( 'tailor-render' ),
		        'unlockPost'            =>  wp_create_nonce( 'tailor-unlock-post' ),
		        'saveTemplate'          =>  wp_create_nonce( 'tailor-save-template' ),
		        'loadTemplate'          =>  wp_create_nonce( 'tailor-load-template' ),
		        'deleteTemplate'        =>  wp_create_nonce( 'tailor-delete-template' ),
		        'query'                 =>  wp_create_nonce( 'tailor-query' ),
	        );

            return $nonces;
        }
    }
}

new Tailor_Sidebar;