# Actions

## General actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_activated | Fires after the plugin is activated | |
| tailor_deactivated | Fires after the plugin is deactivated |  |
| tailor_updated | Fires after the plugin is updated | string $previous_version |
| tailor_init | Fires after all plugin files are loaded | Tailor $tailor |
| tailor_save | Fires when the save action is triggered | int $post_id <br> Tailor $tailor |
| tailor_save_after | Fires after all save actions have been completed | int $post_id <br> Tailor $tailor |
| tailor_save_post_content | Fires before the updated post content is saved | int $post_id <br> string $post_content <br> string $updated_post_content |
| tailor_save_post_content_after | Fires after the updated post content has been saved | int $post_id <br> string $post_content <br> string $updated_post_content |
| tailor\_partial\_**{$slug}** | Fires before a template partial is loaded | string $partial <br> string $slug <br> string $name <br> array $args |

## Element actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_load_elements | Fires after all default element files are loaded | Tailor_Elements $element_manager |
| tailor_register_elements | Fires after all default elements have been registered | Tailor_Elements $element_manager |
| tailor_print_element_data | Fires after element library data have been printed | |
| tailor_print_element_html | Fires after element HTML templates have been printed | |
| tailor_print_default_element_html | Fires after default element HTML templates have been printed | |
| tailor_element_register_controls | Fires after element controls have been registered | Tailor_Element $element |
| tailor_element\_register\_controls\_**{$tag}** | Fires after element controls have been registered | Tailor_Element $element |
| tailor_element_prepare_controls | Fires after element controls have been prepared | Tailor_Element $element |

## Model actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_print_models | Fires after element models have been printed | |
| tailor_add_models | Fires after element models have been added to a page | int $post_id <br> array $sanitized_models |
| tailor_add_model | Fires after an element model has been added to a page | int $post_id <br> array $sanitized_model |
| tailor_update_models | Fires after element models have been updated on a given page | int $post_id <br> array $sanitized_models |
| tailor_update_model | Fires after an element model has been updated on a given page | int $post_id <br> array $sanitized_model |
| tailor_delete_models | Fires after element models have been deleted on a given page | int $post_id |
| tailor_delete_model | Fires after an element model has been deleted on a given page | int $post_id <br> int $model_id |
| tailor_change_collection | Fires after the model collection has been changed | int $post_id <br> array $sanitized_models |
| tailor_save_models | Fires after element models have been saved on a given page | int $post_id <br> array $sanitized_models |

## Sidebar actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_sidebar_init | Fires when a sidebar session is initialized | |
| tailor_sidebar_head | Fires when the document head of the sidebar is rendered | |
| tailor_sidebar_content | Fires when the sidebar content is rendered | |
| tailor_sidebar_footer | Fires when the sidebar footer is rendered | |
| tailor_enqueue_sidebar_styles | Fires after the sidebar styles are enqueued | string $handle |
| tailor_enqueue_sidebar_scripts | Fires after the sidebar scripts are enqueued | string $handle |

## Canvas actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_canvas_init | Fires when a canvas session is initialized | |
| tailor_sidebar_head | Fires when the document head is rendered during a canvas page load | |
| tailor_sidebar_content | Fires when the page content is rendered during a canvas page load | |
| tailor_sidebar_footer | Fires when the footer is rendered during a canvas page load | |
| tailor_enqueue_canvas_styles | Fires after styles are enqueued during a canvas page load | string $handle |
| tailor_enqueue_canvas_scripts | Fires after scripts are enqueued during a canvas page load | string $handle |

## Custom CSS/JavaScript actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_print_dynamic_css_rules | Fires when dynamic CSS rule data is printed | |
| tailor_print_setting_css_rules | Fires when setting CSS rule data is printed | |
| tailor_print_customizer_css | Fires when Customizer CSS is printed | |
| tailor_print_custom_css | Fires when custom CSS is printed | |
| tailor_print_dynamic_css | Fires when dynamic CSS is printed | |
| tailor_print_custom_js | Fires when custom JavaScript is printed | |

## Template actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_add_template | Fires when a template model collection is added | array $template |
| tailor_update_template | Fires when a template model collection is updated | array $template |
| tailor_delete_template | Fires when a template model collection is deleted | int $template_id |

## Setting actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_load_panels | Fires after panels, sections, settings and controls have been loaded | Tailor_Setting_Manager $setting_manager |
| tailor_register_panels | Fires after panels, sections, settings and controls have been registered | Tailor_Setting_Manager $setting_manager |
| tailor_print_panel_templates | Fires after panel templates have been printed | string $type |
| tailor_save_settings | Fires when settings have been saved | int $post_id <br> array $settings |
| tailor\_save\_{**$id**} | Fires before a setting's save method is called | Tailor_Setting $setting |
| tailor\_update\_{**$type**} | Fires after a setting's update method is called | mixed $value <br> Tailor_Setting $setting |

## Admin actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_register_admin_settings | Fires after admin settings have been registered | |

## REST API actions

| Action | Description | Argument(s) |
|----------|----------|----------|
| tailor_api_loaded | Fires after REST API files have been loaded | |
| tailor_api_init | Fires after REST API routes have been created | |
