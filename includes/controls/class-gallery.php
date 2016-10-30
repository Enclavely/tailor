<?php

/**
 * Tailor Gallery Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Gallery_Control' ) ) {

    /**
     * Tailor Gallery Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Gallery_Control extends Tailor_Control {

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

	        <% if ( ! ids[ media ].length ) { %>
	        <p class="control__message"><?php _e( 'No images selected', 'tailor' ); ?></p>
	        <div class="actions">
		        <button type="button" class="button button--select"><?php _e( 'Create Gallery', 'tailor' ); ?></button>
	        </div>
	        <% } else { %>
	        <ul class="thumbnails is-loading">
		        <% _.each( ids[ media ], function( id ) { %>
		        <li class="thumbnail">
			        <img src="<?php echo tailor()->plugin_url() . 'assets/img/empty.png'; ?>"/>
		        </li>
		        <% } ); %>
	        </ul>
	        <div class="actions">
		        <button type="button" class="button button--remove"><?php _e( 'Remove Gallery', 'tailor' ); ?></button>
		        <button type="button" class="button button--change"><?php _e( 'Edit Gallery', 'tailor' ); ?></button>
	        </div>
	        <% } %>

            <?php
        }
    }
}
