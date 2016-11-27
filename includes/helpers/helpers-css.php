<?php

/**
 * CSS helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.7.2
 */

if ( ! function_exists( 'tailor_get_style_values' ) ) {

	/**
	 * Returns an associative array of style positions and values.
	 *
	 * @since 1.7.2
	 *
	 * @param $string
	 *
	 * @return array
	 */
	function tailor_get_style_values( $string ) {
		if ( empty( $string ) ) {
			return array();
		}

		if ( false !== strpos( $string, ',' ) ) {
			$values = explode( ',', $string );
		}
		else {
			$values = explode( '-', $string );
		}

		if ( 2 == count( $values ) ) {
			$positions = array( 'top', 'bottom' );
		}
		else if ( 4 == count( $values ) ) {
			$positions = array( 'top', 'right', 'bottom', 'left' );
		}
		else {
			return array();
		}

		return array_combine( $positions, $values );
	}
}

if ( ! function_exists( 'tailor_get_numeric_value' ) ) {

	/**
	 * Returns the numeric value contained in a given CSS declaration.
	 *
	 * @since 1.7.2
	 *
	 * @param $string
	 *
	 * @return string
	 */
	function tailor_get_numeric_value( $string ) {
		return preg_replace( '/[^0-9,.]+/i', '', $string );
	}
}

if ( ! function_exists( 'tailor_get_unit' ) ) {

	/**
	 * Returns the unit within a given CSS declaration.
	 *
	 * @since 1.7.2
	 *
	 * @param string $string
	 * @param string $default
	 *
	 * @return string
	 */
	function tailor_get_unit( $string, $default = 'px' ) {
		$map = array(
			"px",
			"%",
			"in",
			"cm",
			"mm",
			"pt",
			"pc",
			"em",
			"rem",
			"ex",
			"vw",
			"vh",
		);
		if ( 1 == preg_match( '/' .  implode( '|', $map ) . '/', (string) $string, $matches ) ) {
			return $matches[0];
		}
		return $default;
	}
}

if ( ! function_exists( 'tailor_generate_general_css_rules' ) ) {

	/**
	 * Returns CSS rules associated with default element settings in the General section.
	 *
	 * @since 1.7.2
	 *
	 * @param $css_rules
	 * @param $atts
	 * @param array $selectors
	 *
	 * @return array
	 */
	function tailor_generate_general_css_rules( $css_rules, $atts, $selectors = array() ) {

		// If custom selectors are provided, only process the rules associated with them
		$keys = array_keys( $selectors );
		if ( ! empty( $keys ) ) {
			$atts = array_intersect_key( $atts, array_flip( $keys ) );
		}

		$selectors = wp_parse_args( $selectors, array(
			'max_width'                 =>  array(),
			'min_height'                =>  array(),
			'min_item_height'           =>  array( '.tailor-grid__item' ),
			'item_spacing'              =>  array( '.entry:not(:last-child)', '.tailor-attachment:not(:last-child)' ),
		) );

		$screen_sizes = array(
			'',
			'tablet',
			'tablet',
			'mobile',
		);

		// Max width and min heights
		$attributes = array(
			'max_width'             =>  'max-width',
			'min_height'            =>  'min-height',
			'min_item_height'       =>  'min-height',
		);
		foreach ( $screen_sizes as $screen_size ) {

			$postfix = empty( $screen_size ) ? '' : "_{$screen_size}";
			foreach ( $attributes as $setting => $attr ) {
				$setting_id = ( $setting . $postfix );
				if ( ! empty( $atts[ $setting_id ] ) ) {
					$unit = tailor_get_unit( $atts[ $setting_id ] );
					$value = tailor_get_numeric_value( $atts[ $setting_id ] );
					$rule = array(
						'setting'               =>  $setting_id,
						'media'                 =>  $screen_size,
						'selectors'             =>  array_key_exists( $setting_id, $selectors ) ? $selectors[ $setting_id ]: $selectors[ $setting ],
						'declarations'          =>  array(),
					);
					$rule['declarations'][ $attr ] = esc_attr( ( $value . $unit ) );
					$css_rules[] = $rule;
				}
			}

			$setting_id = ( 'item_spacing' . $postfix );
			if ( ! empty( $atts[ $setting_id ] ) ) {
				$unit = tailor_get_unit( $atts[ $setting_id ] );
				$value = tailor_get_numeric_value( $atts[ $setting_id ] );
				if ( 'carousel' == $atts['layout'] ) {
					$css_rules[] = array(
						'setting'               =>  $setting_id,
						'media'                 =>  $screen_size,
						'selectors'             =>  array( '.tailor-carousel__item' ),
						'declarations'          =>  array(
							'padding-left'          =>  esc_attr( ( ( $value / 2 ) . $unit ) ),
							'padding-right'         =>  esc_attr( ( ( $value / 2 ) . $unit ) ),
						),
					);
				}
				else if ( 'grid' == $atts['layout'] ) {
					$css_rules[] = array(
						'setting'               =>  $setting_id,
						'media'                 =>  $screen_size,
						'selectors'             =>  array( '.tailor-grid__item' ),
						'declarations'          =>  array(
							'padding'               =>  esc_attr( ( ( $value / 2 ) . $unit ) ),
						),
					);
				}
				else {
					$css_rules[] = array(
						'setting'               =>  $setting_id,
						'media'                 =>  $screen_size,
						'selectors'             =>  array_key_exists( $setting_id, $selectors ) ? $selectors[ $setting_id ]: $selectors[ 'item_spacing' ],
						'declarations'          =>  array(
							'margin-bottom'         =>  esc_attr( ( $value . $unit ) ),
						),
					);
				}
			}
		}
		
		return $css_rules;
	}
}

