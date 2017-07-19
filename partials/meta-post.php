<?php

/**
 * Post meta template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var array $meta An array containing the types of meta information to display.
 */

defined( 'ABSPATH' ) or die();

$meta = (array) $meta;
$meta_order = array( 'author', 'date', 'category', 'tag', 'comment-number' );

/**
 * Filters the post meta display order.
 *
 * @since 1.0.0
 *
 * @param array $meta_order
 */
apply_filters( 'tailor_post_meta_order', $meta_order );

if ( count( array_intersect( $meta, $meta_order ) ) >= 1 ) {

	echo '<div class="entry__meta">';

	foreach ( $meta_order as $meta_type ) {
		if ( in_array( $meta_type, $meta ) ) {
			tailor_partial( 'meta', $meta_type );
		}
	}

	echo '</div>';
}

if ( in_array( 'excerpt', $meta ) ) {
	tailor_partial( 'meta', 'excerpt' );
}
