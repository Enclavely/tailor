(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require( './shared/utility/ajax' );

require( './admin/components/icon-kits' );
},{"./admin/components/icon-kits":2,"./shared/utility/ajax":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
/**
 * window.ajax
 *
 * Simple AJAX utility module.
 *
 * @class
 */
var $ = jQuery,
    Ajax;

Ajax = {

    url : window.ajaxurl,

    /**
     * Sends a POST request to WordPress.
     *
     * @param  {string} action The slug of the action to fire in WordPress.
     * @param  {object} data   The data to populate $_POST with.
     * @return {$.promise}     A jQuery promise that represents the request.
     */
    post : function( action, data ) {
        return ajax.send( {
            data: _.isObject( action ) ? action : _.extend( data || {}, { action: action } )
        } );
    },

    /**
     * Sends a POST request to WordPress.
     *
     * Use with wp_send_json_success() and wp_send_json_error().
     *
     * @param  {string} action  The slug of the action to fire in WordPress.
     * @param  {object} options The options passed to jQuery.ajax.
     * @return {$.promise}      A jQuery promise that represents the request.
     */
    send : function( action, options ) {

        if ( _.isObject( action ) ) {
            options = action;
        }
        else {
            options = options || {};
            options.data = _.extend( options.data || {}, {
                action : action,
                tailor : 1
            } );
        }

        options = _.defaults( options || {}, {
            type : 'POST',
            url : ajax.url,
            context : this
        } );

        return $.Deferred( function( deferred ) {

            if ( options.success ) {
                deferred.done( options.success );
            }

            var onError = options.error ? options.error : ajax.onError;
            deferred.fail( onError );

            delete options.success;
            delete options.error;

            $.ajax( options )
                .done( function( response ) {

                    // Treat a response of `1` as successful for backwards compatibility with existing handlers.
                    if ( response === '1' || response === 1 ) {
                        response = { success: true };
                    }
                    if ( _.isObject( response ) && ! _.isUndefined( response.success ) ) {
                        deferred[ response.success ? 'resolveWith' : 'rejectWith' ]( this, [ response.data ] );
                    }
                    else {
                        deferred.rejectWith( this, [ response ] );
                    }
                } )
                .fail( function() {
                    deferred.rejectWith( this, arguments );
                } );

        } ).promise();
    },

    /**
     * General error handler for AJAX requests.
     *
     * @since 1.0.0
     *
     * @param response
     */
    onError : function( response ) {

        // Print the error to the console if the Notify feature is unavailable
        if ( ! Tailor.Notify ) {
            console.error( response );
            return;
        }

        if ( response && response.hasOwnProperty( 'message' ) ) {  // Display the error from the server
            Tailor.Notify( response.message );
        }
        else if ( '0' == response ) {  // Session expired
            Tailor.Notify( window._l10n.expired );
        }
        else if ( '-1' == response ) {  // Invalid nonce
            Tailor.Notify( window._l10n.invalid );
        }
        else {  // General error condition
            Tailor.Notify( window._l10n.error );
        }
    }
};

window.ajax = Ajax;

module.exports = Ajax;
},{}]},{},[1]);
