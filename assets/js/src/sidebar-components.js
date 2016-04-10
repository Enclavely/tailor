
( function( Panels, Sections, Items, Controls ) {

    'use strict';

    Panels.Default = require( './components/panels/panel-default' );
    Panels.Templates = require( './components/panels/panel-templates' );

    Panels.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( window.Tailor.Panels.hasOwnProperty( type ) ) {
            return window.Tailor.Panels[ type ];
        }

        return window.Tailor.Panels.Default;
    };

    Sections.Default = require( './components/sections/section-default' );

    Sections.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Sections.hasOwnProperty( type ) ) {
            return Sections[ type ];
        }

        return Sections.Default;
    };

    Items = window.Tailor.Items || {};
    Items.Default = require( './components/items/item-default' );
    Items.Panels = require( './components/items/item-panels' );
    Items.History = require( './components/items/item-history' );
    Items.Library = require( './components/items/item-library' );
    Items.Templates = require( './components/items/item-templates' );

    Items.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Items.hasOwnProperty( type ) ) {
            return Items[ type ];
        }

        return Items.Default;
    };

    Controls = window.Tailor.Controls || {};
    Controls.ButtonGroup = require( './components/controls/button-group' );
    Controls.Checkbox = require( './components/controls/checkbox' );
    Controls.Code = require( './components/controls/code' );
    Controls.Colorpicker = require( './components/controls/colorpicker' );
    Controls.Editor = require( './components/controls/editor' );
    Controls.Gallery = require( './components/controls/gallery' );
    Controls.Icon = require( './components/controls/icon' );
    Controls.Image = require( './components/controls/image' );
    Controls.Link = require( './components/controls/link' );
    Controls.List = require( './components/controls/list' );
    Controls.Radio = require( './components/controls/radio' );
    Controls.Range = require( './components/controls/range' );
    Controls.Select = require( './components/controls/select' );
    Controls.SelectMulti = require( './components/controls/select-multi' );
    Controls.Style = require( './components/controls/style' );
    Controls.Switch = require( './components/controls/switch' );
    Controls.Text = require( './components/controls/text' );
    Controls.Textarea = require( './components/controls/textarea' );
    Controls.Video = require( './components/controls/video' );

    Controls.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Controls.hasOwnProperty( type ) ) {
            return Controls[ type ];
        }

        return Controls.Text;
    };

    window.Tailor.Panels = Panels;
    window.Tailor.Sections = Sections;
    window.Tailor.Items = Items;
    window.Tailor.Controls = Controls;

} ) ( window.Tailor.Panels || {}, window.Tailor.Sections || {}, window.Tailor.Items || {}, window.Tailor.Controls || {} );