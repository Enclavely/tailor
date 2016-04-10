
( function( Models ) {

    'use strict';

    Models.Section = require( './entities/models/library/model-wrapper' ); // Sections are just special wrappers
    Models.Element = require( './entities/models/library/element' );
    Models.Container = require( './entities/models/library/model-container' );
    Models.Wrapper = require( './entities/models/library/model-wrapper' );

    Models.lookup = function( tag, type ) {

        tag = tag.replace( /tailor_/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
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