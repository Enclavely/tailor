var $ = Backbone.$,
	SearchableCollection;

SearchableCollection = Backbone.Collection.extend( {

	/**
	 * Performs a search based on a given search term.
	 *
	 * @since 1.0.0
	 *
	 * @param value
	 */
	doSearch: function( value ) {

		// Don't do anything if we've already done this search
		if ( this.terms === value ) {
			return;
		}
		this.terms = value;

		if ( this.terms.length > 0 ) {
			this.search( this.terms );
		}

		// If search is blank, show all items
		if ( this.terms === '' ) {
			this.each( function( item ) {
				item.set( 'match', true );
			} );
		}
	},

	/**
	 * Shows or hides items based on whether they match the search criteria.
	 *
	 * @since 1.0.0
	 *
	 * @param term
	 */
	search: function( term ) {
		var match, haystack;

		// Escape the term string for RegExp meta characters
		term = term.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );

		// Consider spaces as word delimiters and match the whole string so matching terms can be combined
		term = term.replace( / /g, ')(?=.*' );

		match = new RegExp( '^(?=.*' + term + ').+', 'i' );

		this.each( function( item ) {
			haystack = this.getHaystack( item );
			item.set( 'match', match.test( haystack ) );
		}, this );
	}

} );

module.exports = SearchableCollection;
