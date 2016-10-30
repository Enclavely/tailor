<?php

/**
 * Sidebar Panels class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Panels' ) ) {

    /**
     * Tailor Panels class.
     *
     * @since 1.0.0
     */
    class Tailor_Panels extends Tailor_Setting_Manager {
	    
	    /**
	     * The panel manager instance.
	     *
	     * @since 1.4.1
	     * @access private
	     * @var Tailor_Panels
	     */
	    private static $instance;

	    /**
	     * Returns a singleton instance.
	     *
	     * @since 1.4.1
	     *
	     * @return Tailor_Panels
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
         */
        public function add_actions() {
            add_action( 'after_setup_theme', array( $this, 'load_panels' ) );
            add_action( 'wp', array( $this, 'register_panels' ) );
            add_action( 'tailor_register_panels', array( $this, 'prepare_controls' ), 99 );
            add_action( 'tailor_enqueue_sidebar_scripts', array( $this, 'print_panel_data' ) );

	        add_action( 'tailor_save_post_content', array( $this, 'save_settings' ) );
	        add_action( 'tailor_save_settings', array( $this, 'update_post_title' ) );
        }

        /**
         * Loads panels during initialization.
         *
         * @since 1.0.0
         */
        public function load_panels() {

            tailor()->load_directory( 'settings' );
	        
	        /**
	         * Fires after panels, sections, settings and controls have been loaded.
	         *
	         * @since 1.0.0
	         *
	         * @param Tailor_Panels $this
	         */
	        do_action( 'tailor_load_panels', $this );
        }

        /**
         * Registers the default set of panels, sections and controls.
         *
         * @since 1.0.0
         */
        public function register_panels() {

	        $this->add_panel( new Tailor_Elements_Panel( 'library', array(
		        'title'                 =>  __( 'Elements', 'tailor' ),
		        'description'           =>  __( 'Elements are the building blocks of your page.  Drag one from the list below to the desired position on the page to get started.', 'tailor' ),
		        'priority'              =>  10,
	        ) ) );

	        $this->add_panel( new Tailor_Templates_Panel( 'templates', array(
	            'title'                 =>  __( 'Templates', 'tailor' ),
	            'description'           =>  __( 'Templates allow you to save customized elements, or the entire layout, for future use.', 'tailor' ),
	            'priority'              =>  20,
	        ) ) );

	        $this->add_panel( 'settings', array(
		        'title'                 =>  __( 'Settings', 'tailor' ),
		        'priority'              =>  30,
	        ) );

	        $this->add_panel( new Tailor_History_Panel( 'history', array(
		        'title'                 =>  __( 'History', 'tailor' ),
		        'priority'              =>  40,
	        ) ) );

	        $this->add_section( 'general', array(
		        'title'                 =>  __( 'General', 'tailor' ),
		        'priority'              =>  10,
		        'panel'                 =>  'settings',
	        ) );

	        $this->add_setting( '_post_title', array(
		        'default'               =>  get_the_title(),
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( '_post_title', array(
		        'label'                 =>  __( 'Page title', 'tailor' ),
		        'type'                  =>  'text',
		        'priority'              =>  10,
		        'section'               =>  'general',
	        ) );

	        $this->add_setting( '_tailor_page_css', array(
		        'default'               =>  "/**\n * Custom CSS\n */\n",
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( '_tailor_page_css', array(
		        'label'                 =>  __( 'Custom CSS', 'tailor' ),
		        'description'           =>  __( 'Enter custom declarations and rules in the editor below to see them applied to the page in real-time.', 'tailor' ),
		        'type'                  =>  'code',
		        'mode'                  =>  'css',
		        'priority'              =>  20,
		        'section'               =>  'general',
	        ) );

	        $this->add_setting( '_tailor_page_js', array(
		        'default'               =>  "// Custom JavaScript\n",
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( '_tailor_page_js', array(
		        'label'                 =>  __( 'Custom JavaScript', 'tailor' ),
		        'description'           =>  __( 'Enter custom JavaScript in the editor below.  Saved code will be run when the page is reloaded.', 'tailor' ),
		        'type'                  =>  'code',
		        'mode'                  =>  'javascript',
		        'priority'              =>  30,
		        'section'               =>  'general',
	        ) );

	        $this->add_section( 'layout', array(
		        'title'                 =>  __( 'Layout', 'tailor' ),
		        'description'           =>  __( 'The settings on this page override those specified in the Customizer.', 'tailor' ),
		        'priority'              =>  20,
		        'panel'                 =>  'settings',
	        ) );

	        $this->add_setting( '_tailor_section_width', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( '_tailor_section_width', array(
		        'label'                 =>  __( 'Section width', 'tailor' ),
		        'description'           =>  __( 'The maximum width for sections.', 'tailor' ),
		        'type'                  =>  'text',
		        'priority'              =>  10,
		        'section'               =>  'layout',
	        ) );

	        $this->add_setting( '_tailor_column_spacing', array(
		        'sanitize_callback'     =>  'tailor_sanitize_text',
	        ) );
	        $this->add_control( '_tailor_column_spacing', array(
		        'label'                 =>  __( 'Column spacing', 'tailor' ),
		        'description'           =>  __( 'The amount of horizontal space to display between columns.', 'tailor' ),
		        'type'                  =>  'text',
		        'priority'              =>  20,
		        'section'               =>  'layout',
	        ) );

            $this->add_setting( '_tailor_element_spacing', array(
                'sanitize_callback'     =>  'tailor_sanitize_text',
            ) );
            $this->add_control( '_tailor_element_spacing', array(
                'label'                 =>  __( 'Element spacing', 'tailor' ),
                'description'           =>  __( 'The amount of vertical space to display between elements.', 'tailor' ),
                'type'                  =>  'text',
                'priority'              =>  30,
                'section'               =>  'layout',
            ) );
	        
	        /**
	         * Fires after panels, sections, settings and controls have been registered.
	         *
	         * @since 1.0.0
	         *
	         * @param Tailor_Panels $this
	         */
	        do_action( 'tailor_register_panels', $this );
        }

	    /**
	     * Prepares panels, sections and controls.
	     *
	     * @since 1.0.0
	     */
	    public function prepare_controls() {

		    // Prepare panels
		    $panels = array();
            $this->panels = array_reverse( $this->panels );
		    uasort( $this->panels, array( $this, '_cmp_priority' ) );
		    foreach ( $this->panels as $panel ) {  /* @var $panel Tailor_Panel */

			    if ( $panel->check_capabilities() && apply_filters( 'tailor_enable_sidebar_panel_' . $panel->id, true, $this ) ) {
				    $panels[ $panel->id ] = $panel;
			    }
		    }
		    $this->panels = $panels;

		    // Prepare sections
		    $sections = array();
            $this->sections = array_reverse( $this->sections );
		    uasort( $this->sections, array( $this, '_cmp_priority' ) );
		    foreach ( $this->sections as $section ) {  /* @var $section Tailor_Section */

			    if ( ! $section->check_capabilities() && apply_filters( 'tailor_enable_sidebar_section_' . $section->id, true, $this ) ) {
				    continue;
			    }
			    if ( $section->panel && ! isset( $this->panels[ $section->panel ] ) ) {
				    continue;
			    }
			    $sections[ $section->id ] = $section;
		    }
		    $this->sections = $sections;

		    // Prepare controls
		    $controls = array();
            $this->controls = array_reverse( $this->controls );
		    uasort( $this->controls, array( $this, '_cmp_priority' ) );
		    foreach ( $this->controls as $control ) {  /* @var $control Tailor_Control */

			    if ( ! apply_filters( 'tailor_enable_sidebar_control_' . $control->id, true, $this ) ) {
				    continue;
			    }

			    if ( ! isset( $control->setting ) ) {
				    continue;
			    }

			    if ( ! isset( $this->sections[ $control->section ] ) || ! isset( $this->settings[ $control->setting->id ] ) || ! $control->check_capabilities() ) {
				    continue;
			    }
			    $controls[ $control->id ] = $control;
		    }
		    $this->controls = $controls;
	    }

	    /**
	     * Prints the panel, section, control and setting data to the page.
	     *
	     * @since 1.0.0
	     */
	    public function print_panel_data() {

		    $settings = $panels = $sections = $controls = array();

		    foreach ( $this->panels() as $panel ) { /* @var $panel Tailor_Panel */
			    $panels[] = $panel->to_json();
		    }

		    foreach ( $this->sections() as $section ) { /* @var $section Tailor_Section */
			    $sections[] = $section->to_json();
		    }

		    foreach ( $this->controls() as $control ) {  /* @var $control Tailor_Control */
			    $controls[] = $control->to_json();
		    }

		    foreach ( $this->settings() as $setting ) { /* @var $setting Tailor_Setting */
			    $settings[] = $setting->to_json();
		    }

		    wp_localize_script( 'tailor-sidebar', '_panels', $panels );
		    wp_localize_script( 'tailor-sidebar', '_sections', $sections );
		    wp_localize_script( 'tailor-sidebar', '_controls', $controls );
		    wp_localize_script( 'tailor-sidebar', '_settings', $settings );
	    }

	    /**
	     * Returns the unsanitized setting values.
	     *
	     * @since 1.0.0
	     *
	     * @param Tailor_Setting $setting
	     * @param mixed $default
	     * @return mixed
	     */
	    public function post_value( $setting, $default ) {

		    $post_values = $this->unsanitized_post_values();

		    if ( array_key_exists( $setting->id, $post_values ) ) {
			    return $setting->sanitize( $post_values[ $setting->id ] );
		    }
		    else {
			    return $default;
		    }
	    }

	    /**
	     * Returns the saved settings for a given page/post.
	     *
	     * @since 1.0.0
	     *
	     * @return array
	     */
	    public function unsanitized_post_values() {

		    if ( ! isset( $this->_post_values ) ) {
			    if ( isset( $_POST['settings'] ) ) {
				    $settings = json_decode( wp_unslash( $_POST['settings'] ), true );
				    foreach ( $settings as $setting ) {
					    $this->_post_values[ $setting['id'] ] = $setting['value'];
				    }
			    }

			    if ( empty( $this->_post_values ) ) {
				    $this->_post_values = array();
			    }
		    }

		    if ( empty( $this->_post_values ) ) {
			    return array();
		    }
		    else {
			    return $this->_post_values;
		    }
	    }

	    /**
	     * Saves the values of all registered settings.
	     *
	     * @since 1.0.0
	     *
	     * @param $post_id
	     */
	    public function save_settings( $post_id ) {

		    $this->load_panels();
		    $this->register_panels();

		    $settings = $this->settings();
		    foreach ( $settings as $setting ) { /* @var $setting Tailor_Setting */
			    $setting->save();
		    }

		    /**
		     * Fires after the settings have been saved.
		     *
		     * @since 1.0.0
		     *
		     * @param string $post_id
		     * @param array $settings
		     */
		    do_action( 'tailor_save_settings', $post_id, $settings );
	    }

	    /**
	     * Updates the post/page title after settings are saved.
	     *
	     * @since 1.0.0
	     *
	     * @param $post_id
	     */
	    public function update_post_title( $post_id ) {

		    $saved_title = get_post_meta( $post_id, '_post_title', true );

		    if ( false != $saved_title ) {
			    wp_update_post( array(
				    'ID'                =>  $post_id,
				    'post_title'        =>  $saved_title
			    ) );
		    }
	    }
    }
}


if ( ! function_exists( 'tailor_panels' ) ) {

	/**
	 * Returns a singleton instance of the panel manager.
	 *
	 * @since 1.4.1
	 *
	 * @return Tailor_Panels
	 */
	function tailor_panels() {
		return Tailor_Panels::get_instance();
	}
}

tailor_panels();