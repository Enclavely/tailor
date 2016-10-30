<?php

/**
 * Setting class.
 *
 * @package Tailor
 * @subpackage Settings
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Setting' ) ) {

    /**
     * Tailor Setting class.
     *
     * @since 1.0.0
     * @see Tailor_Setting_Manager
     */
    class Tailor_Setting {

        /**
         * Tailor_Setting_Manager instance.
         *
         * @since 1.0.0
         * @access protected
         * @var Tailor_Setting_Manager
         */
        protected $manager;

        /**
         * Unique identifier.
         *
         * @since 1.0.0
         * @var string
         */
        public $id;

	    /**
	     * Setting type.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $type = 'post_meta';
	    
        /**
         * Default value for the setting.
         *
         * @since 1.0.0
         * @var string|array
         */
        public $default = null;

        /**
         * Capability required to edit this setting.
         *
         * @since 1.0.0
         * @access protected
         * @var string
         */
        protected $capability = '';

	    /**
	     * Method to use to update the DOM when the setting is updated.
	     *
	     * @since 1.5.0
	     * @access protected
	     * @var array
	     */
	    protected $refresh = array();

        /**
         * Theme feature support required to edit this setting.
         *
         * @since 1.0.0
         * @access protected
         * @var string|array
         */
        protected $theme_supports = '';

        /**
         * Sanitization callback for the setting's value.
         *
         * @since 1.0.0
         * @access protected
         * @var callback
         */
        protected $sanitize_callback = '';

        /**
         * Sanitization callback for the setting's value.
         *
         * @since 1.0.0
         * @access protected
         * @var callback
         */
        protected $sanitize_js_callback = '';
	    
        /**
         * Constructor.
         *
         * Any supplied $args override class property defaults.
         *
         * @since 1.0.0
         *
         * @param Tailor_Setting_Manager $manager Tailor Setting Manager instance.
         * @param string $id A specific ID for the setting.
         * @param array $args Setting arguments.
         */
        public function __construct( $manager, $id, $args = array() ) {
            $keys = array_keys( get_object_vars( $this ) );
            foreach ( $keys as $key ) {
                if ( isset( $args[ $key ] ) )
                    $this->$key = $args[ $key ];
            }

            $this->manager = $manager;
            $this->id = $id;

            if ( $this->sanitize_callback ) {
                add_filter( "tailor_sanitize_{$this->manager->id}_{$this->id}", $this->sanitize_callback, 10, 2 );
            }

            if ( $this->sanitize_js_callback ) {
                add_filter( "tailor_sanitize_js_{$this->manager->id}_{$this->id}", $this->sanitize_js_callback, 10, 2 );
            }
        }

        /**
         * Validates user capabilities whether the theme supports the setting.
         *
         * @since 1.0.0
         *
         * @return bool
         */
        final public function check_capabilities() {
            if ( $this->capability && ! call_user_func_array( 'current_user_can', (array) $this->capability ) ) {
                return false;
            }
            if ( $this->theme_supports && ! call_user_func_array( 'current_theme_supports', (array) $this->theme_supports ) ) {
                return false;
            }
            return true;
        }

	    /**
	     * Returns the parameters that will be passed to the client JavaScript via JSON.
	     *
	     * @since 1.0.0
	     *
	     * @return array The array to be exported to the client as JSON.
	     */
	    public function to_json() {
		    $setting = array();
		    $setting['id'] = $this->id;
		    $setting['default'] = $this->default;
		    $setting['refresh'] = $this->refresh;
		    $setting['value'] = $this->js_value();

		    return $setting;
	    }

	    /**
	     * Checks user capabilities and theme supports, and then saves the value of the setting.
	     *
	     * @since 1.0.0
	     *
	     * @return bool
	     */
	    public function save() {
		    
		    if ( ! $this->check_capabilities() ) {
			    return false;
		    }

		    $value = $this->post_value( $this->default );
		    
		    /**
		     * Fires before Tailor_Setting::save() method is called.
		     *
		     * @since 1.0.0
		     *
		     * @param Tailor_Setting $this {@see Tailor_Setting} instance.
		     */
		    do_action( 'tailor_save_' . $this->id, $this );

		    $this->update( $value );

		    return true;
	    }

	    /**
	     * Returns the sanitized $_POST value for the setting.
	     *
	     * @since 1.0.0
	     *
	     * @param $default
	     * @return mixed.
	     */
	    final public function post_value( $default = null ) {
		    return $this->manager->post_value( $this, $default );
	    }

	    /**
	     * Sanitizes the setting value.
	     *
	     * @since 1.0.0
	     *
	     * @param mixed $value
	     * @return mixed
	     */
	    public function sanitize( $value ) {

		    $value = wp_unslash( $value );

		    /**
		     * Filters a setting value in un-slashed form.
		     *
		     * @since 1.0.0
		     * @param mixed $value Value of the setting.
		     * @param Tailor_Setting $this {@see Tailor_Setting} instance.
		     */
		    return apply_filters( "tailor_sanitize_{$this->manager->id}_{$this->id}", $value, $this );
	    }

	    /**
	     * Saves the value of the setting, using the related API.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @param mixed $value
	     */
	    protected function update( $value ) {

		    switch( $this->type ) {

			    case 'theme_mod' :
				    set_theme_mod( $this->id, $value );
				    break;

			    case 'option' :
				    update_option( $this->id, $value );
				    break;

			    case 'post_meta' :
				    $post_id = wp_unslash( $_POST['post_id'] );
				    update_post_meta( $post_id, $this->id, $value );
				    break;

			    default :

				    /**
				     * Fires when the {@see Tailor_Setting::update()} method is called for a setting value not
				     * handled as a theme_mod, option or piece of post meta.
				     *
				     * @since 1.0.0
				     *
				     * @param mixed $value
				     * @param Tailor_Setting $this {@see Tailor_Setting} instance.
				     */
				    do_action( 'tailor_update_' . $this->type, $value, $this );
		    }
	    }

	    /**
	     * Returns the value of the setting.
	     *
	     * @since 1.0.0
	     *
	     * @return mixed.
	     */
	    public function value() {

		    switch ( $this->type ) {

			    case 'theme_mod' :
				    return get_theme_mod( $this->id, $this->default );
				    break;

			    case 'option' :
				    return get_option( $this->id, $this->default );
				    break;

			    case 'post_meta' :
				    $post_id = get_the_ID();
				    $value = get_post_meta( $post_id, $this->id, true );
				    return ( $value ) ? $value : $this->default;
				    break;

			    default :

				    /**
				     * Filter a setting value not handled as a theme_mod, option or piece of post meta.
				     *
				     * @since 1.0.0
				     *
				     * @param mixed $default
				     */
				    return apply_filters( 'tailor_value_' . $this->id, $this->default );
		    }
	    }

	    /**
	     * Sanitizes the setting's value for use in JavaScript.
	     *
	     * @since 1.0.0
	     *
	     * @return mixed The requested escaped value.
	     */
	    public function js_value() {

		    /**
		     * Filters the setting value for use in JavaScript.
		     *
		     * @since 1.0.0
		     *
		     * @param mixed $value The setting value.
		     * @param Tailor_Setting $this {@see Tailor_Setting} instance.
		     */
		    $value = apply_filters( "tailor_sanitize_js_{$this->id}", $this->value(), $this );

		    if ( is_string( $value ) ) {
			    return html_entity_decode( $value, ENT_QUOTES, 'UTF-8' );
		    }

		    return $value;
	    }
    }
}