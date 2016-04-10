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
		$page_title = __( 'Tailor', tailor()->textdomain() );

		/**
		 * Filters the user capability required to manage plugin settings.
		 *
		 * @since 1.0.0
		 *
		 * @param string
		 */
		$page_capability = apply_filters( 'tailor_settings_page_capability', 'manage_options' );

		$options_page = add_options_page( $page_title, $page_title,	$page_capability, TAILOR_SETTING_ID, array( $this, 'render_page' ) );

		add_action( 'load-' . $options_page, array( $this, 'add_help_tab' ) );
	}

	/**
	 * Adds a help tab to the Settings page.
	 *
	 * @since 1.0.0
	 */
	public function add_help_tab() {

		$screen = get_current_screen();

		ob_start();

		tailor_partial( 'admin/help', 'settings' );

		$content = ob_get_clean();
		$screen->add_help_tab( array(
			'id'	        =>  'tailor-settings-help',
			'title'	        =>  __( 'Tailor settings', tailor()->textdomain() ),
			'content'	    =>  $content,
		) );
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
			__( 'General', tailor()->textdomain() ),	    // The section title
			null,	                                        // The section rendering function
			$setting_id		                                // The settings page ID
		);

		$post_type_field_id = 'post_types';
		$post_type_field_label = __( 'Post types', tailor()->textdomain() );

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

		$role_field_id = 'roles';
		$role_field_label = __( 'User roles', tailor()->textdomain() );

		add_settings_field(
			$role_field_id,
			$role_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id,
			array(
				'label'             =>  $role_field_label,
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $role_field_id . ']',
				'value'             =>  tailor_get_setting( $role_field_id ),
				'options'           =>  tailor_get_roles(),
			)
		);

		$role_field_id = 'content_placeholder';
		$role_field_label = __( 'Content placeholder', tailor()->textdomain() );

		add_settings_field(
			$role_field_id,
			$role_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id,
			array(
				'label'             =>  $role_field_label,
				'type'              =>  'textarea',
				'name'              =>  $setting_id . '[' . $role_field_id . ']',
				'value'             =>  tailor_get_setting( $role_field_id, tailor_do_shakespeare() ),
				'options'           =>  tailor_get_roles(),
			)
		);

		add_settings_section(
			$setting_id . '_elements',
			__( 'Element list', tailor()->textdomain() ),
			null,
			$setting_id
		);

		$element_descriptions_field_id = 'show_element_descriptions';
		$element_descriptions_field_label = __( 'Descriptions', tailor()->textdomain() );

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
					'on'                =>  __( 'Show element descriptions?')
				),
			)
		);

		$inactive_elements_field_id = 'show_inactive_elements';
		$inactive_elements_field_label = __( 'Inactive elements', tailor()->textdomain() );

		add_settings_field(
			$inactive_elements_field_id,
			$inactive_elements_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_elements',
			array(
				'type'              =>  'checkbox',
				'name'              =>  $setting_id . '[' . $inactive_elements_field_id . ']',
				'value'             =>  tailor_get_setting( $inactive_elements_field_id ),
				'options'           =>  array(
					'on'                =>  __( 'Show inactive elements?')
				),
			)
		);

		add_settings_section(
			$setting_id . '_icons',
			__( 'Icons', tailor()->textdomain() ),
			array( $this, 'render_icon_section_description' ),
			$setting_id
		);

		$icon_field_id = 'icon_kits';
		$icon_field_label = __( 'Icon kits', tailor()->textdomain() );

		add_settings_field(
			$icon_field_id,
			$icon_field_label,
			array( $this, 'render_field' ),
			$setting_id,
			$setting_id . '_icons',
			array(
				'label'             =>  $icon_field_label,
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
		tailor_partial( 'admin/page', 'settings', $args );
	}

	/**
	 * Renders the description for the Icon Kit field.
	 *
	 * @since 1.0.0
	 *
	 * @param $args
	 */
	public function render_icon_section_description( $args ) {
		printf(
			'<p>%s <a href="http://icomoon.io/app" target="_blank">%s</a> %s</p>',
			__( 'Select an existing icon kit from your Media Library or ', tailor()->textdomain() ),
			__( 'create', tailor()->textdomain() ),
			__( 'and upload one.', tailor()->textdomain() )
		);
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
			<legend class="screen-reader-text">
				<span><?php esc_attr_e( $args['label'] ); ?></span>
			</legend>

			<?php tailor_partial( 'admin/field', $args['type'], $args ); ?>

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

		$extension = SCRIPT_DEBUG ? '.js' : '.min.js';

		wp_enqueue_media();
		wp_enqueue_script(
			'tailor-admin',
			tailor()->plugin_url() . 'assets/js/dist/admin' . $extension,
			array(),
			tailor()->version()
		);

		wp_localize_script( 'tailor-admin', 'iconKitNonce', wp_create_nonce( 'tailor-modify-icon-kits' ) );
	}

	/**
	 * Prints the admin Underscore JS Partials.
	 *
	 * @since 1.0.0
	 */
	public function print_js_partials() {
		tailor_partial( 'underscore/admin', 'notice' );
	}
}

Tailor_Settings::get_instance();