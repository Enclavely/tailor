---
layout: documentation
title: Adding Elements
---

Adding custom elements or behavior to Tailor is easy using a custom extension plugin.

This page contains all the information you'll need to create your own simple extension plugin, or alternatively you can use our <a href="https://www.wordpress.org/plugins/tailor-portfolio/">Portfolio</a> plugin as a guide.

## Extension structure

Below is one possible folder structure for Tailor extensions.

{% highlight bash %}
plugin/
├── assets/
│   ├── css/
│   └── js/
├── includes/
│   └── elements/
│   └── shortcodes/
├── partials/
└── plugin.php
{% endhighlight %}

This should be familiar to most plugin developers.

The <b>elements</b> folder contains the custom element definitions (i.e., basic attributes and the available configuration settings) and the <b>shortcodes</b> folder contains the shortcode definitions used to actually render the element on the frontend.  Any custom template partials that you'd like to use should be added to the <b>partials</b> folder.

## Registering a custom element

Tailor has three main types of elements:

1. Simple content elements (e.g., the Posts element).

2. Wrapper elements, which can hold one or more content elements and provide context or style (e.g., the Card element).

3. Container elements, which can hold one or more child elements of a particular type (e.g., the List element and their List Item child elements).  Child element can hold both wrapper and content elements.

To define a new element, hook into the `tailor_register_elements` action as follows:

{% highlight php startinline=true %}
<?php

include $path_to_element_definition . '.php';

/**
 * Registers your custom element.
 */
function register_custom_element( $element_manager ) {
    $element_manager->add_element( 'tailor_custom_tag', array(
        'label'             =>  __( 'Custom element', tailor()->textdomain() ),
        'description'       =>  __( 'This is a custom element.', tailor()->textdomain() ),
        'type'              =>  'wrapper',
    ));
}

add_action( 'tailor_register_elements', 'register_custom_element' ); ?>
{% endhighlight %}

Where `tailor_custom_tag` is the shortcode tag used to render the element.

## Defining configuration options

Custom elements extend the <b>Tailor_Element</b> class and define custom controls and style rules using the `register_controls()` and `generate_css()` methods, respectively.

{% highlight php startinline=true %}
<?php

/**
 * Defines your custom element.
 */
class Tailor_Custom_Element extends Tailor_Element {

    /**
     * Registers element settings, sections and controls.
     *
     * @access protected
     */
    protected function register_controls() {

        $this->add_section( 'colors', array(
            'title'                 =>  __( 'Colors', tailor()->textdomain() ),
            'priority'              =>  10,
        ));

        $this->add_setting( 'color_setting', array(
            'sanitize_callback'     =>  'tailor_sanitize_color',
        ));
        
        $this->add_control( 'color_setting', array(
            'label'                 =>  __( 'Custom color', tailor()->textdomain() ),
            'type'                  =>  'colorpicker',
            'priority'              =>  10,
            'section'               =>  'colors',
        ));
    }

    /**
     * Returns custom CSS rules for the element.
     *
     * @param $atts
     * @return array
     */
    public function generate_css( $atts ) {
        $css_rules = array();

        if ( ! empty( $atts['color_setting'] ) ) {
            $css_rules[] = array(
                'selectors'         =>  array( '.something-in-element' ),
                'declarations'      =>  array(
                    'color'             =>  esc_attr( $atts['color_setting'] ),
                ),
            );
        }

        return $css_rules;
    }
} ?>
{% endhighlight %}

## Rendering custom HTML

In order to ensure that the element is rendered in the frontend, you must define a shortcode rendering function.

### Using partials

### Defining custom views

If your element simply renders content then it's probably not necessary to create a custom view.

For those that will contain content elements (i.e., serve as wrappers or containers) or require custom JavaScript (e.g., a carousel), you can extend the default <b>Container</b> view as follows: 

{% highlight js %}
(function( Views ) {
    'use strict';
    
    // Create a new custom view based on the Container view
    Views.TailorCustom = Views.Container.extend({...});
    window.Tailor.Views = Views;
})( window.Tailor.Views || {} );
{% endhighlight %}

## Custom element JavaScript

If your element requires custom JavaScript in order to function, you can use the Tailor API to initialize a script when the element is rendered:

{% highlight js %}
(function( Api, $ ) {
    'use strict';
    
    Api.Element.onRender( 'tailor_custom_tag', function( atts, model ) {
        var $el = this.$el;
        
        // Do something based on the current set of attributes
        $el.carousel( atts );
    });
    
})( window.Tailor.Api || {}, jQuery );
{% endhighlight %}

You can also register a callback function to be run when a given element is destroyed in a similar way using the `onDestroy()` function.
 
## Handling setting changes

Tailor manages a number of global settings (e.g., section width) which may affect your element.  You can listen for changes to any of the defined Tailor settings as follows:

{% highlight js %}
(function( Api, $ ) {
    'use strict';
    
    Api.Setting( '_tailor_custom_setting', function( to, from ) {
    
        // Do something with the 'to' and 'from' values
        $( '.something' ).html( to );
    });
   
})( window.Tailor.Api || {}, jQuery );
{% endhighlight %}

<script src="https://gist.github.com/andrew-worsfold/ac31277159d4c8492e3dd040311c890d.js"></script>

Where `to` and `from` are the new and old setting values, respectively.



