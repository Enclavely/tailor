<?php

/**
 * Tailor Switch Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Switch_Control' ) ) {

    /**
     * Tailor Switch Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Switch_Control extends Tailor_Control {

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

            <input id="<%= id %>-<%= media %>" name="<%= media %>" type="checkbox" value="1" <%= checked( media ) %> />
            <label for="<%= id %>-<%= media %>" class="switch"></label>

            <?php
        }
    }
}
