<?php

/**
 * Comment number meta template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! ( comments_open() || pings_open() ) || 0 == $comments_number = get_comments_number() ) {
	return;
}

if ( 1 == $comments_number ) {
	$comment_text = $comments_number . ' ' . __( 'Comment', 'tailor' );
}
else {
	$comment_text = $comments_number . ' ' . __( 'Comments', 'tailor' );
}

/**
 * Filters the variable determining whether to present the comment number as a link.
 *
 * @since 1.0.0
 *
 * @param bool
 */
$comments_link = apply_filters( 'tailor_show_comments_link', false );

if ( $comments_link ) {
	printf(
		'<span class="entry__comment-number"><a href="%1$s" title="%2$s">%3$s</a></span>',
		esc_url( get_comments_link() ),
		esc_attr( sprintf( __( 'Leave a comment on: &ldquo;%s&rdquo;', 'tailor' ), get_the_title() ) ),
		$comment_text
	);
}
else {
	printf(
		'<span class="entry__comment-number">%1$s</span>',
		$comment_text
	);
}