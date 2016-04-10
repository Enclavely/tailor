/**
 * Tailor.Controls.Textarea
 *
 * A textarea control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    TextareaControl;

TextareaControl = AbstractControl.extend( {

    ui : {
        'input' : 'textarea',
        'default' : '.js-default'
    },

    onRestoreDefault : function() {
        this.render();
    }

} );

module.exports = TextareaControl;