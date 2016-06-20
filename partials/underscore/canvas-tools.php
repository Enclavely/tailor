<?php

/**
 * Underscore JS Canvas Tools template.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

$edit_label = __( 'Edit', 'tailor' );
$delete_label = __( 'Delete', 'tailor' ); ?>

<script id="tmpl-tailor-tools-select" type="text/html">
	<div class="select__menu"></div>
	<div class="select__controls">
		<a class="select__item js-edit" title="<?php echo $edit_label; ?>"><?php echo $edit_label; ?></a>
		<a class="select__item js-delete" title="<?php echo $delete_label; ?>"><?php echo $delete_label; ?></a>
	</div>
</script>