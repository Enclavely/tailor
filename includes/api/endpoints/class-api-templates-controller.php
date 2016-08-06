<?php

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_REST_Templates_Controller' ) ) {
	
	class Tailor_REST_Templates_Controller extends Tailor_REST_Controller {

		/**
		 * Register the routes for the objects of the controller.
		 * 
		 * @since 1.4.0
		 */
		public function register_routes() {

			register_rest_route( $this->namespace, '/' . $this->type, array(
				array(
					'methods'                   =>  WP_REST_Server::CREATABLE,
					'callback'                  =>  array( $this, 'create_items' ),
					'permission_callback'       =>  array( $this, 'create_items_permissions_check' ),
					'args'                      =>  array(),
				),
				array(
					'methods'                   =>  WP_REST_Server::READABLE,
					'callback'                  =>  array( $this, 'get_items' ),
					'permission_callback'       =>  array( $this, 'get_items_permissions_check' ),
					'args'                      =>  array(),
				)
			) );

			register_rest_route( $this->namespace, '/' . $this->type . '/(?P<id>[\w\-\_]+)?', array(
				array(
					'methods'                   =>  WP_REST_Server::READABLE,
					'callback'                  =>  array( $this, 'get_item' ),
					'permission_callback'       =>  array( $this, 'get_item_permissions_check' ),
					'args'                      =>  array(
						'id'                        =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_string( $param );
							}
						),
					),
				),
				array(
					'methods'                   =>  WP_REST_Server::EDITABLE,
					'callback'                  =>  array( $this, 'update_item' ),
					'permission_callback'       =>  array( $this, 'update_item_permissions_check' ),
					'args'                      =>  array(
						'id'                        =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_string( $param );
							}
						),
					),
				),
				array(
					'methods'                   =>  WP_REST_Server::DELETABLE,
					'callback'                  =>  array( $this, 'delete_item' ),
					'permission_callback'       =>  array( $this, 'delete_item_permissions_check' ),
					'args'                      =>  array(
						'id'                        =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_string( $param );
							}
						),
					),
				)
			) );
		}

		/**
		 * Creates a collection of items.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Request
		 */
		public function create_items( $request ) {

			$items = $this->prepare_collection_for_database( $request );

			if ( is_wp_error( $items ) || empty( $items ) ) {
				return $this->invalid_request_error();
			}

			$template_data = array();
			foreach ( $items as $item ) {
				if ( empty( $item['tag'] ) || empty( $item['label'] ) ) {
					continue;
				}

				$template = tailor_templates()->add_models( (array) $item );
				$template_id = $template['id'];
				$template = $this->prepare_item_for_response( $template, $request );
				
				if ( ! empty( $template ) ) {
					$template_data[ $template_id ] = $template;

				}
			}

			if ( ! empty( $template_data ) ) {
				
				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 * 
				 * @param array $template_data
				 * @param WP_REST_Request $request
				 */
				$template_data = apply_filters( 'tailor_api_create_template', $template_data, $request );

				return new WP_REST_Response( $template_data, 200 );
			}

			return new WP_Error(
				'tailor-cannot-create',
				_x( 'The templates could not be created', 'error message', 'tailor' ),
				array( 'status' => 500 )
			);
		}

		/**
		 * Get a collection of items.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Response
		 */
		public function get_items( $request ) {

			$template_data = array();
			foreach ( tailor_templates()->get_template_ids() as $template_id ) {

				// Do nothing if the template cannot be found
				$template = tailor_templates()->get_models( $template_id );
				if ( false == $template ) {
					continue;
				}

				$template = $this->prepare_item_for_response( $template, $request );
				$template_data[ $template_id ][] = $template;
			}

			if ( empty( $template_data ) ) {
				return $this->no_items_error();
			}

			/**
			 * Filter the response.
			 *
			 * @since 1.4.0
			 * 
			 * @param array $template_data
			 * @param WP_REST_Request $request
			 */
			$template_data = apply_filters( 'tailor_api_get_templates', $template_data, $request );

			return new WP_REST_Response( $template_data, 200 );
		}

		/**
		 * Get one item from the collection.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Response
		 */
		public function get_item( $request ) {
			$template = tailor_templates()->get_models( $request['id'] );
			if ( false == $template ) {
				return new WP_Error(
					'tailor-no-template',
					_x( 'No template could be found', 'error message', 'tailor-api' ),
					array( 'status' => 404 )
				);
			}

			$template = $this->prepare_item_for_response( $template, $request );

			/**
			 * Filter the response.
			 *
			 * @since 1.4.0
			 *
			 * @param array $template
			 * @param WP_REST_Request $request
			 */
			$template = apply_filters( 'tailor_api_get_template', $template, $request );

			return new WP_REST_Response( $template, 200 );
		}
		
		/**
		 * Update one item from the collection.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Request
		 */
		public function update_item( $request ) {

			$item = $this->prepare_item_for_database( $request );

			if ( is_wp_error( $item ) ) {
				return $this->invalid_request_error();
			}

			$template = tailor_templates()->update_models( (array) $item );
			if ( $template ) {

				$template = $this->prepare_item_for_response( $template, $request );

				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param array $template
				 * @param WP_REST_Request $request
				 */
				$template = apply_filters( 'tailor_api_update_template', $template, $request );

				return new WP_REST_Response( $template, 200 );
			}

			return new WP_Error(
				'tailor-cannot-update',
				_x( 'The template could not be updated', 'error message', 'tailor' ),
				array( 'status' => 500 )
			);
		}

		/**
		 * Delete one item from the collection.
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Request
		 */
		public function delete_item( $request ) {

			$template_deleted = tailor_templates()->delete_models( $request['id'] );
			if ( $template_deleted ) {

				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param bool $template_deleted
				 * @param WP_REST_Request $request
				 */
				$template_deleted = apply_filters( 'tailor_api_delete_template', $template_deleted, $request );

				return new WP_REST_Response( $template_deleted, 200 );
			}

			return new WP_Error(
				'tailor-cannot-delete',
				_x( 'The template could not be deleted', 'error message', 'tailor'),
				array( 'status' => 500 )
			);
		}

		/**
		 * Prepare the collection for create or update operation.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Request object
		 * @return WP_Error|object $prepared_item
		 */
		protected function prepare_collection_for_database( $request ) {
			$items = json_decode( $request->get_body(), 1 );
			return $items;
		}

		/**
		 * Prepare the item for create or update operation.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Request object
		 * @return WP_Error|object $prepared_item
		 */
		protected function prepare_item_for_database( $request ) {
			$item = json_decode( $request->get_body(), 1 );
			$item['id'] = $request->get_param( 'id' );
			return $item;
		}

		/**
		 * Prepare the item for the REST response.
		 *
		 * @since 1.4.0
		 *
		 * @param array $item
		 * @param WP_REST_Request $request Request object.
		 * @return array
		 */
		public function prepare_item_for_response( $item, $request ) {

			if ( ! empty( $item['models'] ) ) {
				foreach ( $item['models'] as &$model ) {
					$model['atts'] = empty( $model['atts'] ) ? array() : $this->clean_attributes( (array) $model['atts'] );
				}
			}

			$allowed = array( 'tag', 'label', 'type', 'models' ) ;
			return array_intersect_key( $item, array_flip( $allowed ) );
		}

		/**
		 * Removes null values from the attributes array.
		 *
		 * @since 1.4.0
		 *
		 * @param $atts
		 *
		 * @return mixed
		 */
		protected function clean_attributes( $atts ) {
			foreach ( $atts as $attr => $value ) {
				if ( is_null( $value ) ) {
					unset( $atts[ $attr ] );
				}
			}
			return $atts;
		}
	}
}
