<?php

/**
 * Element helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_control_presets' ) ) {

	/**
	 * Registers the settings and controls based.
	 *
	 * @since 1.0.0
	 *
	 * @param Tailor_Element $element
	 * @param array $control_ids
	 * @param array $control_arguments
	 * @param int $priority
	 * @return int $priority
	 */
	function tailor_control_presets( $element, $control_ids = array(), $control_arguments = array(), $priority = 10 ) {

		$control_definitions = get_transient( 'tailor_control_definitions' );
		if ( ! $control_definitions ) {
			$control_definitions = include tailor()->plugin_dir() . 'includes/config/control_definitions.php';
			set_transient( 'tailor_control_definitions', $control_definitions, DAY_IN_SECONDS );
		}

		foreach ( $control_ids as $control_id ) {
			if ( array_key_exists( $control_id, $control_definitions ) ) {
                if ( array_key_exists( $control_id, $control_arguments ) ) {
                    if ( array_key_exists( 'control', $control_arguments[ $control_id ] ) ) {
                        $control_definitions[ $control_id ]['control'] = array_merge(
                            $control_definitions[ $control_id ]['control'],
                            $control_arguments[ $control_id ]['control']
                        );
                    }
                    if ( array_key_exists( 'setting', $control_arguments[ $control_id ] ) ) {
                        $control_definitions[ $control_id ]['setting'] = array_merge(
                            $control_definitions[ $control_id ]['setting'],
                            $control_arguments[ $control_id ]['setting']
                        );
                    }
                }

				if ( array_key_exists( 'setting', $control_definitions[ $control_id ] ) ) {
					$setting_args = $control_definitions[ $control_id ]['setting'];

					/**
					 * Filter the setting arguments.
					 *
					 * @since 1.4.0
					 *
					 * @param array $setting_args
					 * @param Tailor_Element $element
					 */
					$setting_args= apply_filters( 'tailor_setting_args_' . $element->tag, $setting_args, $element );

					/**
					 * Filter the setting arguments.
					 *
					 * @since 1.4.0
					 *
					 * @param array $setting_args
					 * @param Tailor_Element $element
					 */
					$setting_args = apply_filters( 'tailor_setting_args_' . $element->tag . '_' . $control_id, $setting_args, $element );

					$element->add_setting( $control_id, $setting_args );
				}

				if ( array_key_exists( 'control', $control_definitions[ $control_id ] ) ) {
					$control_args = $control_definitions[ $control_id ]['control'];

					// Set the priority if this is a control and the priority is empty
					if ( empty( $control_args['priority'] ) ) {
						$control_args['priority'] = $priority += 10;
					}

					/**
					 * Filter the control arguments by control type.
					 *
					 * @since 1.5.6
					 *
					 * @param array $control_args
					 * @param Tailor_Element $element
					 */
					$control_args = apply_filters( 'tailor_control_args_' . $control_args['type'], $control_args, $element );

					/**
					 * Filter the control arguments by element tag.
					 *
					 * @since 1.4.0
					 *
					 * @param array $control_args
					 * @param Tailor_Element $element
					 */
					$control_args = apply_filters( 'tailor_control_args_' . $element->tag, $control_args, $element );

					/**
					 * Filter the control arguments by element tag and control ID.
					 *
					 * @since 1.4.0
					 *
					 * @param array $control_args
					 * @param Tailor_Element $element
					 */
					$control_args = apply_filters( 'tailor_control_args_' . $element->tag . '_' . $control_id, $control_args, $element );

					$element->add_control( $control_id, $control_args );
				}
			}
		}

		return $priority;
	}
}