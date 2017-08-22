var SnapshotCollection = Backbone.Collection.extend( {

    /**
     * The maximum number of history entries to store.
     *
     * @since 1.0.0
     */
	maxSize : 50,

    /**
     * The active history entry.
     *
     * @since 1.0.0
     */
    active : null,

    /**
     * The attribute by which entries in the collection are sorted.
     *
     * @since 1.0.0
     */
    comparator : function( model ) {
        return - model.get( 'timestamp' );
    },

    /**
     * Initializes the history entry collection.
     *
     * @since 1.0.0
     */
	initialize: function() {
        this.addEventListeners();
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'add', this.checkLength );
        this.listenToOnce( app.channel, 'canvas:initialize', function() {
            this.save( window._l10n.initialized );
        } );
    },

    /**
     * Saves the current element collection as a history entry.
     *
     * @since 1.0.0
     *
     * @param label
     */
    save : function( label ) {

        // If the active entry exists and is not the latest one, remove subsequent entries
        if ( this.active ) {
            var activePosition = this.indexOf( this.active );
            if ( activePosition > 0 ) {
                this.remove( this.slice( 0, activePosition ) );
            }
        }

        var models = app.channel.request( 'canvas:elements' );
        var templates = app.channel.request( 'canvas:templates' );
        var css = app.channel.request( 'canvas:css' );

        console.log( models, templates, css );

        // Add the new entry to the collection
        var entry = this.add( {
            label : label || '',
            elements : models ? models.toJSON() : [],
            templates: templates,
            css: css,
            time : this.getTime(),
            timestamp : _.now()
        } );

	    this.setActive( entry );
    },

    /**
     * Returns the current time as a formatted string.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    getTime : function() {
        var date = new Date();
        var hours = date.getHours();
        var separator = ':';
        var suffix;

        if ( hours > 12 ) {
            hours -= 12;
            suffix = ' PM';
        }
        else {
            suffix = ' AM';
        }

        return (
            hours + separator +
            ( '0' + date.getMinutes() ).slice( -2 ) + separator +
            ( '0' + date.getSeconds() ).slice( -2 ) + suffix
        );
    },

    /**
     * Restores a given history entry.
     *
     * @since 1.0.0
     *
     * @param timestamp
     */
    restore : function( timestamp ) {
        var entry = this.findWhere( { timestamp : timestamp } );
        if ( ! entry || entry === this.getActive() ) {
            return;
        }

        this.setActive( entry );
        var elements = entry.get( 'elements' );
        var templates = entry.get( 'templates' );
        var css = entry.get( 'css' );

        /**
         * Fires when the element collection is reset.
         *
         * @since 1.0.0
         *
         * @param elements
         */
        app.channel.trigger( 'elements:reset', elements, templates, css );
    },

    /**
     * Restores the previous history entry.
     *
     * @since 1.0.0
     */
    undo : function() {
        if ( ! this.length ) {
            return;
        }

        var entry = this.at( this.indexOf( this.getActive() ) + 1 );
        if ( entry ) {
            this.restore( entry.get( 'timestamp' ) );
        }
    },

    /**
     * Restores the next history entry.
     *
     * @since 1.0.0
     */
    redo : function() {
        if ( ! this.length ) {
            return;
        }

        if ( 0 === this.indexOf( this.getActive() ) ) {
            return;
        }
        
        var entry = this.at( this.indexOf( this.getActive() ) - 1 );

        if ( entry ) {
            this.restore( entry.get( 'timestamp' ) );
        }
    },

    /**
     * Removes the oldest entry from the collection if it reaches it's maximum length.
     *
     * @since 1.0.0
     */
    checkLength : function() {
        if ( this.length > this.maxSize ) {
            this.pop();
        }
	},

    /**
     * Sets the given entry as active.
     *
     * @since 1.0.0
     *
     * @param model
     */
    setActive : function( model ) {
        this.active = model;
        this.trigger( 'change:active', model );
    },

    /**
     * Returns the active entry.
     *
     * @since 1.0.0
     *
     * @returns {null}
     */
    getActive : function() {
        return this.active;
    }

} );

module.exports = SnapshotCollection;
