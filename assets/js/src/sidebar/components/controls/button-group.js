/**
 * Tailor.Controls.ButtonGroup
 *
 * A button group control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
	ButtonGroupControl;

ButtonGroupControl = AbstractControl.extend( {

    ui : {
        'input' : '.control__body .button',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'click @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        active : function( media, key ) {
            return key === this.values[ media ] ? 'active' : '';
        }
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        this.ui.input.filter( '[name^="' + this.media + '"]' ).removeClass( 'active' );
        var button = e.currentTarget;
        button.classList.add( 'active' );
        this.setValue( button.value );
    }

} );

module.exports = ButtonGroupControl;
