<?php

/**
 * Author box template.
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

$display_name = get_the_author_meta( 'display_name', $author_id ); ?>

<div class="tailor-author__header">
	<?php echo get_avatar( $author_id, 100, '', $display_name, array( 'class' => 'tailor-author__avatar' ) ); ?>
</div>
<div class="tailor-author__wrap">
	<h3 class="tailor-author__name"><?php esc_attr_e( $display_name ); ?></h3>

	<?php tailor_partial( 'author', 'links', array( 'author_id' => $author_id ) ) ?>

	<p class="tailor-author__description"><?php esc_attr_e( get_the_author_meta( 'description', $author_id ) ); ?></p>
</div>