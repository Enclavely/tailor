<?php

/**
 * Panel classes.
 *
 * Includes the Settings (default), Elements, Templates and History panel definitions.
 *
 * @package Tailor
 * @subpackage Settings
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Panel' ) ) {

    /**
     * Tailor Panel class.
     *
     * @since 1.0.0
     */
    class Tailor_Panel {

        /**
         * Collection of panel instances.
         *
         * @since 1.0.0
         * @static
         * @access protected
         * @var array
         */
        protected static $instances = array();

        /**
         * Incremented with each new class instantiation, then stored in $instance_number.
         *
         * Used when sorting two instances whose priorities are equal.
         *
         * @since 1.0.0
         * @static
         * @access protected
         * @var int
         */
        protected static $instance_count = 0;

        /**
         * Order in which this panel instance was created in relation to other instances of the same type.
         *
         * @since 1.0.0
         * @var int
         */
        public $instance_number;

        /**
         * Unique identifier.
         *
         * @since 1.0.0
         * @var string
         */
        public $id;

        /**
         * Panel title to display in the UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $title = '';

        /**
         * Panel description/help text to display in the UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $description = '';

	    /**
	     * The panel type.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $type = 'default';

        /**
         * Priority of the panel, which determines the display order.
         *
         * @since 1.0.0
         * @var integer
         */
        public $priority = 0;

        /**
         * Capability required for the panel.
         *
         * @since 1.0.0
         * @access protected
         * @var string
         */
        protected $capability = '';

        /**
         * Theme feature support for the panel.
         *
         * @since 1.0.0
         * @access protected
         * @var string|array
         */
        protected $theme_supports = '';

        /**
         * Constructor.
         *
         * Any supplied $args override class property defaults.
         *
         * @since 1.0.0
         *
         * @param string $id A specific ID for the panel.
         * @param array $args Panel arguments.
         */
        public function __construct( $id, $args = array() ) {
            $keys = array_keys( get_object_vars( $this ) );
            foreach ( $keys as $key ) {
                if ( isset( $args[ $key ] ) ) {
                    $this->$key = $args[ $key ];
                }
            }

	        $this->id = $id;
	        $class_name = get_class( $this );
            self::$instances[ $class_name ][] = $this;
            $this->instance_number = count( self::$instances[ $class_name ] );

	        $this->add_actions();
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {
            if ( 1 === $this->instance_number ) {
                add_action( 'tailor_sidebar_footer', array( $this, 'print_template' ), -1 );
            }
        }

        /**
         * Checks if the theme supports the panel and that the current user has the required capabilities.
         *
         * @since 1.0.0
         *
         * @return bool
         */
        final public function check_capabilities() {

            if ( $this->capability && ! call_user_func_array( 'current_user_can', (array) $this->capability ) ) {
                return false;
            }

            if ( $this->theme_supports && ! call_user_func_array( 'current_theme_supports', (array) $this->theme_supports ) ) {
                return false;
            }

            return true;
        }

        /**
         * Returns the parameters that will be passed to the client JavaScript via JSON.
         *
         * @since 1.0.0
         *
         * @return array The array to be exported to the client as JSON.
         */
        public function to_json() {
            return wp_array_slice_assoc( (array) $this, array( 'id', 'title', 'description', 'type' ) );
        }

	    /**
	     * Prints the Underscore template for this panel.
	     *
	     * @since 1.0.0
	     */
	    public function print_template() { ?>

		    <script type="text/html" id="tmpl-tailor-panel-<?php echo $this->type; ?>">
			    <?php $this->render_template(); ?>
		    </script>

		    <script type="text/html" id="tmpl-tailor-panel-<?php echo $this->type; ?>-item">
			    <?php $this->item_template(); ?>
		    </script>

		    <script type="text/html" id="tmpl-tailor-panel-<?php echo $this->type; ?>-empty">
			    <?php $this->empty_template(); ?>
		    </script>

		    <?php

		    /**
		     * Fires after panel templates have been printed.
		     *
		     * @since 1.0.0
		     *
		     * @param string $type
		     */
		    do_action( 'tailor_print_panel_templates', $this->type );
	    }

	    /**
	     * Prints the Underscore template for the panel.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Panel::to_json()
	     * @see Tailor_Panel::print_template()
	     */
	    protected function render_template() { ?>

		    <div class="header">

			    <button class="back-button">
				    <?php echo tailor_screen_reader_text( __( 'Back', 'tailor' ) ); ?>
			    </button>

			    <div class="title-block">

				    <h3 class="title">
					    <span class="notice"><?php _e( 'Tailor', 'tailor' ); ?></span>
					    <%= title %>
				    </h3>

				    <% if ( description ) { %>
				    <button class="help-button dashicons dashicons-editor-help">
					    <?php echo tailor_screen_reader_text( __( 'Help', 'tailor' ) ); ?>
				    </button>
				    <% } %>
			    </div>

			    <% if ( description ) { %>
			    <div class="help-description"><%= description %></div>
			    <% } %>

		    </div>

		    <?php

		    $this->items_template();
	    }

	    /**
	     * Prints the Underscore template for the items container.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Panel::to_json()
	     * @see Tailor_Panel::print_template()
	     */
	    protected function items_template() { ?>

		    <ul class="list list--primary" id="items"></ul>

		    <?php
	    }

	    /**
	     * Prints the Underscore template for individual panel items.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Panel::to_json()
	     * @see Tailor_Panel::print_template()
	     */
	    protected function item_template() { ?>

		    <li class="list__item">
			    <h3 class="list__label"><%= title %></h3>
		    </li>

		    <?php
	    }

	    /**
	     * Prints the Underscore template for the panel empty state.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Panel::to_json()
	     * @see Tailor_Panel::print_template()
	     */
	    protected function empty_template() { ?>

		    <p><?php _e( 'There are no sections to display', 'tailor' ); ?></p>

			<?php
	    }
    }
}

