<?php

/**
 * Tailor List Control classes.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_List_Control' ) ) {

	/**
	 * Tailor List Control class.
	 *
	 * @since 1.0.0
	 */
	class Tailor_List_Control extends Tailor_Control {

		/**
		 * Enqueues control related scripts/styles.
		 *
		 * @since 1.0.0
		 */
		public function enqueue() {

			wp_enqueue_script(
				'sortable',
				tailor()->plugin_url() . 'assets/js/dist/vendor/sortable.min.js',
				array(),
				tailor()->version(),
				true
			);
		}

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
					        <?php _e( 'Default', 'tailor' ); ?>
				        </a>
	                </span>
					<% } else { %>
					<a class="button button-small js-default <% if ( 'undefined' == typeof showDefault || ! showDefault ) { %>is-hidden<% } %>">
						<?php _e( 'Default', 'tailor' ); ?>
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

			<script type="text/html" id="tmpl-tailor-control-<?php echo $this->type; ?>-item">
				<?php $this->item_template(); ?>
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

				<ul id="list-items"></ul>
				<div class="actions">
					<button class="button js-add"><?php _e( 'Add', 'tailor' ); ?> <%= childLabel %></button>
				</div>

			<?php
		}

		/**
		 * Prints the Underscore template for individual list items.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Control::to_json()
		 * @see Tailor_Control::print_template()
		 */
		protected function item_template() { ?>

			<div class="list-item__title" tabindex="0">
				<h4><%= atts.title %></h4>
			</div>
			<div class="list-item__content">
				<ul id="controls"></ul>
				<?php printf(
					'<a class="link link--delete js-delete-list-item" title="%1$s">%1$s</a> | <a class="link js-close-list-item" title="%2$s">%2$s</a>',
					__( 'Delete', 'tailor' ),
					__( 'Close', 'tailor' )
				); ?>
			</div>

			<?php
		}

		/**
		 * Prints the Underscore template for the list empty state.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Control::to_json()
		 * @see Tailor_Control::print_template()
		 */
		protected function empty_template() { ?>

			<p class="control__message"><?php _e( 'No items to display', 'tailor' ); ?></p>

			<?php
		}
	}
}