# Filters

## General filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_setting_id | Applies to the option key used to store setting values | string $setting_id |
| tailor_enable_frontend_styles | Allow developers to prevent Tailor front end styles from being enqueued | bool |
| tailor_enable_frontend_scripts | Allow developers to prevent Tailor front end scripts from being enqueued | bool |
| tailor_enable_editor_styles | Allow developers to prevent Tailor editor styles from being enqueued | bool |
| tailor_save_response | Applies to the response data for a successful tailor_save AJAX request | array $response <br> int $post_id <br> Tailor $tailor |
| tailor_plugin_dir | Applies to the Tailor plugin directory path | string $plugin_dir |
| tailor_plugin_url | Applies to the Tailor plugin directory URL | string $plugin_url |
| tailor_check_user | Applies to the result of the user permission check | bool $allowable |
| tailor_check_post | Applies to the result of the post check | bool $allowable <br> int $post_id |
| tailor_edit_url_query_args | Applies to the query args used in the Edit link URL | array $query_args |
| tailor_editor_styles | Applies to the collection of stylesheets to be loaded in the editor | array $editor_styles |
| tailor_editor_settings | Applies to the default settings to be used for the editor control | array $editor_settings |

## Element filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_print_element_html | Applies to the HTML for elements on a given page | string $element_html <br> int $post_id |
| tailor_print_default_element_html | Applies to the HTML for default elements on a given page | string $default_element_html <br> int $post_id |
| tailor_render_elements_response | Applies to the response data for a successful render_elements AJAX request | array $response |
| tailor_setting\_args\_**{$tag}** | Applies to the setting arguments for a given element | array $setting_args <br> Tailor_Element $element |
| tailor_setting\_args\_**{$tag}**\_**{$id}** | Applies to the setting arguments for a given element and control | array $setting_args <br> Tailor_Element $element |
| tailor_control\_args\_**{$type}** | Applies to the control arguments for a given control type | array $control_args <br> Tailor_Element $element |
| tailor_control\_args\_**{$tag}** | Applies to the control arguments for a given element | array $control_args <br> Tailor_Element $element |
| tailor_control\_args\_**{$tag}**\_**{$id}** | Applies to the control arguments for a given element and control | array $control_args <br> Tailor_Element $element |
| tailor_enable_element\_panel\_**{$id}** | Allow developers to prevent an element panel from being displayed | bool |
| tailor_enable_element\_section\_**{$id}** | Allow developers to prevent an element section from being displayed | bool |
| tailor_enable_element\_control\_**{$id}** | Allow developers to prevent an element control from being displayed | bool |
| tailor_element_active | Allow developers to prevent an element from being displayed as active | bool $active <br> Tailor_Element $element |
| tailor_excerpt_length | Applies to the entry excerpt length | int $excerpt_length |
| tailor_shortcode_default_atts_**{$tag}** | Applies to the default attributes passed to the shortcode rendering function | array $default_atts |
| tailor_shortcode_html_attributes | Applies to the HTML attributes for the element (ID, classes, data) | array $html_atts <br> array $atts <br> string $tag |
| tailor_shortcode_html | Applies to the rendered HTML for the element | string $html <br> string $outer_html <br> string $inner_html <br> string $html_atts <br> array $atts <br> string $content <br> string $tag |

## Model filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_get_models | Applies to the collection of unsanitized models | array $unsanitized_models <br> int $post_id |
| tailor_get_sanitized_models | Applies to the collection of sanitized models | array $sanitized_models <br> int $post_id |
| tailor_sanitize_model | Applies to the a sanitized model | array $sanitized_model |
| tailor_get_default_models | Applies to the collection of default models | array $default_models <br> int $post_id |
| tailor_save_content_as_html | Allows developers to control whether content is saved as HTML or shortcodes | bool |

## Sidebar filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_setting_id | Applies to the option key used to store setting values | string $setting_id |
| tailor_enable_sidebar_styles | Allow developers to prevent Tailor sidebar styles from being enqueued | bool |
| tailor_preview_url | Applies to the URL of the preview/canvas frame | string $preview_url <br> string $permalink <br> array $query_args |

## Canvas filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_canvas_content | Applies to the content of the page during a canvas page load | string $content |
| tailor_enable_canvas_styles | Allow developers to prevent Tailor canvas styles from being enqueued | bool |

## Custom CSS filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_custom_css_key | Applies to the key used to store custom CSS as post meta | string $key |
| tailor_dynamic_css_key | Applies to the key used to store dynamic element CSS as post meta | string $key |
| tailor_element_css_rule_sets | Applies to the CSS rule sets generated for each element | string $css_rule_sets <br> array $atts <br> Tailor_Element $element |
| tailor_element_css_rule\_sets\_**{tag}** | Applies to the CSS rule sets generated for each element | string $css_rule_sets <br> array $atts <br> Tailor_Element $element |
| tailor_generate_dynamic_css_rules | Applies to the CSS rule sets generated for the element collection | string $collection_css_rules |
| tailor_generate_template_dynamic_css_rules | Applies to the CSS rule sets generated for the template element collection | string $template_css_rules |
| tailor_get_dynamic_css_rules | Applies to the CSS rule sets retrieved from post meta | string $dynamic_css_rules <br> int $post_id |
| tailor_get_custom_css | Applies to the custom page CSS retrieved from post meta | string $custom_page_css <br> int $post_id |
| tailor_enable_customizer_css | Allow developers to prevent Customizer CSS from being printed | bool |
| tailor_enable_custom_css | Allow developers to prevent custom CSS from being printed | bool |
| tailor_enable_dynamic_css | Allow developers to prevent dynamic CSS from being printed | bool |

