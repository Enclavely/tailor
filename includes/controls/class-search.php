<?php

/**
 * Tailor Search Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Search_Control' ) ) {

    /**
     * Tailor Search Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Search_Control extends Tailor_Control {

	    /**
	     * The resource type to search for.
	     *
	     * @since 1.0.0
	     * @access public
	     * @var array
	     */
	    public $resource = '';

	    /**
	     * Returns the parameters that will be passed to the client JavaScript via JSON.
	     *
	     * @since 1.0.0
	     *
	     * @return array The array to be exported to the client as JSON.
	     */
	    public function to_json() {
		    $array = parent::to_json();
		    $array['resource'] = esc_attr( $this->resource );
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

	        <% if ( '' == value ) { %>
	        <p class="control__message"><?php _e( 'Nothing selected', 'tailor' ); ?></p>
	        <% } else { %>
	        <input value="<%= value %>" />
	        <% } %>

	        <div class="actions">
		        <button type="button" class="button button--select"><?php _e( 'Select', 'tailor' ); ?> <%= resource %></button>
	        </div>

            <?php
        }
    }
}
