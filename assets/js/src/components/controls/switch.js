/**
 * Tailor.Controls.Switch
 *
 * A switch control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    SwitchControl;

SwitchControl = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns true if the switch is enabled.
         *
         * @since 1.0.0
         *
         * @returns {string}
         */
        checked : function() {
            return ! this.value ? '' : 'checked';
        }
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        this.setSettingValue( this.ui.input.get(0).checked ? 1 : '' );
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

module.exports = SwitchControl;