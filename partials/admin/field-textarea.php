<?php

/**
 * Textarea field template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var array $args The field arguments.
 */

defined( 'ABSPATH' ) or die(); ?>

<textarea class="widefat" name="<?php esc_attr_e( $args['name'] ); ?>" rows="5"><?php echo esc_textarea( $args['value'] ); ?></textarea>