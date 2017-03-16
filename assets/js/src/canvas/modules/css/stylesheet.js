/**
 * Stylesheet object for managing CSS.
 *
 * @param id
 * @param media
 * @constructor
 */
function Stylesheet( id, media ) {
    this.id = id;

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
		this.lookup = [];
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
	 * @since 1.5.0
	 *
	 * @param ruleSet
	 */
    addRules : function( ruleSet ) {
		for ( var elementId in ruleSet ) {
			if ( ruleSet.hasOwnProperty( elementId ) ) {
				this.lookup = this.lookup || [];

				// Add rules for each element
				for ( var i in ruleSet[ elementId ] ) {
					if ( ruleSet[ elementId ].hasOwnProperty( i ) ) {
						this.addRule( elementId, ruleSet[ elementId ][ i ] );
					}
				}
			}
		}
	},

	/**
	 * Adds a rule to the stylesheet.
	 *
	 * @since 1.7.3
	 *
	 * @param elementId
	 * @param rule
	 */
	addRule : function( elementId, rule ) {
		if ( this.checkRule( rule ) ) {
			var selectors = Tailor.CSS.parseSelectors( rule['selectors'], elementId );
			var declarations = Tailor.CSS.parseDeclarations( rule['declarations'] );

			if ( ! _.isEmpty( declarations ) ) {
				var settingId = rule['setting'];

				// this.deleteRules( elementId, settingId );

				// Add the rule to the stylesheet and lookup array
				Tailor.CSS.addRule( this.sheet, selectors, declarations, this.lookup.length );
				
				this.lookup.push( {
					elementId: elementId,
					settingId: settingId
				} );
			}
		}
	},

	/**
	 * Returns true if the rule is properly formatted.
	 *
	 * @since 1.7.3
	 *
	 * @param rule
	 * @returns {*|Boolean}
	 */
	checkRule : function( rule ) {
		return _.has( rule, 'selectors' ) &&
		       _.has( rule, 'declarations' ) &&
		       _.has( rule, 'setting' );
	},

	/**
	 * Gets the rules for a given element.
	 *
	 * @since 1.5.0
	 *
	 * @param elementId
	 * 
	 * @returns {Array}
	 */
	getRules : function( elementId ) {
		var rules = [];
		for ( var i = 0; i < this.lookup.length; i++ ) {
			if ( _.has( this.lookup[ i ], 'elementId' ) && elementId == this.lookup[ i ]['elementId'] ) {
				var rule = this.sheet.cssRules[ i ];
				if ( rule.selectorText && rule.selectorText.indexOf( elementId ) > -1 ) {
					rules.push( {
						selectors : rule.selectorText,
						declarations : rule.style.cssText,
						setting: this.lookup[ i ]['settingId'] || ''
					} );
				}
			}
		}
		return rules;
	},

	getAllRules : function() {
		var rules = {};
		for ( var i = 0; i < this.lookup.length; i++ ) {
			var elementId = this.lookup[ i ]['elementId'];
			var rule = this.sheet.cssRules[ i ];
			
			rules[ elementId ] = rules[ elementId ] || [];
			rules[ elementId ].push( {
				selectors : rule.selectorText,
				declarations : rule.style.cssText,
				setting: this.lookup[ i ]['settingId'] || ''
			} );
		}
		return rules;
	},

	/**
	 * Deletes rules for a given element from the stylesheet.
	 *
	 * @since 1.5.0
	 *
	 * @param elementId
	 * @param settingId
	 */
    deleteRules : function( elementId, settingId ) {
		for ( var i = 0; i < this.sheet.cssRules.length; i++ ) {
			if ( _.has( this.lookup[ i ], 'elementId' ) && elementId == this.lookup[ i ]['elementId'] ) {
				if ( _.isEmpty( settingId ) ) {
					this.deleteRule( i );
					i--;
				}

				// Check the element and setting ID
				else {
					if ( _.has( this.lookup[ i ], 'settingId' ) && settingId == this.lookup[ i ]['settingId'] ) {
						this.deleteRule( i );
						i--;
					}
				}
			}
		}
	},

	/**
	 * Deletes a rule from the stylesheet.
	 * 
	 * @since 1.5.0
	 * 
	 * @param i
	 */
	deleteRule: function( i ) {
		Tailor.CSS.deleteRule( this.sheet, i );
		this.lookup.splice( i, 1 );
	},

	/**
	 * Deletes all rules from the stylesheet.
	 *
	 * @since 1.0.0
	 **/
    clearRules : function() {
		for ( var i = 0; i < this.sheet.cssRules.length; i++ ) {
			this.deleteRule( i );
			i--;
		}
		this.lookup = [];
    }
};

module.exports = Stylesheet;