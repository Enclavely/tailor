<?php

/**
 * Color helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_advanced_add_section' ) ) {

	/**
	 * Adds a color section to the Customizer.
	 *
	 * @since 1.7.2
	 *
	 * @param array $sections
	 *
	 * @return array $sections
	 */
	function tailor_advanced_add_section( $sections ) {
		$sections['tailor_colors'] = array(
			'title'                     =>  __( 'Colors', 'tailor' ),
			'priority'                  =>  count( $sections ) * 10 + 10,
			'panel'                     =>  'tailor',
		);
		return $sections;
	}

	add_filter( 'tailor_customizer_sections', 'tailor_advanced_add_section' );
}

if ( ! function_exists( 'tailor_advanced_add_settings' ) ) {

	/**
	 * Adds color settings and controls to the Customizer.
	 *
	 * @since 1.7.2
	 *
	 * @param array $settings
	 *
	 * @return array $settings
	 */
	function tailor_advanced_add_settings( $settings ) {

		$colors = array(
			'1' => '#000000', // Black
			'2' => '#ffffff', // White
			'3' => '#dd3333', // Red
			'4' => '#dd9933', // Orange
			'5' => '#eeee22', // Yellow
			'6' => '#81d742', // Green
			'7' => '#1e73be', // Blue
			'8' => '#8224e3', // Purple
		);

		foreach ( $colors as $number => $default ) {
			$settings[ "tailor_color_{$number}" ] = array(
				'setting'                   =>  array(
					'sanitize_callback'         =>  'sanitize_hex_color',
					'default'                   =>  $default,
				),
				'control'                   => array(
					'label'                     =>  sprintf( __( 'Color %s', 'tailor' ), $number ),
					'type'                      =>  'color',
					'priority'                  =>  $number * 10,
					'section'                   =>  'tailor_colors',
				),
			);
		}

		return $settings;
	}

	add_filter( 'tailor_customizer_settings', 'tailor_advanced_add_settings' );
}

if ( ! function_exists( 'tailor_custom_editor_color_palette' ) ) {

	/**
	 * Adds the custom color palette to the WordPress editor.
	 *
	 * @since 1.7.2
	 *
	 * @param $init
	 *
	 * @return mixed
	 */
	function tailor_custom_editor_color_palette( $init ) {
		$default_colours = array(
			'000000'    =>  __( 'Black', 'tailor' ),
			'993300'    =>  __( 'Burnt orange', 'tailor' ),
			'333300'    =>  __( 'Dark olive', 'tailor' ),
			'003300'    =>  __( 'Dark green', 'tailor' ),
			'003366'    =>  __( 'Dark azure', 'tailor' ),
			'000080'    =>  __( 'Navy Blue', 'tailor' ),
			'333399'    =>  __( 'Indigo', 'tailor' ),
			'333333'    =>  __( 'Very dark gray', 'tailor' ),
			'800000'    =>  __( 'Maroon', 'tailor' ),
			'FF6600'    =>  __( 'Orange', 'tailor' ),
			'808000'    =>  __( 'Olive', 'tailor' ),
			'008000'    =>  __( 'Green', 'tailor' ),
			'008080'    =>  __( 'Teal', 'tailor' ),
			'0000FF'    =>  __( 'Blue', 'tailor' ),
			'666699'    =>  __( 'Grayish blue', 'tailor' ),
			'808080'    =>  __( 'Gray', 'tailor' ),
			'FF0000'    =>  __( 'Red', 'tailor' ),
			'FF9900'    =>  __( 'Amber', 'tailor' ),
			'99CC00'    =>  __( 'Yellow green', 'tailor' ),
			'339966'    =>  __( 'Sea green', 'tailor' ),
			'33CCCC'    =>  __( 'Turquoise', 'tailor' ),
			'3366FF'    =>  __( 'Royal blue', 'tailor' ),
			'800080'    =>  __( 'Purple', 'tailor' ),
			'999999'    =>  __( 'Medium gray', 'tailor' ),
			'FF00FF'    =>  __( 'Magenta', 'tailor' ),
			'FFCC00'    =>  __( 'Gold', 'tailor' ),
			'FFFF00'    =>  __( 'Yellow', 'tailor' ),
			'00FF00'    =>  __( 'Lime', 'tailor' ),
			'00FFFF'    =>  __( 'Aqua', 'tailor' ),
			'00CCFF'    =>  __( 'Sky blue', 'tailor' ),
			'993366'    =>  __( 'Brown', 'tailor' ),
			'C0C0C0'    =>  __( 'Silver', 'tailor' ),
			'FF99CC'    =>  __( 'Pink', 'tailor' ),
			'FFCC99'    =>  __( 'Peach', 'tailor' ),
			'FFFF99'    =>  __( 'Light yellow', 'tailor' ),
			'CCFFCC'    =>  __( 'Pale green', 'tailor' ),
			'CCFFFF'    =>  __( 'Pale cyan', 'tailor' ),
			'99CCFF'    =>  __( 'Light sky blue', 'tailor' ),
			'CC99FF'    =>  __( 'Plum', 'tailor' ),
			'FFFFFF'    =>  __( 'White', 'tailor' ),
		);

		$colors = array(
			'1' => '#000000', // Black
			'2' => '#ffffff', // White
			'3' => '#dd3333', // Red
			'4' => '#dd9933', // Orange
			'5' => '#eeee22', // Yellow
			'6' => '#81d742', // Green
			'7' => '#1e73be', // Blue
			'8' => '#8224e3', // Purple
		);

		$custom_colours = array();
		foreach ( $default_colours as $color => $label ) {
			$custom_colours[] = $color; // . ',' . $label;
			$custom_colours[] = $label;
		}

		foreach ( $colors as $number => $default ) {
			$color = sanitize_hex_color_no_hash( get_theme_mod( "tailor_color_{$number}", $default ) );
			$custom_colours[] = $color;
			$custom_colours[] = sprintf( __( 'Tailor color %s', 'tailor' ), $number );
		}

		$init['textcolor_map'] = json_encode( $custom_colours );
		$init['textcolor_rows'] = 6;

		return $init;
	}

	add_filter( 'tiny_mce_before_init', 'tailor_custom_editor_color_palette' );
}

