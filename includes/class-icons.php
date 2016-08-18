<?php

/**
 * Icon Manager class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Icons' ) ) {

    /**
     * Tailor Icons class.
     *
     * @since 1.0.0
     */
    class Tailor_Icons {

	    /**
	     * The icon manager instance.
	     *
	     * @since 1.0.0
	     * @access private
	     * @var Tailor_Icons
	     */
	    private static $instance;

	    /**
	     * Returns a singleton instance of the icon manager.
	     *
	     * @since 1.0.0
	     *
	     * @return Tailor_Icons
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
	        add_action( 'tailor_enqueue_sidebar_styles', array( $this, 'enqueue_styles' ) );
	        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
	        add_action( 'mce_css', array( $this, 'add_mce_styles' ) );

	        add_action( 'tailor_enqueue_sidebar_scripts', array( $this, 'print_icon_data' ) );

	        add_action( 'wp_ajax_tailor_add_icon_kit', array( &$this , 'add_icon_kit' ) );
	        add_action( 'wp_ajax_tailor_delete_icon_kit', array( &$this , 'delete_icon_kit' ) );
        }

	    /**
	     * Enqueues the stylesheet for each active icon kit.
	     *
	     * @since 1.0.0
	     */
	    public function enqueue_styles() {
		    $icon_kits = $this->get_icon_kits();
		    $active_icon_kits = $this->get_active_icon_kits();

		    foreach ( $active_icon_kits as $icon_kit_id => $active ) {
			    if ( 'dashicons' == $icon_kit_id ) {
				    wp_enqueue_style( 'dashicons' );
			    }
			    else if ( array_key_exists( $icon_kit_id, $icon_kits ) ) {
				    wp_enqueue_style(
					    $icon_kits[ $icon_kit_id ]['name'],
					    $icon_kits[ $icon_kit_id ]['stylesheet'],
					    array(),
					    tailor()->version()
				    );
			    }
		    }
	    }

        /**
         * Enqueues the stylesheet for each active icon kit in the TinyMCE editor.
         *
         * @since 1.0.0
         *
         * @param string $stylesheets
         * @return string $stylesheets
         */
        public function add_mce_styles( $stylesheets ) {
	        $icon_kits = $this->get_icon_kits();
	        $active_icon_kits = $this->get_active_icon_kits();

	        foreach ( $active_icon_kits as $icon_kit_id => $active ) {
		        if ( array_key_exists( $icon_kit_id, $icon_kits ) && 'dashicons' != $icon_kit_id ) {
			        $stylesheets .= ',' . $icon_kits[ $icon_kit_id ]['stylesheet'];
		        }
	        }

            return $stylesheets;
        }

        /**
         * Adds a new icon pack.
         *
         * @since 1.0.0
         */
        public function add_icon_kit() {

	        check_ajax_referer( 'tailor-save-icon-kit', 'nonce' );

	        if ( ! isset( $_POST['id'] ) || ! isset( $_POST['name'] ) ) {
		        wp_send_json_error();
	        }

	        $field_name = preg_split( '/[[\]]{1,2}/', wp_unslash( $_POST['name'] ) );
	        if ( count( $field_name ) < 2 ) {
		        wp_send_json_error();
	        }

	        if ( false === ( $file_path = get_attached_file( $_POST['id'] ) ) ) {
		        wp_send_json_error( array(
			        'message'           =>  __( 'Icon kit file does not exist', 'tailor' )
		        ) );
	        }

	        // Check whether the icon kit is already in use
	        $file_name = basename( $file_path, ".zip" );
	        $existing_icon_kits = $this->get_icon_kits();
	        if ( array_key_exists( $file_name, $existing_icon_kits ) ) {
		        wp_send_json_error( array(
			        'message'           =>  __( 'Icon kit is already being used', 'tailor' )
		        ) );
	        }

            WP_Filesystem();

            $wp_upload_dir = tailor_upload_dir();
            $icon_dir = trailingslashit( $wp_upload_dir['basedir'] . '/tailor/icons/' . $file_name );
            $icon_uri = trailingslashit( $wp_upload_dir['baseurl'] . '/tailor/icons/' . $file_name );

	        // Decompress the icon kit
            $unzip = unzip_file( $file_path, $icon_dir );
	        if ( ! $unzip ) {
		        wp_send_json_error( array(
			        'message'           =>  __( 'Icon kit could not be unzipped', 'tailor' )
		        ) );
	        }

	        $stylesheet_path = $icon_dir . 'style.css';
	        $styles = file_get_contents( $stylesheet_path );

            // Validate the icon kit
	        if ( ! $styles || ! file_exists(  $icon_dir . 'selection.json' ) ) {
		        tailor_remove_dir( $icon_dir );
		        wp_send_json_error( array(
			        'message'           =>  __( 'Icon kit is invalid', 'tailor' )
		        ) );
	        }

            // Update the font URIs
            file_put_contents( $stylesheet_path, str_replace( "url('fonts/" , "url( '" . $icon_uri . 'fonts/' , $styles ) );

	        $icon_set = array();
	        $json = json_decode( file_get_contents( $icon_dir . 'selection.json' ) );
            $prefix = $json->preferences->fontPref->prefix;
	        foreach ( $json->icons as $icon ) {
		        $name = $icon->properties->name;
		        $icon_set[ $prefix . $name ] = ucfirst( $name );
	        }

	        // Clean up the icon kit files
	        $files = array( '.', '..', 'selection.json', 'style.css', 'fonts' );
	        $objects = scandir( $icon_dir );
	        if ( ! empty( $files ) ) {
		        foreach ( $objects as $object ) {
			        if ( ! in_array( $object, $files ) ) {
				        $path = $icon_dir . "/" . $object;
				        if ( filetype( $path ) == "dir" ) {
					        tailor_remove_dir( $path );
				        }
				        else {
					        unlink( $path );
				        }
			        }
		        }
	        }
	        reset( $objects );

	        $icon_kit = array(
		        'id'                =>  $file_name,
		        'name'              =>  preg_replace( '/[^a-zA-Z0-9]/', ' ', $json->metadata->name ),
		        'dir'               =>  $icon_dir,
		        'uri'               =>  $icon_uri,
		        'stylesheet'        =>  $icon_uri . 'style.css',
		        'icons'             =>  $icon_set,
		        'default'           =>  false,
	        );

	        $existing_icon_kits[ $file_name ] = $icon_kit;

	        update_option( '_tailor_icon_kits', $existing_icon_kits );

	        ob_start();

	        $args = array(
		        'name'              =>  $field_name[0] . "[{$field_name[1]}]",
		        'value'             =>  tailor_get_setting( $field_name[1] ),
		        'options'           =>  $this->get_icon_kits(),
	        );

	        tailor_partial( 'admin/field', 'icon', $args );

	        wp_send_json_success( ob_get_clean() );
        }

	    /**
	     * Returns an array containing the registered icon kits.
	     *
	     * @since 1.0.0
	     *
	     * @return array
	     */
	    public function get_icon_kits() {
		    $dashicons = include tailor()->plugin_dir() . 'includes/config/dashicons.php';
		    $icon_kits = get_option( '_tailor_icon_kits', array() );
		    $icon_kits['dashicons'] = $dashicons;

		    /**
		     * Filters the array of icon kits.
		     *
		     * @since 1.4.0
		     *
		     * @param array $icon_kits
		     */
		    $icon_kits = apply_filters( 'tailor_get_icon_kits', $icon_kits );

		    return $icon_kits;
	    }

	    /**
	     * Returns an array containing the active registered icon kits.
	     *
	     * @since 1.0.0
	     *
	     * @return array
	     */
	    public function get_active_icon_kits() {

		    $active_icon_kits = tailor_get_setting( 'icon_kits', array() );

		    /**
		     * Filter the array of active icon kits.
		     *
		     * @since 1.0.0
		     *
		     * @param array $icon_kits
		     */
		    $active_icon_kits = apply_filters( 'tailor_get_active_icon_kits', $active_icon_kits );

		    return $active_icon_kits;

	    }

        /**
         * Deletes an icon pack.
         *
         * @since 1.0.0
         */
        public function delete_icon_kit() {

	        check_ajax_referer( 'tailor-delete-icon-kit', 'nonce' );

	        if ( ! isset( $_POST['id'] ) || ! isset( $_POST['name'] ) ) {
		        wp_send_json_error();
	        }

	        $field_name = preg_split( '/[[\]]{1,2}/', wp_unslash( $_POST['name'] ) );
	        if ( count( $field_name ) < 2 ) {
		        wp_send_json_error();
	        }

	        $icon_kit_id = wp_unslash( $_POST['id'] );
	        $icon_kits = $this->get_icon_kits();
	        if ( ! array_key_exists( $icon_kit_id, $icon_kits ) ) {
		        wp_send_json_error( array(
			        'message'           =>  __( 'Icon kit file does not exist', 'tailor' )
		        ) );
	        }

	        $icon_dir = $icon_kits[ $icon_kit_id ]['dir'];
	        tailor_remove_dir( $icon_dir );
	        unset( $icon_kits[ $icon_kit_id ] );

	        update_option( '_tailor_icon_kits', $icon_kits );

	        ob_start();

	        $args = array(
		        'name'              =>  $field_name[0] . "[{$field_name[1]}]",
		        'value'             =>  tailor_get_setting( $field_name[1] ),
		        'options'           =>  $this->get_icon_kits(),
	        );

	        tailor_partial( 'admin/field', 'icon', $args );

            wp_send_json_success( ob_get_clean() );
        }
	    
	    /**
	     * Prints icon kit data.
	     *
	     * @since 1.0.0
	     */
	    public function print_icon_data() {
		    $icon_kits = $this->get_icon_kits();
		    $active_icon_kits = $this->get_active_icon_kits();

		    foreach ( $icon_kits as $id => $icon_kit ) {
			    if ( ! array_key_exists( $id, $active_icon_kits ) ) {
				    unset( $icon_kits[ $id ] );
			    }
		    }

		    wp_localize_script( 'tailor-sidebar', '_kits', $icon_kits );
	    }
    }
}

if ( ! function_exists( 'tailor_icons' ) ) {

	/**
	 * Returns the Tailor Icons instance.
	 *
	 * @since 1.0.0
	 *
	 * @return Tailor_Icons
	 */
	function tailor_icons() {
		return Tailor_Icons::get_instance();
	}
}

/**
 * Initializes the Tailor Icons module.
 *
 * @since 1.0.0
 */
tailor_icons();