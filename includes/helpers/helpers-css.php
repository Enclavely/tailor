<?php

/**
 * CSS helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.4.0
 */

if ( ! function_exists( 'tailor_add_dynamic_css' ) ) {

	/**
	 * Updates custom CSS with rules based on Customizer/page settings.
	 *
	 * @since 1.4.0
	 *
	 * @param string $custom_page_css
	 * @return mixed|void
	 */
	function tailor_add_dynamic_css( $custom_page_css ) {
		$post_id = get_the_ID();
		$css_rule_sets = tailor_css()->get_setting_css_rules();

		if ( ! empty( $css_rule_sets ) ) {
			foreach ( $css_rule_sets as $setting_id => $css_rules ) {

				$setting_value = get_post_meta( $post_id, $setting_id, true );

				if ( empty( $setting_value ) ) {
					continue;
				}
				
				if ( ! empty( $css_rules ) ) {
					foreach ( $css_rules as $css_rule ) {
						$selectors = implode(  ",\n", $css_rule['selectors'] );
						$declarations = tailor_css()->parse_declarations( $css_rule['declarations'], '' );
						$custom_page_css .= str_replace( '{{value}}', $setting_value, "{$selectors} {\n{$declarations}}\n" );
					}
				}
			}
		}

		return $custom_page_css;
	}

	add_filter( 'tailor_get_custom_css', 'tailor_add_dynamic_css' );
}