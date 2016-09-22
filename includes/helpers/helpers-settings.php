<?php

/**
 * Setting and sanitization helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_get_setting' ) ) {

    /**
     * Returns the value of a given setting.
     *
     * @since 1.0.0
     *
     * @param string $id
     * @param mixed $default
     * @return mixed
     */
    function tailor_get_setting( $id = '', $default = false ) {
	    $settings = get_option( TAILOR_SETTING_ID );

	    if ( false === $settings ) {
		    $setting_defaults = array(
			    'post_types'                =>  array(
				    'page'                      =>  'on',
			    ),
			    'content_placeholder'       =>  tailor_do_shakespeare(),
			    'show_element_descriptions' =>  array(
				    'on'                        =>  'on',
			    ),
			    'icon_kits'                 =>  array(
				    'dashicons'                 =>  'on',
			    ),
		    );

		    /**
		     * Filters the default setting values.
		     *
		     * @since 1.0.0
		     *
		     * @param array $setting_defaults
		     */
		    $settings = apply_filters( 'tailor_default_settings', $setting_defaults );
	    }

	    if ( ! isset( $settings[ $id ] ) ) {
		    return $default;
	    }

	    return $settings[ $id ];
    }
}

if ( ! function_exists( 'tailor_get_range' ) ) {

	/**
	 * Returns a list of values.
	 *
	 * @since 1.0.0
	 *
	 * @param int $from
	 * @param int $to
	 * @param int $increment
	 * @param array $values
	 * @return array
	 */
	function tailor_get_range( $from = 0, $to = 100, $increment = 1, $values = array() ) {

		for ( $from ; $from <= $to ; $from += $increment ) {
			$values[ $from ] = $from;
		}

		return $values;
	}
}

if ( ! function_exists( 'tailor_strip_unit' ) ) {

	/**
	 * Returns the numerical value and unit for an attribute.
	 *
	 * @since 1.0.0
	 *
	 * @param string $attribute
	 * @return array
	 */
	function tailor_strip_unit( $attribute = '' ) {
		$unit = preg_replace( "/[^a-z]/", '', $attribute );
		$value = str_replace( $unit, '', $attribute );

		return array( $value, $unit );
	}
}

if ( ! function_exists( 'tailor_get_users' ) ) {

	/**
	 * Returns the users IDs for registered users.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	function tailor_get_users() {
		$blogusers = get_users();
		$user_ids = array();
		$user_ids[0] = __( 'Current user', 'tailor' );

		foreach ( $blogusers as $user ) {
			$user_ids[ $user->ID ] = esc_attr( $user->display_name );
		}

		return $user_ids;
	}
}

if ( ! function_exists( 'tailor_get_image_sizes' ) ) {

	/**
	 * Returns a list of the registered image sizes.
	 *
	 * @since 1.0.0
	 *
	 * @param array $exclude
	 * @return array $registered_image_sizes
	 */
	function tailor_get_image_sizes( $exclude = array() ) {

		global $_wp_additional_image_sizes;

		// WordPress default image sizes
		$image_sizes = array(
			'full'              =>  array(
				'width'             =>  'full',
				'height'            =>  'full',
			),
			'thumbnail'         =>  array(
				'width'             =>  get_option( 'thumbnail_size_w' ),
				'height'            =>  get_option( 'thumbnail_size_h' ),
			),
			'medium'            =>  array(
				'width'             =>  get_option( 'medium_size_w' ),
				'height'            =>  get_option( 'medium_size_h' ),
			),
			'large'             =>  array(
				'width'             =>  get_option( 'large_size_w' ),
				'height'            =>  get_option( 'large_size_h' ),
			),
		);

		if ( count( (array) $_wp_additional_image_sizes ) > 0 ) {
			$image_sizes = array_merge( $image_sizes, $_wp_additional_image_sizes  );
		}

		$registered_image_sizes = array();
		foreach ( $image_sizes as $key => $image_size ) {

			if ( in_array( $key, $exclude ) ) {
				continue;
			}

			if ( 'full' == $key ) {
				$label = __( 'Original', 'tailor' );
			}
			else if ( is_numeric( $image_size['width'] ) && is_numeric( $image_size['height'] ) ) {
				$label = sprintf(
					'%1$s (%2$spx x %3$spx)',
					ucwords( str_replace( '_', ' ', str_replace( '-', ' ', $key ) ) ),
					$image_size['width'],
					$image_size['width']
				);
			}
			else {
				continue;
			}

			$registered_image_sizes[ $key ] = $label;
		}

		return $registered_image_sizes;
	}
}

