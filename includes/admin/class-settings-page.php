<?php

/**
 * Tailor Admin Settings class.
 *
 * @package Tailor
 * @subpackage Admin
 * @since 1.0.0
 */

class Tailor_Settings {

	/**
	 * The settings page instance.
	 *
	 * @since 1.0.0
	 * @access private
	 * @var Tailor_Settings
	 */
	private static $instance;

	/**
	 * Returns a singleton instance of the tailor settings page.
	 *
	 * @since 1.0.0
	 *
	 * @return Tailor_Settings
	 */
	public static function get_instance() {
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
	function __construct() {
		$this->add_actions();
	}

	/**
	 * Adds required action hooks.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function add_actions() {
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_menu', array( $this, 'register_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_print_scripts-settings_page_' . TAILOR_SETTING_ID, array( $this, 'print_js_partials' ) );
	}

	/**
	 * Adds the settings page.
	 *
	 * @since 1.0.0
	 */
	function register_page() {
		$page_title = __( 'Tailor', 'tailor' );

		/**
		 * Filters the user capability required to manage plugin settings.
		 *
		 * @since 1.0.0
		 *
		 * @param string
		 */
		$page_capability = apply_filters( 'tailor_settings_page_capability', 'manage_options' );

		add_options_page( $page_title, $page_title,	$page_capability, TAILOR_SETTING_ID, array( $this, 'render_page' ) );
	}

	/**
	 * Registers the plugin admin settings.
	 *
	 * @since 1.0.0
	 */
	public function register_settings() {
		$setting_id = TAILOR_SETTING_ID;

		register_setting( $setting_id, $setting_id );

		add_settings_section(
			$setting_id,			                        // The section ID
			__( 'General', 'tailor' ),	                    // The section title
			null,	                                        // The section rendering function
			$setting_id		                                // The settings page ID
		);

		$post_type_field_id = 'post_types';
		$post_type_field_label = __( 'Enabled post types', 'tailor' );
		add_settings_field(
			$post_type_field_id,						    // The field ID
			$post_type_field_label,                         // The field label
			array( $this, 'render_field' ),	                // The field rendering function
			$setting_id	,                                   // The settings page ID
			$setting_id,			                        // The setting section ID
			array(                                          // The field arguments
				'label'             =>  $post_type_field_label,
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $post_type_field_id . ']',
				'value'             =>  tailor_get_setting( $post_type_field_id ),
				'options'           =>  tailor_get_post_types(),
			)
		);

		$role_field_id = 'restricted_roles';
		$role_field_label = __( 'Restricted user roles', 'tailor' );
		add_settings_field(
			$role_field_id,
			$role_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id,
			array(
				'label'             =>  $role_field_label,
				'description'       =>  __( 'By default, user roles that can manage options or edit posts can Tailor posts.', 'tailor' ),
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $role_field_id . ']',
				'value'             =>  tailor_get_setting( $role_field_id ),
				'options'           =>  tailor_get_roles(),
			)
		);

		add_settings_section(
			$setting_id . '_elements',
			__( 'Elements', 'tailor' ),
			null,
			$setting_id
		);

		$element_descriptions_field_id = 'show_element_descriptions';
		$element_descriptions_field_label = __( 'Descriptions', 'tailor' );
		add_settings_field(
			$element_descriptions_field_id,
			$element_descriptions_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_elements',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $element_descriptions_field_id . ']',
				'value'             =>  tailor_get_setting( $element_descriptions_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Show element descriptions in the Elements list?', 'tailor' )
				),
			)
		);

		$inactive_elements_field_id = 'show_inactive_elements';
		$inactive_elements_field_label = __( 'Inactive elements', 'tailor' );
		add_settings_field(
			$inactive_elements_field_id,
			$inactive_elements_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_elements',
			array(
				'type'              =>  'checkbox',
				'description'       =>  __( 'Inactive elements are those that depend on a third-party plugin to work (e.g., Contact Form 7).', 'tailor' ),
				'name'              =>  $setting_id . '[' . $inactive_elements_field_id . ']',
				'value'             =>  tailor_get_setting( $inactive_elements_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Show inactive elements in the Elements list?', 'tailor' )
				),
			)
		);

		$role_field_id = 'content_placeholder';
		$role_field_label = __( 'Content placeholder', 'tailor' );
		add_settings_field(
			$role_field_id,
			$role_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_elements',
			array(
				'label'             =>  $role_field_label,
				'type'              =>  'textarea',
				'name'              =>  $setting_id . '[' . $role_field_id . ']',
				'value'             =>  tailor_get_setting( $role_field_id, __( 'This is placeholder text which you can replace by editing this element.', 'tailor' ) ),
				'options'           =>  tailor_get_roles(),
			)
		);

		add_settings_section(
			$setting_id . '_features',
			__( 'Features', 'tailor' ),
			null,
			$setting_id
		);

