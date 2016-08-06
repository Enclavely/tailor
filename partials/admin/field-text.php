<?php

/**
 * Text field template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var array $args The field arguments.
 */

defined( 'ABSPATH' ) or die(); ?>

<label>
	<input class="regular-text code" name="<?php esc_attr_e( $args['name'] ); ?>" type="text" value="<?php esc_attr_e( $args['value'] ); ?>" />
</label>