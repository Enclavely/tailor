<?php

/**
 * Tailor Range Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Range_Control' ) ) {

    /**
     * Tailor Range Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Range_Control extends Tailor_Control {

        /**
         * Input attributes for this control.
         *
         * @since 1.0.0
         * @var array
         */
        public $input_attrs = array();

        /**
         * Returns the parameters that will be passed to the client JavaScript via JSON.
         *
         * @since 1.0.0
         *
         * @return array The array to be exported to the client as JSON.
         */
        public function to_json() {
            $array = parent::to_json();
            $array['input_attrs'] = $this->input_attrs;
            return $array;
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
        protected function render_template() { ?>

            <input type="range" value="<%= value %>" <?php $this->input_attrs(); ?>/>
            <input type="text" value="<%= value %>" />

            <?php
        }

        /**
         * Returns the custom attributes for the control's input element.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function input_attrs() {
            foreach ( $this->input_attrs as $attr => $value ) {
                echo $attr . '="' . esc_attr( $value ) . '" ';
            }
        }
    }
}
