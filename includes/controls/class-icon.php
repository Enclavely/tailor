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
	     * Prints the Underscore (JS) templates for this control.
	     *
	     * @since 1.0.0
	     */
	    public function print_template() { ?>

		    <script type="text/html" id="tmpl-tailor-control-<?php echo $this->type; ?>">
			    <div class="control__header">
				    <% if ( label ) { %>
	                <span class="control__title">
		                <%= label %>
				        <a class="button button-small js-default <% if ( 'undefined' == typeof showDefault || ! showDefault ) { %>is-hidden<% } %>">
					        <?php _e( 'Default', tailor()->textdomain() ); ?>
				        </a>
	                </span>
				    <% } else { %>
				    <a class="button button-small js-default <% if ( 'undefined' == typeof showDefault || ! showDefault ) { %>is-hidden<% } %>">
					    <?php _e( 'Default', tailor()->textdomain() ); ?>
				    </a>
				    <% } %>
				    <% if ( description ) { %>
				    <span class="control__description"><%= description %></span>
				    <% } %>
			    </div>
			    <div class="control__body">
				    <?php $this->render_template(); ?>
			    </div>
		    </script>

		    <script type="text/html" id="tmpl-tailor-control-<?php echo $this->type; ?>-empty">
			    <?php $this->empty_template(); ?>
		    </script>

		    <?php
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
	        <p class="message"><?php _e( 'No icon selected', tailor()->textdomain() ); ?></p>
	        <div class="actions">
		        <button type="button" class="button button--select"><?php _e( 'Select Icon', tailor()->textdomain() ); ?></button>
	        </div>
	        <% } else { %>
	        <p>
		        <i class="<%= value %>"></i>
	        </p>
	        <div class="actions">
		        <button type="button" class="button button--remove"><?php _e( 'Remove Icon', tailor()->textdomain() ); ?></button>
		        <button type="button" class="button button--change"><?php _e( 'Change Icon', tailor()->textdomain() ); ?></button>
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
				    <?php _e( 'Please add and enable at least one icon kit on the', tailor()->textdomain() ); ?>
		            <a href="<?php echo esc_url( self_admin_url( 'options-general.php?page=' . TAILOR_SETTING_ID ) ); ?>" target="_blank">
			            <?php _e( 'Settings Page.', tailor()->textdomain() ); ?>
		            </a>
			    </p>
		    </div>

		<?php
	    }
    }
}
