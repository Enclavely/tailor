<?php

/**
 * Underscore JS template for the Sidebar Home panel.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<script id="tmpl-tailor-home" type="text/html">
    <div class="header">
        <div class="title-block">
	        <h3 class="title">
		        <span class="notice"><?php _e( 'You are Tailoring', 'tailor' ); ?></span>
		        <?php the_title(); ?>
	        </h3>
            <button class="help-button dashicons dashicons-editor-help">
                <span class="screen-reader-text"><?php _e( 'Help', 'tailor' ); ?></span>
            </button>
        </div>
        <div class="help-description">
	        <p><?php _e( 'Create beautiful layouts for your content by simply dragging and dropping elements and templates on to the page.', 'tailor' ); ?></p>
        </div>
    </div>
    
    <ul class="list list--primary" id="items"></ul>
	
</script>