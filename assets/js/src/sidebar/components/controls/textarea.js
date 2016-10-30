/**
 * Tailor.Controls.Textarea
 *
 * A textarea control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    TextareaControl;

TextareaControl = AbstractControl.extend( {

    ui : {
        'input' : 'textarea',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    }

} );

module.exports = TextareaControl;
