/**
 * Tailor.Controls.Switch
 *
 * A switch control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SwitchControl;

SwitchControl = AbstractControl.extend( {

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        checked : function( media ) {
            return 1 == parseInt( this.values[ media ], 10 ) ? 'checked' : '';
        }
    },
    
    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function() {
        var $field = this.ui.input.filter( '[name^="' + this.media + '"]' );
        this.setValue( $field.get(0).checked ? '1' : '0' );
    }

} );

module.exports = SwitchControl;
