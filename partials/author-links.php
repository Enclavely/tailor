<?php

/**
 * Author links template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var int $author_id The author ID.
 */

defined( 'ABSPATH' ) or die();

if ( empty( $author_id ) ) {
	$author_id = get_current_user_id();
}

$display_name = get_the_author_meta( 'display_name', $author_id );
$social_links = '';

if ( $facebook_link = esc_url( get_the_author_meta( 'facebook', $author_id ) ) ) {
	$link_title = esc_attr( sprintf( __( 'View %s\'s Facebook profile', 'tailor' ), $display_name ) );
	$social_links .=    '<li>' .
		                    "<a class=\"dashicons dashicons-facebook\" href=\"{$facebook_link}\" title=\"{$link_title}\" target=\"_blank\"></a>" .
	                    '</li>';
}

if ( $twitter_link = esc_url( get_the_author_meta( 'twitter', $author_id ) ) ) {
	$link_title = esc_attr( sprintf( __( 'View %s\'s Twitter page', 'tailor' ), $display_name ) );
	$social_links .=    '<li>' .
		                    "<a class=\"dashicons dashicons-twitter\" href=\"{$twitter_link}\" title=\"{$link_title}\" target=\"_blank\"></a>" .
	                    '</li>';
}

if ( $google_plus_link = esc_url( get_the_author_meta( 'googleplus', $author_id ) ) ) {
	$link_title = esc_attr( sprintf( __( 'View %s\'s Google Plus profile', 'tailor' ), $display_name ) );
	$social_links .=    '<li>' .
		                    "<a class=\"dashicons dashicons-googleplus\" href=\"{$google_plus_link}\" title=\"{$link_title}\" target=\"_blank\"></a>" .
	                    '</li>';
}

if ( '' !== $social_links ) {
	echo '<ul class="tailor-author__social-links">' . $social_links . '</ul>';
}