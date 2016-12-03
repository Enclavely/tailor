<?php

/**
 * Underscore JS Canvas Tools template.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

$add_label = __( 'Add', 'tailor' );
$edit_label = __( 'Edit', 'tailor' );
$copy_label = __( 'Copy', 'tailor' );
$delete_label = __( 'Delete', 'tailor' ); ?>

<script id="tmpl-tailor-tools-select" type="text/html">
	<div class="select__menu"></div>
	<div class="select__controls">
		<% if ( 'container' == type ) { %>
		<div class="select__item js-add" title="<?php echo $add_label; ?>"><?php echo $add_label; ?></div>
		<% } %>
		<div class="select__item js-edit" title="<?php echo $edit_label; ?>"><?php echo $edit_label; ?></div>
		<div class="select__item js-copy" title="<?php echo $copy_label; ?>"><?php echo $copy_label; ?></div>
		<div class="select__item js-delete" title="<?php echo $delete_label; ?>"><?php echo $delete_label; ?></div>
	</div>
</script>