if ( ! function_exists( 'tailor_get_terms' ) ) {

	/**
	 * Returns a list of terms for a given taxonomy.
	 *
	 * @since 1.0.0
	 *
	 * @param string $taxonomy_name
	 * @param array $default_term_args
	 * @return array
	 */
	function tailor_get_terms( $taxonomy_name = 'category', $default_term_args = array() ) {
		$values = array();
		$taxonomies = get_taxonomies( array( 'name' => $taxonomy_name ), 'objects' );
		if ( empty( $taxonomies ) ) {
			return $values;
		}

		$term_args = wp_parse_args( array(
			'public'                =>  true,
			'orderby'				=>	'name',
			'order'         		=>	'ASC',
			'hide_empty'			=>	true
		), $default_term_args );

		if ( 1 == count( $taxonomies ) ) {
			$taxonomy = reset( $taxonomies );
			$term_args['taxonomy'] = $taxonomy->name;
			$terms = get_terms( $term_args['taxonomy'] );
			if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
				foreach ( $terms as $term ) {
					if ( isset( $term->term_id ) ) {
						$values[ $term->term_id ] = $term->name;
					}
				}
			}
		}
		else {
			foreach ( $taxonomies as $taxonomy ) {
				if ( $taxonomy->hierarchical && $taxonomy->show_in_nav_menus ) {
					$term_args['taxonomy'] = $taxonomy->name;
					$terms = get_terms( $term_args );
					if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
						$values[ $taxonomy->labels->name ] = array( $taxonomy->object_type[0] => sprintf( __( 'All %s', 'tailor' ), $taxonomy->labels->name ) );
						foreach ( $terms as $term ) {
							if ( isset( $term->term_id ) ) {
								$values[ $taxonomy->labels->name ][ "{$taxonomy->name}-{$term->term_id}" ] = $term->name;
							}
						}
					}
				}
			}
		}

		return $values;
	}
}

if ( ! function_exists( 'tailor_sanitize_text' ) ) {

	/**
	 * Sanitizes a simple text string.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The string to sanitize.
	 * @return string The sanitized string.
	 */
	function tailor_sanitize_text( $value ) {
		return strip_tags( stripslashes( $value ) );
	}
}

if ( ! function_exists( 'tailor_kses_allowed_html' ) ) {

	/**
	 * Specifies additional allowable HTML tag types for Tailor content.
	 * 
	 * @since 1.5.6
	 * 
	 * @param array $tags
	 * @return array $tags
	 */
	function tailor_kses_allowed_html( $tags, $context ) {

		if ( ! array_key_exists( 'input', $tags ) ) {
			$tags['input'] = array(
				'autocomplete'      =>  1,
				'autofocus'         =>  1,
				'checked'           =>  1,
				'disabled'          =>  1,
				'name'              =>  1,
				'placeholder'       =>  1,
				'readonly'          =>  1,
				'required'          =>  1,
				'size'              =>  1,
				'src'               =>  1,
				'step'              =>  1,
				'type'              =>  1,
				'value'             =>  1,
				'width'             =>  1,
			);
		}

		return $tags;
	}
	
	add_filter( 'wp_kses_allowed_html', 'tailor_kses_allowed_html', 10, 2 );
}

if ( ! function_exists( 'tailor_sanitize_html' ) ) {

	/**
	 * Sanitizes content that could contain HTML.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The HTML string to sanitize.
	 * @return string The sanitized string.
	 */
	function tailor_sanitize_html( $value ) {
		return balanceTags( wp_kses_post( $value ), true );
	}
}

if ( ! function_exists( 'tailor_sanitize_number' ) ) {

	/**
	 * Sanitizes a number value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The value to sanitize.
	 * @param mixed $setting The associated setting.
	 * @return int The sanitized value.
	 */
	function tailor_sanitize_number( $value, $setting ) {
		if ( ! is_numeric( (int) $value ) ) {
			return $setting->default;
		}

		return $value < 0 ? abs( $value ) : $value;
	}
}

