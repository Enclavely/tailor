<?php

/**
 * Tailor Customizer class
 *
 * @package Tailor
 * @subpackage Customizer
 * @since 1.0.0
 */

if ( ! class_exists( 'Tailor_Customizer' ) ) {

    /**
     * Tailor Customizer class.
     *
     * @since 1.0.0
     */
	class Tailor_Customizer {

		/**
		 * Initialize the Tailor Customizer settings.
		 *
		 * @since 1.5.0
		 */
		public static function initialize() {
			self::includes();
			self::hooks();
		}

		/**
		 * Includes the required files.
		 *
		 * @since 1.5.0
		 * @access private
		 */
		private static function includes() {
			require_once dirname( __FILE__ ) . '/customizer/customizer-panels.php';
			require_once dirname( __FILE__ ) . '/customizer/customizer-sections.php';
			require_once dirname( __FILE__ ) . '/customizer/customizer-settings.php';
		}
		
        /**
         * Adds required action hooks.
         *
         * @since 1.5.0
         * @access private
         */
		private static function hooks() {
            add_action( 'customize_register', array( __CLASS__, 'register_panels' ) );
            add_action( 'customize_register', array( __CLASS__, 'register_sections' ) );
            add_action( 'customize_register', array( __CLASS__, 'register_settings' ) );
        }


        /**
         * Registers Customizer panels for the plugin.
         *
         * @since 1.0.0
         *
         * @param $wp_customize WP_Customize_Manager
         */
		public static function register_panels( $wp_customize ) {
			foreach ( (array) tailor_get_customizer_panels() as $panel => $data ) {
				$wp_customize->add_panel( $panel, $data );
			}
		}

        /**
         * Registers Customizer sections for the plugin.
         *
         * @since 1.0.0
         *
         * @param $wp_customize WP_Customize_Manager
         */
        public static function register_sections( $wp_customize ) {
			foreach ( (array) tailor_get_customizer_sections() as $section => $args ) {
				$wp_customize->add_section( $section, $args );
			}
		}

        /**
         * Registers Customizer settings and controls for the plugin.
         *
         * @since 1.0.0
         *
         * @param $wp_customize WP_Customize_Manager
         */
        public static function register_settings( $wp_customize ) {
			foreach ( (array) tailor_get_customizer_settings() as $setting_id => $args ) {

				if ( isset( $args['setting'] ) ) {
					$defaults = array(
						'type'                  =>  'theme_mod',
						'capability'            =>  'edit_theme_options',
						'theme_supports'        =>  '',
						'default'               =>  null,
						'transport'             =>  'refresh',
						'sanitize_callback'     =>  '',
						'sanitize_js_callback'  =>  '',
					);
					$setting_args = wp_parse_args( $args['setting'], $defaults );
					$wp_customize->add_setting( $setting_id, $setting_args );
				}

				if ( isset( $args['control'] ) ) {
					$control_defaults = array(
						'settings'              =>  $setting_id,
						'section'               =>  'none',
						'priority'              =>  10,
					);
					$control_args = wp_parse_args( $args['control'], $control_defaults );
					$type = str_replace( '-', '_', $args['control']['type'] );
					$type = preg_replace_callback( "/_[a-z]?/", array( __CLASS__, 'capitalize_word' ), $type );
					$control_class = null;
					try {
						$class = new ReflectionClass( "WP_Customize_{$type}_Control" );
						$control_class = $class->newInstanceArgs( array(
							$wp_customize,
							$setting_id,
							$control_args
						) );
					}
					catch ( ReflectionException $e ) {
						$control_class = new WP_Customize_Control(
							$wp_customize,
							$setting_id,
							$control_args
						);
					}
					$wp_customize->add_control( $control_class );
				}
			}
		}

        /**
         * Capitalizes the first letter of each word in an array.
         *
         * @since 1.0.0
         *
         * @param $matches array
         * @return array
         */
		private static function capitalize_word( $matches ) {
			return ucfirst( $matches[ 0 ] );
		}
	}
}

if ( ! function_exists( 'tailor_maybe_init_customizer' ) ) {

	/**
	 * Initializes the Tailor Customizer settings if this is a Customizer page load.
	 *
	 * @since 1.5.0
	 */
	function tailor_maybe_init_customizer() {
		if ( is_customize_preview() ) {
			Tailor_Customizer::initialize();
		}
	}

	add_action( 'init', 'tailor_maybe_init_customizer' );
}