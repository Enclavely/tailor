
( function( Models ) {

    'use strict';

    Models.Container = require( './entities/models/elements/model-container' );
    Models.Wrapper = require( './entities/models/elements/model-wrapper' );
    Models.Child = require( './entities/models/elements/model-child' );
    Models.Element = require( './entities/models/elements/element' );

    Models.Section = require( './entities/models/elements/wrappers/section' );
    Models.Row = require( './entities/models/elements/containers/row' );
    Models.Column = require( './entities/models/elements/children/column' );
    Models.GridItem = require( './entities/models/elements/children/grid-item' );
    Models.Tabs = require( './entities/models/elements/containers/tabs' );
    Models.Carousel = require( './entities/models/elements/containers/carousel' );

    Models.lookup = function( tag, type ) {

        tag = tag.replace( /tailor_/g, ' ' ).replace( /_/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Models.hasOwnProperty( tag ) ) {
            return Models[ tag ];
        }

        type = type.replace( /_/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Models.hasOwnProperty( type ) ) {
            return Models[ type ];
        }

        return Models.Element;
    };

    window.Tailor.Models = Models;

} ) ( window.Tailor.Models || {} );