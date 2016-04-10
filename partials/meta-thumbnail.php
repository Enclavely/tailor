<?php

/**
 * Entry thumbnail template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var string $image_size The image size.
 * @var string $aspect_ratio The image aspect ratio.
 * @var bool $stretch True if the image should be stretched to fit the aspect ratio.
 * @var bool $lightbox True if a lightbox should be used.
 */

defined( 'ABSPATH' ) or die();

if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
	return;
}

$post = get_post();

$thumbnail_class_name = 'entry__thumbnail';
if ( ! empty( $aspect_ratio )  ) {
    $thumbnail_class_name .= ' aspect-ratio-' . esc_attr( str_replace( ':', '-', $aspect_ratio ) );
}
if ( ( isset( $stretch ) && true == $stretch ) ) {
    $thumbnail_class_name .= ' is-stretched';
}

if ( true == $lightbox ) {
    $attachment_link_class_name .= 'is-lightbox-image';
    $attachment_link = get_the_post_thumbnail_url( $post, 'full' );
}
else {
    $attachment_link_class_name = '';
    $attachment_link = get_permalink( $post->ID );
} ?>

<div class="<?php esc_attr_e( $thumbnail_class_name ); ?>">

    <a class="<?php echo $attachment_link_class_name; ?>" href="<?php echo $attachment_link; ?>" rel="bookmark" aria-hidden="true">

        <?php the_post_thumbnail( $image_size, array( 'alt' => the_title_attribute( 'echo=0' ) ) ); ?>

    </a>
</div>