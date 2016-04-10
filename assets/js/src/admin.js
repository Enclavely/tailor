
/**
 * Admin scripts to facilitate dismissible notices and icon kit management.
 *
 * @since 1.0.0
 */
window.ajax = require( './utility/ajax' );
window.notify = require( './utility/notify' );

( function( ajax, $ ) {

    'use strict';

    $( document ).ready( function() {

        var $iconKitField = $( '.tailor-icon-kits' );

        $( '.notice.is-dismissible' ).on( 'click', '.notice-dismiss', function( event ) {
            $( this ).slideUp();
        } );

        var frame = wp.media( {
            button: {
                text : 'Select kit'
            },
            states: [
                new wp.media.controller.Library({
                    title : 'Select kit',
                    library : wp.media.query( { type : [ 'application/zip' ] } ),
                    multiple : false,
                    date : false
                } )
            ]
        } );

        frame.on( 'select', function( e ) {
            var selection = frame.state().get( 'selection' ).toJSON();
            var id = _.pluck( selection, 'id' );
            var name = $iconKitField.data( 'name' );

            $iconKitField.find( '.spinner' ).addClass( 'is-active' );

            var options = {

                data : {
                    id : id[0],
                    name : name,
                    nonce : window.iconKitNonce
                },

                error : function( response ) {

                    var $notice = $( _.template( document.getElementById( 'tmpl-tailor-notice' ).innerHTML, { message : response.message } ) );

                    $iconKitField.closest( '.form-table' ).before( $notice );

                    $notice.on( 'click', function() {
                        $notice
                            .hide()
                            .off();
                    } );
                },

                success : function( response ) {
                    $iconKitField.html( $( response ).html() );
                },

                complete : function() {
                    $iconKitField.find( '.spinner' ).removeClass( 'is-active' );
                }
            };

            ajax( 'tailor_add_icon_kit', options );
        } );

        $iconKitField.on( 'click', '.js-select', function( e ) {
            frame.open();
        } );

        $iconKitField.on( 'click', '.js-delete', function( e ) {
            var name = $iconKitField.data( 'name' );
            $iconKitField.find( '.spinner' ).addClass( 'is-active' );

            var options = {
                data : {
                    id : this.getAttribute( 'data-id' ),
                    name : name,
                    nonce : window.iconKitNonce
                },

                success : function( response ) {
                    $iconKitField.html( $( response ).html() );
                }
            };

            ajax( 'tailor_delete_icon_kit', options );

            e.preventDefault();
        } );
    } );

} )( window.ajax.send, jQuery );