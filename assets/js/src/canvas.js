require( './utility/polyfills/classlist' );
require( './utility/polyfills/raf' );

var Application = require( './apps/canvas' );
window.app = new Application();

window.Tailor = {
    Api : {
        Setting : require( './components/api/setting' ),
        Element : require( './components/api/element' )
    },
    CSS : require( './utility/css' )
};

window.ajax = require( './utility/ajax' );

( function( app, $ ) {

    'use strict';

    require( './canvas-behaviors' );
    require( './canvas-components' );
    require( './canvas-entities' );
    require( './canvas-preview' );
    
    if ( null == document.getElementById( "canvas" ) || null == document.getElementById( "select" ) ) {
        console.error( 'The page canvas could not be initialized.  This could be caused by a plugin or theme conflict.' );
    }
    else {
        app.addRegions( {

            // Primary canvas region
            canvasRegion : {
                selector : "#canvas",
                regionClass : require( './modules/canvas/canvas-region' )
            },

            // Tools region
            selectRegion : {
                selector : "#select",
                regionClass : require( './modules/tools/select-region' )
            }
        } );

        app.on( 'before:start', function() {
            app.module( 'entities:canvas', require( './entities/canvas' ) );
        } );

        app.on( 'start', function() {
            app.module( 'module:canvas', require( './modules/canvas' ) );
            app.module( 'module:tools', require( './modules/tools' ) );
            app.module( 'module:stylesheet', require( './modules/stylesheet' ) );
        } );
    }

    $( document ).ready( function() {
        app.start( {
            elements : window._elements || [],
            nonces : window._nonces || [],
            l10n : window._l10n || [],
            mediaQueries : window._media_queries || {},
            cssRules : window._css_rules || {}
        } );
    } );

} ) ( window.app, jQuery );

//require( './utility/debug' );