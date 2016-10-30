<?php

/**
 * Tailor Image Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Image_Control' ) ) {

    /**
     * Tailor Image Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Image_Control extends Tailor_Control {

        /**
         * Enqueues control related scripts/styles.
         *
         * @since 1.0.0
         */
        public function enqueue() {
            wp_enqueue_media();
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

	        <% if ( '' == values[ media ] ) { %>
	        <p class="control__message"><?php _e( 'No image selected', 'tailor' ); ?></p>
	        <div class="actions">
		        <button type="button" class="button button--select"><?php _e( 'Select Image', 'tailor' ); ?></button>
	        </div>
	        <% } else { %>
	        <ul class="thumbnails is-loading">
		        <li class="thumbnail">
			        <img src="<?php echo tailor()->plugin_url() . 'assets/img/empty.png'; ?>"/>
		        </li>
	        </ul>
	        <div class="actions">
		        <button type="button" class="button button--remove"><?php _e( 'Remove Image', 'tailor' ); ?></button>
		        <button type="button" class="button button--change"><?php _e( 'Change Image', 'tailor' ); ?></button>
	        </div>
	        <% } %>

            <?php
        }
    }
}
