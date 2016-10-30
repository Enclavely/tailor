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

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        checked : function( media, key ) {
            return this.values[ media ] === key ? 'checked' : '';
        }
    },
    
    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function() {
        this.setValue( this.ui.input.filter( '[name^="' + this.media + '"]:checked' ).val() );
    }

} );

module.exports = RadioControl;