if ( ! function_exists( 'tailor_custom_colorpicker_palette' ) ) {

	/**
	 * Modifies the default colorpicker palettes.
	 *
	 * @since 1.7.2
	 *
	 * @param array $control_args
	 *
	 * @return array $control_args
	 */
	function tailor_modify_colorpicker( $control_args ) {

		static $pallettes;
		if ( isset( $pallettes ) ) {
			$control_args['palettes'] = $pallettes;
			return $control_args;
		}

		$colors = array(
			'1' => '#000000', // Black
			'2' => '#ffffff', // White
			'3' => '#dd3333', // Red
			'4' => '#dd9933', // Orange
			'5' => '#eeee22', // Yellow
			'6' => '#81d742', // Green
			'7' => '#1e73be', // Blue
			'8' => '#8224e3', // Purple
		);

		$pallettes = array();
		foreach ( $colors as $number => $default ) {
			$pallettes[] = sanitize_hex_color( get_theme_mod( "tailor_color_{$number}", $default ) );
		}

		$control_args['palettes'] = $pallettes;
		return $control_args;
	}

	add_action( 'tailor_control_args_colorpicker', 'tailor_modify_colorpicker' );
}

if ( ! function_exists( 'tailor_adjust_color_brightness' ) ) {

	/**
	 * Adjusts the apparent brightness of a color value.
	 *
	 * @since 1.0.0
	 *
	 * @param $color
	 * @param $percent
	 * @return string
	 */
	function tailor_adjust_color_brightness( $color, $percent ) {
		$percent = max( -1, min( 1, $percent ) );
		$steps = max( -255, min( 255, $percent * 255 ) );

		if ( false !== stripos( $color, '#' ) ) {
			return tailor_adjust_hex_brightness( $color, $steps );
		}
		else if ( false !== stripos( $color, 'rgba' ) ) {
			return tailor_adjust_rgba_brightness( $color, $steps );
		}
		return $color;
	}
}

