<?php

/**
 * Tailor Select Multi Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Select_Multi_Control' ) ) {

    /**
     * Tailor Select Multi Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Select_Multi_Control extends Tailor_Control {

        /**
         * Choices array for this control.
         *
         * @since 1.0.0
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
         * Enqueues control related scripts/styles.
         *
         * @since 1.0.0
         */
        public function enqueue() {

			wp_enqueue_script(
                'select2',
                tailor()->plugin_url() . 'assets/js/dist/vendor/select2.min.js',
                array( 'jquery' ),
                tailor()->version(),
                true
            );

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

	        <select multiple name="<%= media %>">

		        <% _.each( choices, function( label, key ) { %>
		        <% if ( _.isObject( label ) ) { %>
		        <optgroup label="<%= key %>">
			        <% _.each( label, function( subLabel, subKey ) { %>
			        <option value="<%= subKey %>" <%= selected( media, subKey ) %>><%= subLabel %></option>
			        <% } ) %>
		        </optgroup>
		        <% } else { %>
		        <option value="<%= key %>" <%= selected( media, key ) %>><%= label %></option>
		        <% } %>
		        <% } ) %>

	        </select>

            <?php
        }
    }
}
