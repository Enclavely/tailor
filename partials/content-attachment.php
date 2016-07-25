<?php

/**
 * Attachment template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var string $image_link The image link type.
 * @var string $image_size The image size.
 * @var string $aspect_ratio The image aspect ratio.
 * @var bool $stretch True if the image should be stretched to fit the aspect ratio.
 * @var bool $caption True if a caption should be displayed.
 */

defined( 'ABSPATH' ) or die();

$attachment = get_post();

// Generate the attachment class name
$attachment_class_name = 'tailor-attachment';
if ( ! empty( $aspect_ratio )  ) {
	$attachment_class_name .= ' aspect-ratio-' . esc_attr( str_replace( ':', '-', $aspect_ratio ) );
}
if ( ( isset( $stretch ) && true == $stretch ) ) {
	$attachment_class_name .= ' is-stretched';
}

// Generate the attachment link class name
$attachment_link_class_name = 'tailor-attachment__link';
if ( 'lightbox' == $image_link ) {
	$attachment_link_class_name .= ' is-lightbox-image';
}

// Get the attachment image
$attachment_image = '<figure class="tailor-attachment__image">' . wp_get_attachment_image( $attachment->ID, $image_size );
if ( isset( $caption ) && true == $caption && has_excerpt() ) {
	$attachment_image .= '<figcaption class="tailor-attachment__caption">' . esc_attr( $attachment->post_excerpt ) . '</figcaption>';
}
$attachment_image .= '</figure>';

// Add the attachment link, if required
if ( 'none' !== $image_link ) {
	if ( 'file' == $image_link  || 'lightbox' == $image_link ) {
		$attachment_link = wp_get_attachment_url( $attachment->ID );
	}
	else {
		$attachment_link = get_attachment_link( $attachment->ID );
	}
	$attachment_image = "<a class=\"{$attachment_link_class_name}\" href=\"{$attachment_link}\" rel=\"bookmark\">{$attachment_image}</a>";
} ?>

<article class="<?php esc_attr_e( implode( ' ', get_post_class( $attachment_class_name ) ) ); ?>" id="attachment-<?php esc_attr_e( $attachment->ID ); ?>">

	<?php echo $attachment_image; ?>

</article>