<?php

/**
 * Entry thumbnail template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var string $image_link The image link type.
 * @var string $image_size The image size.
 * @var string $aspect_ratio The image aspect ratio.
 * @var bool $stretch True if the image should be stretched to fit the aspect ratio.
 */

defined( 'ABSPATH' ) or die();

if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
	return;
}

$post = get_post();

// Generate the thumbnail class name
$thumbnail_class_name = 'entry__thumbnail';

if ( ! empty( $aspect_ratio )  ) {
    $thumbnail_class_name .= ' aspect-ratio-' . esc_attr( str_replace( ':', '-', $aspect_ratio ) );
}

if ( ( isset( $stretch ) && true == $stretch ) ) {
    $thumbnail_class_name .= ' is-stretched';
}

// Get the thumbnail image
$thumbnail_image = '<figure>' . get_the_post_thumbnail( $post, $image_size, array( 'alt' => the_title_attribute( 'echo=0' ) ) ) . '</figure>';

// Add the thumbnail link, if required
if ( 'none' !== $image_link ) {
    if ( 'file' == $image_link  || 'lightbox' == $image_link ) {
        $thumbnail_link = get_the_post_thumbnail_url( $post, 'full' );
    }
    else {
        $thumbnail_link = get_permalink( $post->ID );
    }

    $thumbnail_image = "<a href=\"{$thumbnail_link}\" rel=\"bookmark\">{$thumbnail_image}</a>";
} ?>

<div class="<?php esc_attr_e( $thumbnail_class_name ); ?>">

    <?php echo $thumbnail_image; ?>

</div>