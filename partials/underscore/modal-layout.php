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

		        <?php
		        $modal_header_controls = sprintf(
			        '<button class="js-close" title="%s"></button>',
			        __( 'Close', 'tailor' )
		        );

		        /**
		         * Filter the modal header controls.
		         *
		         * @since 1.0.0
		         *
		         * @param string $modal_header_controls
		         */
		        $modal_header_controls = apply_filters( 'tailor_modal_header_controls', $modal_header_controls );

		        echo $modal_header_controls; ?>

	        </div>
            <div id="tailor-modal-tabs"></div>
        </div>

	    <!-- Modal content container -->
	    <div class="modal__content" id="tailor-modal-sections"></div>

	    <!-- Modal footer container -->
        <div class="modal__footer" id="tailor-modal-footer">

            <?php

            $modal_footer_actions = sprintf( '
				<button class="button button-large js-preview" disabled>%s</button>
 				<button class="button button-large button-primary js-apply" disabled>%s</button>',
                __( 'Preview', 'tailor' ),
                __( 'Apply', 'tailor' )
            );

            /**
             * Filters the modal footer actions.
             *
             * @since 1.0.0
             *
             * @param string $modal_header_actions
             */
            $modal_footer_actions = apply_filters( 'tailor_modal_footer_actions', $modal_footer_actions );

            echo $modal_footer_actions; ?>

        </div>
    </div>
</script>