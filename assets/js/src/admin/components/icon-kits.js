/* window._l10n, window.nonces */

var $ = window.jQuery,
	l10n = window._l10n,
	ajax = window.ajax;

$( function() {
	var $field = $( '.tailor-icon-kits' );
	var frame = wp.media( {
		button: {
			text : l10n.selectKit
		},
		states: [
			new wp.media.controller.Library({
				title : l10n.selectKit,
				library : wp.media.query( { type : [ 'application/zip' ] } ),
				multiple : false,
				date : false
			} )
		]
	} );

	frame.on( 'select', function( e ) {
		var selection = frame.state().get( 'selection' ).toJSON();
		var id = _.pluck( selection, 'id' );

		$field
			.find( '.spinner' )
			.addClass( 'is-active' );
		
		ajax.send( 'tailor_add_icon_kit', {
			data : {
				id : id[0],
				name : $field.data( 'name' ),
				nonce : window._nonces.saveKit
			},

			/**
			 * Display an error message when the request is unsuccessful.
			 * 
			 * @since 1.0.0
			 * 
			 * @param response
			 */
			error : function( response ) {
				var template = _.template( document.getElementById( 'tmpl-tailor-notice' ).innerHTML );
				var $notice = $( template( { message: response.message } ) );

				$field
					.parent()
					.before( $notice );

				$notice.on( 'click button', function() {
					$notice
						.fadeOut()
						.off();
				} );

				$field
					.find( '.spinner' )
					.removeClass( 'is-active' );
			},

			/**
			 * Update the list of icon kits when the request is successful.
			 * 
			 * @since 1.0.0
			 * 
			 * @param response
			 */
			success : function( response ) {
				$field.html( $( response ).html() );
			}

		} );
	} );

	$field

		// Open the Media Library frame
		.on( 'click', '.js-select', function( e ) {
			frame.open();
		} )

		// Delete an icon kit
		.on( 'click', '.js-delete', function( e ) {

			$field
				.find( '.spinner' )
				.addClass( 'is-active' );

			ajax.send( 'tailor_delete_icon_kit', {
				data : {
					id : this.getAttribute( 'data-id' ),
					name : $field.data( 'name' ),
					nonce : window._nonces.deleteKit
				},

				/**
				 * Update the icon kit when the request is successful.
				 * 
				 * @since 1.0.0
				 * 
				 * @param response
				 */
				success : function( response ) {
					$field.html( $( response ).html() );
				}
			} );
	
			e.preventDefault();
	} );
} );