/**
 * Tailor.Controls.ButtonGroup
 *
 * A button group control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
	AbstractControl = require( './abstract-control' ),
	ButtonGroupControl;

ButtonGroupControl = AbstractControl.extend( {

	ui: {
		'input' : 'button',
        'default' : '.js-default'
	},

    events : {
        'click @ui.input' : 'onControlChange',
        'click @ui.default' : 'restoreDefaultValue'
    },

    templateHelpers : {

        /**
         * Returns the appropriate class name if the current button is the selected one.
         *
         * @since 1.0.0
         *
         * @param button
         * @returns {string}
         */
        active : function( button ) {
            return button === this.value ? 'active' : '';
        }
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {

        var button = e.currentTarget;

        this.ui.input.removeClass( 'active' );
        button.classList.add( 'active' );
        this.setSettingValue( button.value );
    }

} );

module.exports = ButtonGroupControl;