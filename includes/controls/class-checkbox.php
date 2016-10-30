<?php

/**
 * Tailor Checkbox Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Checkbox_Control' ) ) {

    /**
     * Tailor Checkbox Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Checkbox_Control extends Tailor_Control {

        /**
         * Choices array for this control.
         *
         * @since 1.0.0
         * @access public
         * @var array
         */
        public $choices = array();

        /**
         * Returns the parameters that will be passed to the client JavaScript via JSON.
         *
         * @since 1.0.0
         *
         * @return array The array to be exported to the client as JSON.
         */
        public function to_json() {
            $array = parent::to_json();
            $array['choices'] = $this->choices;
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

            <% _.each( choices, function( label, key ) { %>
            <label>
                <input type="checkbox" name="<%= media %>[<%= id %>]" value="<%= key %>" <%= checked( media, key ) %> />
                <?php echo "\n"; ?><span><%= label %></span></br>
            </label>
            <% } ) %>

            <?php
        }
    }
}
