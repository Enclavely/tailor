/**
 * Tailor.Controls.Gallery
 *
 * A gallery control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    GalleryControl;

GalleryControl = AbstractControl.extend( {

	ui: {
        select : '.button--select',
        change : '.button--change',
		remove : '.button--remove',
        thumbnails : '.thumbnails',
        default : '.js-default'
	},

    events : {
        'click @ui.select' : 'selectImages',
        'click @ui.change' : 'selectImages',
        'click @ui.thumbnails' : 'selectImages',
        'click @ui.remove' : 'removeImages',
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
        data.ids = this.ids();

        return data;
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
	 * Opens the Media Library window.
	 *
	 * @since 1.0.0
	 */
    selectImages : function() {
        var galleryControl = this;
        var ids = this.ids();
		var selection = this.getSelection( ids );
        var frame = wp.media( {
            frame : 'post',
            state : ( ids.length ? 'gallery-edit' : 'gallery-library' ),
            editing : true,
            multiple : true,
            selection : selection
        } );
		var library;

        frame
            .on( 'open', function() {

	            // Hide the Cancel Gallery link
                var mediaFrame = frame.views.get( '.media-frame-menu' )[0];
                mediaFrame.$el.children().slice( 0, 2 ).hide();

	            library = JSON.stringify( selection.toJSON() );
            } )
            .on( 'update', function( collection ) {
	            var value = collection.pluck( 'id' ).join( ',' );
	            galleryControl.setSettingValue( value );

	            if ( ! _.isEqual( library, JSON.stringify( collection.toJSON() ) ) ) {
		            galleryControl.model.setting.trigger( 'change', galleryControl.model.setting, value );
	            }
	            galleryControl.updateThumbnails( collection );

            } )
            .on( 'close', function() {
                frame.dispose();
            } );

        frame.open();
    },

	/**
	 * Removes all selected images.
	 *
	 * @since 1.0.0
	 */
    removeImages : function() {
        this.setSettingValue( '' );
        this.render();
    },

	/**
	 * Updates the thumbnails when the control is rendered.
	 *
	 * @since 1.0.0
	 */
    onRender : function() {
        this.generateThumbnails();
    },

	/**
	 * Generates image thumbnails.
	 *
	 * @since 1.0.0
	 */
	generateThumbnails : function() {
		var gallery = this;
		var ids = this.ids();

		if ( ids.length ) {
			var selection = this.getSelection( this.ids() );

			selection.more().done( function() {
				selection.props.set( { query: false } );
				selection.unmirror();
				selection.props.unset( 'orderby' );

				gallery.updateThumbnails( selection );
			} );
		}
	},

	/**
	 * Updates image thumbnails based on a selection from the Media Library.
	 *
	 * @since 1.0.0
	 *
	 * @param selection
	 */
	updateThumbnails : function( selection ) {
		var html = '';
		var urls = selection.map( function( attachment ) {

			var sizes = attachment.get( 'sizes' );
			var url;

			if ( sizes.hasOwnProperty( 'medium' ) ) {
				url = sizes.medium.url;
			}
			else if ( sizes.hasOwnProperty( 'thumbnail' ) ) {
				url = sizes.thumbnail.url;
			}
			else if ( sizes.hasOwnProperty( 'full' ) ) {
				url = sizes.full.url;
			}
			else {
				url = '';
			}

			return url;
		} );

		if ( urls.length ) {
			_.each( urls, function( url ) {
				html += '<li class="thumbnail"><img src="' + url + '"/></li>';
			} );
		}

		this.ui.thumbnails
			.removeClass( 'is-loading' )
			.html( html );
	},

	/**
	 * Returns a Media Library selection from a given set of image ids.
	 *
	 * @since 1.0.0
	 *
	 * @param ids
	 * @returns {*|R|r}
	 */
    getSelection : function( ids ) {
        var attachments = wp.media.query( {
            orderby : 'post__in',
            order: 'ASC',
            type: 'image',
            post__in : ids
        } );

        return new wp.media.model.Selection( attachments.models, {
            props : attachments.props.toJSON(),
            multiple: true
        } );
    },
	
    /**
     * Returns the selected image IDs.
     *
     * @since 1.0.0
     *
     * @returns {Array|*}
     */
    ids : function() {
        var value = this.getSettingValue();
        return value ? value.split( ',' ) : false;
    },

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     */
    restoreDefaultValue : function() {
        this.setSettingValue( this.getDefaultValue() );
    }

} );

module.exports = GalleryControl;