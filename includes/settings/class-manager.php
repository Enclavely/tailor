<?php

/**
 * Setting Manager class.
 *
 * @package Tailor
 * @subpackage Settings
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Setting_Manager' ) ) {

    /**
     * Tailor Setting Manager class.
     *
     * @since 1.0.0
     */
    abstract class Tailor_Setting_Manager {

	    /**
	     * Unique identifier.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $id;

        /**
         * The settings registered to this manager.
         *
         * @since 1.0.0
         * @access protected
         * @var array
         */
        protected $settings = array();

	    /**
	     * The panels registered to this manager.
	     *
	     * @since 1.0.0
	     * @access protected
	     * @var array
	     */
	    protected $panels = array();

        /**
         * The sections registered to this manager.
         *
         * @since 1.0.0
         * @access protected
         * @var array
         */
        protected $sections = array();

        /**
         * The controls registered to this manager.
         *
         * @since 1.0.0
         * @access protected
         * @var array
         */
        protected $controls = array();

	    /**
	     * Unsanitized setting values.
	     *
	     * @since 1.0.0
	     * @access protected
	     * @var array
	     */
	    protected $_post_values;

        /**
         * Returns the registered settings.
         *
         * @since 1.0.0
         * @access public
         * @return array
         */
        public function settings() {
            return $this->settings;
        }

	    /**
	     * Returns the registered panels.
	     *
	     * @since 1.0.0
	     * @access public
	     * @return array
	     */
	    public function panels() {
		    return $this->panels;
	    }

        /**
         * Returns the registered sections.
         *
         * @since 1.0.0
         * @access public
         * @return array
         */
        public function sections() {
            return $this->sections;
        }

        /**
         * Returns the registered controls.
         *
         * @since 1.0.0
         * @access public
         * @return array
         */
        public function controls() {
            return $this->controls;
        }

        /**
         * Returns a setting.
         *
         * @since 1.0.0
         *
         * @param string $id Setting ID.
         * @return Tailor_Setting|null The setting, if set.
         */
        public function get_setting( $id ) {
            if ( isset( $this->settings[ $id ] ) ) {
                return $this->settings[ $id ];
            }
	        return null;
        }

	    /**
	     * Returns a panel.
	     *
	     * @since 1.0.0
	     *
	     * @param string $id Panel ID.
	     * @return Tailor_Panel|null The panel, if set.
	     */
	    public function get_panel( $id ) {
		    if ( isset( $this->panels[ $id ] ) ) {
			    return $this->panels[ $id ];
		    }
		    return null;
	    }

        /**
         * Returns a section.
         *
         * @since 1.0.0
         *
         * @param string $id Section ID.
         * @return Tailor_Section|null The section, if set.
         */
        public function get_section( $id ) {
            if ( isset( $this->sections[ $id ] ) ) {
	            return $this->sections[ $id ];
            }
	        return null;
        }

        /**
         * Returns a control.
         *
         * @since 1.0.0
         *
         * @param string $id ID of the control.
         * @return Tailor_Control|null The control, if set.
         */
        public function get_control( $id ) {
            if ( isset( $this->controls[ $id ] ) ) {
	            return $this->controls[ $id ];
            }
	        return null;
        }

        /**
         * Adds a setting.
         *
         * @since 1.0.0
         *
         * @param Tailor_Setting|string $id Tailor_Setting object, or ID.
         * @param array $args Setting arguments
         * @return Tailor_Setting
         */
        public function add_setting( $id, $args = array() ) {
            if ( $id instanceof Tailor_Setting ) {
                $setting = $id;
            }
            else {
                $setting = new Tailor_Setting( $this, $id, $args );
            }
            $this->settings[ $setting->id ] = $setting;
	        return $setting;
        }

	    /**
	     * Adds a panel.
	     *
	     * @since 1.0.0
	     *
	     * @param string|Tailor_Panel $id
	     * @param array $args
	     * @return Tailor_Panel
	     */
	    public function add_panel( $id, $args = array() ) {
		    if ( $id instanceof Tailor_Panel ) {
			    $panel = $id;
		    } else {
			    $panel = new Tailor_Panel( $id, $args );
		    }
		    $this->panels[ $panel->id ] = $panel;
		    return $panel;
	    }

        /**
         * Adds a section.
         *
         * @since 1.0.0
         *
         * @access public
         * @param Tailor_Section|string $id Tailor_Section object, or Section ID.
         * @param array $args Section arguments.
         * @return Tailor_Section
         */
        public function add_section( $id, $args = array() ) {
            if ( $id instanceof Tailor_Section ) {
                $section = $id;
            }
            else {
                $section = new Tailor_Section( $this, $id, $args );
            }
            $this->sections[ $section->id ] = $section;
	        return $section;
        }

        /**
         * Add a control.
         *
         * @since 1.0.0
         *
         * @param Tailor_Control|string $id Control object, or ID.
         * @param array $args Control arguments; passed to Tailor_Control constructor.
         * @return Tailor_Control
         */
        public function add_control( $id, $args = array() ) {
            if ( $id instanceof Tailor_Control ) {
                $control = $id;
            }
            else {
                $type = str_replace( '-', '_', $args['type'] );
                $type = preg_replace_callback( "/_[a-z]?/", array( __CLASS__, 'capitalize_word' ), $type );
                $class_name = "Tailor_{$type}_Control";
                if ( class_exists( $class_name ) ) {
                    $control = new $class_name( $this, $id, $args );
                }
                else {
                    $control = new Tailor_Text_Control( $this, $id, $args );
                }
            }
            $this->controls[ $control->id ] = $control;
	        return $control;
        }

        /**
         * Capitalizes the first letter of each word in an array.
         *
         * @since 1.0.0
         * @static
         *
         * @param $matches array
         * @return array
         */
        static function capitalize_word( $matches ) {
            return ucfirst( $matches[0] );
        }

        /**
         * Removes a setting.
         *
         * @since 1.0.0
         *
         * @param string $id Setting ID.
         */
        public function remove_setting( $id ) {
            unset( $this->settings[ $id ] );
        }

	    /**
	     * Removes a panel.
	     *
	     * @since 1.0.0
	     *
	     * @param string $id
	     */
	    public function remove_panel( $id ) {
		    unset( $this->panels[ $id ] );
	    }

        /**
         * Removes a section.
         *
         * @since 1.0.0
         *
         * @param string $id Section ID.
         */
        public function remove_section( $id ) {
            unset( $this->sections[ $id ] );
        }

        /**
         * Remove a control.
         *
         * @since 1.0.0
         *
         * @param string $id ID of the control.
         */
        public function remove_control( $id ) {
            unset( $this->controls[ $id ] );
        }

	    /**
	     * Prepares panels, sections and controls.
	     *
	     * @since 1.0.0
	     */
	    abstract public function prepare_controls();

        /**
         * Compares two objects by priority, ensuring sort stability via instance_number.
         *
         * @since 1.0.0
         * @access protected
         *
         * @param Tailor_Panel|Tailor_Section|Tailor_Control $a Object A.
         * @param Tailor_Panel|Tailor_Section|Tailor_Control $b Object B.
         * @return int
         */
        protected function _cmp_priority( $a, $b ) {
            if ( $a->priority === $b->priority ) {
                return $a->instance_number - $a->instance_number;
            }
            else {
                return $a->priority - $b->priority;
            }
        }

	    /**
	     * Trigger the save() method on each setting.
	     *
	     * @since 1.0.0
	     */
	    public function save() {}

	    /**
	     * Fetches and sanitizes the $_POST value for the setting.
	     *
	     * @since 1.0.0
	     * @abstract
	     *
	     * @param Tailor_Setting $setting
	     * @param mixed $default
	     * @return array
	     */
        abstract public function post_value( $setting, $default );

    }
}
