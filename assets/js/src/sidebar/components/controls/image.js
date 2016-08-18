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
        'default' : '.js-default',
        'thumbnails' : '.thumbnails',
        'thumbnail' : '.thumbnail'
    },

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeImage',
        'click @ui.thumbnail' : 'openFrame',
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
                    title : 'Select Image',
                    library : wp.media.query( { type : [ 'image' ] } ),
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
        //this.listenTo( this.frame, 'select', this.selectImage );

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

        this.setSettingValue( attachment.get( 'id' ) );
        this.updateThumbnail( sizes );
    },

    /**
     * Updates the image thumbnail.
     *
     * @since 1.0.0
     *
     * @param sizes
     */
    updateThumbnail : function( sizes ) {
        var url;
        if ( sizes.hasOwnProperty( 'medium' ) ) {
            url = sizes.medium.url;
        }
        else if ( sizes.hasOwnProperty( 'thumbnail' ) ) {
            url = sizes.thumbnail.url;
        }
        else if ( sizes.hasOwnProperty( 'full' ) ) {
            url = sizes.full.url; // small images do not have thumbnail generated
        }
        else {
            return; // invalid sizes
        }
        
        this.ui.thumbnails
            .removeClass( 'is-loading' )
            .html( '<li class="thumbnail"><img src="' + url + '"/></li>' );
    },

    /**
     * Removes the selected image.
     *
     * @since 1.0.0
     */
    removeImage : function() {
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
            var sizes = attachment.get( 'sizes' );

            if ( sizes ) {
                this.updateThumbnail( sizes );
            }
            else {
                attachment.fetch( {
                    success : function() {
                        sizes = attachment.get( 'sizes' );
                        control.updateThumbnail( sizes );
                    }
                } );
            }
        }
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
