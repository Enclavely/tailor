<?php

/**
 * Tailor Video Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Video_Control' ) ) {

    /**
     * Tailor Video Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Video_Control extends Tailor_Control {

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
	        <p class="control__message"><?php _e( 'No video selected', 'tailor' ); ?></p>
	        <div class="actions">
		        <button type="button" class="button button--enter"><?php _e( 'Enter URL', 'tailor' ); ?></button>
		        <button type="button" class="button button--select"><?php _e( 'Select Video', 'tailor' ); ?></button>
	        </div>
	        <% } else if ( _.isNumber( values[ media ] ) ) { %>
	        <div class="video-preview is-loading">
		        <img class="video-placeholder" src="<?php echo tailor()->plugin_url() . 'assets/img/empty.png'; ?>"/>
	        </div>
	        <div class="actions">
		        <button type="button" class="button button--remove"><?php _e( 'Remove Video', 'tailor' ); ?></button>
		        <button type="button" class="button button--change"><?php _e( 'Change Video', 'tailor' ); ?></button>
	        </div>
	        <% } else { %>
	        <div class="video-preview">
		        <p class="control__message"><%= values[ media ] %></p>
	        </div>
	        <div class="actions">
		        <button type="button" class="button button--remove"><?php _e( 'Remove Video', 'tailor' ); ?></button>
	        </div>
	        <% } %>
	        
            <?php
        }
    }
}
