<?php

/**
 * Tailor Link Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Link_Control' ) ) {

    /**
     * Tailor Icon Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Link_Control extends Tailor_Control {

	    /**
	     * Input attributes for this control.
	     *
	     * @since 1.0.0
	     * @access public
	     * @var array
	     */
	    public $placeholder = '';

	    /**
	     * Returns the parameters that will be passed to the client JavaScript via JSON.
	     *
	     * @since 1.0.0
	     *
	     * @return array The array to be exported to the client as JSON.
	     */
	    public function to_json() {
		    $array = parent::to_json();
		    $array['placeholder'] = esc_attr( $this->placeholder );
		    return $array;
	    }

	    /**
	     * Adds required action hooks.
	     *
	     * @since 1.0.0
	     * @access protected
	     */
	    protected function add_actions() {

		    parent::add_actions();

		    add_action( 'wp_ajax_tailor_get_links', array( $this, 'get_links' ) );
	    }

	    /**
	     * Returns links matching the search criteria to the JavaScript application.
	     *
	     * @since 1.0.0
	     */
	    public function get_links() {

		    check_ajax_referer( 'tailor-query', 'nonce' );

		    $term = wp_unslash( $_POST['s'] );
		    $response = '';

		    if ( ! empty( $term ) ) {

			    $defaults = array(
				    'orderby'           =>  'date',
				    'order'             =>  'DESC',
				    'post_type'         =>  'any',
				    'post_status'       =>  'publish',
				    'posts_per_page'    =>  50,
				    'suppress_filters'  =>  true
			    );

			    $parameters = array_merge( $defaults, $_POST );
			    $posts = get_posts( $parameters );

			    if ( empty( $posts ) ) {
				    $response .= sprintf(
					    '<p class="query-notice">%s</p>',
					    __( 'Nothing found matching your criteria. Showing recent items.', 'tailor' )
				    );
				    $parameters = array_merge( $defaults, array( 'posts_per_page' => 10 ) );
				    $posts = get_posts( $parameters );
			    }

			    foreach ( $posts as $post ) {
				    $post_type = get_post_type( $post->ID );
				    $post_type_object = get_post_type_object( $post_type );
				    $response .=    '<label>' .
				                        '<input type="radio" name="url" value="' . get_permalink( $post->ID ) . '">' .
					                    '<span class="entry-title">' . get_the_title( $post->ID ) . '</span>' .
					                    '<span class="entry-type">' . $post_type_object->labels->singular_name . '</span>' .
				                    '</label>';
			    }
		    }

		    wp_send_json_success( $response );
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

	        <div class="control__input-group">
		        <input type="text" name="<%= media %>" placeholder="<%= placeholder %>" value="<%= values[ media ] %>"/>
		        <button class="button button-small button--select" title="<?php echo esc_attr( __( 'Search', 'tailor' ) ); ?>">
			        <i class="dashicons dashicons-search"></i>
		        </button>
	        </div>

            <?php
        }
    }
}
