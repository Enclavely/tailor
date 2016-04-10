module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function( options ) {
        this.stylesheets = [];

        this.createSheets( options.mediaQueries || {} );
        this.addRules( options.cssRules || {} );
        this.addEventListeners();
    },

	/**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var collection = app.channel.request( 'canvas:elements' );
        this.listenTo( collection, 'destroy', this.onDestroy );

        this.listenTo( app.channel, 'css:add', this.addRules );
        this.listenTo( app.channel, 'css:update', this.updateRules );
        this.listenTo( app.channel, 'css:delete', this.deleteRules );
        this.listenTo( app.channel, 'css:clear', this.clearRules );
        this.listenTo( app.channel, 'css:copy', this.copyRules );
    },

	/**
     * Creates stylesheets for each registered media query.
     *
     * @since 1.0.0
     *
     * @param mediaQueries
     */
    createSheets : function( mediaQueries ) {
        var Stylesheet = require( './stylesheet/stylesheet' );

        _.each( mediaQueries, function( queryAtts, queryId ) {
            if ( '' != queryAtts.min ) {
                if ( '' != queryAtts.max ) {
                    this.stylesheets[ queryId ] = new Stylesheet( queryId, 'only screen and (min-width: ' + queryAtts.min + ') and (max-width: ' + queryAtts.max + ')' );
                    this.stylesheets[ queryId + '-up' ] = new Stylesheet( queryId + '-up', 'only screen and (min-width: ' + queryAtts.min + ')' );
                }
                else {
                    this.stylesheets[ queryId ] = new Stylesheet( queryId, 'only screen and (min-width: ' + queryAtts.min + ')' );
                }
            }
            else  {
                if ( '' != queryAtts.max ) {
                    this.stylesheets[ queryId ] = new Stylesheet( queryId, 'only screen and (max-width: ' + queryAtts.max + ')' );
                }
                else {
                    this.stylesheets[ queryId ] = new Stylesheet( queryId, 'only screen' );
                }
            }
        }, this );
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
    },

	/**
	 * Adds a set of dynamic CSS rules.
	 *
	 * @since 1.0.0
	 *
	 * @param cssRules
	 */
    addRules : function( cssRules ) {
        _.each( cssRules, function( queryRules, queryId ) {
            if ( queryId in this.stylesheets ) {
                this.stylesheets[ queryId ].addRules( queryRules );
            }
        }, this );
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
	 * @param originalId
	 * @param copyId
	 */
    copyRules : function( originalId, copyId ) {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {
                var rules = this.stylesheets[ queryId ].copyRules( 'tailor-' + originalId, 'tailor-' + copyId );
                if ( rules.length ) {
                    var rulesSet = {};
                    rulesSet[ queryId ] = {};
                    rulesSet[ queryId ][ copyId ] = rules;
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
	 */
    deleteRules : function( elementId ) {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {
                this.stylesheets[ queryId ].deleteRules( 'tailor-' + elementId );
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
    }

} );