if ( ! class_exists( 'Tailor_Elements_Panel' ) ) {

	/**
	 * Tailor Elements Panel class.
	 *
	 * @since 1.0.0
	 */
	class Tailor_Elements_Panel extends Tailor_Panel {

		/**
		 * Type of item to display.
		 *
		 * @since 1.0.0
		 * @var string
		 */
		public $type = 'library';

		/**
		 * Prints the Underscore template for the items section of the panel.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function items_template() {

			$search_text =  __( 'Search elements..', 'tailor' ); ?>

			<% if ( items.length ) { %>
			<div class="search-form">
				<?php echo tailor_screen_reader_text( $search_text ); ?>
				<input class="search" type="search" role="search" placeholder="<?php esc_attr_e( $search_text ); ?>">
			</div>
			<% } %>

			<?php
			$list_class_name = 'list list--secondary';

			if ( false == tailor_get_setting( 'show_element_descriptions', false ) ) {
				$list_class_name .= ' is-simplified';
			} ?>

			<ul class="<?php echo $list_class_name; ?>" id="items"></ul>

			<?php
		}

		/**
		 * Prints the Underscore template for individual panel items.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function item_template() { ?>

			<% if ( active ) { %>
			<li class="list__item draggable element element--<%= tag.replace( 'tailor_', '' ) %>" draggable="true" tabindex="0">
			<% } else { %>
			<?php $visibility = tailor_get_setting( 'show_inactive_elements', false ) ? 'is-inactive' : 'is-hidden'; ?>

			<li class="list__item draggable element element--<%= tag.replace( 'tailor_', '' ) %><?php echo " {$visibility}"; ?>">

			<% } %>

				<div class="element__wrap">
					<% if ( badge ) { %><span class="element__badge"><%= badge %></span><% } %>
					<h3 class="list__label">
						<%= label %>
					</h3>
					<div class="element__description"><%= description %></div>
				</div>
			</li>

			<?php
		}

		/**
		 * Prints the Underscore template for the panel empty state.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function empty_template() { ?>

			<p><?php _e( 'There are no elements to display.', 'tailor' ); ?></p>

			<?php
		}
	}
}

if ( ! class_exists( 'Tailor_Templates_Panel' ) ) {

	/**
	 * Tailor Templates Panel class.
	 *
	 * @since 1.0.0
	 */
	class Tailor_Templates_Panel extends Tailor_Panel {

		/**
		 * Type of item to display.
		 *
		 * @since 1.0.0
		 * @var string
		 */
		public $type = 'templates';

		/**
		 * Prints the Underscore template for the items section of the panel.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function items_template() {

			$search_text =  __( 'Search templates..', 'tailor' ); ?>

			<% if ( items.length ) { %>
			<div class="search-form">
				<?php echo tailor_screen_reader_text( $search_text ); ?>
				<input class="search" type="search" role="search" placeholder="<?php esc_attr_e( $search_text ); ?>">
			</div>
			<% } %>

			<ul class="list list--secondary" id="items"></ul>

			<?php

			$this->action_buttons_template();
		}

		/**
		 * Prints the Underscore template for individual panel items.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function item_template() { ?>

			<li class="list__item draggable template" draggable="true" tabindex="0">

				<h3 class="list__label"><%= label %></h3>

				<div class="template__controls">

					<?php
					$preview_label = __( 'Preview template', 'tailor' );
					$download_label = __( 'Download template', 'tailor' );
					$delete_label = __( 'Delete template', 'tailor' ); ?>

					<button class="not-a-button button--icon button--preview js-preview-template" title="<?php echo $preview_label; ?>">
						<?php echo tailor_screen_reader_text( $preview_label ); ?>
					</button>
					<button class="not-a-button button--icon button--download js-download-template" title="<?php echo $download_label; ?>">
						<?php echo tailor_screen_reader_text( $download_label ); ?>
					</button>
					<button class="not-a-button button--icon button--delete js-delete-template" title="<?php echo $delete_label; ?>">
						<?php echo tailor_screen_reader_text( $delete_label ); ?>
					</button>
				</div>
			</li>

			<?php
		}

		/**
		 * Prints the Underscore template for the panel empty state.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function empty_template() { ?>

			<h2><?php _e( 'Getting started', 'tailor' ); ?></h2>
			<ol>
				<li><?php _e( 'Select the element you wish to save.  If you do not select anything, the entire layout will be saved.', 'tailor' ); ?></li>
				<li><?php _e( 'Press the Save template button and enter a name for the template.', 'tailor' ); ?></li>
			</ol>
			<p><?php _e( 'Once you have one or more templates available, simply drag and drop them into the desired position on the page.', 'tailor' ); ?></p>

			<?php
		}

		/**
		 * Prints the Underscore template for the panel action buttons.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function action_buttons_template() { ?>

			<div class="template-actions">

				<button class="button button-large js-save-template">
					<?php _e( 'Save template', 'tailor' ); ?>
				</button>

				<span class="or"><?php _e( 'or', 'tailor' ); ?></span>

				<button class="button button-large js-import-template">
					<?php _e( 'Import template', 'tailor' ); ?>
				</button>

				<a id="download-template" style="display:none"></a>
			</div>

			<?php
		}
	}
}

if ( ! class_exists( 'Tailor_History_Panel' ) ) {

	/**
	 * Tailor History Panel class.
	 *
	 * @since 1.0.0
	 */
	class Tailor_History_Panel extends Tailor_Panel {

		/**
		 * Type of item to display.
		 *
		 * @since 1.0.0
		 * @var string
		 */
		public $type = 'history';

		/**
		 * Prints the Underscore template for the items section of the panel.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function items_template() { ?>

			<ul class="list list--secondary" id="items"></ul>

			<?php
		}

		/**
		 * Prints the Underscore template for individual panel items.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function item_template() { ?>

			<li class="list__item history" title="<%= label %>">
				<div class="history__wrap">
					<div class="history__time"><%= time %></div>
					<h3 class="list__label"><%= label %></h3>
				</div>
			</li>

			<?php
		}

		/**
		 * Prints the Underscore template for the panel empty state.
		 *
		 * @since 1.0.0
		 * @access protected
		 *
		 * @see Tailor_Panel::to_json()
		 * @see Tailor_Panel::print_template()
		 */
		protected function empty_template() { ?>

			<p><?php _e( 'There are no history entries to display.', 'tailor' ); ?></p>

			<?php
		}
	}
}