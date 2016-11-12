<?php

/**
 * Tailor Editor Control class.
 *
 * @package Tailor
 * @subpackage Controls
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( class_exists( 'Tailor_Control' ) && ! class_exists( 'Tailor_Editor_Control' ) ) {

    /**
     * Tailor Editor Control class.
     *
     * @since 1.0.0
     */
    class Tailor_Editor_Control extends Tailor_Control {

	    /**
	     * Settings array for this control.
	     *
	     * @since 1.0.0
	     * @var array
	     */
	    public $settings = array();

	    /**
	     * Adds required action hooks.
	     *
	     * @since 1.0.0
	     * @access protected
	     */
	    protected function add_actions() {

		    parent::add_actions();
		    
		    add_filter( 'tailor_editor_styles', array( $this, 'add_editor_styles' ) );
	    }

	    /**
	     * Adds editor styles to the editor.
	     *
	     * @since 1.0.0
	     *
	     * @param $editor_styles
	     *
	     * @return array
	     */
	    function add_editor_styles( $editor_styles ) {
		    $extension = SCRIPT_DEBUG ? '.css' : '.min.css';
		    $editor_styles[] = tailor()->plugin_url() . 'assets/css/frontend' . $extension;
		    $editor_styles[] = tailor()->plugin_url() . 'assets/css/tinymce' . $extension;

		    return $editor_styles;
	    }

        /**
         * Prints the Underscore (JS) template for this control.
         *
         * Class variables are available in the JS object provided by the to_json method.
         *
         * @since 1.0.0
         * @access protected
         *
         * @see Tailor_Control::to_json()
         * @see Tailor_Control::print_template()
         */
        protected function render_template() {
            global $editor_styles;
	        $editor_styles = get_option( '_tailor_editor_styles', $editor_styles );
            $editor_settings = array(
                'textarea_rows'     =>  30,
                'tinymce'           =>  array(
                    'toolbar1'          =>  'bold,italic,bullist,numlist,blockquote,tailoricon,wp_adv',
                    'toolbar2'          =>  'link,unlink,alignleft,aligncenter,alignright,alignjustify,outdent,indent',
                    'toolbar3'          =>  'forecolor,hr,strikethrough,pastetext,removeformat,undo,redo',
                    'toolbar4'          =>  'fontselect,fontsizeselect,formatselect,styleselect',
                ),
            );

            /**
             * Filters the Tailor editor settings.
             *
             * @since 1.0.0
             *
             * @param array $editor_settings
             */
            $editor_settings = apply_filters( 'tailor_editor_settings', $editor_settings );

	        wp_editor( 'tailor-value', 'tailor-editor', $editor_settings );
        }
    }
}