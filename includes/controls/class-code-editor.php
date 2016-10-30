<?php

/**
 * Tailor Code Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Code_Control' ) ) {

    /**
     * Tailor Code Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Code_Control extends Tailor_Control {

	    /**
	     * The mode/language.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $mode = 'javascript';

	    /**
	     * Returns the parameters that will be passed to the client JavaScript via JSON.
	     *
	     * @since 1.0.0
	     *
	     * @return array The array to be exported to the client as JSON.
	     */
	    public function to_json() {
		    $array = parent::to_json();
		    $array['mode'] = $this->mode;
		    return $array;
	    }

        /**
         * Enqueues control related scripts/styles.
         *
         * @since 1.0.0
         */
        public function enqueue() {
            wp_enqueue_script(
                'codemirror',
                tailor()->plugin_url() . 'assets/js/dist/vendor/codemirror.min.js',
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

	        <textarea name="<%= media %>-<%= cid %>"><%= values[ media ] %></textarea>

            <?php
        }
    }
}
