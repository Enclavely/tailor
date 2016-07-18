<?php

/**
 * Grid loop template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var WP_Query $q The WP_Query object.
 * @var array $layout_args General layout arguments.
 * @var array $entry_args Entry layout arguments.
 */

defined( 'ABSPATH' ) or die();

if ( $q->have_posts() ) {

	$grid_class_name = "tailor-grid--tablet tailor-grid--{$layout_args['items_per_row']}";
	if ( true == $layout_args['masonry'] ) {
		$grid_class_name .= ' tailor-grid--masonry';
	}

	echo '<div class="' . esc_attr( $grid_class_name ) . '">';

	while ( $q->have_posts() ) {

		$q->the_post();

		echo '<div class="tailor-grid__item">';
		tailor_partial( 'content', get_post_type(), $entry_args );
		echo '</div>';
	}

	echo '</div>';

	if ( isset( $layout_args['pagination'] ) && true == $layout_args['pagination'] ) {
		tailor_partial( 'pagination', 'links', array( 'q' => $q ) );
	}
}
else {
	tailor_partial( 'empty' );
}

wp_reset_postdata();