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
        'default' : '.js-default'
    },

    getTemplate : function() {
        var html = document.getElementById( 'tmpl-tailor-control-editor' ).innerHTML;
        return _.template( html
                .replace( new RegExp( 'tailor-editor', 'gi' ), this.cid )
                .replace( new RegExp( 'tailor-value', 'gi' ), '<%= value %>' )
        );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.toggleDefaultButton );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
        this.listenTo( app.channel, 'list:change:order', this.maybeRefreshEditor );
    },

	/**
	 * Refreshes the editor after the containing list item is moved.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param el
	 */
	maybeRefreshEditor : function( el ) {
        if ( el.contains( this.el ) ) {
            tinyMCE.execCommand( 'mceRemoveEditor', false, this.cid );
            tinyMCE.execCommand( 'mceAddEditor', false, this.cid );
        }
    },

    /**
     * Initializes the TinyMCE instance.
     *
     * @since 1.0.0
     */
    onAttach : function() {
		var input = this.ui.input;
		var id = this.cid;
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
                    input.change();
                } );
			}
		} );

		switchEditors.go( id, 'tmce' );

        tinymce.execCommand( 'mceAddEditor', true, id );
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
        tinyMCE.get( this.cid ).setContent( value );
    },

    /**
     * Destroys the TinyMCE instance when the control is destroyed.
     *
     * @since 1.0.0
     */
	onDestroy : function() {
        tinyMCE.execCommand( 'mceRemoveEditor', true, this.cid );
	}

} );

module.exports = EditorControl;
