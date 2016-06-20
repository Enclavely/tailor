<?php

/**
 * Author meta template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

global $authordata, $post;

if ( empty( $authordata ) && isset( $post->post_author ) ) {
	$authordata = get_userdata( $post->post_author );
}

if ( empty( $authordata ) ) {
	return;
}

$author_name = get_the_author();

$author_link = sprintf(
	'<a href="%1$s" title="%2$s" rel="author">%3$s</a>',
	esc_url( get_author_posts_url( $authordata->ID, $authordata->user_nicename ) ),
	esc_attr( sprintf( __( 'Posts by %s', 'tailor' ), $author_name ) ),
	$author_name
);

echo '<span class="entry__author">' . __( 'By', 'tailor' ) . ' ' . $author_link . '</span>';