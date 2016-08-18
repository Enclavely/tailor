/**
 * Tailor.Controls.Radio
 *
 * A radio control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    RadioControl;

RadioControl = AbstractControl.extend( {

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
            return ( this.value === choice ) ? 'checked' : '';
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
        this.setSettingValue( this.ui.input.filter( ':checked' ).val() );
    }

} );

module.exports = RadioControl;
