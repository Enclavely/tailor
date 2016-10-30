/**
 * Tailor.Controls.Image
 *
 * An image control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    ImageControl;

ImageControl = AbstractControl.extend( {

	ui : {
        'select' : '.button--select',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *',
        'thumbnail' : '.thumbnail'
    },

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeImage',
        'click @ui.thumbnail' : 'openFrame',
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
                    title : 'Select Image',
                    library : wp.media.query( { type : [ 'image' ] } ),
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

        this.frame.on( 'select', this.selectImage.bind( this ) );
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
    selectImage : function() {
        var selection = this.frame.state().get( 'selection' );
        var attachment = selection.first();
        var sizes = attachment.get( 'sizes' );
        this.setValue( attachment.get( 'id' ) );
    },

    /**
     * Updates the image thumbnail.
     *
     * @since 1.0.0
     *
     * @param sizes
     * @param media
     */
    updateThumbnail : function( sizes, media ) {
        var url;
        if ( sizes.hasOwnProperty( 'medium' ) ) {
            url = sizes.medium.url;
        }
        else if ( sizes.hasOwnProperty( 'thumbnail' ) ) {
            url = sizes.thumbnail.url;
        }
        else if ( sizes.hasOwnProperty( 'full' ) ) {
            url = sizes.full.url; // Small images do not have thumbnail generated
        }
        else {
            return; // Invalid sizes
        }
        
        this.ui.controlGroups
            .filter( '[id^="' + media + '"]' )
            .find( '.thumbnails' )
            .removeClass( 'is-loading' )
            .html( '<li class="thumbnail"><img src="' + url + '"/></li>' );
    },

    /**
     * Removes the selected image.
     *
     * @since 1.0.0
     */
    removeImage : function() {
        this.setValue( '' );
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
     * Renders the image thumbnail.
     *
     * @since 1.0.0
     */
    onRender : function() {
        _.each( this.getValues(), function( value, media ) {
            if ( value ) {
                var attachment = wp.media.attachment( value );
                var sizes = attachment.get( 'sizes' );
                if ( sizes ) {
                    this.updateThumbnail( sizes, media );
                }
                else {
                    var control = this;
                    attachment.fetch( {
                        success : function() {
                            sizes = attachment.get( 'sizes' );
                            control.updateThumbnail( sizes, media );
                        }
                    } );
                }
            }
        }, this );

        this.updateControlGroups();
    },

    /**
     * Disposes of the media frame when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.frame.off().dispose();
    }

} );

module.exports = ImageControl;