if ( ! function_exists( 'tailor_bool_to_string' ) ) {

	/**
	 * Converts a boolean value to a string representation (i.e., 'true' or 'false').
	 *
	 * @since 1.3.3
	 *
	 * @param bool $bool
	 * @return string
	 */
	function tailor_bool_to_string( $bool ) {
		return boolval( $bool ) ? 'true' : 'false';
	}
}

if ( ! function_exists( 'tailor_sanitize_color' ) ) {

	/**
	 * Sanitizes a color value.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color The value to sanitize.
	 * @param mixed $setting The associated setting.
	 * @return string The sanitized RGBA color value.
	 */
	function tailor_sanitize_color( $color, $setting ) {
		if ( ! is_string( $color ) ) {
			return $setting->default;
		}

		if ( '' === $color ) {
			return '';
		}

		if ( false !== stripos( $color, '#' ) ) {
			return sanitize_hex_color( $color );
		}

		if ( false !== stripos( $color, 'rgba' ) ) {
			return tailor_sanitize_rgba( $color );
		}

		return $setting->default;
	}
}

if ( ! function_exists( 'tailor_sanitize_rgba' ) ) {

	/**
	 * Sanitizes an RGBA color value.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color The RGBA color value to sanitize.
	 * @return string The sanitized RGBA color value.
	 */
	function tailor_sanitize_rgba( $color ) {
		$color = str_replace( ' ', '', $color );
		sscanf( $color, 'rgba(%d,%d,%d,%f)', $red, $green, $blue, $alpha );

		return 'rgba(' . $red . ',' . $green . ',' . $blue . ',' . $alpha . ')';
	}
}

if ( ! function_exists( 'sanitize_hex_color' ) ) {

	/**
	 * Sanitizes a hex color.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return string|null
	 */
	function sanitize_hex_color( $color ) {
		if ( '' === $color ) {
			return '';
		}

		if ( preg_match('|^#([A-Fa-f0-9]{3}){1,2}$|', $color ) ) {
			return $color;
		}

		return null;
	}
}

if ( ! function_exists( 'sanitize_hex_color_no_hash' ) ) {

	/**
	 * Sanitizes a hex color without a hash. Use sanitize_hex_color() when possible.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return string|null
	 */
	function sanitize_hex_color_no_hash( $color ) {
		$color = ltrim( $color, '#' );
		if ( '' === $color ) {
			return '';
		}

		return sanitize_hex_color( '#' . $color ) ? $color : null;
	}
}

if ( ! function_exists( 'maybe_hash_hex_color' ) ) {

	/**
	 * Ensures that any hex color is properly hashed.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color
	 * @return string|null
	 */
	function maybe_hash_hex_color( $color ) {
		if ( $unhashed = sanitize_hex_color_no_hash( $color ) ) {
			return '#' . $unhashed;
		}

		return $color;
	}
}

if ( ! function_exists( 'tailor_show_attributes_section' ) ) {

	/**
	 * Shows the element attributes section only if it's not disabled from the admin backend.
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_show_attributes_section() {
		return ! tailor_get_setting( 'hide_attributes_panel' );
	}

	add_filter( 'tailor_enable_element_section_attributes', 'tailor_show_attributes_section', 10 );
}

if ( ! function_exists( 'tailor_show_custom_css_control' ) ) {

	/**
	 * Shows the custom CSS control only if it's not disabled from the admin backend.
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_show_custom_css_control() {
		return ! tailor_get_setting( 'hide_css_editor' );
	}

	add_filter( 'tailor_enable_sidebar_control_custom_css', 'tailor_show_custom_css_control', 10 );
}

if ( ! function_exists( 'tailor_show_custom_js_control' ) ) {

	/**
	 * Shows the custom JavaScript control only if it's not disabled from the admin backend.
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_show_custom_js_control() {
		return ! tailor_get_setting( 'hide_css_editor' );
	}

	add_filter( 'tailor_enable_sidebar_control_custom_js', 'tailor_show_custom_js_control', 10 );
}

if ( ! function_exists( 'tailor_maybe_enable_scripts' ) ) {

	/**
	 * Enables styles and scripts if the current page or post has been (or is being) Tailored
	 * (or the admin override is set to active).
	 *
	 * @since 1.1.1
	 *
	 * @return bool
	 */
	function tailor_maybe_enable_scripts() {
		
		if ( ! is_singular() ) {
			return false;
		}

		if ( tailor()->is_canvas() || tailor()->is_template_preview() ) {
			return true;
		}

		$enable_scripts = tailor_get_setting( 'enable_scripts_all_pages' );
		if ( ! empty( $enable_scripts ) ) {
			return true;
		}

		$post_id = get_the_ID();
		$tailor_layout = get_post_meta( $post_id, '_tailor_layout' );
		return ! empty( $tailor_layout );
	}
	
	add_filter( 'tailor_enable_frontend_styles', 'tailor_maybe_enable_scripts' );
	add_filter( 'tailor_enable_frontend_scripts', 'tailor_maybe_enable_scripts' );
}

