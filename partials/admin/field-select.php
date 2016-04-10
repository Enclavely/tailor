<?php

/**
 * Select field template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var array $args The field arguments.
 */

defined( 'ABSPATH' ) or die(); ?>

<label>
	<select name="<?php esc_attr_e( $args['name'] ); ?>">

		<?php foreach ( $args['options'] as $id => $option ) { ?>
			<option value="<?php esc_attr_e( $id ); ?>" <?php selected( $id, $args['value'] ); ?>><?php esc_html_e( $option ); ?></option>
		<?php } ?>

	</select>
</label>