<?php

/**
 * Tailor Customizer panel definitions.
 *
 * @package Tailor
 * @subpackage Customizer
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_get_customizer_panels' ) ) {

    /**
     * Returns the Customizer panels to be registered.
     *
     * @since 1.0.0
     *
     * @return mixed|void
     */
    function tailor_get_customizer_panels() {

        $panels = array(
            'tailor'                   =>  array(
                'title'                     =>  __( 'Tailor', 'tailor' ),
                'priority'                  =>  999,
            ),
        );

        return apply_filters( 'tailor_customizer_panels', $panels );
    }
}