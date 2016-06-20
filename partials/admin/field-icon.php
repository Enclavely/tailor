<?php

/**
 * Icon field template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var array $args The field arguments.
 */

defined( 'ABSPATH' ) or die();

$args['value'] = is_array( $args['value'] ) ? $args['value'] : array(); ?>

<div class="tailor-icon-kits" data-name="<?php esc_attr_e( $args['name'] ); ?>">
	<div class="icon-kits">

		<?php

		foreach ( $args['options'] as $icon_kit ) { ?>

			<label class="widefat">
				<input name="<?php esc_attr_e( $args['name'] . '[' . $icon_kit['id'] . ']' ); ?>"
				       type="checkbox" <?php checked( array_key_exists( $icon_kit['id'], $args['value'] ) ); ?> />

				<?php
				esc_html_e( $icon_kit['name'] );
				if ( 'dashicons' != $icon_kit['id'] ) {
					echo ' <a class="js-delete" data-id="' . esc_attr( $icon_kit['id'] ) . '">' . __( 'Delete', 'tailor' ) . '</a>';
				} ?>

				<br>
			</label>

		<?php } ?>

	</div>
	<p class="tailor-icons__actions">
		<a class="button button-large js-select"><?php _e( 'Add kit', 'tailor' ); ?></a>
		<span class="spinner"></span>
	</p>
</div>