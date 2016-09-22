<?php

/**
 * Post excerpt template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<div class="entry__excerpt">

	<?php
	$post = get_post();

	if ( post_password_required( $post ) ) {
		$trimmed_excerpt = __( 'There is no excerpt because this is a protected post.', 'tailor' );
	}
	else {
		$excerpt = has_excerpt() ? $post->post_excerpt : $post->post_content;
		$excerpt_length = empty( $excerpt_length ) ? 30 : $excerpt_length;

		/**
		 * Filters the entry excerpt length.
		 *
		 * @since 1.5.6
		 *
		 * @param int $excerpt_length
		 */
		$excerpt_length = apply_filters( 'tailor_excerpt_length', $excerpt_length );
		$excerpt_more = sprintf( '...<br><a class="entry__more" href="%s">%s</a>', get_permalink(), __(  'Continue reading &rsaquo;', 'tailor' ) );
		$trimmed_excerpt = wp_trim_words( $excerpt, $excerpt_length, $excerpt_more );

		/**
		 * Filters the entry excerpt.
		 *
		 * @since 1.0.0
		 *
		 * @param string $trimmed_excerpt
		 * @param string $excerpt
		 * @param int $excerpt_length
		 * @param string $excerpt_more
		 */
		$trimmed_excerpt = apply_filters( 'tailor_excerpt', $trimmed_excerpt, $excerpt, $excerpt_length, $excerpt_more );
	}

	echo $trimmed_excerpt; ?>

</div>