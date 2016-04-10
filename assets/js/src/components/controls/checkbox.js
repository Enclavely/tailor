/**
 * Tailor.Controls.Checkbox
 *
 * A checkbox control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
	CheckboxControl;

CheckboxControl = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns "checked" if the current choice is the selected one.
         *
         * @since 1.0.0
         *
         * @param choice
         * @returns {string}
         */
        checked : function( choice ) {
            var value = this.value.split( ',' );
            return -1 !== value.indexOf( choice ) ? 'checked' : '';
        }
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {

        var value = [];

        _.each( this.ui.input, function( input ) {
            if ( input.checked ) {
                value.push( input.value );
            }
        } );

        this.setSettingValue( value.join( ',' ) );
    }

} );

module.exports = CheckboxControl;