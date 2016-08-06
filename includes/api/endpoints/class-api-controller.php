<?php

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_REST_Controller' ) ) {
	
	class Tailor_REST_Controller extends WP_REST_Controller {

		/**
		 * The resource type.
		 * 
		 * @since 1.4.0
		 * 
		 * @var mixed|void
		 */
		protected $type;

		protected $id;

		/**
		 * Constructs the REST controller.
		 *
		 * @since 1.4.0
		 *
		 * @param $type
		 */
		public function __construct( $type ) {
			$this->type = $type;
			$this->namespace = 'tailor/v1';
		}

		/**
		 * Check if a given request has access to create items.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function create_items_permissions_check( $request ) {

			/**
			 * Filter the response of the get items permission check.
			 *
			 * @since 1.4.0
			 */
			return apply_filters( 'tailor_api_create_items_capability', current_user_can( 'edit_posts' ), $request, $this->type );
		}

		/**
		 * Check if a given request has access to create a specific item.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function create_item_permissions_check( $request ) {
			return $this->create_items_permissions_check( $request );
		}

		/**
		 * Check if a given request has access to get items.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function get_items_permissions_check( $request ) {

			/**
			 * Filter the response of the get items permission check.
			 *
			 * @since 1.4.0
			 */
			return apply_filters( 'tailor_api_get_items_capability', true, $request, $this->type );
		}

		/**
		 * Check if a given request has access to get a specific item.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function get_item_permissions_check( $request ) {
			return $this->get_items_permissions_check( $request );
		}

		/**
		 * Check if a given request has access to update items.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function update_items_permissions_check( $request ) {
			return $this->create_items_permissions_check( $request );
		}

		/**
		 * Check if a given request has access to update a specific item.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function update_item_permissions_check( $request ) {
			return $this->create_items_permissions_check( $request );
		}

		/**
		 * Check if a given request has access to delete items.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function delete_items_permissions_check( $request ) {
			return $this->create_items_permissions_check( $request );
		}
		
		/**
		 * Check if a given request has access to delete a specific item.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|bool
		 */
		public function delete_item_permissions_check( $request ) {
			return $this->create_items_permissions_check( $request );
		}

		/**
		 * Returns an error when no post could be found.
		 *
		 * @since 1.4.0
		 *
		 * @return WP_Error
		 */
		protected function no_post_error() {
			return new WP_Error(
				'tailor-api-no-post',
				_x( 'The post could not be found', 'error message', 'tailor-api' ),
				array( 'status' => 404 )
			);
		}

		/**
		 * Returns an error when no items could be found.
		 *
		 * @since 1.4.0
		 *
		 * @return WP_Error
		 */
		protected function no_items_error() {
			return new WP_Error(
				'tailor-api-no-items',
				_x( 'No items could be found', 'error message', 'tailor-api' ),
				array( 'status' => 404 )
			);
		}
		
		/**
		 * Returns an error when no item could be found.
		 *
		 * @since 1.4.0
		 *
		 * @return WP_Error
		 */
		protected function no_item_error() {
			return new WP_Error(
				'tailor-api-no-item',
				_x( 'No item could be found', 'error message', 'tailor-api' ),
				array( 'status' => 404 )
			);
		}
		
		/**
		 * Returns an error when the request is improperly formatted.
		 *
		 * @since 1.4.0
		 *
		 * @return WP_Error
		 */
		protected function invalid_request_error() {
			return new WP_Error(
				'tailor-api-invalid-request',
				_x( 'The request format is invalid', 'error message', 'tailor' ),
				array( 'status' => 500 )
			);
		}
	}
}