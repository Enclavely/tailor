<?php

/**
 * Tailor Textarea Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Textarea_Control' ) ) {

    /**
     * Tailor Textarea Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Textarea_Control extends Tailor_Control {

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

            <textarea name="<%= media %>"><%= values[ media ] %></textarea>

            <?php
        }
    }
}
