<?php

/**
 * Post entry template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var array $meta
 * @var string $image_link The image link type.
 * @var string $image_size The image size.
 * @var string $aspect_ratio The image aspect ratio.
 * @var bool $stretch True if the image should be stretched to fit the aspect ratio.
 * @var bool $lightbox True if a lightbox should be used.
 */

defined( 'ABSPATH' ) or die();

$post = get_post(); ?>

<article id="entry-<?php esc_attr_e( $post->ID ); ?>" class="<?php esc_attr_e( implode( ' ', get_post_class( 'entry' ) ) ); ?>">

	<?php
	if ( in_array( 'thumbnail', $meta ) ) {
		tailor_partial( 'meta', 'thumbnail', array(
            'image_link'        =>  $image_link,
            'image_size'        =>  $image_size,
            'aspect_ratio'      =>  $aspect_ratio,
            'stretch'           =>  $stretch,
        ) );
	} ?>

	<div class="entry__content">
		<h2 class="entry__title">
			<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
		</h2>

		<?php
		tailor_partial( 'meta', 'post', array(
			'meta'              =>  $meta,
		) ); ?>

	</div>
</article>