if ( ! function_exists( 'tailor_get_registered_media_queries' ) ) {

	/**
	 * Returns the registered media queries.
	 *
	 * @since 1.0.0
	 * 
	 * @param bool $include_all
	 *
	 * @return array
	 */
	function tailor_get_registered_media_queries( $include_all = false ) {
		$media_queries = array(
			'desktop'               =>  array(
				'label'                 =>  __( 'Desktop', 'tailor' ),
				'min'                   =>  '721px',
				'max'                   =>  '',
			),
			'tablet'                =>  array(
				'label'                 =>  __( 'Tablet', 'tailor' ),
				'min'                   =>  '321px',
				'max'                   =>  '720px',
			),
			'mobile'                =>  array(
				'label'                 =>  __( 'Mobile', 'tailor' ),
				'min'                   =>  '',
				'max'                   =>  '320px',
			),
		);
		
		if ( true === $include_all ) {
			$media_queries['all'] = array(
				'label'                 =>  __( 'All', 'tailor' ),
				'min'                   =>  '',
				'max'                   =>  '',
			);
		}

		/**
		 * Filters the registered media queries.
		 *
		 * @since 1.0.0
		 *
		 * @param array $media_queries
		 */
		$media_queries = apply_filters( 'tailor_get_registered_media_queries', $media_queries );

		// Only allow all, mobile, tablet and desktop media queries
		$allowed = array( 'all', 'mobile', 'tablet', 'desktop' ) ;
		
		return array_intersect_key( $media_queries, array_flip( $allowed ) );
	}
}


if ( ! function_exists( 'tailor_get_media_queries' ) ) {

	/**
	 * Returns the registered media queries.
	 *
	 * @since 1.1.3
	 *
	 * @return array
	 */
	function tailor_get_media_queries() {
		$media_queries = array();
		foreach ( tailor_get_registered_media_queries() as $media_query_id => $media_query ) {
			$media_queries[ $media_query_id ] = $media_query['label'];
		}

		return $media_queries;
	}
}

if ( ! function_exists( 'tailor_get_preview_sizes' ) ) {

	/**
	 * Returns the registered media queries.
	 *
	 * @since 1.0.0
	 *
	 * @deprecated 1.1.3 Deprecated in favor of tailor_get_media_queries().
	 */
	function tailor_get_preview_sizes() {
		trigger_error(
			sprintf(
				__( '%1$s is <strong>deprecated</strong> since Tailor version %2$s! Use %3$s instead.', 'tailor' ),
				'tailor_get_preview_sizes',
				'1.1.3',
				'tailor_get_media_queries'
			)
		);

		return tailor_get_registered_media_queries();
	}
}

/**
 * Returns a list of devices to allow previewing.
 *
 * @since 1.1.3
 *
 * @return array|mixed|void
 */
function tailor_get_previewable_devices() {
	$devices = array(
		'desktop' => array(
			'label' => __( 'Enter desktop preview mode', 'tailor' ),
			'default' => true,
		),
		'tablet' => array(
			'label' => __( 'Enter tablet preview mode', 'tailor' ),
		),
		'mobile' => array(
			'label' => __( 'Enter mobile preview mode', 'tailor' ),
		),
	);

	/**
	 * Filter the available devices to allow previewing in the Customizer.
	 *
	 * @since 1.1.3
	 *
	 * @param array $devices List of devices with labels and default setting.
	 */
	$devices = apply_filters( 'customize_previewable_devices', $devices );

	return $devices;
}