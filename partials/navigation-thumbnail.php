<?php

/**
 * Pagination template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var WP_Query $q The WP_Query object.
 */

if ( $q->have_posts() ) {

	echo '<ul class="navigation navigation--thumbnail">';

	while ( $q->have_posts() ) {

		$q->the_post();
		$attachment = get_post(); ?>

		<li class="navigation__item" id="<?php esc_attr_e( $attachment->ID ); ?>">

			<?php echo wp_get_attachment_image( $attachment->ID, 'thumbnail' ); ?>

		</li>

		<?php
	}

	echo '</ul>';
}