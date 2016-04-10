/**
 * Tailor.Controls.Video
 *
 * A video control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    VideoControl;

VideoControl = AbstractControl.extend( {

	ui : {
        'select' : '.button--select',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'default' : '.js-default',
        'preview' : '.video-preview'
	},

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeVideo',
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Initializes the media frame for the control.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {

        this.frame = wp.media( {
            states: [
                new wp.media.controller.Library({
                    title : 'Select Video',
                    library : wp.media.query( { type : [ 'video' ] } ),
                    multiple : false,
                    date : false
                } )
            ]
        } );

        this.addEventListeners();
        this.checkDependencies( this.model.setting );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
        this.listenTo( this.frame, 'select', this.selectVideo );
    },

    /**
     * Opens the media frame.
     *
     * @since 1.0.0
     */
    openFrame : function() {
        this.frame.open();
    },

    /**
     * Saves the image ID and updates the thumbnail when the selected image changes.
     *
     * @since 1.0.0
     */
    selectVideo : function() {
        var selection = this.frame.state().get( 'selection' );
        var attachment = selection.first();

        this.setSettingValue( attachment.get( 'id' ) );
        this.updatePreview( attachment );
    },

    /**
     * Updates the video preview.
     *
     * @since 1.0.0
     *
     * @param attachment
     */
    updatePreview : function( attachment ) {
        var url = attachment.get( 'url' );
        var mime = attachment.get( 'mime' );

        this.ui.preview
            .removeClass( 'is-loading' )
            .html( '<video controls><source src="' + url + '" type="' + mime + '"></video>' );
    },

    /**
     * Removes the selected video.
     *
     * @since 1.0.0
     */
    removeVideo : function() {
        this.setSettingValue( '' );
    },

    /**
     * Renders the image thumbnail.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var control = this;
        var id = this.getSettingValue();

        if ( id ) {
            var attachment = wp.media.attachment( id );
            if ( ! attachment.get( 'url' ) ) {
                attachment.fetch( {
                    success : function() {
                        control.updatePreview( attachment );
                    }
                } );
            }
            else {
                control.updatePreview( attachment );
            }
        }
    },

    /**
     * Disposes of the media frame when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.frame.dispose();
        //this.destroyPlayer();
    },

    /**
     * Initializes the video player.
     *
     * @since 1.0.0
     */
    initializePlayer : function() {
        var mejsSettings = window._wpmejsSettings || {};
        var video = this.ui.preview.get(0).firstChild;
        this.player = new MediaElementPlayer( video, mejsSettings );
    },

    /**
     * Destroys the video player.
     *
     * @since 1.0.0
     */
    destroyPlayer : function() {
        this.player && wp.media.mixin.removePlayer( this.player );
    }

} );

module.exports = VideoControl;