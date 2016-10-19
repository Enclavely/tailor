/**
 * Tailor.Controls.InputGroup
 *
 * An input group control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    InputGroup;

InputGroup = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
    },

    events : {
        'input @ui.input' : 'onControlChange',
        'change @ui.input' : 'onControlChange',
        'click @ui.default' : 'restoreDefaultValue',
        'click @ui.link' : 'onLinkChange'
    },

    /**
     * Initializes the media frame for the control.
     *
     * @since 1.0.0
     */
    initialize : function( ) {
        this.addEventListeners();
        this.checkDependencies( this.model.setting );
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        var defaultValue = this.getDefaultValue();

        data.value = this.getSettingValue();
        data.showDefault = null != defaultValue && ( data.value != defaultValue );
        data.choices = [];
        
        var values;
        if ( _.isString( data.value ) ) {
            values = data.value.split( ',' );
        }
        
        var choices = this.model.get( 'choices' );
        for ( var choice in choices ) {
            if ( choices.hasOwnProperty( choice ) ) {
                data.choices[ choice ] = {};
                data.choices[ choice ].label = choices[ choice ].label || '';
                data.choices[ choice ].type = choices[ choice ].type || 'text';
                data.choices[ choice ].unit = choices[ choice ].unit || '';
                data.choices[ choice ].value = _.isArray( values ) ? values.shift() : null;
            }
        }

        return data;
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function() {
        var values = [];
        _.each( this.ui.input, function( input ) {
            values.push( input.value );
        }, this );
        this.setSettingValue( values.join( ',' ) );
    },

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     */
    restoreDefaultValue : function() {
        this.setSettingValue( this.getDefaultValue() );
        this.render();
    }

} );

module.exports = InputGroup;
