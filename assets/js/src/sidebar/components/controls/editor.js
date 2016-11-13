/**
 * Tailor.Controls.Editor
 *
 * An editor control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
	EditorControl;

EditorControl = AbstractControl.extend( {

	ui : {
		'input' : 'textarea',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

	events : {
		'blur @ui.input' : 'onFieldChange',
		'click @ui.mediaButton' : 'onMediaButtonChange',
		'click @ui.defaultButton' : 'restoreDefaults'
	},

    getTemplate : function() {
        var html = document.getElementById( 'tmpl-tailor-control-editor' ).innerHTML;
        return _.template( html
                .replace( new RegExp( 'tailor-editor', 'gi' ), '<%= media %>-<%= cid %>' )
                .replace( new RegExp( 'tailor-value', 'gi' ), '<%= values[ media ] %>' )
        );
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
	 * Adds the required event listeners.
	 *
	 * @since 1.0.0
	 */
	addEventListeners : function() {
		this.listenTo( this.getSetting().collection, 'change', this.checkDependencies );
	},

	/**
	 * Maybe refershes the TinyMCE instance(s).
	 * 
	 * @since 1.7.2
	 * 
	 * @param el
	 */
	maybeRefreshEditor : function( el ) {
        if ( el.contains( this.el ) ) {
	        _.each( this.getValues(), function( value, media ) {
		        tinyMCE.execCommand( 'mceRemoveEditor', false, media + '-' + this.cid );
		        tinyMCE.execCommand( 'mceAddEditor', false, media + '-' + this.cid );
	        }, this );
        }
    },

	/**
	 * Initializes the TinyMCE instance(s).
	 * 
	 * @since 1.7.2
	 */
    onAttach : function() {
	    var control = this;

	    _.each( this.getValues(), function( value, media ) {
		    var id = media + '-' + control.cid;
		    var quickTagSettings = _.extend( {}, tinyMCEPreInit.qtInit['tailor-editor'], { id : id } );

		    quicktags( quickTagSettings );
		    QTags._buttonsInit();

		    tinyMCEPreInit.mceInit[ id ] = _.extend( {}, tinyMCEPreInit.mceInit['tailor-editor'], {
			    id : id,
			    resize : 'vertical',
			    height: 350,

			    setup : function( ed ) {
				    ed.on( 'change', function() {
					    ed.save();
					    control.setValue( ed.getContent() );
				    } );
			    }
		    } );

		    switchEditors.go( id, 'tmce' );
		    tinymce.execCommand( 'mceAddEditor', true, id );
	    }, this );
	},

	/**
	 * Restores each setting to its default value.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	restoreDefaults : function() {
		_.each( this.getSettings(), function( setting ) {

			var value = setting.get( 'default' ) || '';
			setting.set( 'value', value );

			var editor = tinyMCE.get( setting.media + '-' + this.cid );
			editor.setContent( value );

		}, this );
	},

	/**
	 * Destroys the TinyMCE instance(s).
	 * 
	 * @since 1.7.2
	 */
	onDestroy : function() {
	    _.each( this.getValues(), function( value, media ) {
		    tinyMCE.execCommand( 'mceRemoveEditor', true, media + '-' + this.cid );
	    }, this );
	}

} );

module.exports = EditorControl;
