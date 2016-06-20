<?php

/**
 * Underscore JS template for the Save Template dialog window content.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<script id="tmpl-tailor-dialog-save-template" type="text/html">
	<div class="dialog__container">
		<p><?php _e( 'Enter the label to use for this template.', 'tailor' ); ?></p>
		<input id="save-template" type="text">
	</div>
</script>