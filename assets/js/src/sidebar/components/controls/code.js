/**
 * Tailor.Controls.Code
 *
 * A code editor control.
 *
 * @augments Marionette.ItemView
 */

var $ = window.jQuery,
	AbstractControl = require( './abstract-control' ),
	CodeControl;

CodeControl = AbstractControl.extend( {

	ui : {
		'input' : 'textarea',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

	events : {
		'click @ui.mediaButton' : 'onMediaButtonChange',
		'click @ui.defaultButton' : 'onDefaultButtonChange'
	},

	/**
	 * Provides additional data to the template rendering function.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	addSerializedData : function( data ) {
		data.cid = this.cid;
		return data;
	},

	/**
	 * Initailizes the CodeMirror editor when the control is rendered.
	 * 
	 * @since 1.7.2
	 */
    onRender : function() {
	    var control = this;
	    var mode = control.model.get( 'mode' );
	    this.editors = {};

	    _.each( this.getValues(), function( value, media ) {
		    var $field = control.ui.input.filter( '[name^="' + media + '-' + control.cid + '"]' );

		    control.editors[ media ] = CodeMirror.fromTextArea( $field.get(0), {
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

		    control.editors[ media ].on( 'change', function( editor ) {
			    control.setValue( editor.getValue() );
		    }, this );

		    setTimeout( function() {
			    control.editors[ media ].refresh();
		    }, 10 );
	    } );

	    this.updateControlGroups();
    },

	/**
	 * Restores each setting to its default value.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	restoreDefaults : function() {
		_.each( this.getSettings(), function( setting, media ) {
			var value = setting.get( 'default' ) || '';
			setting.set( 'value', value );
		} );
	},

	/**
	 * Displays the control group associated with the current media query.
	 *
	 * @since 1.7.2
	 */
	updateControlGroups : function() {
		var control = this;
		var media = this.media;

		this.ui.controlGroups.each( function() {
			$( this ).toggleClass( 'is-hidden', media != this.id );
		} );

		this.ui.mediaButton.each( function() {
			$( this ).toggleClass( 'active', media == this.getAttribute( 'data-media' ) );
		} );

		control.editors[ media ].refresh();
	},

    /**
     * Destroys the editor instance when the control is destroyed.
     *
     * @since 1.0.0
     */
	onDestroy : function() {
		var control = this;
	    _.each( this.getValues(), function( value, media ) {
		    control.editors[ media ].off();
		    control.editors[ media ].toTextArea();
	    } );
	}

} );

module.exports = CodeControl;
