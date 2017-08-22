<?php

/**
 * General helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.7.2
 */

if ( ! function_exists( 'tailor_is_ssl' ) ) {

	/**
	 * Returns true if SSL is used.
	 *
	 * @since 1.0.0
	 *
	 * @see https://codex.wordpress.org/Function_Reference/is_ssl
	 *
	 * @return bool
	 */
	function tailor_is_ssl() {
		return (
			is_ssl() &&
		    0 === stripos( get_option( 'siteurl' ), 'https://' ) &&
		    isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && 'https' == $_SERVER['HTTP_X_FORWARDED_PROTO']
		);
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

if ( ! function_exists( 'tailor_get_users' ) ) {

	/**
	 * Returns the users IDs for registered users.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	function tailor_get_users() {
		$blogusers = get_users( array( 'fields' => array( 'ID', 'display_name' ) ) );
		$user_ids = array();
		$user_ids[0] = __( 'Current user', 'tailor' );

		foreach ( $blogusers as $user ) {
			$user_ids[ $user->ID ] = esc_attr( $user->display_name );
		}

		return $user_ids;
	}
}

if ( ! function_exists( 'tailor_get_widget_areas' ) ) {

	/**
	 * Returns an array containing the registered widget areas.
	 *
	 * @since 1.0.0
	 * @uses $wp_registered_sidebars
	 *
	 * @param array $widget_areas
	 * @return array
	 */
	function tailor_get_widget_areas( $widget_areas = array() ) {
		global $wp_registered_sidebars;

		if ( empty( $wp_registered_sidebars ) ) {
			$widget_areas = array( '' => tailor_empty_list( __( 'widget areas', 'tailor' ) ) );
		}

		foreach ( $wp_registered_sidebars as $sidebar ) {
			$widget_areas[ $sidebar['id'] ] = $sidebar['name'];
		}

		return $widget_areas;
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
					$image_size['height']
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

if ( ! function_exists( 'tailor_get_post_types' ) ) {

	/**
	 * Returns an array containing the names of registered post types.
	 *
	 * @since 1.0.0
	 *
	 * @param array $defaults
	 *
	 * @return array
	 */
	function tailor_get_post_types( $defaults = array( 'page' => 'page', 'post' => 'post' ), $args = array() ) {
		$args = wp_parse_args( $args, array(
			'_builtin'              =>  false,
			'public'                =>  true,
			'show_ui'               =>  true,
			'exclude_from_search'   =>  false,
		) );

		$types = array_merge( $defaults, get_post_types( $args ) );
		foreach ( $types as $type_id => $type ) {
			$type_object = get_post_type_object( $type_id );
			$types[ $type_id ] = $type_object->label;
		}
		return $types;
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
		$mobile_breakpoint = intval( get_theme_mod( 'tailor_mobile_breakpoint', 320 ) );
		$tablet_breakpoint = intval( get_theme_mod( 'tailor_tablet_breakpoint', 720 ) );
		$media_queries = array(
			'all'                   =>  array(
				'label'                 =>  __( 'All', 'tailor' ),
				'min'                   =>  '',
				'max'                   =>  '',
			),
			'desktop'               =>  array(
				'label'                 =>  __( 'Desktop', 'tailor' ),
				'min'                   =>  ( $tablet_breakpoint + 1 ) . 'px',
				'max'                   =>  '',
			),
			'tablet'                =>  array(
				'label'                 =>  __( 'Tablet', 'tailor' ),
				'min'                   =>  ( $mobile_breakpoint + 1 ) . 'px',
				'max'                   =>  $tablet_breakpoint . 'px',
			),
			'mobile'                =>  array(
				'label'                 =>  __( 'Mobile', 'tailor' ),
				'min'                   =>  '',
				'max'                   =>  $mobile_breakpoint . 'px',
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
		if ( true !== $include_all ) {
			unset( $media_queries['all'] );
		}

		// Only allow all, mobile, tablet and desktop media queries
		$allowed = array( 'mobile', 'tablet', 'desktop', 'all' ) ;

		return array_intersect_key( $media_queries, array_flip( $allowed ) );
	}
}

if ( ! function_exists( 'tailor_get_media_queries' ) ) {

	/**
	 * Returns the registered media queries.
	 *
	 * @since 1.1.3
	 *
	 * @param bool $include_all
	 * 
	 * @return array
	 */
	function tailor_get_media_queries( $include_all = false ) {
		$media_queries = array();
		foreach ( tailor_get_registered_media_queries( $include_all ) as $media_query_id => $media_query ) {
			$media_queries[ $media_query_id ] = $media_query['label'];
		}
		return $media_queries;
	}
}

if ( ! function_exists( 'tailor_empty_list' ) ) {

	/**
	 * Returns a message to display when a list contains no items.
	 *
	 * @since 1.0.0
	 *
	 * @param string $list_type
	 * @return string
	 */
	function tailor_empty_list( $list_type ) {
		return sprintf( _x( 'No %1$s to display', 'expected item type', 'tailor' ), $list_type );
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