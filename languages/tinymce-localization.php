<?php

/**
 * Localizes the custom Tailor Icon TinyMCE plugin.
 *
 * @package Tailor
 * @subpackage Localization
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( '_WP_Editors' ) ) {
	require( ABSPATH . WPINC . '/class-wp-editor.php' );
}

/**
 * Localizes strings used by the custom Tailor Icon TinyMCE plugin.
 *
 * @since 1.0.0
 *
 * @return string
 */
function tailor_tinymce_localization() {

	$strings = array(
		'title'             =>  __( 'Select Icon', 'tailor' ),
		'select'            =>  __( 'Select', 'tailor' ),
	);
	$locale = _WP_Editors::$mce_locale;
	$translated = 'tinyMCE.addI18n( "' . $locale . '.tailoricon", ' . json_encode( $strings ) . ");\n";

	return $translated;
}

$strings = tailor_tinymce_localization();