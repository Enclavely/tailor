<?php

/**
 * Tailor Icon Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Icon_Control' ) ) {

    /**
     * Tailor Icon Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Icon_Control extends Tailor_Control {

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
	        <p class="control__message"><?php _e( 'No icon selected', 'tailor' ); ?></p>
	        <div class="actions">
		        <button type="button" class="button button--select"><?php _e( 'Select Icon', 'tailor' ); ?></button>
	        </div>
	        <% } else { %>
	        <p>
		        <i class="<%= values[ media ] %>"></i>
	        </p>
	        <div class="actions">
		        <button type="button" class="button button--remove"><?php _e( 'Remove Icon', 'tailor' ); ?></button>
		        <button type="button" class="button button--change"><?php _e( 'Change Icon', 'tailor' ); ?></button>
	        </div>
	        <% } %>

            <?php
        }

	    /**
	     * Prints the Underscore template for the icon list empty state.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Control::to_json()
	     * @see Tailor_Control::print_template()
	     */
	    protected function empty_template() { ?>

		    <div class="dialog__container">
			    <p>
				    <?php _e( 'Please add and enable at least one icon kit on the', 'tailor' ); ?>
		            <a href="<?php echo esc_url( self_admin_url( 'options-general.php?page=' . TAILOR_SETTING_ID ) ); ?>" target="_blank">
			            <?php _e( 'Settings Page.', 'tailor' ); ?>
		            </a>
			    </p>
		    </div>

		<?php
	    }
    }
}