## Custom JavaScript filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_custom_js_key | Applies to the key used to store custom JavaScript as post meta | string $key |
| tailor_get_custom_js | Applies to the custom page JavaScript retrieved from post meta | string $custom_page_js <br> int $post_id |
| tailor_enable_custom_js | Allow developers to prevent custom page JavaScript from being printed | bool |

## Template filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_templates_post_name | Applies to the name of the post used to store templates | string $name |
| tailor_save_template_response | Applies to the response data for a successful save_template AJAX request | array $response <br> int $template_id |
| tailor_load_template_response | Applies to the response data for a successful load_template AJAX request | array $response <br> int $template_id |
| tailor_delete_template_response | Applies to the response data for a successful delete_template AJAX request | array $response <br> int $template_id |
| get_template_preview | Applies to the page content during a template preview session | string $template_preview_content |

## Settings filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_enable_sidebar\_panel\_**{$id}** | Allow developers to prevent a sidebar panel from being displayed | bool |
| tailor_enable_sidebar\_section\_**{$id}** | Allow developers to prevent a sidebar section from being displayed | bool |
| tailor_enable_sidebar\_control\_**{$id}** | Allow developers to prevent a sidebar control from being displayed | bool |
| tailor_customizer_panels | Applies to the configuration settings for Customizer panels | array $panels |
| tailor_customizer_sections | Applies to the configuration settings for Customizer sections | array $sections |
| tailor_customizer_settings | Applies to the configuration settings for Customizer settings and controls | array $settings |
| tailor\_sanitize\_**{$manager_id}**\_**{$id}** | Applies to the value of a given setting within a given setting manager | mixed $value <br> Tailor_Setting $setting |
| tailor_sanitize\_js\_**{$id}** | Applies to the value of a given setting for use in JavaScript | mixed $value <br> Tailor_Setting $setting |
| tailor\_value\_**{$id}** | Applies to the deafult value of a given setting that's not handled as a theme_mod, option or piece of post meta | mixed $default_value |
| tailor_control_use_label | Allow developers to control whether a specific control should be contained within a label tag | bool $use_label <br> string $type |

## Icon kits filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_get_icon_kits | Applies to the set of installed icon kits | array $icon_kits |
| tailor_get_active_icon_kits | Applies to the set of installed and active icon kits | array $active_icon_kits |
| tailor_dashicons | Applies to the class mappings for default Dashicon icons | array $dashicons |

## Admin filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_settings_page_capability | Applies to the user capability required to manage plugin settings | string $capability |
| tailor_default_settings | Applies to the set of default admin setting values | array $setting_defaults |
| tailor_get_registered_media_queries | Applies to the set of default media queries | array $media_queries |
| tailor_revision_meta_keys | Applies to the set of meta keys monitored for post revisions | array $meta_keys |

## Template partial filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_theme_partial_dir | Applies to theme directory to be searched for Tailor template partials | string $theme_partial_dir |
| tailor_plugin_partial_paths | Applies to plugin directories to be searched for Tailor template partials | string $plugin_partial_paths |
| tailor_partial | Applies to template partial that is about to be loaded | string $partial <br> string $slug <br> string $name <br> array $args |
| tailor_excerpt | Applies to excerpt used in elements | string $trimmed_excerpt <br> string $excerpt <br> int $excerpt_length <br> string $excerpt_more |
| tailor_post_meta_order | Applies to order of post meta displayed in the Posts element | array $meta_order |
| tailor_show_comments_link | Allow developers to control whether the comment number should act as a link | bool |

## REST API filters

| Filter | Description | Argument(s) |
|----------|----------|----------|
| tailor_api_types | Applies to the resource types available in the Tailor REST API | string $types |
| tailor_api_get_elements | Applies to response from an API request to get all registered elements | array $element_data <br> WP_REST_Request $request |
| tailor_api_get_element | Applies to response from an API request to get a registered element | array $element_data <br> WP_REST_Request $request |
| tailor_api_create_models | Applies to response from an API request to create models for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_create_model | Applies to response from an API request to create a model for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_get_models | Applies to response from an API request to get models for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_get_model | Applies to response from an API request to get a model for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_update_models | Applies to response from an API request to update models for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_update_model | Applies to response from an API request to update a model for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_delete_models | Applies to response from an API request to delete models for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_delete_model | Applies to response from an API request to delete a model for a given post | array $model_data <br> WP_REST_Request $request |
| tailor_api_create_template | Applies to response from an API request to create a template | array $template_data <br> WP_REST_Request $request |
| tailor_api_get_templates | Applies to response from an API request to get templates | array $template_data <br> WP_REST_Request $request |
| tailor_api_get_template | Applies to response from an API request to get a template | array $template_data <br> WP_REST_Request $request |
| tailor_api_update_template | Applies to response from an API request to update a template | array $template_data <br> WP_REST_Request $request |
| tailor_api_delete_template | Applies to response from an API request to delete a template | array $template_data <br> WP_REST_Request $request |
| tailor_api_create_items_permissions_check | Applies to create items permission check result | bool <br> WP_REST_Request $request <br> string $type |
| tailor_api_get_items_permissions_check | Applies to create items permission check result | bool <br> WP_REST_Request $request <br> string $type |