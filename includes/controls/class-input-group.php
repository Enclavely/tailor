<?php

/**
 * Tailor Input Group Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Input_Group_Control' ) ) {

    /**
     * Tailor Input Group Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Input_Group_Control extends Tailor_Control {

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
            $array['choices'] = (array) $this->choices;
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

                <% _.each( choices, function( data, key ) { %>
                <li>

                    <% if ( label.unit ) { %>
                    <div class="control__input-group">
                        <input type="<%= data.type %>" name="<%= media %>[<%= key %>]" value="<%= values[ media ][ key ] %>" />
                        <span class="control__input-addon"><%= data.unit %></span>
                    </div>
                    <% } else { %>
                    <input type="<%= data.type %>" name="<%= media %>[<%= key %>]" value="<%= values[ media ][ key ] %>" />
                    <% } %>

                    <span class="control__input-label"><%= data.label %></span>
                </li>
                <% } ) %>

            </ul>
            
            <?php
        }
    }
}
