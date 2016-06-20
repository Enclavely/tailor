<?php

/**
 * Underscore JS template for dialog windows.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<script id="tmpl-tailor-dialog" type="text/html">
    <div class="dialog__inner">
        <div class="dialog__header">
            <div class="dialog__title">
                <h2><%= title %></h2>
            </div>
	        <button class="dialog__close js-close" title="<?php _e( 'Close', 'tailor' ); ?>"></button>
        </div>
        <div class="dialog__content"><%= content %></div>
        <div class="dialog__footer">
            <button class="button button-large button-primary js-save">
                <%= button %>
            </button>
        </div>
    </div>
</script>