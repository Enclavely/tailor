<?php

/**
 * Underscore JS template for the Modal window.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<script id="tmpl-tailor-modal" type="text/html">
    <div class="modal__inner">
        <div class="modal__header" id="header">
            <h2 class="modal__title"><%= label %></h2>
	        <div class="modal__controls">
		        <button class="js-close" title="<?php _e( 'Close', 'tailor' ); ?>"></button>
	        </div>
            <div id="tailor-modal-tabs"></div>
        </div>

	    <!-- Modal content container -->
	    <div class="modal__content" id="tailor-modal-sections"></div>

	    <!-- Modal footer container -->
        <div class="modal__footer" id="tailor-modal-footer">

            <?php printf(
 				'<button class="button button-large button-primary js-apply" disabled>%s</button>',
                __( 'Apply', 'tailor' )
            ); ?>

        </div>
    </div>
</script>