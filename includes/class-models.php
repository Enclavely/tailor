<?php

/**
 * Models class.
 *
 * @package Tailor
 * @subpackage Modules
 * @since 1.4.0
 */

defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'Tailor_Models' ) ) {

    /**
     * Tailor Elements class.
     *
     * @since 1.4.0
     */
    class Tailor_Models {

	    /**
	     * Tailor Models instance.
	     *
	     * @since 1.4.0
	     * @access private
	     * @var Tailor_Models
	     */
	    private static $instance;

	    /**
	     * Returns the Tailor Models instance.
	     *
	     * @since 1.4.0
	     *
	     * @return Tailor_Elements
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
         * @since 1.4.0
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

		    add_action( 'tailor_register_elements', array( $this, 'generate_element_regex' ) );
		    //add_action( 'wp', array( $this, 'generate_models' ) );
		    
		    // Print model data
		    add_action( 'tailor_canvas_footer', array( $this, 'print_models' ) );
		    
		    // Save model data
		    add_action( 'tailor_save', array( $this, 'save_models' ) );

		    // Update post content when the model collection changes
		    add_action( 'tailor_change_collection', array( $this, 'update_post_content' ), 10, 2 );
        }
	     
	    /**
	     * Creates a new collection of models.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param array $models
	     *
	     * @return bool|array
	     */
	    public function add_models( $post_id, $models ) {
		    if ( empty( $post_id ) ) {
			    return false;
		    }

		    // Sanitize and save the collection
		    $sanitized_models = $this->sanitize_models( $models );
		    if ( ! empty( $sanitized_models ) && update_post_meta( $post_id, '_tailor_layout', $sanitized_models ) ) {

			    /**
			     * Fires after models have been added to the collection.
			     *
			     * @since 1.4.0
			     * 
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_add_models', $post_id, $sanitized_models );

			    /**
			     * Fires after the collection has changed.
			     *
			     * @since 1.4.0
			     *
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_change_collection', $post_id, $sanitized_models );
			    
			    return $sanitized_models;
		    }
		    
		    return false;
	    }

	    /**
	     * Adds a model to the collection.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param array $model
	     *
	     * @return bool|array
	     */
	    public function add_model( $post_id, $model ) {
		    if ( empty( $post_id ) ) {
			    return false;
		    }

		    $unsanitized_models = $this->get_models( $post_id );
		    $sanitized_model = $this->sanitize_model( $model );
		    if ( ! empty( $sanitized_model ) ) {
			    $unsanitized_models = array_merge( array( $sanitized_model ), $unsanitized_models );
		    }

		    // Sanitize and save the collection
		    $sanitized_models = $this->sanitize_models( $unsanitized_models );
		    if ( ! empty( $sanitized_model ) && update_post_meta( $post_id, '_tailor_layout', $sanitized_models ) ) {

			    /**
			     * Fires after a model has been added to the collection.
			     *
			     * @since 1.4.0
			     * 
			     * @param int $post_id
			     * @param array $sanitized_model
			     */
			    do_action( 'tailor_add_model', $post_id, $sanitized_model );

			    /**
			     * Fires after the collection has changed.
			     *
			     * @since 1.4.0
			     *
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_change_collection', $post_id, $sanitized_models );

			    return $sanitized_model;
		    }

		    return false;
	    }

	    private $models = array();

	    /**
	     * Returns models in the collection.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     *
	     * @return bool|array
	     */
	    public function get_models( $post_id ) {

		    if ( ! empty( $this->models ) ) {
			    return $this->models;
		    }

		    $unsanitized_models = get_post_meta( $post_id, '_tailor_layout', true );

		    /**
		     * Filters the collection of unsanitized models.
		     *
		     * @since 1.0.0
		     *
		     * @param array $unsanitized_models
		     * @param int $post_id
		     */
		    $unsanitized_models = apply_filters( 'tailor_get_models', $unsanitized_models, $post_id );

		    // Check for model data within the saved HTML content
		    $generated_models = $this->generate_models();
		    if ( ! empty( $generated_models ) ) {
			    foreach ( $unsanitized_models as $unsanitized_model ) {
				    foreach ( $generated_models as &$generated_model ) {
						if ( $generated_model["id"] == $unsanitized_model["id"] ) {
							$generated_model["atts"] = array_merge( $unsanitized_model["atts"], $generated_model["atts"] );
						}
				    }
			    }
			    $unsanitized_models = $generated_models;
		    }

		    $this->models = $unsanitized_models;
		    return $this->models;
	    }

	    /**
	     * Returns a model in the collection.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param int $model_id
	     *
	     * @return bool|array
	     */
	    public function get_model( $post_id, $model_id ) {
		    $unsanitized_models = $this->get_sanitized_models( $post_id );

		    // Return the model with the given ID, if it exists
		    foreach ( $unsanitized_models as $sanitized_model ) {
			    if ( $sanitized_model['id'] == $model_id ) {
				    return $sanitized_model['id'];
			    }
		    }
		    return false;
	    }

	    /**
	     * Returns the default set of elements.
	     *
	     * @since 1.4.0
	     *
	     * @return array
	     */
	    protected function get_default_models() {
		    $section_element = tailor_elements()->get_element( 'tailor_section' );
		    $content_element = tailor_elements()->get_element( 'tailor_content' );
		    $default_models = array(
			    array(
				    'id'                    =>  'section-element-1',
				    'tag'                   =>  $section_element->tag,
				    'atts'                  =>  array(),
			    ),
			    array(
				    'id'                    =>  'content-element-1',
				    'tag'                   =>  $content_element->tag,
				    'atts'                  =>  array(
					    'content'               =>  wpautop( get_the_content() ),
				    ),
				    'parent'                =>  'section-element-1',
			    ),
		    );

		    $post_id = get_the_ID();
		    
		    /**
		     * Filters the collection of default models.
		     *
		     * @since 1.4.0
		     *
		     * @param array $default_models
		     * @param int $post_id
		     */
		    $default_models = apply_filters( 'get_default_models', $default_models, $post_id );

		    return $default_models;
	    }

	    /**
	     * Returns the sanitized models for a given post.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param bool $apply_default
	     *
	     * @return array
	     */
	    public function get_sanitized_models( $post_id, $apply_default = false ) {
		    $sanitized_models = $this->sanitize_models( $this->get_models( $post_id ) );
		    if ( empty( $sanitized_models ) ) {
			    $sanitized_models = ( true == $apply_default ) ? $this->get_default_models() : array();
		    }

		    /**
		     * Filters the collection of sanitized models.
		     *
		     * @since 1.4.0
		     *
		     * @param array $sanitized_models
		     */
		    $sanitized_models = apply_filters( 'tailor_get_sanitized_models', $sanitized_models, $post_id );

		    return $sanitized_models;
	    }

	    /**
	     * Updates models in the collection.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param array $models
	     *
	     * @return bool|array
	     */
	    public function update_models( $post_id, $models ) {
		    if ( empty( $post_id ) ) {
			    return false;
		    }

		    // Update models in the collection
		    $unsanitized_models = $this->get_models( $post_id );

		    // Don't update if there are no models in the collection
		    if ( empty( $unsanitized_models ) ) {
			    return false;
		    }

		    foreach ( $models as $model ) {

			    // Do nothing is a valid model ID is not provided
			    if ( empty( $model['id'] ) ) {
				    continue;
			    }

			    // Update the model with the same ID
			    foreach ( $unsanitized_models as &$unsanitized_model ) {
				    if ( $unsanitized_model['id'] == $model['id'] ) {
					    $model = array_merge( $unsanitized_model, $model );
					    $unsanitized_model = $model;
					    continue;
				    }
			    }
		    }

		    // Sanitize and save the collection
		    $sanitized_models = $this->sanitize_models( $unsanitized_models );
		    if ( ! empty( $sanitized_models ) && update_post_meta( $post_id, '_tailor_layout', $sanitized_models ) ) {

			    /**
			     * Fires after models in the collection have been updated.
			     * 
			     * @since 1.4.0
			     * 
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_update_models', $post_id, $sanitized_models );

			    /**
			     * Fires after the collection has changed.
			     *
			     * @since 1.4.0
			     *
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_change_collection', $post_id, $sanitized_models );
			    
			    return $sanitized_models;
		    }
		    return false;
	    }

	    /**
	     * Updates models in the collection.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param array $model
	     *
	     * @return bool|array
	     */
	    public function update_model( $post_id, $model ) {
		    if ( empty( $post_id ) || empty( $model['id'] ) ) {
			    return false;
		    }

		    // Update the model in the collection
		    $unsanitized_models = $this->get_models( $post_id );
		    foreach ( $unsanitized_models as &$unsanitized_model ) {
			    if ( $unsanitized_model['id'] == $model['id'] ) {

				    // Merge the model attributes
				    if ( isset( $model['atts'] ) ) {
					    $unsanitized_model['atts'] = array_merge( $unsanitized_model['atts'], $model['atts'] );
				    }

				    $unsanitized_model = $model = array_merge( $unsanitized_model, $model );

				    continue;
			    }
		    }

		    // Sanitize and save the collection
		    $sanitized_models = $this->sanitize_models( $unsanitized_models );
		    
		    if ( ! empty( $sanitized_models ) && update_post_meta( $post_id, '_tailor_layout', $sanitized_models ) ) {
			    $sanitized_model = $this->sanitize_model( $model );
			    
			    /**
			     * Fires after a model in the collection has been updated.
			     *
			     * @since 1.4.0
			     * 
			     * @param int $post_id
			     * @param array $sanitized_model
			     */
			    do_action( 'tailor_update_model', $post_id, $sanitized_model );

			    /**
			     * Fires after the collection has changed.
			     *
			     * @since 1.4.0
			     *
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_change_collection', $post_id, $sanitized_models );
			    
			    return $sanitized_model;
		    }

		    return false;
	    }

	    /**
	     * Deletes the model collection.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     *
	     * @return bool
	     */
	    public function delete_models( $post_id ) {
		    if ( ! empty( $post_id ) && delete_post_meta( $post_id, '_tailor_layout' ) ) {

			    /**
			     * Fires after models in the collection have been deleted.
			     *
			     * @since 1.4.0
			     *
			     * @param int $post_id
			     */
			    do_action( 'tailor_delete_models', $post_id );

			    /**
			     * Fires after the collection has changed.
			     *
			     * @since 1.4.0
			     *
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_change_collection', $post_id, array() );

			    return true;
		    }
		    
			return false;
	    }

	    /**
	     * Deletes a model from the collection.
	     *
	     * @since 1.4.0
	     *
	     * @param int $post_id
	     * @param int $model_id
	     *
	     * @return bool|array
	     */
	    public function delete_model( $post_id, $model_id ) {

		    // Remove the model from the collection
		    $unsanitized_models = $this->get_models( $post_id );
		    foreach ( $unsanitized_models as $key => $unsanitized_model ) {
			    if ( $unsanitized_model['id'] == $model_id ) {
				    unset( $unsanitized_models[ $key ] );
				    continue;
			    }
		    }

		    // Sanitize the collection
		    $sanitized_models = $this->sanitize_models( $unsanitized_models );

		    // If empty, remove the collection
		    if ( empty( $sanitized_models ) ) {
			    return $this->delete_models( $post_id );
		    }

		    // Otherwise save it
		    if ( update_post_meta( $post_id, '_tailor_layout', $sanitized_models ) ) {

			    /**
			     * Fires after a model in the collection has been deleted.
			     *
			     * @since 1.4.0
			     * 
			     * @param int $post_id
			     * @param string $model_id
			     */
			    do_action( 'tailor_delete_model', $post_id, $model_id );

			    /**
			     * Fires after the collection has changed.
			     *
			     * @since 1.4.0
			     *
			     * @param int $post_id
			     * @param array $sanitized_models
			     */
			    do_action( 'tailor_change_collection', $post_id, $sanitized_models );
			    
			    return true;
		    }
		    return false;
	    }

	    /**
	     * Saves the current collection of models.
	     *
	     * @since 1.4.0
	     *
	     * @see Tailor::save()
	     *
	     * @param string $post_id
	     */
	    public function save_models( $post_id = '' ) {
		    $post = get_post( $post_id );
		    if ( ! $post ) {
			    wp_send_json_error( array(
				    'message'           =>  _x( 'The post with the given ID could not be found', 'error message', 'tailor' ),
			    ) );
		    }

		    // Sanitize the received models
		    $unsanitized_models = json_decode( wp_unslash( $_POST['models'] ), true );
		    $sanitized_models = $this->sanitize_models( $unsanitized_models );
		    if ( ! is_array( $sanitized_models ) ) {
			    wp_send_json_error( array(
				    'message'           =>  _x( 'No valid models were provided', 'error message', 'tailor' )
			    ) );
		    }

		    // Refresh the model IDs to avoid conflicts
		    $refreshed_models = $this->refresh_model_ids( $sanitized_models );

		    /**
		     * Fires before the sanitized model data has been saved to the database.
		     *
		     * @since 1.4.0
		     *
		     * @param string $post_id
		     * @param array $refreshed_models
		     */
		    do_action( 'tailor_save_models', $post_id, $refreshed_models );

		    // Save the model data
		    update_post_meta( $post_id, '_tailor_layout', $refreshed_models );

			// Update the post content
		    $this->update_post_content( $post_id, $refreshed_models );
	    }

	    /**
	     * Updates the content of a post based on a collection of element models.
	     *
	     * @since 1.4.0
	     *
	     * @param $post_id
	     * @param $sanitized_models
	     */
	    public function update_post_content( $post_id, $sanitized_models ) {
		    $post = get_post( $post_id );
		    $updated_post_content = '';
		    
		    // Generate the page content using the model collection
		    if ( ! empty( $sanitized_models ) ) {
			    $ordered_sanitized_models = $this->order_models_by_parent( $sanitized_models );
			    $shortcodes = $this->generate_shortcodes( '', $ordered_sanitized_models );

			    /**
			     * Allows developers to control whether content is saved as HTML or shortcodes.
			     *
			     * @since 1.5.7
			     *
			     * @param bool
			     */
			    if ( apply_filters( 'tailor_save_content_as_html', true ) ) {

				    // Ensure that only (non-dynamic) element shortcodes are processed
				    global $shortcode_tags;
				    $dynamic_shortcodes = array();
				    foreach ( tailor_elements()->get_elements() as $element ) {
					    if ( true != (bool) $element->dynamic ) {
						    $dynamic_shortcodes[ $element->tag ] = $shortcode_tags[ $element->tag ];
					    }
				    }

				    $shortcode_tags = $dynamic_shortcodes;
				    $updated_post_content = do_shortcode( $shortcodes );
			    }
			    else {
				    $updated_post_content = $shortcodes;
			    }
		    }

		    /**
		     * Fires before the post content has been updated.
		     *
		     * @since 1.4.0
		     *
		     * @param string $post_id
		     * @param string $post->post_content
		     * @param string $updated_post_content
		     */
		    do_action( 'tailor_save_post_content', $post_id, $post->post_content, $updated_post_content );

		    wp_update_post( array(
			    'ID'                =>  $post_id,
			    'post_content'      =>  $updated_post_content,
		    ) );

		    /**
		     * Fires after the post content has been updated.
		     *
		     * @since 1.4.0
		     *
		     * @param string $post_id
		     * @param string $post->post_content
		     */
		    do_action( 'tailor_save_post_content_after', $post_id, $updated_post_content );
	    }

	    /**
	     * Returns an array of models sorted by parent and order.
	     *
	     * @since 1.0.0
	     *
	     * @param $models
	     * @return array $css_rules
	     */
	    public function order_models_by_parent( $models ) {
		    $ordered_models = array();
		    foreach ( $models as $model ) {
			    $ordered_models[ $model['parent'] ][ $model['order'] ] = $model;
		    }

		    return $ordered_models;
	    }

	    /**
	     * Returns all child (and grandchild) shortcodes for an given model.
	     *
	     * @since 1.4.0
	     *
	     * @param $parent_id
	     * @param $ordered_sanitized_models
	     * @return string
	     */
	    public function generate_shortcodes( $parent_id, $ordered_sanitized_models ) {
		    $shortcodes = '';

		    if ( ! array_key_exists( $parent_id, $ordered_sanitized_models ) ) {
			    return $shortcodes;
		    }
		    
		    foreach ( $ordered_sanitized_models[ $parent_id ] as $sanitized_model ) {
			    $element = tailor_elements()->get_element( $sanitized_model['tag'] );

			    // Set the element content appropriately
			    $content = $this->generate_shortcodes( $sanitized_model['id'], $ordered_sanitized_models );
			    if ( array_key_exists( 'content', $sanitized_model['atts'] ) ) {
				    if ( empty( $content ) ) {
					    $content = $sanitized_model['atts']['content'];
				    }
				    unset( $sanitized_model['atts']['content'] );
			    }

				// Allow nested shortcodes
			    if ( has_shortcode( $content, $element->tag ) ) {
				    $content = do_shortcode( $content );
			    }

			    $shortcode = $element->generate_shortcode( $sanitized_model['id'], $sanitized_model['atts'], $content );
			    $comment_data = "tailor:{$element->tag}:{$sanitized_model['id']}";
			    $shortcodes .= "<!-- {$comment_data} -->{$shortcode}<!-- /{$comment_data} -->";
		    }

		    return $shortcodes;
	    }

	    /**
	     * Sanitizes a collection of element models.
	     *
	     * @since 1.4.0
	     *
	     * @param array $unsanitized_models
	     *
	     * @return array
	     */
	    public function sanitize_models( $unsanitized_models ) {
		    $sanitized_models = array();
		    if ( ! is_array( $unsanitized_models ) ) {
			    return $sanitized_models;
		    }

		    foreach ( $unsanitized_models as $unsanitized_model ) {
			    $sanitized_models[] = $this->sanitize_model( $unsanitized_model );
		    }

		    return $sanitized_models;
	    }

	    /**
	     * Sanitizes an element model.
	     *
	     * @since 1.4.0
	     *
	     * @param $unsanitized_model
	     *
	     * @return array|mixed|void
	     */
	    public function sanitize_model( $unsanitized_model ) {
		    $sanitized_atts = array();

		    if ( $element = tailor_elements()->get_element( $unsanitized_model['tag'] ) ) {
			    if ( ! $element->active() ) {
				    $original_label = $element->label;

				    // Create a content element containing an error message
				    $element = tailor_elements()->get_element( 'tailor_content' );
				    $sanitized_atts['content'] = sprintf(
					    __( '%1$sThe %2$s element is not active.%3$s ', 'tailor' ),
					    '<p class="error">',
					        '<code>'  . esc_attr( $original_label ) . '</code>',
					    '</p>'
				    );
			    }
			    else {
				    foreach ( $element->settings() as $setting ) { /* @var $setting Tailor_Setting */

					    // Apply default if a value has not been provided
					    if ( ! array_key_exists( $setting->id, $unsanitized_model['atts'] ) ) {
						    $unsanitized_model['atts'][ $setting->id ] = $setting->default;
					    }

					    if ( '' == $unsanitized_model['atts'][ $setting->id ] && '' == $setting->default ) {
						    continue;
					    }

					    // Sanitize value
					    $sanitized_value = $setting->sanitize( $unsanitized_model['atts'][ $setting->id ] );
					    if ( is_array( $sanitized_value ) ) {
						    continue;
					    }

					    $sanitized_atts[ $setting->id ] = $sanitized_value;
				    }
			    }
		    }
		    else {

			    // Create a content element containing an error message
			    $element = tailor_elements()->get_element( 'tailor_content' );
			    $sanitized_atts['content'] = sprintf(
				    __( '%1$sThe element associated with shortcode %2$s could not be found%3$s ', 'tailor' ),
				    '<p class="error">',
				    '<code>'  . esc_attr( $unsanitized_model['tag'] ) . '</code>',
				    '</p>'
			    );
		    }

		    $sanitized_model = array(
			    'id'            =>  $unsanitized_model['id'],
			    'tag'           =>  $element->tag,
			    'atts'          =>  $sanitized_atts,
			    'parent'        =>  $unsanitized_model['parent'],
			    'order'         =>  $unsanitized_model['order'],
		    );

		    /**
		     * Filters the sanitized model.
		     *
		     * @since 1.0.0
		     *
		     * @param array $sanitized_model
		     */
		    $sanitized_model = apply_filters( 'tailor_sanitize_model', $sanitized_model );

		    return $sanitized_model;
	    }
	    
	    /**
	     * Refreshes the IDs and parent references for a given set of models.
	     *
	     * @since 1.4.0
	     *
	     * @param array $models
	     * @return array $models
	     */
	    public function refresh_model_ids( $models ) {
		    $model_ids = $updated_models = array();

		    // Generate a random ID base which is iterated for each element
		    $id_base = uniqid();

		    foreach ( $models as $model ) {
			    if ( ! array_key_exists( $model['id'], $model_ids ) ) {
				    $model_ids[ $model['id'] ] = $id_base ++;
			    }

			    $model['id'] = $model_ids[ $model['id'] ];
			    if ( ! empty( $model['parent'] ) ) {
				    if ( ! array_key_exists( $model['parent'], $model_ids ) ) {
					    $model_ids[ $model['parent'] ] = $id_base ++;
				    }
				    $model['parent'] = $model_ids[ $model['parent'] ];
			    }
			    $updated_models[] = $model;
		    }

		    return $updated_models;
	    }

	    /**
	     * Prints model data.
	     *
	     * @since 1.4.0
	     */
	    public function print_models() {
		    if ( did_action( 'tailor_print_models' ) ) {
			    return;
		    }

		    // Get the sanitized models for the post
		    $post_id = get_the_ID();
		    $sanitized_models = $this->get_sanitized_models( $post_id, true );
		    $sanitized_models = json_encode( $sanitized_models );
		    
		    echo "<script type=\"text/javascript\">\n var _elements = {$sanitized_models}; \n</script>\n";

		    /**
		     * Fires after the element models have been printed to the screen.
		     *
		     * @since 1.4.0
		     */
		    do_action( 'tailor_print_models' );
	    }
	    
	    

	    private $regex = false;

	    /**
	     * Generates the regular expression used to identify elements in post content.
	     *
	     * Runs once all elements have been registered.
	     *
	     * <!-- tailor:{$type}:{$id} -->
	     *
	     * @see Tailor_Elements::register_elements()
	     */
	    public function generate_element_regex() {
		    $element_types = array();
		    foreach ( tailor_elements()->get_elements() as $element ) {
			    $element_types[] = $element->tag;
		    }
		    $this->regex = sprintf(
			    "/<!--" .
			    '\s?(?![\\/])(tailor:(%s):(.*?))' .
			    '(.*?)' .
			    '-->' .
			    '(.*?)' .
			    '<!--' .
			    '\s?\\/\1\s?' .
			    "-->/",
			    join( '|', $element_types )
		    );
	    }
	    
	    /**
	     * Generates models from the saved post content.
	     *
	     * @since 1.8.0
	     */
	    public function generate_models() {

		    $models = array();
		    if ( false === $this->regex ) {
			    return $models;
		    }

		    global $post;

		    $content = str_replace( "\n", '', $post->post_content );
		    $models = $this->generate_models_from_html( $content, '', array() );
		    return $models;
	    }

	    /**
	     * Recursively generates element models from HTML.
	     *
	     * @since 1.8.0
	     * 
	     * @param $html
	     * @param $parent
	     * @param $models
	     *
	     * @return array
	     */
	    public function generate_models_from_html( $html, $parent, $models ) {
		    $placeholder = tailor_get_setting( 'content_placeholder', __( 'This is placeholder text which you can replace by editing this element.', 'tailor' ) );

		    if ( preg_match_all( $this->regex, $html, $matches ) ) {
			    for ( $i = 0; $i < count( $matches[3] ); $i++ ) {
				    $id = $matches[3][ $i ];
				    $type = $matches[2][ $i ];
				    $content = $matches[5][ $i ];
				    $model = array(
					    'id'            =>  $id,
					    'tag'           =>  $type,
					    'atts'          =>  array(),
					    'parent'        =>  $parent,
					    'order'         =>  $i,
				    );

				    // Get the inner HTML of content elements
				    if ( $type == 'tailor_content' ) {
					    $dom = new DOMDocument('1.0', 'UTF-8');
					    $dom->loadHtml(mb_convert_encoding( preg_replace( $this->regex, '', $content ), 'HTML-ENTITIES', 'UTF-8') );
					    $inner_html = '';

					    foreach ( $dom->getElementsByTagName("div") as $node ) {
						    if ( strpos( $node->getAttribute("class"), "tailor-{$id}" ) !== false ) {
							    foreach ( $node->childNodes as $el ) {
								    $inner_html .= $dom->saveHTML($el);
							    }
						    }
					    }

					    if ( wp_strip_all_tags( $inner_html ) != $placeholder ) {
						    $model['atts']['content'] = $inner_html;
					    }
				    }

				    $models[] = $model;
				    $models = $this->generate_models_from_html( $content, $id, $models );
			    }
		    }
		    return $models;
	    }
    }
}

if ( ! function_exists( 'tailor_models' ) ) {

	/**
	 * Returns the Tailor Models instance.
	 *
	 * @since 1.4.0
	 *
	 * @return Tailor_Models
	 */
	function tailor_models() {
		return Tailor_Models::get_instance();
	}
}

/**
 * Initializes the Tailor Models module.
 *
 * @since 1.4.0
 */
tailor_models();