if ( ! function_exists( 'tailor_generate_color_rules' ) ) {

	/**
	 * Returns CSS rules associated with default element settings in the Colors section.
	 *
	 * @since 1.7.2
	 *
	 * @param $css_rules
	 * @param $atts
	 * @param array $selectors
	 *
	 * @return array
	 */
	function tailor_generate_color_css_rules( $css_rules, $atts, $selectors = array() ) {

		// If custom selectors are provided, only process the rules associated with them
		if ( ! empty( $selectors ) ) {
			$keys = array_keys( $selectors );
			$atts = array_intersect_key( $atts, array_flip( $keys ) );
		}

		$selectors = wp_parse_args( $selectors, array(
			'color'                     =>  array(),
			'color_hover'               =>  array( ':hover' ),
			'link_color'                =>  array( 'a'),
			'link_color_hover'          =>  array( 'a:hover', 'a:focus' ),
			'heading_color'             =>  array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ),
			'background_color'          =>  array(),
			'background_color_hover'    =>  array( ':hover' ),
			'border_color'              =>  array(),
			'navigation_color_dot'      =>  array( '.slick-active button:before' ),
			'navigation_color_arrow'    =>  array( '.slick-arrow:not( .slick-disabled )' ),
		) );

		if ( ! empty( $atts['color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'color',
				'selectors'             =>  $selectors['color'],
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['color'] ),
				),
			);
		}

		if ( ! empty( $atts['color_hover'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'color_hover',
				'selectors'             =>  $selectors['color_hover'],
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['color_hover'] ),
				),
			);
		}

		if ( ! empty( $atts['link_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'link_color',
				'selectors'             =>  $selectors['link_color'],
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['link_color'] ),
				),
			);
		}

		if ( ! empty( $atts['link_color_hover'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'link_color_hover',
				'selectors'             =>  $selectors['link_color_hover'],
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['link_color_hover'] ),
				),
			);
		}

		if ( ! empty( $atts['heading_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'heading_color',
				'selectors'             =>  $selectors['heading_color'],
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['heading_color'] ),
				),
			);
		}

		if ( ! empty( $atts['background_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'background_color',
				'selectors'             =>  $selectors['background_color'],
				'declarations'          =>  array(
					'background-color'      =>  esc_attr( $atts['background_color'] ),
				),
			);
		}

		if ( ! empty( $atts['background_color_hover'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'background_color_hover',
				'selectors'             =>  $selectors['background_color_hover'],
				'declarations'          =>  array(
					'background-color'      =>  esc_attr( $atts['background_color_hover'] ),
				),
			);
		}
		
		if ( ! empty( $atts['border_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'border_color',
				'selectors'             =>  $selectors['border_color'],
				'declarations'          =>  array(
					'border-color'          =>  esc_attr( $atts['border_color'] ),
				),
			);
		}

		if ( ! empty( $atts['border_color_hover'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'border_color_hover',
				'selectors'             =>  $selectors['border_color_hover'],
				'declarations'          =>  array(
					'border-color'          =>  esc_attr( $atts['border_color_hover'] ),
				),
			);
		}

		if ( ! empty( $atts['navigation_color'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'navigation_color',
				'selectors'             =>  $selectors['navigation_color_dot'],
				'declarations'          =>  array(
					'background-color'      =>  esc_attr( $atts['navigation_color'] ),
				),
			);
			$css_rules[] = array(
				'setting'               =>  'navigation_color',
				'selectors'             =>  $selectors['navigation_color_arrow'],
				'declarations'          =>  array(
					'color'                 =>  esc_attr( $atts['navigation_color'] ),
				),
			);
		}

		return $css_rules;
	}
}

if ( ! function_exists( 'tailor_generate_attribute_css_rules' ) ) {

	/**
	 * Returns CSS rules associated with default element settings in the Attributes section.
	 *
	 * @since 1.7.2
	 *
	 * @param $css_rules
	 * @param $atts
	 * @param array $selectors
	 *
	 * @return array
	 */
	function tailor_generate_attribute_css_rules( $css_rules, $atts, $selectors = array() ) {

		// If custom selectors are provided, only process the rules associated with them
		$keys = array_keys( $selectors );
		if ( ! empty( $keys ) ) {
			$atts = array_intersect_key( $atts, array_flip( $keys ) );
		}
		
		$selectors = wp_parse_args( $selectors, array(
			'margin'                    =>  array(),
			'padding'                   =>  array(),
			'border_width'              =>  array(),
			'border_style'              =>  array(),
			'border_radius'             =>  array(),
			'shadow'                    =>  array(),
			'background_image'          =>  array(),
			'background_repeat'         =>  array(),
			'background_position'       =>  array(),
			'background_size'           =>  array(),
			'background_attachment'     =>  array(),
		) );

		$screen_sizes = array(
			'',
			'tablet',
			'mobile',
		);
		
		// Margin, padding and border width
		$attributes = array(
			'margin'                =>  'margin-%s',
			'padding'               =>  'padding-%s',
			'border_width'          =>  'border-%s-width',
		);
		foreach ( $screen_sizes as $screen_size ) {
			$postfix = empty( $screen_size ) ? '' : "_{$screen_size}";
			foreach ( $attributes as $setting => $attr_pattern ) {
				$setting_id = ( $setting . $postfix );
				if ( ! array_key_exists( $setting_id, $atts ) ) {
					continue;
				}
				$styles = tailor_get_style_values( $atts[ $setting_id ] );

				// Generate declarations
				$declarations = array();
				foreach ( (array) $styles as $position => $value ) {
					$sign = '-' == substr( $value, 0, 1 ) ? '-' : '';
					$unit = tailor_get_unit( $value );
					$value = tailor_get_numeric_value( $value );
					if ( is_numeric( $value ) ) {
						$declarations[ sprintf( $attr_pattern, $position ) ] = esc_attr( $sign . $value . $unit );
					}
				}

				// Add rule
				if ( ! empty( $declarations ) ) {
					$css_rules[] = array(
						'media'                 =>  $screen_size,
						'setting'               =>  $setting_id,
						'selectors'             =>  array_key_exists( $setting_id, $selectors ) ? $selectors[ $setting_id ]: $selectors[ $setting ],
						'declarations'          =>  $declarations,
					);
				}
			}
		}

		// Border style, border radius and box shadow
		if ( ! empty( $atts['border_style'] ) ) {
			$css_rules[] = array(
				'setting'               =>  'border_style',
				'selectors'             =>  $selectors['border_style'],
				'declarations'          =>  array(
					'border-style'          =>  esc_attr( $atts['border_style'] ),
				),
			);
			
			if ( 'none' !== $atts['border_style'] ) {
				
				if ( ! empty( $atts['border_radius'] ) ) {
					$css_rules[] = array(
						'setting'               =>  'border_radius',
						'selectors'             =>  $selectors['border_radius'],
						'declarations'          =>  array(
							'border-radius'         =>  esc_attr( $atts['border_radius'] ),
						),
					);
				}
				
				if ( ! empty( $atts['shadow'] ) ) {
					$css_rules[] = array(
						'setting'               =>  'shadow',
						'selectors'             =>  $selectors['shadow'],
						'declarations'          =>  array(
							'box-shadow'            =>  '0 2px 6px rgba(0, 0, 0, 0.1)',
						),
					);
				}
			}
		}

		// Background image (and related attributes)
		if ( ! empty( $atts['background_image'] ) && is_numeric( $atts['background_image'] ) ) {
			$background_image_info = wp_get_attachment_image_src( trim( $atts['background_image'] ), 'full' );
			$background_image_src = $background_image_info[0];
			
			if ( ! empty( $atts['background_color'] ) ) {
				if ( false !== strpos( $atts['background_color'], 'rgba' ) ) {

					// Semi transparent color over image
					// @see: https://css-tricks.com/tinted-images-multiple-backgrounds/
					$css_rules[] = array(
						'setting'               =>  'background_image',
						'selectors'             =>  $selectors['background_image'],
						'declarations'          =>  array(
							'background'        =>  esc_attr(
								"linear-gradient( {$atts['background_color']}, {$atts['background_color']} ), 
								url({$background_image_src}) center center no-repeat"
							),
						),
					);
				}
				else {

					// Image over color
					$css_rules[] = array(
						'setting'               =>  'background_image',
						'selectors'             =>  $selectors['background_image'],
						'declarations'          =>  array(
							'background'            =>  esc_attr(
								"{$atts['background_color']} url({$background_image_src}) center center no-repeat"
							),
						),
					);
				}
			}
			else {
				
				// Standard background image
				$css_rules[] = array(
					'setting'               =>  'background_image',
					'selectors'             =>  $selectors['background_image'],
					'declarations'          =>  array(
						'background'            =>  "url('{$background_image_src}') center center no-repeat",
					),
				);
			}

			if ( ! empty( $atts['background_repeat'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_repeat',
					'selectors'             =>  $selectors['background_repeat'],
					'declarations'          =>  array(
						'background-repeat'     =>  esc_attr( $atts['background_repeat'] ),
					),
				);
			}

			if ( ! empty( $atts['background_position'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_position',
					'selectors'             =>  $selectors['background_position'],
					'declarations'          =>  array(
						'background-position'   =>  esc_attr( $atts['background_position'] ),
					),
				);
			}

			if ( ! empty( $atts['background_size'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_size',
					'selectors'             =>  $selectors['background_size'],
					'declarations'          =>  array(
						'background-size'       =>  esc_attr( $atts['background_size'] ),
					),
				);
			}

			if ( ! empty( $atts['background_attachment'] ) ) {
				$css_rules[] = array(
					'setting'               =>  'background_attachment',
					'selectors'             =>  $selectors['background_attachment'],
					'declarations'          =>  array(
						'background-attachment'     =>  esc_attr( $atts['background_attachment'] ),
					),
				);
			}
		}

		return $css_rules;
	}
}

if ( ! function_exists( 'tailor_css_presets' ) ) {

	/**
	 * Returns the CSS rules associated with the default controls.
	 *
	 * @since 1.0.0
	 *
	 * @param array $css_rules
	 * @param array $atts
	 * @param array $excluded_settings
	 *
	 * @return array $css_rules
	 */
	function tailor_css_presets( $css_rules = array(), $atts = array(), $excluded_settings = array() ) {

		// Remove values for excluded settings
		if ( ! empty( $excluded_settings ) ) {
			$atts = array_diff_key( $atts, array_flip( $excluded_settings ) );
		}

		// General
		$css_rules = tailor_generate_general_css_rules( $css_rules, $atts );
		
		// Colors
		$css_rules = tailor_generate_color_css_rules( $css_rules, $atts );

		// Attributes
		$css_rules = tailor_generate_attribute_css_rules( $css_rules, $atts );

		return $css_rules;
	}
}