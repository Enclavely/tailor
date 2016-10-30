/**
 * Tailor.Controls.WidgetForm
 *
 * A widget form control.
 *
 * @augments Marionette.ItemView
 */
var $ = window.jQuery,
    AbstractControl = require( './abstract-control' ),
    WidgetFormControl;

WidgetFormControl = AbstractControl.extend( {

    ui : {},

    events : {
        'blur *' : 'onFieldChange',
        'change *' : 'onFieldChange'
    },

    /**
     * Returns the template ID.
     *
     * @since 1.6.0
     */
    getTemplateId : function() {
        return 'tmpl-tailor-widget-form-' + this.model.get( 'widget_id_base' );
    },

    /**
     * Returns the element template.
     *
     * @since 1.6.0
     *
     * @returns {string}
     */
    getTemplate : function() {
        var el = document.getElementById( this.getTemplateId() );
        var template = '';
        if ( el ) {
            template = _.template( el.innerHTML );
        }
        return template;
    },

	/**
     * Populate the form with setting values when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender: function() {
        var idBase = this.model.get( 'widget_id_base' );
        var $el = this.$el;

        // Format the default WordPress widget label
        this.$el.find( 'label' )
            .addClass( 'control__title' )
            .each( function() {
                var $label = $( this );
                $label.html( this.innerHTML.replace( ':', '' ) );
            } );

        _.each( this.getValues(), function( value, media ) {
            if ( ! _.isEmpty( value ) ) {
                var values = JSON.parse( value );
                _.each( values, function( value, name ) {
                    var $field = $el.find( '[name="widget-' + idBase + '[__i__][' + name + ']"]' );
                    if ( $field.length ) {
                        if ( 'checkbox' == $field[0].type || 'radio' == $field[0].type  ) {
                            $field.attr( 'checked', 'true' );
                        }
                        else {
                            $field.val( value );
                        }
                    }
                } );
            }
        }, this );
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var fields = this.$el.find( 'input, select, radio, textarea' ).serializeArray();
        var values = {};

        $.each( fields, function() {
            var matches = this.name.match( /\[(.*?)\]/g );
            if ( matches && 2 == matches.length ) { // Expecting name in format: widget-{type}[__i__][{field_id}]
                var name = matches[1].substring( 1, matches[1].length - 1 );
                if ( 'undefined' != typeof values[ name ] ) {
                    if ( ! values[ name ].push ) {
                        values[ name ] = [ values[ name ] ];
                    }
                    values[ name ].push( this.value || '' );
                }
                else {
                    values[ name ] = this.value || '';
                }
            }
        } );

        this.setValue( JSON.stringify( values ) );

        e.preventDefault();
        e.stopImmediatePropagation();
    },

	/**
     * Do nothing on setting change.
     *
     * @since 1.7.2
     */
    onSettingChange : function() {}
    
} );

module.exports = WidgetFormControl;