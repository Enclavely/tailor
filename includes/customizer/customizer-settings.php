<?php

/**
 * Tailor Customizer setting definitions.
 *
 * @package Tailor
 * @subpackage Customizer
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_get_customizer_settings' ) ) {

    /**
     * Returns the Customizer settings and controls to be registered.
     *
     * @since 1.0.0
     *
     * @return mixed|void
     */
    function tailor_get_customizer_settings() {

        $settings = array(
            'tailor_section_width'      =>  array(
                'setting'                   =>  array(
                    'sanitize_callback'         =>  'tailor_sanitize_text',
                ),
                'control'                   => array(
                    'label'                     =>  __( 'Section width', 'tailor' ),
                    'description'               =>  __( 'The maximum width for sections.', 'tailor' ),
                    'type'                      =>  'text',
                    'priority'                  =>  10,
                    'section'                   =>  'layout',
                ),
            ),
            'tailor_column_spacing'     =>  array(
                'setting'                   =>  array(
                    'sanitize_callback'         =>  'tailor_sanitize_text',
                ),
                'control'                   => array(
                    'label'                     =>  __( 'Column spacing', 'tailor' ),
                    'description'               =>  __( 'The amount of horizontal space to display between columns.', 'tailor' ),
                    'type'                      =>  'text',
                    'priority'                  =>  20,
                    'section'                   =>  'layout',
                ),
            ),
            'tailor_element_spacing'    =>  array(
                'setting'                   =>  array(
                    'sanitize_callback'         =>  'tailor_sanitize_text',
                ),
                'control'                   => array(
                    'label'                     =>  __( 'Element spacing', 'tailor' ),
                    'description'               =>  __( 'The amount of vertical space to display between elements.', 'tailor' ),
                    'type'                      =>  'text',
                    'priority'                  =>  30,
                    'section'                   =>  'layout',
                ),
            ),
        );

	    /**
	     * Filters the plugin Customizer settings.
	     *
	     * @since 1.0.0
	     *
	     * @param array $settings
	     */
        return apply_filters( 'tailor_get_customizer_settings', $settings );
    }
}

if ( ! function_exists( 'tailor_add_dynamic_css' ) ) {

	/**
	 * Updates the custom page CSS with column spacing rules.
	 *
	 * @since 1.0.0
	 *
	 * @param string $custom_page_css
	 * @return mixed|void
	 */
	function tailor_add_dynamic_css( $custom_page_css ) {

		$post_id = get_the_ID();

		$section_width = get_post_meta( $post_id, '_tailor_section_width', true );
		if ( empty( $section_width ) ) {
            $section_width = get_theme_mod( 'tailor_section_width', false );
		}

		if ( ! empty( $section_width ) ) {
			$value = (int) preg_replace( "/[a-z]/", '', $section_width );
			$unit = preg_replace( "/[0-9]/", '', $section_width );

			if ( is_numeric( $value ) ) {
				$custom_page_css .= (
					'@media screen and (min-width: 45em) {' .
						'.tailor-ui .tailor-section__content {' .
							'max-width: ' . $value . $unit . ';' .
						'}' .
					'}'
				);
			}
		}

		$column_spacing = get_post_meta( $post_id, '_tailor_column_spacing', true );
		if ( empty( $column_spacing ) ) {
			$column_spacing = get_theme_mod( 'tailor_column_spacing', false );
		}

		if ( ! empty( $column_spacing ) ) {
			$value = (int) preg_replace( "/[a-z]/", '', $column_spacing ) / 2;
			$unit = preg_replace( "/[0-9]/", '', $column_spacing );

			if ( is_numeric( $value ) ) {
				$custom_page_css .= (
					'.tailor-ui .small-columns .tailor-column {' .
						'padding-left: ' . $value . $unit . ';' .
						'padding-right: ' . $value . $unit . ';' .
					'}' .
					'.tailor-ui .tailor-row.small-columns {' .
						'margin-left: -' . $value . $unit . ';' .
						'margin-right: -' . $value . $unit . ';' .
					'}'
				);
			}
		}

        $element_spacing = get_post_meta( $post_id, '_tailor_element_spacing', true );
        if ( empty( $element_spacing ) ) {
            $element_spacing = get_theme_mod( 'tailor_element_spacing', false );
        }

        if ( ! empty( $element_spacing ) ) {
            $value = (int) preg_replace( "/[a-z]/", '', $element_spacing );
            $unit = preg_replace( "/[0-9]/", '', $element_spacing );

            if ( is_numeric( $value ) ) {
                $custom_page_css .= (
	                '.tailor-ui .tailor-element {' .
	                    'margin-bottom: ' . $value . $unit . ';' .
	                '}'
                    //'@media screen and (min-width: 45em) {' .
                    //    '.tailor-element {' .
                    //        'margin-bottom: ' . $value . $unit . ';' .
                    //    '}' .
                    //'}'
                );
            }
        }

        return $custom_page_css;
	}

	add_filter( 'tailor_get_page_css', 'tailor_add_dynamic_css' );
}