/**
 * Tailor.CSS
 *
 * Helper functions for managing dynamic stylesheets.
 *
 * @class
 */
var CSS = {

	/**
	 * Adds a CSS rule to an existing style sheet.
	 *
	 * @since 1.0.0
	 *
	 * @param sheet
	 * @param selector
	 * @param declaration
	 * @param index
	 */
    addRule : function( sheet, selector, declaration, index ) {
        if ( 'insertRule' in sheet ) {
            sheet.insertRule( selector + " {" + declaration + "}", sheet.cssRules.length );
        }
        else if ( 'addRule' in sheet ) {
            sheet.addRule( selector, declaration, sheet.cssRules.length );
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

        var elementClass = elementId ? '.tailor-' + elementId : '';
		var prefix = '.tailor-ui ';
		if ( ! selectors.length ) {
			return prefix + elementClass;
		}

		selectors = selectors.map( function( selector ) {
			if ( selector.indexOf( '&' ) > -1 ) {
				selector = selector.replace( '&', elementClass );
			}
			else {
				var firstCharacter = selector.charAt( 0 );
				if ( ':' == firstCharacter || '::' == firstCharacter ) {
					selector = elementClass + selector;
				}
				else {
					selector = elementClass + ' ' + selector
				}
			}
			return prefix + selector;
		} );

		return selectors.join( ',' );
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