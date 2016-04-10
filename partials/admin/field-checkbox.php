<?php

/**
 * Checkbox field template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var array $args The field arguments.
 */

defined( 'ABSPATH' ) or die();

if ( $args['options'] ) {

	$args['value'] = is_array( $args['value'] ) ? $args['value'] : array();

	foreach ( $args['options'] as $id => $option ) { ?>

		<label class="widefat">
			<input name="<?php esc_attr_e( $args['name'] . '[' . $id . ']' ); ?>" type="checkbox" <?php checked( array_key_exists( $id, $args['value'] ) ); ?> />
			<?php esc_html_e( $option ); ?>
			<br>
		</label>

	<?php
	}
}
else { ?>

	<label class="widefat">
		<input name="<?php esc_attr_e( $args['name'] ); ?>" type="checkbox" <?php checked( ! empty( $args['value'] ) ); ?> />
		<?php esc_html_e( $args['description'] ); ?>
		<br>
	</label>

<?php }