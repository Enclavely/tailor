<?php

/**
 * Tailor Widget Form Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.6.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Widget_Form_Control' ) ) {

    /**
     * Tailor Widget Form Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Widget_Form_Control extends Tailor_Control {

	    public $widget_class_name;
	    public $widget_id_base;

        /**
         * Returns the parameters that will be passed to the client JavaScript via JSON.
         *
         * @since 1.6.0
         *
         * @return array The array to be exported to the client as JSON.
         */
        public function to_json() {
            $array = parent::to_json();
	        $array['widget_id_base'] = $this->widget_id_base;
	        $array['widget_class_name'] = $this->widget_class_name;
	        return $array;
        }

        /**
         * Prints the Underscore (JS) template for this control.
         *
         * Class variables are available in the JS object provided by the to_json method.
         *
         * @since 1.6.0
         * @access protected
         *
         * @see Tailor_Control::to_json()
         * @see Tailor_Control::print_template()
         */
        protected function render_template() {

	        global $wp_widget_factory;
	        if ( ! empty( $wp_widget_factory->widgets[ $this->widget_class_name ] ) ) {
		        $wp_widget_factory->widgets[ $this->widget_class_name ]->form( array() );
	        }
        }
    }
}
