<?php

/**
 * Attachment template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var string $image_size The image size.
 * @var string $aspect_ratio The image aspect ratio.
 * @var bool $stretch True if the image should be stretched to fit the aspect ratio.
 * @var bool $caption True if a caption should be displayed.
 * @var bool $lightbox True if a lightbox should be used.
 */

defined( 'ABSPATH' ) or die();

$attachment = get_post();

$attachment_class_name = 'tailor-attachment';
if ( ! empty( $aspect_ratio )  ) {
	$attachment_class_name .= ' aspect-ratio-' . esc_attr( str_replace( ':', '-', $aspect_ratio ) );
}
if ( ( isset( $stretch ) && true == $stretch ) ) {
	$attachment_class_name .= ' is-stretched';
}

$attachment_link_function = ( true == $lightbox ) ? 'wp_get_attachment_url' : 'get_attachment_link';
$attachment_link_class_name = 'tailor-attachment__image';
if ( true == $lightbox ) {
	$attachment_link_class_name .= ' is-lightbox-image';
	$attachment_link = wp_get_attachment_url( $attachment->ID );
}
else {
	$attachment_link = get_attachment_link( $attachment->ID );
} ?>

<article class="<?php esc_attr_e( implode( ' ', get_post_class( $attachment_class_name ) ) ); ?>" id="attachment-<?php esc_attr_e( $attachment->ID ); ?>">

	<a class="<?php echo $attachment_link_class_name; ?>" href="<?php echo $attachment_link; ?>" rel="bookmark">

		<?php
		echo wp_get_attachment_image( $attachment->ID, $image_size );

		if ( isset( $caption ) && true == $caption && has_excerpt() ) { ?>

			<figcaption class="tailor-attachment__caption">

				<?php esc_attr_e( $attachment->post_excerpt ); ?>

			</figcaption>

		<?php } ?>

	</a>
</article>
