<?php

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_API' ) ) {

	/**
	 * Tailor API class.
	 *
	 * @since 1.4.0
	 */
	class Tailor_API {

		/**
		 * Initialize the Tailor API.
		 * 
		 * @since 1.4.0
		 */
		public static function initialize() {

			// Do nothing if the Tailor REST API is not enabled
			if ( false == tailor_get_setting( 'enable_rest_api', false ) || false == self::is_wp_api_active() ) {
				return;
			}

			self::includes();
			self::hooks();
		}

		/**
		 * Includes the required plugin files.
		 * 
		 * @since 1.4.0
		 * @access private
		 */	
		private static function includes() {
			require_once dirname( __FILE__ ) . '/endpoints/class-api-controller.php';
			require_once dirname( __FILE__ ) . '/endpoints/class-api-elements-controller.php';
			require_once dirname( __FILE__ ) . '/endpoints/class-api-templates-controller.php';
			require_once dirname( __FILE__ ) . '/endpoints/class-api-models-controller.php';

			/**
			 * Fires when all Tailor API files are loaded.
			 *
			 * @since 1.4.0
			 */
			do_action( 'tailor_api_loaded' );
		}

		/**
		 * Adds the required action hooks.
		 * 
		 * @since 1.4.0
		 * @access private
		 */
		private static function hooks() {
			add_action( 'rest_api_init', array( __CLASS__, 'create_rest_routes' ), 10 );
		}

		/**
		 * Creates the Tailor API endpoints.
		 * 
		 * @since 1.4.0
		 * @access private
		 */
		public static function create_rest_routes() {

			$types = array(
				'elements',
				'templates',
				'models',
			);

			/**
			 * Filter the list of resource types.
			 * 
			 * @since 1.4.0
			 */
			$types = apply_filters( 'tailor_api_types', $types );
			
			if ( is_array( $types ) && count( $types ) > 0 ) {
				foreach( $types as $type ) {
					$type = ucfirst( $type );
					$class_name = "Tailor_REST_{$type}_Controller";
					
					if ( class_exists( $class_name ) ) {
						$controller = new $class_name( $type );

						$controller->register_routes();
					}
				}
			}

			/**
			 * Fires after Tailor REST API routes are created.
			 *
			 * @since 1.4.0
			 */
			do_action( 'tailor_api_init' );
		}

		/**
		 * Returns true if the WP API is active.
		 * 
		 * @since 1.4.0
		 * 
		 * @return bool
		 */
		public static function is_wp_api_active() {
			return class_exists( 'WP_REST_Controller' );
		}

		/**
		 * Displays an admin notice if the WP API is not available.
		 * 
		 * @since 1.4.0
		 */
		public static function missing_wp_api_notice() {
			if ( false != tailor_get_setting( 'enable_rest_api', false ) && false == self::is_wp_api_active() ) {
				tailor_partial( 'admin/html/notice', 'missing-rest-api' );;
			}
		}
	}

	add_action( 'init', array( 'Tailor_API', 'initialize' ) );
	add_action( 'admin_notices', array( 'Tailor_API', 'missing_wp_api_notice' ) );
}