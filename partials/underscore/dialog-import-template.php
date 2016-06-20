<?php

/**
 * Underscore JS template for the Import Template dialog window content.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<script id="tmpl-tailor-dialog-import-template" type="text/html">
	<div class="dialog__container">
		<p><?php _e( 'Select a valid .JSON template file to import.', 'tailor' ); ?></p>
		<input id="import-template" type="file">
	</div>
</script>