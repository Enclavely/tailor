/**
 * Tailor.Controls.Style
 *
 * A style control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    StyleControl;

StyleControl = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
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

        var values = data.value.split( '-' );
        var choices = this.model.get( 'choices' );
        for ( var choice in choices ) {
            if ( choices.hasOwnProperty( choice ) ) {
                data.choices[ choices[ choice ] ] = values.shift() || '';
            }
        }

        return data;
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {

        var values = [];

        _.each( this.ui.input, function( input, index ) {
            values.push( input.value );
        }, this );

        this.setSettingValue( values.join( '-' ) );
    },

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     *
     * @param e
     */
    restoreDefaultValue : function( e ) {
        this.setSettingValue( this.getDefaultValue() );
        this.render();
    }

} );

module.exports = StyleControl;