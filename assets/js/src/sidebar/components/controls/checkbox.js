/**
 * Tailor.Controls.Checkbox
 *
 * A checkbox control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
	CheckboxControl;

CheckboxControl = AbstractControl.extend( {

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        checked : function( media, key ) {
            var values = this.values[ media ].split( ',' );
            return -1 !== values.indexOf( key ) ? 'checked' : '';
        }
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var values = [];
        _.each( this.ui.input.filter( '[name^="' + this.media + '"]:checked' ), function( field ) {
            if ( field.checked ) {
                values.push( field.value || 0 );
            }
        } );
        this.setValue( values.join( ',' ) );
    }

} );

module.exports = CheckboxControl;
