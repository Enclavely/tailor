# [Tailor Page Builder for WordPress](http://www.gettailor.com/)

This is the official GitHub repository for the Tailor page builder WordPress plugin.

Please visit the [Plugin Repository](http://wordpress.org/plugins/tailor/) on WordPress.org to download the latest stable release and check out the free [Portfolio](https://github.com/andrew-worsfold/tailor-portfolio) and [WooCommerce](https://github.com/andrew-worsfold/tailor-woocommerce) extensions.

Tailor exposes a series of endpoints in the [WP REST API v2](https://wordpress.org/plugins/rest-api/) and contains a comprehensive set of [actions](https://github.com/andrew-worsfold/tailor/blob/master/actions.md) and [filters](https://github.com/andrew-worsfold/tailor/blob/master/filters.md).

| Endpoint | POST | GET | PUT | DELETE |
|----------|:--------:|:--------:|:--------:|:--------:|
| /wp-json/tailor/v2/elements/ | &#x2717; | &#10004; | &#x2717; | &#x2717; |
| /wp-json/tailor/v2/elements/**{tag}** | &#x2717; | &#10004; | &#x2717; | &#x2717; |
| /wp-json/tailor/v2/templates/ | &#10004; | &#10004; | &#x2717; | &#x2717; |
| /wp-json/tailor/v2/templates/**{id}** | &#x2717; | &#10004; | &#10004; | &#10004; |
| /wp-json/tailor/v2/models/**{post_id}** | &#10004; | &#10004; | &#10004; | &#10004; |
| /wp-json/tailor/v2/models/**{post_id}**/**{id}** | &#x2717; | &#10004; | &#10004; | &#10004; |

You can get in touch with questions or recommendations in a number of ways:

1. [Facebook](https://www.facebook.com/tailorwp/) or Twitter at [@tailorwp](https://twitter.com/tailorwp) or [@andrewjworsfold](https://twitter.com/andrewjworsfold).
2. The [Help Center](http://support.gettailor.com)
3. The [GitHub project](https://github.com/andrew-worsfold/tailor)

If you like the plugin, you can help by [rating it](https://wordpress.org/support/view/plugin-reviews/tailor?rate=5#postform).