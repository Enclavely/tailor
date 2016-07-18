<?php

/**
 * Form shortcode definition.
 *
 * @package Tailor
 * @subpackage Shortcodes
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_shortcode_form' ) ) {

    /**
     * Defines the shortcode rendering function for the Form element.
     *
     * @since 1.0.0
     *
     * @param array $atts
     * @param string $content
     * @param string $tag
     * @return string
     */
    function tailor_shortcode_form( $atts, $content = null, $tag ) {

        $atts = shortcode_atts( array(
            'id'                        =>  '',
            'class'                     =>  '',
	        'form'                      =>  '',
        ), $atts, $tag );

	    $id = ( '' !== $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
	    $class = trim( esc_attr( "tailor-element tailor-form {$atts['class']}" ) );

	    if ( class_exists( 'WPCF7_ContactForm' ) ) {
		    $contact_form = WPCF7_ContactForm::get_instance( $atts['form'] );

		    if ( empty( $contact_form ) ) {
			    return sprintf( '<p class="tailor-notification tailor-notification--warning">%s</p>', __( 'Please select a contact form to display' ) );
		    }

		    $content = sprintf( '[contact-form-7 id="%1$d" title="%2$s"]', $contact_form->id(), $contact_form->title() );
	    }
	    else {
		    return sprintf( '<p class="tailor-notification tailor-notification--warning">%s</p>', __( 'Please enable the Contact Form 7 plugin' ) );
	    }

        return '<div ' . trim( "{$id} class=\"{$class}\"" ) . '>' . do_shortcode( $content ) . '</div>';
    }

    add_shortcode( 'tailor_form_cf7', 'tailor_shortcode_form' );
}