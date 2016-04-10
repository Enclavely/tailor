
function Stylesheet( id, media ) {
    this.id = id;
    this.elements = [];

    this.initialize( media );
}

Stylesheet.prototype = {

	/**
     * Initializes the stylesheet.
     *
     * @since 1.0.0
     *
     * @param media
     */
    initialize : function( media ) {
        this.stylesheet = this.createStylesheet( media );
        this.sheet = this.stylesheet.sheet;
    },

	/**
	 * Adds the stylesheet to the DOM.
	 *
	 * @since 1.0.0
	 *
	 * @param media
	 * @returns {Element}
	 */
    createStylesheet : function( media ) {
        var style = document.createElement( 'style' );
        style.appendChild( document.createTextNode( '' ) );

        media = media || 'screen';
        style.setAttribute( 'media', media );
        style.setAttribute( 'id', 'tailor-' + this.id );

        document.head.appendChild( style );
        return style;
    },

	/**
	 * Adds a set of CSS rules to the stylesheet.
	 *
	 * @since 1.0.0
	 *
	 * @param ruleSet
	 */
    addRules : function( ruleSet ) {
        _.each( ruleSet, function( rules, elementId ) {
            rules.forEach( function( rule ) {
                if ( 'selectors' in rule && 'declarations' in rule ) {
                    Tailor.CSS.addRule( this.sheet, rule.selectors, rule.declarations, 'tailor-' + elementId );
                }
            }, this );
        }, this );
    },

	/**
	 * Copies the set of CSS rules associated with a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 * @param newElementId
	 * @returns {Array}
	 */
    copyRules : function( elementId, newElementId ) {
        var rules = [];
        for ( var i = 0; i < this.sheet.cssRules.length; i++ ) {
            var rule = this.sheet.cssRules[ i ];
            if ( rule.selectorText && rule.selectorText.indexOf( elementId ) > -1 ) {
                rules.push( {
                    selectors : rule.selectorText.replace( new RegExp( elementId, "g" ), newElementId ),
                    declarations : rule.style.cssText
                } );
            }
        }
        return rules;
    },

	/**
	 * Deletes the set of CSS rules associated with a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 */
    deleteRules : function( elementId ) {
        for ( var i = 0; i < this.sheet.cssRules.length; i++ ) {
            var rule = this.sheet.cssRules[ i ];
            if ( rule.selectorText && rule.selectorText.indexOf( elementId ) > -1 ) {
                Tailor.CSS.deleteRule( this.sheet, i );
                i--;
            }
        }
    },

	/**
	 * Clears all dynamic CSS rules contained in the stylesheet.
	 *
	 * @since 1.0.0
	 */
    clearRules : function() {
        for ( var i = 0; i < this.sheet.cssRules.length; i++ ) {
            Tailor.CSS.deleteRule( this.sheet, i );
            i--;
        }
    }
};

module.exports = Stylesheet;