if ( ! function_exists( 'tailor_adjust_hex_brightness' ) ) {

	/**
	 * Adjusts the apparent brightness of a hexadecimal color value by a given percentage.
	 *
	 * The percent change can be positive or negative (e.g., -0.2 results in a color 20% darker).
	 *
	 * @since 1.0.0
	 *
	 * @see http://stackoverflow.com/questions/3512311/how-to-generate-lighter-darker-color-with-php
	 *
	 * @param string $hex
	 * @param int $steps
	 * @return string
	 */
	function tailor_adjust_hex_brightness( $hex, $steps ) {
		$hex = str_replace( '#', '', $hex );
		if ( 3 == strlen( $hex ) ) {
			$hex = str_repeat( substr( $hex, 0, 1 ), 2 ) .
			       str_repeat( substr( $hex, 1, 1 ), 2 ) .
			       str_repeat( substr( $hex, 2, 1 ), 2 );
		}
		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );
		$r = max( 0, min( 255, $r + $steps ) );
		$g = max( 0, min( 255, $g + $steps ) );
		$b = max( 0, min( 255, $b + $steps ) );
		return '#' .
		       str_pad( dechex( $r ), 2, '0', STR_PAD_LEFT ) .
		       str_pad( dechex( $g ), 2, '0', STR_PAD_LEFT ) .
		       str_pad( dechex( $b ), 2, '0', STR_PAD_LEFT );
	}
}

if ( ! function_exists( 'tailor_adjust_rgba_brightness' ) ) {

	/**
	 * Adjusts the apparent brightness of an RGBA color value.
	 *
	 * @since 1.0.0
	 *
	 * @param $rgba
	 * @param $steps
	 * @return string
	 */
	function tailor_adjust_rgba_brightness( $rgba, $steps ) {
		$rgba = tailor_rgba_to_rgba_array( $rgba );
		$r = max( 0, min( 255, $rgba['r'] + $steps ) );
		$g = max( 0, min( 255, $rgba['g'] + $steps ) );
		$b = max( 0, min( 255, $rgba['b'] + $steps ) );
		return sprintf( 'rgba(%d, %d, %d, %.2f)', $r, $g, $b, $rgba['a']);
	}
}

if ( ! function_exists( 'tailor_rgba_to_rgba_array' ) ) {

	/**
	 * Splits an RGBA color value into an array.
	 *
	 * @since 1.0.0
	 *
	 * @param string $rgba
	 * @return array
	 */
	function tailor_rgba_to_rgba_array( $rgba = '' ) {
		$rgba = trim( str_replace( ' ', '', $rgba ) );
		if ( false !== stripos($rgba, 'rgba' ) ) {
			$result = sscanf( $rgba, "rgba(%d, %d, %d, %f)" );
		}
		else {
			$result = sscanf( $rgba, "rgb(%d, %d, %d)" );
			$result[] = 1;
		}
		return array_combine( array( 'r', 'g', 'b', 'a' ), $result );
	}
}

if ( ! function_exists( 'tailor_rgba_array_to_hex' ) ) {

	/**
	 * Converts an array containing the RGBA color channel values into a hexadecimal color value.
	 *
	 * @since 1.0.0
	 *
	 * @param array $rgba
	 * @return string
	 */
	function tailor_rgba_array_to_hex( $rgba = array() ) {
		$x = 255;
		$y = 0;
		$r = ( is_int( $rgba[0] ) && $rgba[0] >= $y && $rgba[0] <= $x ) ? $rgba[0] : 0;
		$g = ( is_int( $rgba[1] ) && $rgba[1] >= $y && $rgba[1] <= $x ) ? $rgba[1] : 0;
		$b = ( is_int( $rgba[2] ) && $rgba[2] >= $y && $rgba[2] <= $x ) ? $rgba[2] : 0;
		return sprintf( '#%02X%02X%02X', $r, $g, $b );
	}
}

if ( ! function_exists( 'tailor_hex_to_rgb_array' ) ) {

	/**
	 * Converts a hexadecimal color value into an array containing values for each RGB color channel.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return array|string
	 */
	function tailor_hex_to_rgb_array( $color = '' ) {
		if ( false !== strpos( $color, '#' ) ) {
			$color = substr( $color, 1, strlen( $color ) );
		}
		$color = str_split( $color, 2 );
		foreach( $color as $key => $c ) {
			$color[ $key ] = hexdec( $c );
		}
		return $color;
	}
}