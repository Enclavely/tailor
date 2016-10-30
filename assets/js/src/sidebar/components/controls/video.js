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
        'enterUrl' : '.button--enter',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
	},

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.enterUrl' : 'openDialog',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeVideo',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
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
        this.checkDependencies();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        _.each( this.getSettings(), function( setting ) {
            this.listenTo( setting, 'change', this.onSettingChange );
        }, this );
        this.listenTo( this.getSetting().collection, 'change', this.checkDependencies );

        this.frame.on( 'select', this.selectVideo.bind( this ) );
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

        this.setValue( attachment.get( 'id' ) );
    },

    /**
     * Opens the link selection dialog.
     *
     * @since 1.0.0
     */
    openDialog : function() {
        var control = this;
        var options = {
            title : 'Enter URL',
            button : window._l10n.select,

            /**
             * Returns the content for the Select Content dialog.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            content : function() {
                return  '<div class="dialog__container">' +
                            '<input class="search--content" type="search" role="search">' +
                        '</div>';
            },

            /**
             * Returns true if an item has been selected.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            onValidate : function() {
                var url = $( '.search--content' ).val();
                return url && /^(ftp|http|https):\/\/[^ "]+$/.test( url );
            },

            /**
             * Updates the setting value with the selected item URL.
             *
             * @since 1.0.0
             */
            onSave : function() {
                control.setValue( $( '.search--content' ).val() );
            },

            /**
             * Cleans up event listeners.
             *
             * @since 1.0.0
             */
            onClose : function() {
                this.$el.find( '.search--content' ).off( 'input' );
            }
        };

        /**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', options );
    },

    /**
     * Re-renders the control when a setting value changes.
     *
     * @since 1.7.2
     */
    onSettingChange : function() {
        this.render();
    },
    
    /**
     * Removes the selected video.
     *
     * @since 1.0.0
     */
    removeVideo : function() {
        this.setValue( '' );
    },

    /**
     * Renders the image thumbnail.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var control = this;
        _.each( this.getValues(), function( value, media ) {
            if ( value ) {
                var attachment = wp.media.attachment( value );
                if ( ! attachment.get( 'url' ) ) {
                    attachment.fetch( {
                        success : function() {
                            control.updatePreview( attachment, media );
                        }
                    } );
                }
                else {
                    control.updatePreview( attachment, media );
                }
            }
        }, this );

        this.updateControlGroups();
    },

    /**
     * Updates the video preview.
     *
     * @since 1.0.0
     *
     * @param attachment
     * @param media
     */
    updatePreview : function( attachment, media ) {
        var url = attachment.get( 'url' );
        var mime = attachment.get( 'mime' );

        this.ui.controlGroups
            .filter( '[id^="' + media + '"]' )
            .find( '.video-preview' )
            .removeClass( 'is-loading' )
            .html( '<video controls><source src="' + url + '" type="' + mime + '"></video>' );
    },

    /**
     * Disposes of the media frame when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.frame.dispose();
    }
    
} );

module.exports = VideoControl;
