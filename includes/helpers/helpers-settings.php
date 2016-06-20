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
			    'roles'                     =>  array(
				    'editor'                    =>  'on',
				    'author'                    =>  'on',
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

if ( ! function_exists( 'tailor_get_registered_media_queries' ) ) {

	/**
	 * Returns the registered media queries.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	function tailor_get_registered_media_queries() {

		$media_queries = array(
			'all'                   =>  array(
				'label'                 =>  __( 'Full', 'tailor' ),
				'min'                   =>  '',
				'max'                   =>  '',
			),
			'x-large'               =>  array(
				'label'                 =>  __( 'Extra large', 'tailor' ),
				'min'                   =>  '1200px',
				'max'                   =>  '',
			),
			'large'                 =>  array(
				'label'                 =>  __( 'Large', 'tailor' ),
				'min'                   =>  '980px',
				'max'                   =>  '1199px',
			),
			'medium'                =>  array(
				'label'                 =>  __( 'Medium', 'tailor' ),
				'min'                   =>  '768px',
				'max'                   =>  '979px',
			),
			'small'                 =>  array(
				'label'                 =>  __( 'Small', 'tailor' ),
				'min'                   =>  '481px',
				'max'                   =>  '767px',
			),
			'x-small'               =>  array(
				'label'                 =>  __( 'Extra small', 'tailor' ),
				'min'                   =>  '',
				'max'                   =>  '480px',
			),
		);

		/**
		 * Filters the registered media queries.
		 *
		 * @since 1.0.0
		 *
		 * @param array $media_queries
		 */
		$media_queries = apply_filters( 'tailor_get_registered_media_queries', $media_queries );

		return $media_queries;
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
			$terms = get_terms( $taxonomy->name, $term_args );
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
					$terms = get_terms( $taxonomy->name, $term_args );
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

if ( ! function_exists( 'tailor_get_preview_sizes' ) ) {

	/**
	 * Returns the available preview sizes.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	function tailor_get_preview_sizes() {

		$registered_media_queries = tailor_get_registered_media_queries();
		$preview_sizes = array();

		foreach( $registered_media_queries as $media_query_id => $media_query_atts ) {
			if ( ! ( empty( $media_query_atts['min'] ) && empty( $media_query_atts['max'] ) ) ) {
				$preview_sizes[ $media_query_id ] = $media_query_atts['label'];
			}
		}

		/**
		 * Filter the available preview sizes.
		 *
		 * @since 1.0.0
		 *
		 * @param array $media_queries
		 */
		$preview_sizes = apply_filters( 'tailor_preview_sizes', $preview_sizes );

		return $preview_sizes;
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
	 * @since 1.0.0.
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
	 * @since 1.0.0.
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
	 * @since 1.0.0.
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


if ( ! function_exists( 'tailor_maybe_hide_attributes_panel' ) ) {

	/**
	 * Hides the Attributes panel if the associated admin setting is set to active.
	 *
	 * @since 1.1.
	 *
	 * @return bool
	 */
	function tailor_maybe_hide_attributes_panel() {
		return ! tailor_get_setting( 'hide_attributes_panel' );
	}

	add_filter( 'tailor_show_panel_attributes', 'tailor_maybe_hide_attributes_panel', 10, 1 );
}

if ( ! function_exists( 'tailor_maybe_disable_scripts' ) ) {

	/**
	 * Enables styles and scripts if the current page or post has been (or is being) Tailored
	 * (or the admin override is set to active).
	 *
	 * @since 1.1.
	 *
	 * @return bool
	 */
	function tailor_maybe_enable_scripts() {

		$enable_scripts = tailor_get_setting( 'enable_scripts_all_pages' );
		if ( ! empty( $enable_scripts ) ) {
			return true;
		}

		$post_id = get_the_ID();
		$tailor_layout = get_post_meta( $post_id, '_tailor_layout' );
		return ! empty( $tailor_layout ) || tailor()->is_canvas();
	}

	add_filter( 'tailor_enable_enqueue_scripts', 'tailor_maybe_enable_scripts' );
	add_filter( 'tailor_enable_enqueue_stylesheets', 'tailor_maybe_enable_scripts' );
}