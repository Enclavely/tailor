<?php

/**
 * Tailor Style Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Style_Control' ) ) {

    /**
     * Tailor Style Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Style_Control extends Tailor_Control {

        /**
         * Choices array for this control.
         *
         * @since 1.0.0
         *
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
            
            <ul class="control__input-group">

                <% _.each( choices, function( label, key ) { %>
                <li>
                    <input type="text" name="<%= media %>[<%= key %>]" value="<%= values[ media ][ key ] %>" />
                    <span class="control__input-label"><%= label %></span>
                </li>
                <% } ) %>

                <li>
                    <button class="button button-small js-link"><i class="dashicons"></i></button>
                </li>
            </ul>
            
            <?php
        }
    }
}
