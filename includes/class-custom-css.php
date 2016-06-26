<?php

/**
 * Custom CSS class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Custom_CSS' ) ) {

    /**
     * Tailor Custom CSS class.
     *
     * @since 1.0.0
     */
    class Tailor_Custom_CSS {

        /**
         * The custom CSS instance.
         *
         * @since 1.0.0
         * @access private
         * @var Tailor_Custom_CSS
         */
        private static $instance;

        /**
         * The custom CSS data.
         *
         * @since 1.0.0
         * @var array
         */
        public $data = array();

        /**
         * Returns a singleton instance.
         *
         * @since 1.0.0
         *
         * @return Tailor_Custom_CSS
         */
        public static function get_instance() {
            if ( is_null( self::$instance ) ) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        /**
         * Constructor.
         *
         * @since 1.0.0
         */
        public function __construct() {
            $this->add_actions();
        }

        /**
         * Adds required action hooks.
         *
         * @since 1.0.0
         * @access protected
         */
        protected function add_actions() {
            add_action( 'wp_head', array( $this, 'print_page_css' ) );
            add_action( 'wp_head', array( $this, 'print_element_css' ) );
	        add_action( 'tailor_canvas_footer', array( $this, 'print_element_css_data' ) );
	        add_action( 'tailor_save_models', array( $this, 'save_element_css_data' ), 10, 2 );
        }

	    /**
	     * Saves custom CSS for the post or page.
	     *
	     * @since 1.0.0
	     *
	     * @param $post_id
	     * @param $sanitized_models
	     */
	    public function save_element_css_data( $post_id, $sanitized_models ) {
		    $element_css_rules = $this->generate_element_css( $sanitized_models );
		    update_post_meta( $post_id, '_tailor_element_css', $element_css_rules );
	    }

	    /**
	     * Generates custom CSS for the post or page.
	     *
	     * @since 1.0.0
	     */
	    public function generate_element_css( $sanitized_models ) {
		    $element_css_rules = array();

		    foreach ( (array) $sanitized_models as $sanitized_model ) {

			    $element = tailor_elements()->get_element( $sanitized_model['tag'] );

			    if ( method_exists( $element, 'generate_css' ) ) {

				    $css_rule_sets = $element->generate_css( $sanitized_model['atts'] );

				    foreach ( $css_rule_sets as $css_rule_set ) {

					    $media = empty( $css_rule_set['media'] ) ? 'all' : $css_rule_set['media'];

					    if ( ! array_key_exists( $media, $element_css_rules ) ) {
						    $element_css_rules[ $media ] = array();
					    }

					    if ( ! array_key_exists( $sanitized_model['id'], $element_css_rules[ $media ] ) ) {
						    $element_css_rules[ $media ][ $sanitized_model['id'] ] = array();
					    }

					    $element_css_rules[ $media ][ $sanitized_model['id'] ][] = array(
						    'selectors'         =>  $css_rule_set['selectors'],
						    'declarations'      =>  $css_rule_set['declarations'],
					    );
				    }
			    }
		    }

		    /**
		     * Filter the generated element CSS rules.
		     *
		     * @since 1.0.0
		     *
		     * @param string $element_css_rules
		     */
		    $element_css_rules = apply_filters( 'tailor_generate_element_css', $element_css_rules );

		    return $element_css_rules;
	    }

	    /**
	     * Prints CSS rule data to the page.
	     *
	     * @since 1.0.0
	     */
	    public function print_element_css_data() {

		    if ( did_action( 'tailor_print_element_css_data' ) ) {
			    return;
		    }

		    $css_rule_sets = $this->get_element_css();

		    if ( false != $css_rule_sets && is_array( $css_rule_sets ) ) {
			    echo "<script type=\"text/javascript\">\n var _css_rules = " . wp_json_encode( $css_rule_sets ) . ";\n</script>\n";
		    }

		    /**
		     * Fires after the css data has been printed to the screen.
		     *
		     * @since 1.0.0
		     */
		    do_action( 'tailor_print_element_css_data' );
	    }

	    /**
	     * Prints custom CSS to the page.
	     *
	     * @since 1.0.0
	     */
		public function print_element_css() {

			if ( tailor()->is_canvas() || did_action( 'tailor_print_element_css' ) ) {
				return;
			}

			/**
			 * Allow developers to prevent custom element CSS from being printed.
			 *
			 * @since 1.0.0
			 *
			 * @param bool
			 */
			if ( ! apply_filters( 'tailor_print_element_css', true ) ) {
				return;
			}

			if ( tailor()->is_template_preview() ) {
				$css_rule_sets = $this->get_template_css();
			}
			else {
				$css_rule_sets = $this->get_element_css();
			}
			
			if ( ! empty( $css_rule_sets ) ) {
				$t = '';
				$n = "\n";
				$css = $n;

				$available_media_queries = tailor_get_registered_media_queries( true );

				foreach ( $css_rule_sets as $media_query_id => $element_rule_sets ) {

					$media_query_type = str_replace( '-up', '', $media_query_id );
					
					if ( ! array_key_exists( $media_query_type, $available_media_queries ) ) {
						continue;
					}

					if ( 'all' != $media_query_id ) {

						$t = "\t";

						$query_string = "{$n}@media only screen";

						if ( ! empty( $available_media_queries[ $media_query_type ]['min'] ) ) {
							$query_string .= ' and (min-width: ' . $available_media_queries[ $media_query_type ]['min'] . ')';

							if ( ! empty( $available_media_queries[ $media_query_type ]['max'] ) && false == strpos( $media_query_id, '-up' ) ) {
								$query_string .= ' and (max-width: ' . $available_media_queries[ $media_query_type ]['max'] . ')';
							}
						}
						else if ( ! empty( $available_media_queries[ $media_query_type ]['max'] ) ) {
							$query_string .= ' and (max-width: ' . $available_media_queries[ $media_query_type ]['max'] . ')';
						}

						$css .= $query_string . " {{$n}";
					}

					foreach ( $element_rule_sets as $element_id => $rule_set ) {

						foreach ( $rule_set as $rule ) {
							$css .= $this->parse_selectors( $element_id, $rule['selectors'], $t ) . ' {' . $n;
							$css .= $this->parse_declarations( $rule['declarations'], $t );
							$css .= $t . '}' . $n;
						}
					}

					if ( 'all' != $media_query_id ) {
						$css .= '}' . $n;
					}
				}
				
				printf( "\n<style id=\"tailor-custom-element-css\" type=\"text/css\">%s</style>\n", $css );
			}

			/**
			 * Fires after custom element CSS has been printed.
			 *
			 * @since 1.0.0
			 */
			do_action( 'tailor_print_element_css' );
		}

	    /**
	     * Returns the custom CSS rules associated with a given template.
	     *
	     * @since 1.0.0
	     *
	     * @return array|mixed|void
	     */
	    private function get_template_css() {

		    $template_css_rules = array();

		    if ( empty( $_GET['template_id'] ) || false == $template = tailor_templates()->get_template( $_GET['template_id'] ) ) {
			    return $template_css_rules;
		    }

		    $template_css_rules = $this->generate_element_css( $template['models'] );

		    /**
		     * Filter the template CSS rules.
		     *
		     * @since 1.0.0
		     *
		     * @param string $template_css_rules
		     */
		    $template_css_rules = apply_filters( 'tailor_get_template_css', $template_css_rules );

		    return $template_css_rules;
	    }

	    /**
	     * Returns the saved custom CSS for the current page or post.
	     *
	     * @since 1.0.0
	     *
	     * @return array|mixed|void
	     */
	    private function get_element_css() {
		    $element_css_rules = get_post_meta( get_the_ID(), '_tailor_element_css', true );

		    if ( false == $element_css_rules ) {
			    $element_css_rules = array();
		    }

		    /**
		     * Filter the element CSS rules.
		     *
		     * @since 1.0.0
		     *
		     * @param string $element_css_rules
		     */
		    $element_css_rules = apply_filters( 'tailor_get_element_css', $element_css_rules );

		    return $element_css_rules;
	    }

	    /**
	     * Parses CSS selector string(s) for a given element.
	     *
	     * @since 1.0.0
	     *
	     * @param $element_id
	     * @param $selectors
	     * @param string $tab
	     *
	     * @return string
	     */
	    private function parse_selectors( $element_id, $selectors, $tab = '' ) {
		    $n = "\n";
		    $element_class = '.tailor-ui .tailor-' . $element_id;

		    foreach ( $selectors as &$selector ) {
			    $first_character = substr( $selector, 0, 1 );

			    if ( '&' == $first_character ) {
				    $selector = substr( $selector, 1, strlen( $selector ) );
			    }
			    else if ( ':' != $first_character ) {
				    $selector = ' ' . $selector;
			    }
		    }

		    $output = trim( ",{$n}{$tab}{$element_class}" );
		    $output = implode( $output, $selectors );

		    return $tab . $element_class . $output;
	    }

	    /**
	     * Parses CSS declarations.
	     *
	     * @since 1.0.0
	     *
	     * @param $declarations
	     * @param string $tab
	     *
	     * @return string
	     */
	    private function parse_declarations( $declarations, $tab = '' ) {
		    $n = "\n";
		    $t = "\t" . $tab;
		    $output = '';

		    foreach ( $declarations as $property => $value ) {

			    if ( empty( $value ) ) {
				    continue;
			    }

			    $parsed_value = "{$t}{$property}:{$value};$n";
			    $output .= $parsed_value;
		    }

		    return $output;
	    }

	    /**
	     * Prints custom CSS for the post or page.
	     *
	     * @since 1.0.0
	     */
        public function print_page_css() {

	        if ( did_action( 'tailor_print_page_css' ) ) {
		        return;
	        }

	        /**
	         * Allow developers to prevent custom page CSS from being printed.
	         *
	         * @since 1.0.0
	         *
	         * @param bool
	         */
	        if ( apply_filters( 'tailor_print_page_css', true ) ) {

		        $custom_page_css = $this->get_page_css();
		        $custom_page_css = $this->clean_css( $custom_page_css );

		        if ( ! empty( $custom_page_css ) || tailor()->is_canvas() ) {
			        printf( "\n<style id=\"tailor-custom-page-css\" type=\"text/css\">%s</style>\n", $custom_page_css );
		        }
	        }

	        /**
	         * Fires after custom page CSS has been printed.
	         *
	         * @since 1.0.0
	         */
	        do_action( 'tailor_print_page_css' );
        }

	    /**
	     * Returns the saved custom CSS for the page or post.
	     *
	     * @since 1.0.0
	     *
	     * @return string $custom_page_css
	     */
	    private function get_page_css() {

		    $custom_page_css = get_post_meta( get_the_ID(), '_tailor_page_css', true );

		    if ( false == $custom_page_css ) {
			    $custom_page_css = '';
		    }

		    /**
		     * Filter the custom CSS for the page or post.
		     *
		     * @since 1.0.0
		     *
		     * @param string $custom_css
		     */
		    $custom_page_css = apply_filters( 'tailor_get_page_css', $custom_page_css );

		    return $custom_page_css;
	    }

	    /**
	     * Removes comments and whitespace from CSS.
	     *
	     * @since 1.0.0
	     *
	     * @param string $css
	     *
	     * @return string $css
	     */
	    private function clean_css( $css = '' ) {
		    $css = preg_replace( '#/\*.*?\*/#s', '', $css );          // Remove comments
		    $css = preg_replace( '/\s*([{}|:;,])\s+/', '$1', $css );  // Remove whitespace
		    $css = preg_replace( '/\s\s+(.*)/', '$1', $css );         // Remove starting whitespace

		    return trim( $css );
	    }
    }
}

new Tailor_Custom_CSS;