		$api_field_id = 'enable_widgets';
		$api_field_label = __( 'Widgets', 'tailor' );
		add_settings_field(
			$api_field_id,
			$api_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $api_field_id . ']',
				'value'             =>  tailor_get_setting( $api_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Enable WordPress and third-party widgets?', 'tailor' )
				),
			)
		);

		$api_field_id = 'enable_rest_api';
		$api_field_label = __( 'REST API', 'tailor' );
		add_settings_field(
			$api_field_id,
			$api_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $api_field_id . ']',
				'value'             =>  tailor_get_setting( $api_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Enable the Tailor REST API?', 'tailor' )
				),
			)
		);

		$custom_css_field_id = 'hide_css_editor';
		$custom_css_field_label = __( 'Custom CSS', 'tailor' );
		add_settings_field(
			$custom_css_field_id,
			$custom_css_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $custom_css_field_id . ']',
				'value'             =>  tailor_get_setting( $custom_css_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Hide the custom CSS editor?', 'tailor' )
				),
			)
		);

		$custom_js_field_id = 'hide_js_editor';
		$custom_js_field_label = __( 'Custom JavaScript', 'tailor' );
		add_settings_field(
			$custom_js_field_id,
			$custom_js_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $custom_js_field_id . ']',
				'value'             =>  tailor_get_setting( $custom_js_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Hide the custom JavaScript editor?', 'tailor' )
				),
			)
		);

		$scripts_field_id = 'enable_scripts_all_pages';
		$scripts_field_label = __( 'Styles and scripts', 'tailor' );
		add_settings_field(
			$scripts_field_id,
			$scripts_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $scripts_field_id . ']',
				'value'             =>  tailor_get_setting( $scripts_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Load CSS and JavaScript on pages that have not been Tailored?', 'tailor' )
				),
			)
		);

		$google_maps_api_key_field_id = 'google_maps_api_key';
		$google_maps_api_key_field_label = __( 'Google Maps API key', 'tailor' );
		add_settings_field(
			$google_maps_api_key_field_id,
			$google_maps_api_key_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'type'              =>  'text',
				'description'       => sprintf(
					__( '%1$sLearn more%2$s about creating your own Google Maps API key', 'tailor' ),
					'<a href="https://medium.com/@tailorwp/using-the-google-maps-api-with-tailor-1c4d12f3f7a3" target="_blank">',
					'</a>'
				),
				'name'              =>  $setting_id . '[' . $google_maps_api_key_field_id . ']',
				'value'             =>  tailor_get_setting( $google_maps_api_key_field_id ),
			)
		);

		$attributes_field_id = 'hide_attributes_panel';
		$attributes_field_label = __( 'Advanced settings', 'tailor' );
		add_settings_field(
			$attributes_field_id,
			$attributes_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $attributes_field_id . ']',
				'value'             =>  tailor_get_setting( $attributes_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Hide the Attributes panel when editing elements?', 'tailor' )
				),
			)
		);

		$icon_field_id = 'icon_kits';
		$icon_field_label = __( 'Icon kits', 'tailor' );
		add_settings_field(
			$icon_field_id,
			$icon_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_features',
			array(
				'label'             =>  $icon_field_label,
				'description'       =>  sprintf(
					__( 'Select an existing icon kit from your Media Library or %1$screate%2$s and upload the %3$s.zip%4$s file containing one.', 'tailor' ),
					'<a href="http://icomoon.io/app" target="_blank">',
					'</a>',
					'<code>',
					'</code>'
				),
				'type'              =>  'icon',
				'name'              =>  $setting_id . '[' . $icon_field_id . ']',
				'value'             =>  tailor_get_setting( $icon_field_id ),
				'options'           =>  tailor_icons()->get_icon_kits(),
			)
		);

		/**
		 * Fires after the admin setting sections and fields have been registered.
		 *
		 * @since 1.0.0
		 *
		 * @param Tailor_Settings $this
		 */
		do_action( 'tailor_register_admin_settings', $this );
	}

	/**
	 * Renders the settings page.
	 *
	 * @since 1.0.0
	 */
	public function render_page() {
		$args = array( 'page' => TAILOR_SETTING_ID );
		tailor_partial( 'admin/html/page', 'settings', $args );
	}

	/**
	 * Returns the HTML for a field.
	 *
	 * @since 1.0.0
	 *
	 * @param $args
	 */
	public function render_field( $args ) { ?>

		<fieldset>

			<?php
			if ( isset( $args['label'] ) ) {
				printf( '<legend class="screen-reader-text"><span>%s</span></legend>', esc_attr( $args['label'] ) );
			}

			tailor_partial( 'admin/field', $args['type'], $args );

			if ( isset( $args['description'] ) ) {
				printf( '<p class="description">%s</p>', $args['description'] );
			} ?>

		</fieldset>

		<?php
	}

	/**
	 * Enqueues styles for the administrative backend.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook
	 */
	public function enqueue_styles( $hook ) {
		if ( ( 'settings_page_' . TAILOR_SETTING_ID ) !== $hook ) {
			return;
		}

		$extension = SCRIPT_DEBUG ? '.css' : '.min.css';

		wp_enqueue_style(
			'tailor-admin',
			tailor()->plugin_url() . 'assets/css/admin' . $extension,
			array(),
			tailor()->version()
		);
	}

	/**
	 * Enqueues scripts for the administrative backend.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook
	 */
	public function enqueue_scripts( $hook ) {

		if ( ( 'settings_page_' . TAILOR_SETTING_ID ) !== $hook ) {
			return;
		}

		wp_enqueue_media();

		$handle = 'tailor-admin';

		wp_enqueue_script(
			$handle,
			tailor()->plugin_url() . 'assets/js/dist/admin' . ( SCRIPT_DEBUG ? '.js' : '.min.js' ),
			array(),
			tailor()->version()
		);

		wp_localize_script( $handle, '_l10n', array(
			'selectKit'         =>  __( 'Select kit', 'tailor' ),
		) );

		wp_localize_script( $handle, '_nonces', array(
			'saveKit'           =>  wp_create_nonce( 'tailor-save-icon-kit' ),
			'deleteKit'         =>  wp_create_nonce( 'tailor-delete-icon-kit' ),
		) );
	}

	/**
	 * Prints the admin Underscore JS Partials.
	 *
	 * @since 1.0.0
	 */
	public function print_js_partials() {
		tailor_partial( 'admin/html/notice' );
	}
}

Tailor_Settings::get_instance();