<?php

/**
 * Standard loop template.
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

	echo '<div class="tailor-list">';

	while ( $q->have_posts() ) {
		$q->the_post();

		tailor_partial( 'content', get_post_type(), $entry_args );
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