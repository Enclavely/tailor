/**
 * Tailor.Controls.Gallery
 *
 * A gallery control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    GalleryControl;

GalleryControl = AbstractControl.extend( {

	ui: {
        'select' : '.button--select',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'thumbnails' : '.thumbnails',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

    events : {
        'click @ui.select' : 'selectImages',
        'click @ui.change' : 'selectImages',
	    'click @ui.remove' : 'removeImages',
	    'click @ui.thumbnails' : 'selectImages',
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
		data.ids = {};
		_.each( data.values, function( value, media ) {
			data.ids[ media ] = this.getIds( value );
		}, this );
		return data;
	},

	/**
	 * Opens the Media Library window.
	 *
	 * @since 1.0.0
	 */
    selectImages : function() {

		_.each( this.getValues(), function( value, media ) {
			if ( media == this.media ) {
				var control = this;
				var ids = control.getIds( value );
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

					/**
					 * Hide the Cancel Gallery link and record the original library.
					 */
					.on( 'open', function() {
						var mediaFrame = frame.views.get( '.media-frame-menu' )[0];
						mediaFrame.$el.children().slice( 0, 2 ).hide();
						library = JSON.stringify( selection.toJSON() );
					} )

					/**
					 * Update the setting value and thumbnails.
					 */
					.on( 'update', function( collection ) {
						var value = collection.pluck( 'id' ).join( ',' );
						control.setValue( value );

						// Trigger change if the images are the same (implies other change)
						if ( ! _.isEqual( library, JSON.stringify( collection.toJSON() ) ) ) {
							var setting = control.getSetting( media );
							setting.trigger( 'change', setting, value );
						}
					} )

					/**
					 * Dispose of the media frame when it's closed.
					 */
					.on( 'close', function() {
						frame.dispose();
					} );

				frame.open();
			}
		}, this );
    },

	/**
	 * Returns the ID(s) of the selected image(s).
	 * 
	 * @since 1.7.2
	 * 
	 * @param value
	 * @returns {*}
	 */
	getIds : function( value ) {
		if ( _.isEmpty( value ) ) {
			return false;
		}
		return value.split( ',' )
	},

	/**
	 * Removes all selected images.
	 *
	 * @since 1.0.0
	 */
    removeImages : function() {
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
	 * Updates the thumbnails when the control is rendered.
	 *
	 * @since 1.0.0
	 */
    onRender : function() {
		var control = this;
		_.each( this.getValues(), function( value, media ) {
			var selection = this.getSelection( control.getIds( value ) );
			selection.more().done( function() {
				selection.props.set( { query: false } );
				selection.unmirror();
				selection.props.unset( 'orderby' );
				control.updateThumbnails( selection, media );
			} );
		}, this );

		this.updateControlGroups();
	},

	/**
	 * Updates the image thumbnails.
	 * 
	 * @since 1.7.2
	 * 
	 * @param selection
	 * @param media
	 */
	updateThumbnails : function( selection, media ) {
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

		this.ui.controlGroups
			.filter( '[id^="' + media + '"]' )
			.find( '.thumbnails' )
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
    }

} );

module.exports = GalleryControl;
