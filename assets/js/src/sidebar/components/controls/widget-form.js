/**
 * Tailor.Controls.WidgetForm
 *
 * A widget form control.
 *
 * @augments Marionette.ItemView
 */
var $ = window.jQuery,
    WidgetFormControl;

WidgetFormControl = Marionette.ItemView.extend( {

    tagName : 'li',

    className : function() {
        return 'control control--' + this.model.get( 'type' );
    },

    ui : {
		'default' : '.js-default'
	},

    events : {
        'input *' : 'onControlChange',
        'change *' : 'onControlChange',
        'click @ui.default' : 'restoreDefaultValue'
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

    onRender: function() {

        // Format the default WordPress widget label
        this.$el.find( 'label' )
            .addClass( 'control__title' )
            .each( function() {
                var $label = $( this );
                $label.html( this.innerHTML.replace( ':', '' ) );
            } );

        var values = this.getSettingValue();

        if ( ! _.isEmpty( values ) ) {

            values = JSON.parse( values );

            var $el = this.$el;
            var idBase = this.model.get( 'widget_id_base' );

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
    },

    /**
     * Responds to a control change.
     *
     * @since 1.6.0
     */
    onControlChange : function( e ) {
        var data = this.$el.find( 'input, select, radio, textarea' ).serializeArray();
        var values = {};

        $.each( data, function() {
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
        
        this.setSettingValue( JSON.stringify( values ) );
        
        e.preventDefault();
        e.stopImmediatePropagation();
    },

    /**
     * Returns the setting value.
     *
     * @since 1.6.0
     */
    getSettingValue : function() {
        return this.model.setting.get( 'value' );
    },

    /**
     * Updates the setting value.
     *
     * @since 1.6.0
     *
     * @param value
     */
    setSettingValue : function( value ) {
        this.model.setting.set( 'value', value );
    }

} );

module.exports = WidgetFormControl;
