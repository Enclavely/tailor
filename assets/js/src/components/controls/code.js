/**
 * Tailor.Controls.Code
 *
 * A code editor control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
	AbstractControl = require( './abstract-control' ),
	CodeControl;

CodeControl = AbstractControl.extend( {

    ui : {
        'input' : 'textarea',
        'default' : '.js-default'
    },

    events : {
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        var defaultValue = this.getDefaultValue();

        data.value = this.getSettingValue();
        data.showDefault = null != defaultValue && data.value != defaultValue;
        data.cid = this.cid;

        return data;
    },

    /**
     * Initializes the editor.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var obj = this;
        var mode = this.model.get( 'mode' );

        obj.editor = CodeMirror.fromTextArea( this.ui.input.get(0), {
			mode : mode,
			lineNumbers : true,
			matchBrackets : true,
			continueComments : 'Enter',
			viewportMargin : Infinity,
			extraKeys : {

				'F11' : function( cm ) {
					cm.setOption( 'fullScreen', ! cm.getOption( 'fullScreen' ) );
				},

				'Esc' : function( cm ) {
					if ( cm.getOption( 'fullScreen' ) )  {
						cm.setOption( 'fullScreen', false );
					}
				}
			}
		} );

        var onControlChange = function( editor ) {
            obj.setSettingValue( editor.getValue() );
        };

        this.editor.on( 'change', onControlChange );
    },

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     *
     * @param e
     */
    restoreDefaultValue : function( e ) {
        var value = this.getDefaultValue();
        this.setSettingValue( value );
        this.editor.setValue( value );
    },

    /**
     * Destroys the editor instance when the control is destroyed.
     *
     * @since 1.0.0
     */
	onDestroy : function() {
        this.editor.off( 'change', this.onChange );
		this.editor.toTextArea();
	}

} );

module.exports = CodeControl;