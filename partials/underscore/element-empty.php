<?php

/**
 * Underscore JS template for an empty element.
 *
 * Used when a content element does not produce any visible content.
 * 
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.6.0
 */

defined( 'ABSPATH' ) or die(); ?>

<script id="tmpl-tailor-element-empty" type="text/html">
	<p class="tailor-notification tailor-notification--warning">
		<?php _e( 'Please configure this element as there is currently nothing to display', 'tailor' ); ?>
	</p>
</script>