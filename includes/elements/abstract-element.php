<?php

/**
 * Tailor Element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Setting_Manager' ) && ! class_exists( 'Tailor_Element' ) ) {

    /**
     * Tailor Element class.
     *
     * @since 1.0.0
     */
    abstract class Tailor_Element extends Tailor_Setting_Manager {

        /**
         * The element tag.
         *
         * @since 1.0.0
         * @var string
         */
        public $tag = '';

        /**
         * The element label to show in UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $label = '';

        /**
         * The element description to show in the UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $description = '';

	    /**
	     * The element badge to show in the UI.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $badge = '';

        /**
         * The element icon to show in the UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $icon = 'dashicons-admin-post';

	    /**
	     * The element type.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $type = 'element';

	    /**
	     * The child item tag, if any.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $child;

	    /**
	     * True if the element content is dynamically-generated.
	     *
	     * Dynamically generated elements will be represented as shortcodes in the editor.
	     *
	     * @since 1.0.0
	     * @var bool
	     */
	    public $dynamic = false;

	    /**
	     * Callback to determine whether the element is active.
	     *
	     * @since 1.0.0
	     *
	     * @see Tailor_Element::active()
	     *
	     * @var callable Callback
	     */
	    public $active_callback;

        /**
         * Constructor.
         *
         * Any supplied $args override class property defaults.
         *
         * @since 1.0.0
         *
         * @param string $tag
         * @param array $args
         */
        public function __construct( $tag, $args = array() ) {

            $keys = array_keys( get_object_vars( $this ) );
            foreach ( $keys as $key ) {
                if ( isset( $args[ $key ] ) ) {
                    $this->$key = $args[ $key ];
                }
            }

	        $this->tag = $this->id = $tag;

	        add_action( 'wp_loaded', array( $this, 'add_actions' ) );
        }

	    /**
	     * Adds required action hooks.
	     *
	     * @since 1.0.0
	     * @access protected
	     */
	    public function add_actions() {

		    if ( ! $this->active() ) {
			    return;
		    }

		    $this->register_controls();
		    $this->prepare_controls();
	    }

	    /**
	     * Checks whether the element is active.
	     *
	     * @since 1.0.0
	     *
	     * @return bool
	     */
	    final public function active() {

		    if ( isset( $this->active_callback ) ) {
			    $active = call_user_func( $this->active_callback, $this );
		    }
		    else {
			    $active = true;
		    }

		    /**
		     * Filters the response of Tailor_Element::active().
		     *
		     * @since 1.0.0
		     *
		     * @param bool $active
		     * @param Tailor_Element $this
		     */
		    $active = apply_filters( 'tailor_element_active', $active, $this );

		    return $active;
	    }

        /**
         * Returns the properties that will be passed to the client JavaScript via JSON.
         *
         * @since 1.0.0
         *
         * @return array $properties
         */
        public function to_json() {

	        $properties = array( 'tag', 'label', 'description', 'badge', 'icon', 'type' );

	        $properties = wp_array_slice_assoc( (array) $this, $properties );

	        if ( isset( $this->child ) ) {
		        $properties['child'] = $this->child;
	        }

	        $properties['active'] = $this->active();

	        $properties['settings'] = $properties['sections'] = $properties['controls'] = array();

            foreach ( $this->settings() as $setting ) { /* @var $setting Tailor_Setting */
	            $properties['settings'][] = $setting->to_json();
            }

            foreach ( $this->sections() as $section ) {  /* @var $section Tailor_Section */
		        $properties['sections'][] = $section->to_json();
            }

            foreach ( $this->controls() as $control ) { /* @var $control Tailor_Control */
	            $properties['controls'][] = $control->to_json();
            }

            return $properties;
        }

	    /**
	     * Returns the unsanitized setting values.
	     *
	     * @since 1.0.0
         *
	     * @param $setting
	     * @param $default
	     * @return array
	     */
	    public function post_value( $setting, $default ) {
		    return array();
	    }

        /**
         * Returns a text shortcode representing the element.
         *
         * @since 1.0.0
         *
         * @param string $id
         * @param array $atts
         * @param string $content
         * @return string
         */
        public function generate_shortcode( $id, $atts = array(), $content = '' ) {
	        if ( ! empty( $id ) ) {
		        if ( array_key_exists( 'class', $atts ) ) {
			        $atts['class'] = trim( $atts['class'] . ' ' . " tailor-{$id}" );
		        }
		        else {
			        $atts['class'] = "tailor-{$id}";
		        }
	        }

            $shortcode = '[' . $this->tag;
            if ( '' !== ( $attributes = tailor_get_attributes( $atts ) ) ) {
                $shortcode .= " {$attributes}";
            }

            return $shortcode . ']' . $content . '[/' . $this->tag . ']';
        }

        /**
         * Registers element settings, sections and controls.
         *
         * @since 1.0.0
         * @access protected
         */
        protected abstract function register_controls();

	    /**
	     * Prepares panels, sections and controls.
	     *
	     * @since 1.0.0
	     */
	    public function prepare_controls() {

		    // Prepare panels
		    $panels = array();
		    uasort( $this->panels, array( $this, '_cmp_priority' ) );
		    foreach ( $this->panels as $panel ) {  /* @var $panel Tailor_Panel */

			    if ( $panel->check_capabilities() && apply_filters( 'tailor_enable_element_panel_' . $panel->id, true, $this ) ) {
				    $panels[ $panel->id ] = $panel;
			    }
		    }
		    $this->panels = $panels;

		    // Prepare sections
		    $sections = array();
		    uasort( $this->sections, array( $this, '_cmp_priority' ) );
		    foreach ( $this->sections as $section ) {  /* @var $section Tailor_Section */

			    if ( ! $section->check_capabilities() || ! apply_filters( 'tailor_enable_element_section_' . $section->id, true, $this ) ) {
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
		    uasort( $this->controls, array( $this, '_cmp_priority' ) );
		    foreach ( $this->controls as $control ) {  /* @var $control Tailor_Control */

			    if ( ! isset( $control->setting ) ) {
				    continue;
			    }

			    if ( ! $control->check_capabilities() || ! apply_filters( 'tailor_enable_element_control_' . $control->id, true, $this ) ) {
				    continue;
			    }

			    if ( ! isset( $this->sections[ $control->section ] ) || ! isset( $this->settings[ $control->setting->id ] ) ) {
				    continue;
			    }

			    $controls[ $control->id ] = $control;
		    }
		    $this->controls = $controls;
	    }
    }
}