---
layout: documentation
title: Documentation
---

<!--<p class="lead">Learn more about the Tailor plugin and how you can extend it with custom functionality.</p>-->

## Adding elements

<p>Adding custom elements to Tailor is easy using a custom extension plugin.  This page contains all the information you'll need to create your own simple extension plugin, or alternatively you can use our <a href="#">example</a> plugin.</p>

### Extension structure

Below is one possible folder structure for Tailor extensions.

{% highlight bash %}
plugin/
├── dist/
│   ├── css/
│   └── js/
├── docs/
│   └── examples/
├── js/
└── scss/
{% endhighlight %}

### Custom views

If your element simply renders content then it's probably not necessary to create a custom view.  For those that will contain content elements (i.e., serve as wrappers or containers) or require custom JavaScript (e.g., a carousel), you can extend the default Tailor Composite view as follows: 

{% highlight js %}
(function( Views ) {
    'use strict';
    
    // Create a new custom view based on the Composite view
    Views.TailorCustom = Views.Composite.extend({...});
    window.Tailor.Views = Views;
})( window.Tailor.Views || {} );
{% endhighlight %}

{% highlight js %}
(function( Api, $ ) {
    'use strict';
    
    Api.Setting( '_tailor_custom_setting', function( to, from ) {
    
        // Do something with the 'to' and 'from' values
        $( '.something' ).html( to );
    });
   
    Api.Element.onRender( 'tailor_custom_tag', function( atts, model ) {
        var $el = this.$el;
        
        // Do something based on the current set of attributes
        $el.carousel( atts );
    });
})( window.Tailor.Api || {}, jQuery );
{% endhighlight %}


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