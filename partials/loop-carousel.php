<?php

/**
 * Carousel loop template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var WP_Query $q The WP_Query object.
 * @var array $entry_args Entry layout arguments.
 */

defined( 'ABSPATH' ) or die();

if ( $q->have_posts() ) {

	echo '<div class="tailor-carousel__wrap">';

	while ( $q->have_posts() ) {

		$q->the_post();

		echo '<li class="tailor-carousel__item">';
		tailor_partial( 'content', get_post_type(), $entry_args );
		echo '</li>';
	}

	echo '</ul>';
	echo '</div>';
}
else {
	tailor_partial( 'empty' );
}

wp_reset_postdata();