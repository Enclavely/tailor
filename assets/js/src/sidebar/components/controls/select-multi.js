/**
 * Tailor.Controls.SelectMulti
 *
 * A select multi control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SelectMultiControl;

SelectMultiControl = AbstractControl.extend( {


    ui : {
        'input' : 'select',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns "selected" if the current choice is the selected one.
         *
         * @since 1.0.0
         *
         * @param choice
         * @returns {string}
         */
        selected : function( choice ) {
            var value = this.value.split( ',' );
            return -1 !== value.indexOf( choice ) ? 'selected' : '';
        }
    },

    /**
     * Initializes the Select2 plugin.
     *
     * @since 1.0.0
     */
    onRender : function() {
        this.ui.input.select2();
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        var select = this.ui.input.get(0);
        var value = [];

        for ( var i = 0; i < select.length; i ++ ) {
            if ( select[ i ].selected ) {
                value.push( select[ i ].value );
            }
        }

        this.setSettingValue( value.join( ',' ) );
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
    },

    /**
     * Destroys the Select2 instance when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.ui.input.select2( 'destroy' );
    }

} );

module.exports = SelectMultiControl;
