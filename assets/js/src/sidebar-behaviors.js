
( function( Behaviors ) {

    'use strict';

    Behaviors.Resizable = require( './components/behaviors/resizable' );
    Behaviors.Draggable = require( './components/behaviors/draggable' );
    Behaviors.Panel = require( './components/behaviors/panel' );

    Marionette.Behaviors.behaviorsLookup = function() {
        return Behaviors;
    };

    window.Tailor.Behaviors = Behaviors;

} ) ( window.Tailor.Behaviors || {} );