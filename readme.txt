=== Tailor Page Builder ===
Contributors: andrew.worsfold
Donate link: http://gettailor.com/donate/
Tags: page, layout, builder, frontend, content, page builder, drag and drop builder, home page builder, landing page builder, layout builder, frontend builder, frontend editor, responsive, visual composer, beaver builder
Stable tag: 1.6.0
Requires at least: 4.3
Tested up to: 4.6.2
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl.html

Build beautiful layouts for your content faster and easier than ever before using your favourite theme!

== Description ==

[Tailor](http://gettailor.com/) is a free frontend page builder for WordPress that features a simple and intuitive drag and drop interface.

[youtube https://www.youtube.com/watch?v=tfMyLMuaXjI]

To get started:

- [Read the user documentation](support.gettailor.com/hc/en-us/categories/202586427).
- [Read the overview of features and elements](https://github.com/andrew-worsfold/tailor/blob/master/readme.md).
- [Keep up-to-date with the blog](https://medium.com/@tailorwp).
- [Watch videos on YouTube](https://www.youtube.com/channel/UCiFGt6qqPwN1ruuEnjlVOqA).

= Easy to use =

- Add elements and create columns instantly in a single drag and drop movement.
- Copy elements anywhere on the page by dragging and holding the Shift key.
- Move content independently and have it adopt the style of its parent elements!
- Save one or more elements as templates, then drag and drop them onto any page.
- Change the appearance of any element using a set of carefully selected options.
- Undo and redo actions using the History panel (or keyboard shortcuts).
- Control global layout settings in the Customizer.
- Control page specific layout settings and add custom CSS and JavaScript.
- Preview your layouts on different device sizes and manage responsive behavior.
- Supports WordPress features (multimedia, shortcodes and more).
- Supports built-in and third-party widgets.
- Supports multi-language and RTL layouts.

Because Tailor works with any theme, choosing one that you like is now the hardest part of creating a website.

= Easy to extend =

Tailor is open source and built based on WordPress' coding standards and best practices.  Everything from the code base to the user interface integrate perfectly with WordPress. The plugin features:

- A comprehensive set of [actions](https://github.com/andrew-worsfold/tailor/blob/master/actions.md) and [filters](https://github.com/andrew-worsfold/tailor/blob/master/filters.md).
- An API for adding, changing or removing elements.
- An API for adding, changing or removing settings and controls.
- A [REST API](https://github.com/andrew-worsfold/tailor/blob/master/api.md) to manage elements, templates and models.

There are currently two free extensions, with more to come!

- [Portfolio](https://wordpress.org/plugins/tailor-portfolio/) for the creative types.
- [WooCommerce](https://wordpress.org/plugins/tailor-woocommerce/) for those running an online store.

For more information:

- Check out our example of how to extend Tailor [using a theme](https://github.com/andrew-worsfold/tailor-sample-theme).
- Check out our example of how to extend Tailor [using a plugin](https://github.com/andrew-worsfold/tailor-sample-extension).
- [Read the developer documentation](support.gettailor.com/hc/en-us/categories/202586427).
- Get involved in the [GitHub project](https://github.com/andrew-worsfold/tailor).

If you like the plugin, please consider [rating it](https://wordpress.org/support/view/plugin-reviews/tailor?rate=5#postform) or providing your feedback and suggestions through [Facebook](https://www.facebook.com/tailorwp/), [Twitter](https://twitter.com/tailorwp) or the [Community Forum](support.gettailor.com/hc/en-us/community/topics).

== Installation ==

Install Tailor via the plugin directory, or by uploading the files manually to your server.

= From your WordPress dashboard =

1. Visit 'Plugins > Add New’.

2. Search for ‘Tailor’.

3. Activate Tailor from your Plugins page.

= From WordPress.org =

1. Download Tailor.

2. Upload the ‘tailor’ directory to your '/wp-content/plugins/' directory, using your favorite method (ftp, sftp, scp, etc..)

3. Activate Tailor from your Plugins page.

= Once Activated =

Visit 'Settings > Tailor' to configure:

1. Allowable post types and user roles.

2. Element and feature settings.

3. Icon kits.

== Screenshots ==

1. **Adding elements** - Drag an element from the sidebar into the desired position on the page to add it.  Hold the Shift button while dragging an existing element to copy it.

2. **Editing elements** - Click and hold the Shift button to edit an element (or select it and click on the Edit button).

3. **Editing parent/ancestor elements** - Select a parent/ancestor element from the hierarchy dropdown menu and click on the Edit button to edit it.

4. **Adding columns** - Drag an element to the left or right of an existing element to create a row/column structure.  Drag it to the left or right of an existing column to add another column to that row.

5. **Adding templates** - Drag a saved template into the desired position on the page to add it.  The available dropzones will depend on the element(s) in the template.

6. **Custom CSS/JS** - Add custom CSS or JavaScript to the page from within Tailor using the editors provided on the Settings panel.

7. **Layout changes** - Make changes to the layout of the page from within the Settings panel.  To make site-wide changes, use the custom Tailor settings in the Customizer (page-level settings override those in the Customizer).

8. **Device preview** - Preview your page on desktop and mobile device sizes in exactly the same way that you do in the Customizer.

9. **Revision history** - View and restore history revision snapshots in a single click on the History panel.

== Frequently Asked Questions ==

= Can I use my existing WordPress theme? =

Yes! Tailor works out-of-the-box with nearly every WordPress theme.

= How do I get started? =

Navigate to the page that you would like to Tailor and simply select the "Tailor this Page" (or other allowable post type) option from the WordPress Admin Bar.

= Can I move Tailored pages to another WordPress site? =

Yes.  Tailored pages can be migrated like any other type of page using the [duplicator](https://wordpress.org/plugins/duplicator/) plugin.

= Can I include Tailor as part of my theme bundle? =

Yes, however, users should be directed to the WordPress plugin repository to install the latest version of the plugin.  Consider using a tool like [TGM Plugin Activation](http://tgmpluginactivation.com/) to guide users through the installation process.

== Changelog ==

= 1.6.0 =
* Added - Native support for WordPress and third-party widgets.  Please refer to the associated upgrade notice.
* Improved - Support for IE9 browser.
* Improved - Added external URL option to video control.
* Fixed - Range controls do not respect input attributes.
* Removed - Custom icon font used for alignments (replaced with built-in WordPress icons).
* Removed - Deprecated column and grid styles.

= 1.5.7 =
* Added - Translation for Brazilian Portuguese [GitHub PR #45](https://github.com/andrew-worsfold/tailor/pull/45).
* Added - Check for whether a Tailor layout exists for a given post [GitHub #43](https://github.com/andrew-worsfold/tailor/issues/43).
* Added - Filter to allow content to be saved as shortcodes instead of HTML.
* Improved - Closing Tailor will return the user to their original location.
* Improved - Allow HTMl within admin notices [GitHub PR #38](https://github.com/andrew-worsfold/tailor/pull/38).
* Fixed - Global SCSS primary color variable not used for carousel navigation [GitHub PR #39](https://github.com/andrew-worsfold/tailor/pull/39).
* Fixed - It is possible to Customize and Tailor posts at the same time.

= 1.5.6 =
* Added - Support for input HTML tags in content.
* Added - Filter for control arguments by control type (e.g., colorpicker).
* Fixed - Template custom post type is public [GitHub #37](https://github.com/andrew-worsfold/tailor/issues/37).
* Fixed - Frontend element initialization function is not globally accessible [GitHub #31](https://github.com/andrew-worsfold/tailor/issues/31).
* Fixed - Custom style formats defined by themes and plugins not being displayed in the editor.
* Fixed - Excerpts are displayed for password protected posts.

= 1.5.5 =
* Added - Single function for the initialization of elements in the frontend [GitHub #31](https://github.com/andrew-worsfold/tailor/issues/31).
* Added - Filter for empty content placeholder text [GitHub #33](https://github.com/andrew-worsfold/tailor/issues/33).
* Fixed - User permission check being called too early, resulting in a warning message [GitHub #30](https://github.com/andrew-worsfold/tailor/issues/30).
* Fixed - Fuzzy spinner image [GitHub #34](https://github.com/andrew-worsfold/tailor/issues/34).

= 1.5.4 =
* Added - 'Tailor this ..' button above the content editor.

= 1.5.3 =
* Added - French language translation.

= 1.5.2 =
* Fixed - Map element controls not displaying.

= 1.5.1 =
* Added - Utility CSS class for full-width sections.
* Improved - WordPress bundled version of imagesloaded is used, if available.
* Improved - Delete selected element by pressing the Delete key.
* Fixed - Scripts being loaded on archive pages.
* Fixed - Undo and redo keyboard shortcuts (CTRL-Z and CTRL-Y, respectively).
* Fixed - Missing textdomain strings

= 1.5.0 =
* Added - Link hover color control.
* Added - Option to handle setting changes via JavaScript instead of re-rendering the entire element.
* Improved - Instant previewing of changes as they are made. Please refer to the associated upgrade notice.
* Improved - Styling of Gallery thumbnails, when presented as a slideshow.
* Improved - Carousel and slider arrows appear when the mouse hovers over the slider, instead of just the arrow.
* Improved - Updated Backbone Marionette and Backbone Radio dependencies to latest versions.
* Improved - Restructured JavaScript project source files.
* Improved - Reduced the number of Modernizr tests.
* Fixed - Responsive oEmbed functionality.

= 1.4.3 =
* Fixed - Responsive oEmbed functionality.

= 1.4.2 =
* Improved - Styling of Posts pagination.
* Improved - Initial position of Edit modal window.
* Fixed - Posts pagination not working on Front page.
* Fixed - Custom element registration not working in accordance with documentation.

= 1.4.1 =
* Added - Special character button to the toolbar of the Editor.
* Added - Post revision support for page settings.
* Improved - UI and functionality of the Style control used for margin and padding settings.

= 1.4.0 =
* Added - REST API endpoints for elements, models and templates. Please refer to the associated upgrade notice.
* Added - Parallax background images for Sections.
* Added - "Fake parallax" (i.e., background-attachment:fixed option) for elements with background images.
* Added - A dismissible notice is displayed on the Edit page of a Tailored post to advise of the effect of modifying content in the WordPress Editor.
* Improved - Post revisions are used to restore an earlier Tailor layouts or recover the original content.
* Improved - Map element displays a notice when a Google Maps API key has not been added.
* Improved - Order and grouping of settings on the Settings page.
* Improved - Handling of Customizer, custom and dynamic element CSS.
* Improved - Posts in the Trash cannot be Tailored.
* Improved - Users that can modify options or edit the current post type can Tailor pages if they don't have a restricted role type.
* Improved - Set default Card background color to transparent.
* Improved - Added, changed and removed various [actions](https://github.com/andrew-worsfold/tailor/blob/master/actions.md) and [filters](https://github.com/andrew-worsfold/tailor/blob/master/filters.md) for consistency and to accommodate new REST API.
* Fixed - Save button label indicates that the page will be published when Tailoring a draft post.
* Fixed - Errors displayed when the Jetpack Publicize module is active.

= 1.3.7 =
* Improved - Style for empty placeholder content.
* Improved - Hover outline color for improved contrast on themes with grey backgrounds.
* Improved - Various sidebar and canvas style tweaks.
* Fixed - Reordering of Section elements not working correctly.

= 1.3.6 =
* Added - Additional actions for adding/modifying/removing custom CSS rules associated with existing elements.
* Fixed - Minor color inconsistency between sidebar and preview screen during loading.

= 1.3.5 =
* Added - Jetpack Testimonials element.
* Added - Actions for modifying default element settings and controls. [Learn more about this change](https://medium.com/p/c9efb5cb3016).
* Fixed - Singular post type labels not displayed in the "Tailor this.." link.

= 1.3.4 =
* Added - Jetpack Portfolio element. [Learn more about this change](https://medium.com/p/f8a1ff571f21).
* Added - Class for managing theme and plugin compatibility.
* Added - Initialization hooks for the Sidebar and Canvas.
* Fixed - Column width Customizer setting not working.
* Fixed - Undefined variable warning in attachment partial template.

= 1.3.3 =
* Added - Error message if the page canvas is not properly initialized.
* Fixed - Clicking links within the canvas causes the page to be redirected.

= 1.3.2 =
* Fixed - Debug error message is displayed when no admin setting description is provided.

= 1.3.1 =
* Improved - Descriptions for some admin settings.
* Improved - Sidebar and Canvas RTL compatibility.
* Improved - Users with permission to manage options can Tailor pages.
* Fixed - Inactive elements have hover effects and trigger notifications.
* Removed - Separate RTL stylesheet for sidebar (now included within main stylesheet).

= 1.3.0 =
* Added - Image link control to Gallery element.
* Added - Title attribute to history snapshots.
* Added - Compatibility for NextGen gallery plugin.
* Added - Compatibility for Thesis theme framework.
* Improved - Button block style to be a style option instead of alignment option.
* Improved - Open Sans to system fonts.
* Improved - Vertical spacing for various elements, including rows and columns.
* Improved - RTL compatibility for modals, notifications and carousels.
* Fixed - Responsive settings for rows and grids are not being applied appropriately.
* Fixed - History snapshots are created when previewing changes to an element.
* Fixed - Page title is not updated correctly.

= 1.2.8 =
* Added - Check to ensure post archives and the posts page cannot be Tailored.

= 1.2.7 =
* Added - RTL support.

= 1.2.6 =
* Added - Device-specific visibility setting to rows, columns, grids and grid items under General settings tab.
* Improved - Background image/color settings.
* Fixed - Image and gallery controls are breaking when adding small images (credit: dtbaker).

= 1.2.5 =
* Added - Compatibility for the Yoast SEO plugin.

= 1.2.4 =
* Added - Resource links to the admin settings page.
* Added - Google Maps API key setting.
* Improved - CSS to ensure pseudo-elements use double colon notation.

= 1.2.3 =
* Fixed - Element drag-drop ghost images are disappearing when dragging on Chrome.

= 1.2.2 =
* Improved - Display of the 'Tailor this ..' Admin Bar link.

= 1.2.1 =
* Removed - 'Tailor this ..' Admin Bar link from archive pages (credit: BinaryMoon).

= 1.2.0 =
* Improved - Container behaviour so that they do not collapse when only one child element remains (excludes row/column layouts). [Learn more about this change](http://www.andrewworsfold.com/2016/06/26/working-with-containers/).
* Fixed - Custom CSS is not appearing within template previews.
* Fixed - Tabs break after a tab is renamed.

= 1.1.3 =
* Improved - Device preview and media query settings to be in line with the WordPress Customizer (i.e., Desktop, Tablet and Mobile sizes).  [Learn more about this change](http://www.andrewworsfold.com/2016/06/25/device-previews/).

= 1.1.2 =
* Added - Notification and UI styles to help instruct new users to drag elements and templates onto the page.

= 1.1.1 =
* Added - Additional filters for developers to disable panels and elements.

= 1.1 =
* Added - Admin options for hiding the CSS and JavaScript editors.
* Added - Admin option for hiding the Attributes panel (contained within the Edit modal window).
* Improved - Scripts and styles to only load on Tailored pages.
* Removed - Dynamic text domain function.

= 1.0.1 =
* Added - Fallback functions for PHP 5.4.x.

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.6.0 =

This is a major version change which introduces native widget support.  Please enable this feature on the Settings page.

If you are upgrading from version 1.1.2 or earlier, please ensure that you update your columns and grid within Tailor as the original, deprecated styles for these elements have now been removed.

= 1.5.0 =

This is a major version change which introduces live preview.  Please refer to our developer documentation to make the most of these improvements.

= 1.4.0 =

This is a major version change which introduced new classes, actions and filters in order to accommodate the new REST API.  Please review all direct function calls and hooks in your code.