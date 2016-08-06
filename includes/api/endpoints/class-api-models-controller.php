<?php

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_REST_Models_Controller' ) ) {
	
	class Tailor_REST_Models_Controller extends Tailor_REST_Controller {

		/**
		 * Register the routes for the objects of the controller.
		 *
		 * @since 1.4.0
		 */
		public function register_routes() {

			register_rest_route( $this->namespace, '/' . $this->type . '/(?P<post_id>[\d]+)?', array(
				array(
					'methods'                   =>  WP_REST_Server::CREATABLE,
					'callback'                  =>  array( $this, 'create_items' ),
					'permission_callback'       =>  array( $this, 'create_items_permissions_check' ),
					'args'                      =>  array(
						'post_id'                   =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_numeric( $param );
							}
						),
					),
				),
				array(
					'methods'                   =>  WP_REST_Server::READABLE,
					'callback'                  =>  array( $this, 'get_items' ),
					'permission_callback'       =>  array( $this, 'get_items_permissions_check' ),
					'args'                      =>  array(
						'post_id'                   =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_numeric( $param );
							}
						),
					),
				),
				array(
					'methods'                   =>  WP_REST_Server::EDITABLE,
					'callback'                  =>  array( $this, 'update_items' ),
					'permission_callback'       =>  array( $this, 'update_items_permissions_check' ),
					'args'                      =>  array(
						'post_id'                   =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_numeric( $param );
							}
						),
					),
				),
				array(
					'methods'                   =>  WP_REST_Server::DELETABLE,
					'callback'                  =>  array( $this, 'delete_items' ),
					'permission_callback'       =>  array( $this, 'delete_items_permissions_check' ),
					'args'                      =>  array(
						'post_id'                   =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_numeric( $param );
							}
						),
					),
				)
			) );

			register_rest_route( $this->namespace, '/' . $this->type . '/(?P<post_id>[\d]+)?/(?P<model_id>[\w\-\_]+)?', array(
				array(
					'methods'                   =>  WP_REST_Server::READABLE,
					'callback'                  =>  array( $this, 'get_item' ),
					'permission_callback'       =>  array( $this, 'get_item_permissions_check' ),
					'args'                      =>  array(
						'post_id'                   =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_numeric( $param );
							}
						),
						'model_id'                  =>  array(
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
						'post_id'                   =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_numeric( $param );
							}
						),
						'model_id'                  =>  array(
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
						'post_id'                   =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_numeric( $param );
							}
						),
						'model_id'                  =>  array(
							'validate_callback'         =>  function( $param, $request, $key ) {
								return is_string( $param );
							}
						),
					),
				)
			) );
		}

		/**
		 * Create a collection of items.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Response
		 */
		public function create_items( $request ) {

			$post = get_post( $request['post_id'] );

			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}

			$models = $this->prepare_collection_for_database( $request );

			if ( is_wp_error( $models ) ) {
				return $this->invalid_request_error();
			}

			$models_data = tailor_models()->add_models( $post->ID, (array) $models );
			if ( $models_data ) {

				// Prepare the model data
				foreach ( $models_data as &$model_data ) {
					$model_data = $this->prepare_item_for_response( $model_data, $request );
				}

				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param array $model_data
				 * @param WP_REST_Request $request
				 */
				$models_data = apply_filters( 'tailor_api_create_models', $models_data, $request );

				return new WP_REST_Response( $models_data, 200 );
			}

			return new WP_Error(
				'tailor-cannot-create',
				_x( 'The models could not be created', 'error message', 'tailor' ),
				array( 'status' => 500 )
			);

		}
		
		/**
		 * Create one item in the collection.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Response
		 */
		public function create_item( $request ) {

			$post = get_post( $request['post_id'] );

			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}

			$model = $this->prepare_item_for_database( $request );

			if ( is_wp_error( $model ) ) {
				return $this->invalid_request_error();
			}

			$model_data = tailor_models()->add_model( $post->ID, (array) $model );
			if ( $model_data ) {

				$model_data = $this->prepare_item_for_response( $model_data, $request );
				
				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param array $model_data
				 * @param WP_REST_Request $request
				 */
				$model_data = apply_filters( 'tailor_api_create_model', $model_data, $request );

				return new WP_REST_Response( $model_data, 200 );
			}
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

			$post = get_post( $request['post_id'] );
			
			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}

			$sanitized_models = tailor_models()->get_sanitized_models( $post->ID );

			// Prepare the model data
			$model_data = array();
			foreach ( $sanitized_models as $sanitized_model ) {
				$model_data[] = $this->prepare_item_for_response( $sanitized_model, $request );
			}

			// Return an error if the post contains no valid models
			if ( empty( $model_data ) ) {
				return $this->no_items_error();
			}

			/**
			 * Filter the response.
			 *
			 * @since 1.4.0
			 *
			 * @param array $model_data
			 * @param WP_REST_Request $request
			 */
			$model_data = apply_filters( 'tailor_api_get_models', $model_data, $request );

			return new WP_REST_Response( $model_data, 200 );
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

			$post = get_post( $request['post_id'] );
			
			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}
			
			$sanitized_models = tailor_models()->get_sanitized_models( $post->ID );

			// Prepare the model data
			$model_data = array();
			$model_id = (string) $request['model_id'];
			foreach ( $sanitized_models as $sanitized_model ) {
				if ( $model_id == $sanitized_model['id'] ) {
					$model_data = $this->prepare_item_for_response( $sanitized_model, $request );
				}
			}

			// Return an error if the post contains no valid models
			if ( empty( $model_data ) ) {
				return $this->no_item_error();
			}

			/**
			 * Filter the response.
			 *
			 * @since 1.4.0
			 *
			 * @param array $model_data
			 * @param WP_REST_Request $request
			 */
			$model_data = apply_filters( 'tailor_api_get_model', $model_data, $request );

			return new WP_REST_Response( $model_data, 200 );
		}

		/**
		 * Update items in the collection.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Request
		 */
		public function update_items( $request ) {

			$post = get_post( $request['post_id'] );

			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}

			$models = $this->prepare_collection_for_database( $request );

			if ( is_wp_error( $models ) ) {
				return $this->invalid_request_error();
			}

			$models_data = tailor_models()->update_models( $post->ID, (array) $models );
			if ( $models_data ) {

				foreach ( $models_data as &$model_data ) {
					$model_data = $this->prepare_item_for_response( $model_data, $request );
				}
				
				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param array $model_data
				 * @param WP_REST_Request $request
				 */
				$models_data = apply_filters( 'tailor_api_update_models', $models_data, $request );

				return new WP_REST_Response( $models_data, 200 );
			}

			return new WP_Error(
				'tailor-cannot-update',
				_x( 'The models could not be updated', 'error message', 'tailor' ),
				array( 'status' => 500 )
			);
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

			$post = get_post( $request['post_id'] );

			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}

			$model = (array) $this->prepare_item_for_database( $request );
			if ( is_wp_error( $model ) || empty( $model ) ) {
				return $this->invalid_request_error();
			}

			$model['id'] = $request['model_id'];

			$model_data = tailor_models()->update_model( $post->ID, $model );
			if ( $model_data ) {

				$model_data = $this->prepare_item_for_response( $model_data, $request );

				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param array $model_data
				 * @param WP_REST_Request $request
				 */
				$model_data = apply_filters( 'tailor_api_update_model', $model_data, $request );

				return new WP_REST_Response( $model_data, 200 );
			}

			return new WP_Error(
				'tailor-cannot-update',
				_x( 'The model could not be updated', 'error message', 'tailor' ),
				array( 'status' => 500 )
			);
		}

		/**
		 * Deletes items in the collection.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Request
		 */
		public function delete_items( $request ) {

			$post = get_post( $request['post_id'] );

			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}

			$models_deleted = tailor_models()->delete_models( $post->ID );
			if ( $models_deleted ) {

				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param bool $models_deleted
				 * @param WP_REST_Request $request
				 */
				$models_deleted = apply_filters( 'tailor_api_delete_models', $models_deleted, $request );

				return new WP_REST_Response( $models_deleted, 200 );
			}

			return new WP_Error(
				'tailor-cannot-delete',
				_x( 'The models could not be deleted', 'error message', 'tailor' ),
				array( 'status' => 500 )
			);
		}

		/**
		 * Delete one item from the collection.
		 *
		 * @since 1.4.0
		 *
		 * @param WP_REST_Request $request Full data about the request.
		 * @return WP_Error|WP_REST_Request
		 */
		public function delete_item( $request ) {

			$post = get_post( $request['post_id'] );

			// Return an error if the post could not be found
			if ( ! $post ) {
				return $this->no_post_error();
			}

			$model_deleted = tailor_models()->delete_model( $post->ID, $request->get_param( 'model_id' ) );
			if ( $model_deleted ) {

				/**
				 * Filter the response.
				 *
				 * @since 1.4.0
				 *
				 * @param bool $model_deleted
				 * @param WP_REST_Request $request
				 */
				$model_deleted = apply_filters( 'tailor_api_delete_model', $model_deleted, $request );

				return new WP_REST_Response( $model_deleted, 200 );
			}

			return new WP_Error(
				'tailor-cannot-delete',
				_x( 'The model could not be deleted', 'error message', 'tailor' ),
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
			$item['atts'] = empty( $item['atts'] ) ? array() : $this->clean_attributes( (array) $item['atts'] );
			$allowed = array( 'id', 'tag', 'label', 'type', 'atts', 'parent', 'order' ) ;
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
