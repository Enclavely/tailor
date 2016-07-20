=== Tailor Page Builder ===
Contributors: andrew.worsfold
Donate link: http://gettailor.com/donate/
Tags: page, layout, builder, frontend, content, page builder, drag and drop builder, home page builder, landing page builder, layout builder, frontend builder, frontend editor, responsive, visual composer, beaver builder
Stable tag: 1.3.3
Requires at least: 4.3
Tested up to: 4.5.3
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl.html

Build beautiful layouts quickly and easily using your favourite theme with this frontend drag and drop page builder.

== Description ==

[Tailor](http://gettailor.com/) is a simple yet powerful plugin that allows you to easily create stunning pages using an intuitive drag and drop interface.  Everything is done in the frontend of your website, meaning that what you see is what you get. The best part is that it’s all completely free!

To get started, refer to our [documentation](https://tailor.zendesk.com/hc/en-us/categories/202586427-Getting-started).

= Easy to use =

Drag and drop elements relative to one another and then customize them using a set of intelligent (and intelligible) options.  You'll be up and running in minutes and can use all that saved time for more important things - like creating content!

= Easy to extend =

Adding your own custom elements or functionality is easy.

To learn more about how to create your own extensions, check out our [developer documentation](https://tailor.zendesk.com/hc/en-us/categories/203117247-Extending).  The [Portfolio](https://wordpress.org/plugins/tailor-portfolio/) and [WooCommerce](https://wordpress.org/plugins/tailor-woocommerce/) extensions are examples of what's possible.

= Works with any theme =

You can use Tailor with any free or premium theme.  By taking care of the layout and providing basic styles for elements, Tailor leaves a majority of the page style to your selected theme (as it should).

= Free and open-source =

Tailor is completely free and open-source.  Use it to help create your next website or contribute to the project on [Github](https://github.com/andrew-worsfold/tailor/).

You can get in touch with questions or recommendations in a number of ways:

1. [Facebook](https://www.facebook.com/tailorwp/) or Twitter at [@tailorwp](https://twitter.com/tailorwp) or [@andrewjworsfold](https://twitter.com/andrewjworsfold).
2. The [Help Center](http://support.gettailor.com)
3. The [GitHub project](https://github.com/andrew-worsfold/tailor)
4. The [Community Forum](https://tailor.zendesk.com/hc/en-us/community/topics)

If you like the plugin, you can help by [rating it](https://wordpress.org/support/view/plugin-reviews/tailor?rate=5#postform).

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

= 1.3.3 =
* Added: error message if the page canvas is not properly initialized.
* Fixed: clicking links within the canvas will cause the page to be redirected.

= 1.3.2 =
* Fixed: debug error message displayed when no admin setting description is provided.

= 1.3.1 =
* Added: descriptions to some admin settings.
* Added: minor improvements to RTL compatibility for sidebar and canvas.
* Changed: users with permission to manage options can Tailor pages.
* Fixed: inactive elements have hover effects and trigger notifications.
* Removed: separate RTL stylesheet for sidebar (now included within main stylesheet).

= 1.3.0 =
* Added: image link control to Gallery element.
* Added: title attribute to history snapshots.
* Added: compatibility for NextGen gallery plugin.
* Added: compatibility for Thesis theme framework.
* Changed: button block style to be a style option instead of alignment option.
* Changed: Open Sans to system fonts.
* Improved: vertical spacing for various elements, including rows and columns.
* Improved: RTL compatibility for modals, notifications and carousels.
* Fixed: responsive settings for rows and grids being applied inappropriately.
* Fixed: history snapshots being created when previewing changes to an element.
* Fixed: page title not being updated correctly.
* Developer: Cleaned up SCSS project.

= 1.2.8 =
* Added: check to ensure post archives and the posts page cannot be Tailored.

= 1.2.7 =
* Added: RTL support.

= 1.2.6 =
* Added: device-specific visibility setting to rows, columns, grids and grid items under General settings tab.
* Fixed: image and gallery controls breaking when adding small images (credit: dtbaker).
* Improved: background image/color settings.

= 1.2.5 =
* Added: compatibility for the Yoast SEO plugin.

= 1.2.4 =
* Added: resource links to the admin settings page.
* Added: Google Maps API key setting.
* Improved: CSS to ensure pseudo-elements use double colon notation.

= 1.2.3 =
* Fixed: element drag-drop ghost image disappearing when dragging on Chrome.

= 1.2.2 =
* Improved: display of the 'Tailor this ..' Admin Bar link.

= 1.2.1 =
* Removed: 'Tailor this ..' Admin Bar link from archive pages (credit: BinaryMoon).

= 1.2.0 =
* Changed: container behaviour so that they do not collapse when only one child element remains (excludes row/column layouts). [Learn more about this change](http://www.andrewworsfold.com/2016/06/26/working-with-containers/).
* Fixed: custom CSS not appearing within template previews.
* Fixed: breaking of tab order after tab renaming.

= 1.1.3 =
* Improved: device preview and media query settings to be in line with the WordPress Customizer (i.e., Desktop, Tablet and Mobile sizes).  [Learn more about this change](http://www.andrewworsfold.com/2016/06/25/device-previews/).

= 1.1.2 =
* Added: growl notification and UI styles to help instruct new users to drag elements and templates onto the page.

= 1.1.1 =
* Added: additional filters for developers to disable panels and elements.

= 1.1 =
* Added: admin options for hiding the CSS and JavaScript editors.
* Added: admin option for hiding the Attributes panel (contained within the Edit modal window).
* Improved: scripts and styles to only load on Tailored pages.
* Removed: dynamic text domain function.

= 1.0.1 =
* Added: fallback functions for PHP 5.4.x.

= 1.0.0 =
* Initial release.

== Upgrade Notice ==
