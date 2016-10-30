/**
 * Tailor.Controls.Select
 *
 * A select control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SelectControl;

SelectControl = AbstractControl.extend( {

    ui : {
        'input' : 'select',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {
        
        selected : function( media, key ) {
            return key === this.values[ media ] ? 'selected' : '';
        }
    }

} );

module.exports = SelectControl;
