<?php

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_REST_Elements_Controller' ) ) {
	
	class Tailor_REST_Elements_Controller extends Tailor_REST_Controller {

		/**
		 * Register the routes for the objects of the controller.
		 *
		 * @since 1.4.0
		 */
		public function register_routes() {

			register_rest_route( $this->namespace, '/' . $this->type, array(
				'methods'                   =>  WP_REST_Server::READABLE,
				'callback'                  =>  array( $this, 'get_items' ),
				'permission_callback'       =>  array( $this, 'get_items_permissions_check' ),
				'args'                      =>  array(),
			) );

			register_rest_route( $this->namespace, '/' . $this->type . '/(?P<tag>[\w\-\_]+)?', array(
				'methods'                   =>  WP_REST_Server::READABLE,
				'callback'                  =>  array( $this, 'get_item' ),
				'permission_callback'       =>  array( $this, 'get_item_permissions_check' ),
				'args'                      =>  array(
					'tag'                       =>  array(
						'validate_callback'         =>  function( $param, $request, $key ) {
							return is_string( $param );
						}
					),
				),
			) );
		}

		/**
		 * Get a collection of items
		 *
		 * @since 1.4.0
		 * 
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Response
		 */
		public function get_items( $request ) {

			$registered_elements = tailor_elements()->get_elements();
			
			// Return an error if no elements are found
			if ( empty( $registered_elements ) ) {
				return $this->no_items_error();
			}

			// Prepare the element data
			$element_data = array();
			foreach ( $registered_elements as $registered_element ) {
				$element_data[] = $this->prepare_item_for_response( $registered_element, $request );
			}

			/**
			 * Filter the response.
			 *
			 * @since 1.4.0
			 *
			 * @param array $element_data
			 * @param WP_REST_Request $request
			 */
			$element_data = apply_filters( 'tailor_api_get_elements', $element_data, $request );

			return new WP_REST_Response( $element_data, 200 );
		}
		
		/**
		 * Get one item from the collection
		 *
		 * @since 1.4.0
		 * 
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Response
		 */
		public function get_item( $request ) {
			$tag = $request['tag'];
			$registered_element = tailor_elements()->get_element( $tag );

			// Return an error if a registered element with the given tag doesn't exist
			if ( empty( $registered_element ) ) {
				return $this->no_item_error();
			}

			$element_data = $this->prepare_item_for_response( $registered_element, $request );
			
			/**
			 * Filter the response.
			 *
			 * @since 1.4.0
			 *
			 * @param array $element_data
			 * @param WP_REST_Request $request
			 */
			$element_data = apply_filters( 'tailor_api_get_element', $element_data, $request );
			
			return new WP_REST_Response( $element_data, 200 );
		}

		/**
		 * Prepare the item for the REST response
		 *
		 * @since 1.4.0
		 * 
		 * @param Tailor_Element $item
		 * @param WP_REST_Request $request Request object.
		 * @return array
		 */
		public function prepare_item_for_response( $item, $request ) {
			$allowed = array( 'id', 'tag', 'label', 'description', 'type', 'child', 'badge', 'dynamic', 'active' ) ;
			return array_intersect_key( $item->to_array(), array_flip( $allowed ) );
		}
	}
}
