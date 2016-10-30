<?php

/**
 * Tailor Map Marker element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Map_Marker_Element' ) ) {

    /**
     * Tailor Map Marker element class.
     *
     * @since 1.0.0
     */
    class Tailor_Map_Marker_Element extends Tailor_Element {

        /**
         * Registers element settings, sections and controls.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function register_controls() {

	        $this->add_section( 'general', array(
		        'title'                 =>  __( 'General', 'tailor' ),
		        'priority'              =>  10,
	        ) );

	        $priority = 0;
	        $general_control_types = array(
		        'title',
	        );
	        $general_control_arguments = array(
		        'title'                 =>  array(
			        'setting'               =>  array(
				        'default'               =>  $this->label,
			        ),
		        ),
	        );
	        $priority = tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

            $this->add_setting( 'address', array(
                'sanitize_callback'     =>  'tailor_sanitize_text',
            ) );
            $this->add_control( 'address', array(
                'label'                 =>  __( 'Address', 'tailor' ),
                'type'                  =>  'text',
                'priority'              =>  $priority += 10,
                'section'               =>  'general',
            ) );

            $this->add_setting( 'latitude', array(
                'sanitize_callback'     =>  'tailor_sanitize_number',
            ) );
            $this->add_control( 'latitude', array(
                'label'                 =>  __( 'Latitude (optional)', 'tailor' ),
                'type'                  =>  'number',
                'priority'              =>  $priority += 10,
                'section'               =>  'general',
            ) );

            $this->add_setting( 'longitude', array(
                'sanitize_callback'     =>  'tailor_sanitize_number',
            ) );
            $this->add_control( 'longitude', array(
                'label'                 =>  __( 'Longitude (optional)', 'tailor' ),
                'type'                  =>  'number',
                'priority'              =>  $priority += 10,
                'section'               =>  'general',
            ) );

            $this->add_setting( 'content', array(
                'sanitize_callback'     =>  'tailor_sanitize_html',
            ) );
            $this->add_control( 'content', array(
                'label'                 =>  __( 'Content', 'tailor' ),
                'type'                  =>  'editor',
                'priority'              =>  $priority += 10,
                'section'               =>  'general',
            ) );
        }
    }
}