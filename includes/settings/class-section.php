<?php

/**
 * Section class.
 *
 * @package Tailor
 * @subpackage Settings
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Section' ) ) {

    /**
     * Tailor Section class.
     *
     * @since 1.0.0
     * @see Tailor_Setting_Manager
     */
    class Tailor_Section {

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
         * Order in which this instance was created in relation to other instances.
         *
         * @since 1.0.0
         * @var int
         */
        public $instance_number;

        /**
         * Tailor_Setting_Manager instance.
         *
         * @since 1.0.0
         * @access protected
         * @var Tailor_Setting_Manager
         */
        protected $manager;

	    /**
	     * The panel to which this section belongs (optional).
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $panel;

        /**
         * Unique identifier.
         *
         * @since 1.0.0
         * @var string
         */
        public $id;

        /**
         * Title of the section to show in UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $title = '';

        /**
         * Description to show in the UI.
         *
         * @since 1.0.0
         * @var string
         */
        public $description = '';

        /**
         * Priority of the section which informs load order of sections.
         *
         * @since 1.0.0
         * @var integer
         */
        public $priority = 10;

        /**
         * Capability required for the section.
         *
         * @since 1.0.0
         * @access protected
         * @var string
         */
        protected $capability = '';

        /**
         * Theme feature support for the section.
         *
         * @since 1.0.0
         * @access protected
         * @var string|array
         */
        protected $theme_supports = '';

        /**
         * Controls for the section.
         *
         * @since 1.0.0
         * @var array
         */
        public $controls;

	    /**
	     * The section type.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $type = 'default';

        /**
         * Constructor.
         *
         * Any supplied $args override class property defaults.
         *
         * @since 1.0.0
         *
         * @param Tailor_Setting_Manager $manager Tailor Setting Manager instance.
         * @param string $id A specific ID for the section.
         * @param array $args Section arguments.
         */
        public function __construct( $manager, $id, $args = array() ) {
            $keys = array_keys( get_object_vars( $this ) );
            foreach ( $keys as $key ) {
                if ( isset( $args[ $key ] ) ) {
                    $this->$key = $args[ $key ];
                }
            }

            $this->manager = $manager;
            $this->instance_number = ++ self::$instance_count;
            $this->id = $id;

            $this->controls = array(); // Users cannot customize the $controls array.

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
         * Checks if the theme supports the section and that the current user has the required capabilities.
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
            return wp_array_slice_assoc( (array) $this, array( 'id', 'title', 'description', 'type', 'panel' ) );
        }

        /**
         * Prints the Underscore (JS) template for this section.
         *
         * @since 1.0.0
         */
        public function print_template() { ?>

            <script type="text/html" id="tmpl-tailor-section-<?php echo $this->type; ?>">
                <?php $this->render_template(); ?>
            </script>

	        <script type="text/html" id="tmpl-tailor-section-<?php echo $this->type; ?>-item">
		        <?php $this->item_template(); ?>
	        </script>

	        <script type="text/html" id="tmpl-tailor-section-<?php echo $this->type; ?>-empty">
		        <?php $this->empty_template(); ?>
	        </script>

            <?php
        }

	    /**
	     * Prints the Underscore template for the section.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Section::to_json()
	     * @see Tailor_Section::print_template()
	     */
	    protected function render_template() { ?>

		    <div class="header">
			    <button class="back-button" tabindex="0">
				    <?php echo tailor_screen_reader_text( __( 'Back', 'tailor' ) ); ?>
			    </button>
			    <div class="title-block">
				    <h3 class="title">
					    <span class="notice"> <?php _e( 'Tailor &#9656; ', 'tailor' ); ?> <%= panel %></span>
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
	    protected function items_template() {
		    echo '<ul class="controls" id="controls"></ul>';
	    }

	    /**
	     * Prints the Underscore template for individual section items.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Panel::to_json()
	     * @see Tailor_Panel::print_template()
	     */
	    protected function item_template() {
		    echo '<li class="item"><h3><%= title %></h3></li>';
	    }

	    /**
	     * Prints the Underscore template for the section empty state.
	     *
	     * @since 1.0.0
	     * @access protected
	     *
	     * @see Tailor_Panel::to_json()
	     * @see Tailor_Panel::print_template()
	     */
	    protected function empty_template() {
		    printf( '<p>%s</p>', __( 'There are no controls to display', 'tailor' ) );
	    }
    }
}