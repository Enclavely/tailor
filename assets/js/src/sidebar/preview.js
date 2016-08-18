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

var $buttons = $( '.devices button' );
var preview = document.querySelector( '.tailor-preview' );
var viewport = document.querySelector( '.tailor-preview__viewport' );
var mediaQueries = window._media_queries;

// Change the viewport size based on which device preview size is selected
$buttons
    .on( 'click', function( e ) {
        var button = e.target;

        $buttons.each( function() {
            if ( this == button ) {
                var device = button.getAttribute( 'data-device' );
                this.classList.add( 'is-active' );
                this.setAttribute( 'aria-pressed', 'true' );
                preview.className = 'tailor-preview ' + device + '-screens';

                if ( mediaQueries.hasOwnProperty( device ) && mediaQueries[ device ].max ) {
                    viewport.style.maxWidth = mediaQueries[ device ].max;
                }
                else {
                    viewport.style.maxWidth ='';
                }
            }
            else {
                this.classList.remove( 'is-active' );
                this.setAttribute( 'aria-pressed', 'false' );
            }
        } );

    } )
    .first().click();