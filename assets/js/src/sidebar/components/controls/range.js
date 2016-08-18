/**
 * Tailor.Controls.Range
 *
 * A range control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    RangeControl;

RangeControl = AbstractControl.extend( {

	ui : {
        'range' : 'input[type=range]',
		'input' : 'input[type=text]',
        'default' : '.js-default'
	},

    events : {
        'input @ui.range' : 'onControlChange',
        'change @ui.input' : 'onControlChange',
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        var value = e.target.value;
        this.ui.input.val( value );
        this.ui.range.val( value );

        this.setSettingValue( value );
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

module.exports = RangeControl;
