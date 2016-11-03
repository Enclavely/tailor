/* window._l10n, window._mediaQueries */

var $ = jQuery;
var title = document.querySelector( '.tailor__home .title' );

Tailor.Api.Setting.onChange( 'sidebar:_post_title', function( to, from ) {
    if ( title.hasChildNodes() ) {
        var children = title.childNodes;
        for ( var i = 1; i < children.length; i++ ) {
            if ( 3 == children[ i ].nodeType && -1 !== children[ i ].nodeValue.indexOf( from ) ) {
                children[ i ].nodeValue = to;
            }
        }
    }

    document.title = window._l10n.tailoring + to;
} );