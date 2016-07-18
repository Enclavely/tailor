<?php

/**
 * Tailor Control abstract class
 *
 * @since 1.0.0
 *
 * @package Tailor
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Control' ) ) {

    /**
     * Tailor Control abstract class.
     *
     * @since 1.0.0
     */
    abstract class Tailor_Control {

        /**
         * Collection of control instances.
         *
         * @since 1.0.0
         * @static
         * @access protected
         * @var array
         */
        protected static $instances = array();

        /**
         * Incremented with each new class instantiation, then stored in $instance_number.
         *
         * Used when sorting two instances whose priorities are equal.
         *
         * @since 1.0.0
         * @static
         * @access protected
         * @var int
         */
        protected static $instance_count = 0;

        /**
         * Order in which this control instance was created in relation to other instances of the same type.
         *
         * @since 1.0.0
         * @var int
         */
        public $instance_number;

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
         * Label of the panel to show in UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $label = '';

        /**
         * Description to show in the UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $description = '';

        /**
         * The control type.
         *
         * @since 1.0.0
         * @var string
         */
        public $type = 'text';

        /**
         * Priority of the control.
         *
         * @since 1.0.0
         * @var integer
         */
        public $priority = 10;

        /**
         * The setting for the control.
         *
         * @since 1.0.0
         * @var Tailor_Setting
         */
        public $setting;

        /**
         * The section for the control.
         *
         * @since 1.0.0
         * @var Tailor_Section
         */
        public $section;

	    /**
	     * The dependency settings for the control.
	     *
	     * @since 1.0.0
	     * @var array
	     */
	    public $dependencies = array();

        /**
         * Constructor.
         *
         * Any supplied $args override class property defaults.
         *
         * @since 1.0.0
         *
         * @param Tailor_Setting_Manager $manager Tailor Setting Manager instance.
         * @param string $id A specific ID for the control.
         * @param array $args Control arguments.
         */
        public function __construct( $manager, $id, $args = array() ) {
            $keys = array_keys( get_object_vars( $this ) );
            foreach ( $keys as $key ) {
                if ( isset( $args[ $key ] ) ) {
                    $this->$key = $args[ $key ];
                }
            }

            $this->manager = $manager;
            self::$instances[ $this->type ][] = $this;
            $this->instance_number = count( self::$instances[ $this->type ] );
            $this->id = $id;

            if ( empty( $args['setting'] ) ) {
                $this->setting = $this->manager->get_setting( $id );
            }
            else {
                $this->setting = $this->manager->get_setting( $args['setting'] );
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

             if ( 1 === $this->instance_number ) {
                 add_action( 'tailor_sidebar_head', array( $this, 'enqueue' ), -1 );
                 add_action( 'tailor_sidebar_footer', array( $this, 'print_template' ), -1 );

	             /**
	              * Allows developers to use controls in the administrative backend.
	              *
	              * @since 1.0.0
	              *
	              * @param bool
	              */
	             if ( true == apply_filters( 'tailor_admin_print_control_templates', false ) ) {
		             add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ), -1 );
		             add_action( 'admin_print_footer_scripts', array( $this, 'print_template' ), -1 );
	             }
            }
        }

        /**
         * Enqueues control related scripts/styles.
         *
         * @since 1.0.0
         */
        public function enqueue() {}

        /**
         * Returns the setting's value.
         *
         * @since 1.0.0
         *
         * @return mixed The requested setting's value, if the setting exists.
         */
        final public function value() {
            return $this->setting->post_value();
        }

        /**
         * Checks if the theme supports the control and that the current user has the required capabilities.
         *
         * @since 1.0.0
         *
         * @return bool
         */
        public function check_capabilities() {
	        if ( ! $this->setting || ! $this->setting->check_capabilities() ) {
		        return false;
	        }
            $section = $this->manager->get_section( $this->section );
            if ( isset( $section ) && ! $section->check_capabilities() ) {
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
            $array = wp_array_slice_assoc( (array) $this, array( 'id', 'label', 'description', 'type', 'section', 'dependencies' ) );
            $array['setting'] = $this->setting->id;
            return $array;
        }

        /**
         * Prints the Underscore (JS) template for this control.
         *
         * @since 1.0.0
         */
        public function print_template() {

	        $use_label = in_array( $this->type, array( 'select', 'switch', 'style', 'text', 'textarea' ) );

	        /**
	         * Filter the boolean value representing whether or not a label should be used in the control markup.
	         *
	         * @since 1.3.0
	         *
	         * @param bool $use_label
	         */
	        $use_label = apply_filters( 'tailor_control_use_label', $use_label, $this->type ); ?>

            <script type="text/html" id="tmpl-tailor-control-<?php echo $this->type; ?>">

	            <?php if ( $use_label ) { echo '<label>'; } ?>

		            <div class="control__header">

			            <% if ( label ) { %><div class="control__title"><%= label %><% } %>

				        <a class="button button-small js-default <% if ( 'undefined' == typeof showDefault || ! showDefault ) { %>is-hidden<% } %>">
		                    <?php _e( 'Default', 'tailor' ); ?>
		                </a>

				        <% if ( label ) { %></div><% } %>
			            <% if ( description ) { %><span class="control__description"><%= description %></span><% } %>

	                </div>

		            <div class="control__body">
			            <?php $this->render_template(); ?>
		            </div>

	            <?php if ( $use_label ) { echo '</label>'; } ?>

            </script>

            <?php
        }

        /**
         * Prints the Underscore (JS) template for this control.
         *
         * Class variables are available in the JS object provided by the to_json method.
         *
         * @since 1.0.0
         * @access protected
         *
         * @see Tailor_Control::to_json()
         * @see Tailor_Control::print_template()
         */
        protected abstract function render_template();

    }
}