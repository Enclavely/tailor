<?php

/**
 * TinyMCE class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_TinyMCE' ) )  {

    /**
     * Tailor TinyMCE class.
     *
     * @since 1.0.0
     */
	class Tailor_TinyMCE {

		/**
		 * Tailor TinyMCE instance.
		 *
		 * @since 1.0.0
		 * @access private
		 * @var Tailor_TinyMCE
		 */
		private static $instance;

		/**
		 * Unique ID for the TinyMCE instance.
		 *
		 * @since 1.0.0
		 * @access private
		 * @var string
		 */
		private $id = 'tailoricon';

		/**
		 * Returns the Tailor TinyMCE instance.
		 *
		 * @since 1.0.0
		 * @return Tailor_TinyMCE
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {
	        add_action( 'init', array( $this, 'add_actions' ) );
        }

		/**
		 * Adds required action hooks.
		 *
		 * @since 1.0.0
		 */
		public function add_actions() {

			if ( ! current_user_can( 'edit_posts' ) || ! current_user_can( 'edit_pages' ) ) {
				return;
			}

			add_filter( 'tiny_mce_before_init', array( $this, 'configure_tinymce' ) );

			if ( tailor()->is_tailoring() ) {
				add_filter( 'mce_buttons', array( $this, 'add_mce_button' ) );
				add_filter( 'mce_external_plugins', array( $this, 'add_mce_script' ), 999 );
				add_filter( 'mce_external_languages', array( $this, 'register_mce_locale' ) );
			}
		}

		/**
		 * Adds a custom body class to the editor.
		 *
		 * @since 1.0.0
		 *
		 * @param array $settings
		 * @return array $settings
		 */
		public function configure_tinymce( $settings ) {

			if ( empty( $settings['body_class'] ) ) {
				$settings['body_class'] = 'tailor-ui tailor-editor';
			}
			else {
				$settings['body_class'] .= ' tailor-ui tailor-editor';
			}

			if ( empty( $settings['extended_valid_elements'] ) ) {
				$settings['extended_valid_elements'] = '';
			}
			else {
				$settings['extended_valid_elements'] .= ',';
			}

			$settings['extended_valid_elements'] .= '@[id|class|data|data*|style|title|itemscope|itemtype|itemprop|datetime|rel],div,dl,ul,dt,dd,li[data-id],span[*],a|rev|charset|href|lang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur]';

			$style_formats = array(
				array(
					'title'         =>  'Headlines',
					'items'         =>  array(
						array(
							'title'         =>  'Custom Heading',
							'block'         =>  'h2',
							'styles'        =>  array(
								'color'         => '#444',
							),
							'classes'       => 'custom-heading',
						),
					),
				),
				array(
					'title'         =>  'Paragraph',
					'items'         =>  array(
						array(
							'title'         =>  __( 'Dropcap', 'tailor' ),
							'block'         =>  'p',
							'classes'       =>  'dropcap',
						),
						array(
							'title'         =>  __( 'Lede', 'tailor' ),
							'inline'        =>  'span',
							'classes'       =>  'lede',
						),
						array(
							'title'         =>  __( 'Pullquote', 'tailor' ),
							'block'         =>  'div',
							'classes'       =>  'pullquote',
						),
						array(
							'title'         =>  __( 'Pullquote Right', 'tailor' ),
							'block'         =>  'div',
							'classes'       =>  'pullquote pullquote--right',
						),
					),
				),
				array(
					'title'         =>  'Inline',
					'items'         =>  array(
						array(
							'title'         =>  'Superscript',
							'icons'         =>  'superscript',
							'format'        =>  'superscript',
						),
						array(
							'title'         =>  'Subscript',
							'icons'         =>  'subscript',
							'format'        =>  'subscript',
						),
						array(
							'title'         =>  'Strikethrough',
							'icons'         =>  'strikethrough',
							'format'        =>  'strikethrough',
						),
						array(
							'title'         =>  'Code',
							'icons'         =>  'code',
							'format'        =>  'code',
						),
					),
				),
			);

			// Merge the style formats which any pre-existing ones
			if ( ! empty( $settings['style_formats'] ) ) {
				$style_formats = array_merge( json_decode( $settings['style_formats'], true ), $style_formats );
			}
			$settings['style_formats'] = json_encode( $style_formats );

			return $settings;
		}

		function add_mce_button( $buttons ) {
			array_push( $buttons, $this->id );
			return $buttons;
		}

		function add_mce_script( $plugin_array ) {
			$extension = SCRIPT_DEBUG ? '.js' : '.min.js';
			$plugin_array[ $this->id ] = tailor()->plugin_url() . "assets/js/dist/tinymce{$extension}";
			$plugin_array['noneditable'] = tailor()->plugin_url() . 'assets/js/dist/vendor/noneditable.min.js';
			return $plugin_array;
		}

		function register_mce_locale( $locales ) {
			$locales[ $this->id ] = tailor()->plugin_dir() . 'languages/tinymce-localization.php';
			return $locales;
		}
	}
}

/**
 * Returns the Tailor TinyMCE instance.
 *
 * @since 1.0.0
 *
 * @return Tailor_TinyMCE
 */
function tailor_tinymce() {
	return Tailor_TinyMCE::instance();
}

/**
 * Initializes the Tailor TinyMCE instance.
 *
 * @since 1.0.0
 */
tailor_tinymce();