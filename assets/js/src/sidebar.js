require( './utility/polyfills/classlist' );
require( './utility/polyfills/raf' );

var Application = require( './apps/sidebar' );
window.app = new Application();

window.Tailor = {
    Api : require( './components/api/setting' ),
    Notify : require( './utility/notify' )
};

window.ajax = require( './utility/ajax' );

wp.media.view.settings.post.id = window.post.id;

( function( app, $ ) {

    'use strict';

    require( './sidebar-behaviors' );
    require( './sidebar-components' );
    require( './sidebar-entities' );

    app.addRegions( {

        content : '#tailor-sidebar-content',

        dialog : {
            selector : "#tailor-dialog-container",
            regionClass : require( './modules/dialog/dialog-region' )
        },

        modal : {
            selector : "#tailor-modal-container",
            regionClass : require( './modules/modal/modal-region' )
        }
    } );

    app.on( 'before:start', function( options ) {
        app.module( 'entities:settings', require( './entities/sidebar' ) );
    } );

    app.on( 'start', function( options ) {
        app.module( 'module:panels', require( './modules/panels' ) );
        app.module( 'module:modal', require( './modules/modal' ) );
        app.module( 'module:dialog', require( './modules/dialog' ) );
        app.module( 'module:notification', require( './modules/notification' ) );

        require( './sidebar-preview' );

        $( document ).on( 'heartbeat-send', function( e, data ) {
            data['tailor_post_id'] = window.post.id;
        } );

        wp.heartbeat.interval( 60 );
        wp.heartbeat.connectNow();

        $( window )

        /**
         * Warns the user if they attempt to navigate away from the page without saving changes.
         *
         * @since 1.0.0
         */
            .on( 'beforeunload.tailor', function( e ) {
                if ( app.hasUnsavedChanges() ) {
                    return window._l10n.confirmPage;
                }
            } )

        /**
         * Unlocks the post when the user navigates away from the page.
         *
         * @since 1.0.0
         */
            .on( 'unload.tailor', function( e ) {
                window.ajax.send( 'tailor_unlock_post', {
                    data : {
                        post_id : options.postId,
                        nonce : options.nonces.unlockPost
                    }
                } );
            } );
    } );

    $( document ).ready( function() {
        app.start( {
            postId : window.post.id,
            nonces : window._nonces,
            library : window._library || [],
            templates : window._templates || [],
            panels : window._panels || [],
            sections : window._sections || [],
            settings : window._settings || [],
            controls : window._controls || []
        } );
    } );

} ) ( window.app, jQuery );