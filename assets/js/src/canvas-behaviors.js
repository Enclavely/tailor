( function( Behaviors ) {

	'use strict';

	Behaviors.Container = require( './components/behaviors/container' );
	Behaviors.Draggable = require( './components/behaviors/draggable' );
	Behaviors.Droppable = require( './components/behaviors/droppable' );
	Behaviors.Editable = require( './components/behaviors/editable' );
	Behaviors.Movable = require( './components/behaviors/movable' );

	Marionette.Behaviors.behaviorsLookup = function() {
		return Behaviors;
	};

	window.Tailor.Behaviors = Behaviors;

} ) ( window.Tailor.Behaviors || {} );