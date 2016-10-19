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

	    /**
	     * Filter the default shortcode attributes.
	     *
	     * @since 1.6.6
	     *
	     * @param array
	     */
	    $default_atts = apply_filters( 'tailor_shortcode_default_atts_' . $tag, array() );
	    $atts = shortcode_atts( $default_atts, $atts, $tag );
	    $html_atts = array(
		    'id'            =>  empty( $atts['id'] ) ? null : $atts['id'],
		    'class'         =>  explode( ' ', "tailor-element tailor-form {$atts['class']}" ),
		    'data'          =>  array(),
	    );

	    /**
	     * Filter the HTML attributes for the element.
	     *
	     * @since 1.7.0
	     *
	     * @param array $html_attributes
	     * @param array $atts
	     * @param string $tag
	     */
	    $html_atts = apply_filters( 'tailor_shortcode_html_attributes', $html_atts, $atts, $tag );
	    $html_atts['class'] = implode( ' ', (array) $html_atts['class'] );
	    $html_atts = tailor_get_attributes( $html_atts );

	    if ( class_exists( 'WPCF7_ContactForm' ) ) {
		    $contact_form = WPCF7_ContactForm::get_instance( $atts['form'] );
		    if ( empty( $contact_form ) ) {
			    $content = sprintf(
				    '<p class="tailor-notification tailor-notification--warning">%s</p>',
				    __( 'Please select a contact form to display', 'tailor' )
			    );
		    }
			else {
				$content = sprintf( '[contact-form-7 id="%1$d" title="%2$s"]', $contact_form->id(), $contact_form->title() );
			}
	    }
	    else {
		    $content = sprintf(
			    '<p class="tailor-notification tailor-notification--warning">%s</p>',
			    __( 'Please enable the Contact Form 7 plugin', 'tailor' )
		    );
	    }

	    $outer_html = "<div {$html_atts}>%s</div>";
	    $inner_html = '%s';
	    $content = do_shortcode( $content );
	    $html = sprintf( $outer_html, sprintf( $inner_html, $content ) );

	    /**
	     * Filter the HTML for the element.
	     *
	     * @since 1.7.0
	     *
	     * @param string $html
	     * @param string $outer_html
	     * @param string $inner_html
	     * @param string $html_atts
	     * @param array $atts
	     * @param string $content
	     * @param string $tag
	     */
	    $html = apply_filters( 'tailor_shortcode_html', $html, $outer_html, $inner_html, $html_atts, $atts, $content, $tag );

	    return $html;
    }

    add_shortcode( 'tailor_form_cf7', 'tailor_shortcode_form' );
}