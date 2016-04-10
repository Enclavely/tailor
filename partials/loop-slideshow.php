<?php

/**
 * Slideshow loop template.
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

	echo '<div class="tailor-slideshow">';
	echo '<ul class="tailor-slideshow__slides">';

	while ( $q->have_posts() ) {

		$q->the_post();
        $thumbnail =  wp_get_attachment_image_src( get_the_ID(), 'thumbnail' );

        echo '<li class="tailor-slideshow__slide" data-thumb="' . esc_attr( $thumbnail[0] ) . '">';
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