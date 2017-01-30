<?php

/**
 * Tailor Carousel element class.
 *
 * @package Tailor
 * @subpackage Elements
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Element' ) && ! class_exists( 'Tailor_Carousel_Element' ) ) {

    /**
     * Tailor Carousel element class.
     *
     * @since 1.0.0
     */
    class Tailor_Carousel_Element extends Tailor_Element {

	    /**
	     * The child item tag.
	     *
	     * @since 1.0.0
	     * @var string
	     */
	    public $child = 'tailor_carousel_item';

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

	        $this->add_section( 'colors', array(
		        'title'                 =>  __( 'Colors', 'tailor' ),
		        'priority'              =>  20,
	        ) );

	        $this->add_section( 'attributes', array(
		        'title'                 =>  __( 'Attributes', 'tailor' ),
		        'priority'              =>  30,
	        ) );

	        $priority = 0;

	        $general_control_types = array(
		        'style',
		        'items_per_row',
		        'min_item_height',
		        'min_item_height_tablet',
		        'min_item_height_mobile',
		        'autoplay',
		        'autoplay_speed',
		        'fade',
		        'arrows',
		        'dots',
	        );
	        $general_control_arguments = array(
		        'style'                 =>  array(
			        'setting'               =>  array(
				        'default'               =>  'default'
			        ),
			        'control'               =>  array(
				        'choices'               =>  array(
					        'default'               =>  __( 'Default', 'tailor' ),
					        'slider'                =>  __( 'Slider', 'tailor' ),
				        ),
			        ),
		        ),
		        'items_per_row'         =>  array(
			        'setting'               =>  array(
				        'default'               =>  '1'
			        ),
		        ),
		        'autoplay'              =>  array(
			        'control'               =>  array(
				        'description'           =>  __( 'This will only take effect in the frontend', 'tailor' ),
			        ),
		        ),
		        'autoplay_speed'              =>  array(
			        'control'               =>  array(
				        'description'           =>  __( 'This will only take effect in the frontend', 'tailor' ),
				        'dependencies'          =>  array(
					        'autoplay'              =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  '1',
					        ),
				        ),
			        ),
		        ),
		        'fade'                  =>  array(
			        'control'               =>  array(
				        'description'           =>  __( 'This will only take effect in the frontend', 'tailor' ),
				        'dependencies'          =>  array(
					        'items_per_row'         =>  array(
						        'condition'             =>  'lessThan',
						        'value'                 =>  '2',
					        ),
				        ),
			        ),
		        ),
		        'dots'                  =>  array(
			        'control'               =>  array(
				        'description'           =>  __( 'This will only take effect in the frontend', 'tailor' ),
			        ),
		        ),
	        );
	        tailor_control_presets( $this, $general_control_types, $general_control_arguments, $priority );

	        $priority = 0;
	        $color_control_types = array(
		        'color',
		        'link_color',
		        'link_color_hover',
		        'heading_color',
		        'background_color',
		        'border_color',
		        'navigation_color',
	        );
	        $color_control_arguments = array(
		        'navigation_color'      =>  array(
			        'control'               =>  array(
				        'dependencies'          =>  array(
					        'layout'                =>  array(
						        'condition'             =>  'equals',
						        'value'                 =>  'carousel',
					        ),
				        ),
			        ),
		        ),
	        );
	        tailor_control_presets( $this, $color_control_types, $color_control_arguments, $priority );

	        $priority = 0;
	        $attribute_control_types = array(
		        'class',
		        'margin',
		        'margin_tablet',
		        'margin_mobile',
		        'border_style',
		        'border_width',
		        'border_width_tablet',
		        'border_width_mobile',
		        'border_radius',
		        'shadow',
		        'background_image',
		        'background_repeat',
		        'background_position',
		        'background_size',
		        'background_attachment',
	        );
	        $attribute_control_arguments = array(
		        'margin'                =>  array(
			        'setting'               =>  array(
				        'refresh'               =>  ''
			        ),
		        ),
		        'margin_tablet'         =>  array(
			        'setting'               =>  array(
				        'refresh'               =>  ''
			        ),
		        ),
		        'margin_mobile'         =>  array(
			        'setting'               =>  array(
				        'refresh'               =>  ''
			        ),
		        ),
	        );
	        tailor_control_presets( $this, $attribute_control_types, $attribute_control_arguments, $priority );
        }

	    /**
	     * Returns custom CSS rules for the element.
	     *
	     * @since 1.0.0
	     *
	     * @param array $atts
	     * @return array
	     */
	    public function generate_css( $atts = array() ) {
		    $css_rules = array();
		    $excluded_control_types = array(
			    'border_color',
			    'min_item_height',
			    'min_item_height_tablet',
			    'min_item_height_mobile',
		    );
		    $css_rules = tailor_css_presets( $css_rules, $atts, $excluded_control_types );

		    $selectors = array(
			    'border_color'              =>  array( '', '.slick-dots' ),
		    );
		    $css_rules = tailor_generate_color_css_rules( $css_rules, $atts, $selectors );

		    $selectors = array(
			    'min_item_height'               =>  array( '.tailor-carousel__item' ),
			    'min_item_height_tablet'        =>  array( '.tailor-carousel__item' ),
			    'min_item_height_mobile'        =>  array( '.tailor-carousel__item' ),
		    );
		    $css_rules = tailor_generate_general_css_rules( $css_rules, $atts, $selectors );
		    
		    return $css_rules;
	    }
    }
}