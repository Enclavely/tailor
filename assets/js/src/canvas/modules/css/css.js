var Stylesheet = require( './stylesheet' ),
	CSSModule;

CSSModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onBeforeStart : function( options ) {
        this.stylesheets = [];
	    this.collection = app.channel.request( 'canvas:elements' );
	    
        this.createSheets( options.mediaQueries || {} );
        this.addRules( options.cssRules || {} );
        this.addEventListeners();

	    /**
	     * Fires when the CSS module is initialized.
	     *
	     * @since 1.5.0
	     *
	     * @param this
	     */
	    app.channel.trigger( 'module:css:ready', this );
    },

	/**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
		
		this.listenTo( app.channel, 'css:add', this.addRules );         // Add CSS for an element (or elements)
        this.listenTo( app.channel, 'css:delete', this.deleteRules );   // Delete CSS rules for an element/setting (or elements)
        this.listenTo( app.channel, 'css:update', this.updateRules );   // Update the CSS for a given element
		this.listenTo( app.channel, 'css:copy', this.copyRules );       // Copy the CSS for one element/setting to another
		this.listenTo( app.channel, 'css:clear', this.clearRules );     // Clear all dynamic CSS rules
		this.listenTo( this.collection, 'destroy', this.onDestroy );

		app.channel.reply( 'canvas:css', this.getRules.bind( this ) );
	},

	getRules: function() {
		var rules = {};
		for ( var queryId in this.stylesheets ) {
			if ( this.stylesheets.hasOwnProperty( queryId ) ) {
				rules[ queryId ] = this.stylesheets[ queryId ].getAllRules();
			}
		}
		return rules;
	},

	/**
	 * Creates a new stylesheet.
	 *
	 * @since 1.5.0
	 * 
	 * @param id
	 * @param min
	 * @param max
	 * @returns {*}
	 */
	createSheet : function( id, min, max ) {
		var media = 'only screen';
		if ( min ) {
			media += ' and (min-width: ' + min + ')';
		}
		if ( max ) {
			media += ' and (max-width: ' + max + ')';
		}
		return new Stylesheet( id, media );
	},

	/**
	 * Creates a stylesheet for each registered media query.
	 *
	 * @since 1.0.0
	 *
	 * @param mediaQueries
	 */
	createSheets : function( mediaQueries ) {
		_.each( mediaQueries, function( atts, id ) {
			if ( ! _.isEmpty( atts.min ) ) {
				if ( ! _.isEmpty( atts.max ) ) {
					this.stylesheets[ id + '-up' ] = this.createSheet( id + '-up', atts.min );
					this.stylesheets[ id ] = this.createSheet( id, atts.min, atts.max );
				}
				else {
					this.stylesheets[ id ] = this.createSheet( id, atts.min );
				}
			}
			else  {
				if ( ! _.isEmpty( atts.max ) ) {
					this.stylesheets[ id ] = this.createSheet( id, null, atts.max );
				}
				else {
					this.stylesheets[ id ] = this.createSheet( id );
				}
			}
		}, this );

		/**
		 * Fires when stylesheets have been created.
		 *
		 * @since 1.5.0
		 *
		 * @param this
		 */
		app.channel.trigger( 'module:css:stylesheets:ready', this );
	},

	/**
	 * Returns the stylesheet with the given ID (media query type).
	 * 
	 * @since 1.5.0
	 * 
	 * @param id
	 */
	getSheet : function( id ) {
		if ( this.stylesheets.hasOwnProperty( id ) ) {
			return this.stylesheets[ id ];
		}
		return false;
	},

	/**
	 * Adds CSS rules for each registered media query.
	 *
	 * @since 1.0.0
	 *
	 * @param cssRules
	 */
    addRules : function( cssRules ) {
		for ( var queryId in cssRules ) {
			if ( cssRules.hasOwnProperty( queryId ) ) {
				if ( this.stylesheets.hasOwnProperty( queryId ) ) {
					this.stylesheets[ queryId ].addRules( cssRules[ queryId ] );
				}
			}
		}
    },

	/**
	 * Clears all dynamic CSS rules.
	 *
	 * @since 1.0.0
	 */
    clearRules : function() {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {
                this.stylesheets[ queryId ].clearRules();
            }
        }
    },

	/**
	 * Copies the CSS rules associated with a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 * @param newElementId
	 */
    copyRules : function( elementId, newElementId ) {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {

	            // Get rules for the existing element
	            var rules = this.stylesheets[ queryId ].getRules( elementId );
	            if ( rules.length ) {

		            // Update the selector strings
		            for ( var rule in rules ) {
			            if ( rules.hasOwnProperty( rule ) ) {
				            rules[ rule ].selectors = rules[ rule ].selectors.replace( new RegExp( elementId, "g" ), newElementId );
			            }
		            }

		            // Generate a new rule set and add them to the stylesheet
		            var rulesSet = {};
		            rulesSet[ queryId ] = {};
		            rulesSet[ queryId ][ newElementId ] = rules;
		            this.addRules( rulesSet );
	            }
            }
        }
    },

	/**
	 * Deletes the CSS rules associated with a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 * @param settingId
	 */
    deleteRules : function( elementId, settingId ) {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {
                this.stylesheets[ queryId ].deleteRules( elementId, settingId );
            }
        }
    },

	/**
	 * Replaces the CSS rules for a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 * @param cssRules
	 */
    updateRules : function( elementId, cssRules ) {
        this.deleteRules( elementId );
        this.addRules( cssRules );
	},

	/**
	 * Clears all rules for this stylesheet when the element collection is reset.
	 *
	 * @since 1.5.0
	 */
	onReset: function() {
		this.clearRules();
	},

	/**
	 * Deletes the rules associated with an element when it is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 */
	onDestroy : function( model ) {
		this.deleteRules( model.get( 'id' ) );
	}

} );

module.exports = CSSModule;