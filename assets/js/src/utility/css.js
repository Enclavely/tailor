/**
 * Tailor.CSS
 *
 * Helper functions for managing dynamic CSS rules.
 *
 * @class
 */
var $ = Backbone.$,
    CSS;

CSS = {

	/**
	 * Adds a CSS rule to an existing style sheet.
	 *
	 * @since 1.0.0
	 *
	 * @param sheet
	 * @param selectors
	 * @param declarations
	 * @param elementId
	 */
    addRule : function( sheet, selectors, declarations, elementId ) {
        var selectorString = Tailor.CSS.parseSelectors( selectors, elementId );
        var declarationString = Tailor.CSS.parseDeclarations( declarations );

        if ( 'insertRule' in sheet ) {
            sheet.insertRule( selectorString + " {" + declarationString + "}", sheet.cssRules.length );
        }
        else if ( 'addRule' in sheet ) {
            sheet.addRule( selectorString, declarationString, sheet.cssRules.length );
        }
    },

	/**
	 * Deletes a CSS rule from an existing style sheet.
	 *
	 * @since 1.0.0
	 *
	 * @param sheet
	 * @param index
	 */
    deleteRule : function( sheet, index ) {
        if ( 'deleteRule' in sheet ) {
            sheet.deleteRule( index );
        }
        else if ( 'removeRule' in sheet ) {
            sheet.removeRule( index );
        }
    },

	/**
	 * Parses CSS selector string(s) for a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param selectors
	 * @param elementId
	 * @returns {*}
	 */
    parseSelectors : function( selectors, elementId ) {

        if ( _.isString( selectors ) ) {
            return selectors;
        }

        var elementClass = elementId ? '.' + elementId : '';
        var selector;

        if ( ! selectors.length ) {
            selector = elementClass ? '.tailor-ui ' + elementClass : '';
        }
        else {

            if ( elementClass ) {
                selectors = selectors.map( function( selector ) {
                    if ( selector.indexOf( '&' ) > -1 ) {
                        selector = selector.replace( '&', elementClass );
                    }
                    else if ( ':' == selector.charAt( 0 ) ) {
                        selector = elementClass + selector;
                    }
                    else {
                        selector = elementClass + ' ' + selector;
                    }

                    return selector;
                } );
            }

            selector = '.tailor-ui ' + selectors.join( ',.tailor-ui ' );
        }

        return selector;
    },

	/**
	 * Parses CSS declaration(s).
	 *
	 * @since 1.0.0
	 *
	 * @param declarations
	 * @returns {*}
	 */
    parseDeclarations : function( declarations ) {

        if ( _.isString( declarations ) ) {
            return declarations;
        }

        var declaration = '';
        _.each( declarations, function( value, property ) {
            declaration += property + ':' + value + ';';
        } );

        return declaration;
    }

};

module.exports = CSS;