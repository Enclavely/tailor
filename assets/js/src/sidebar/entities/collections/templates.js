var SearchableCollection = require( './searchable' ),
	TemplateCollection;

TemplateCollection = SearchableCollection.extend( {

	model : require( '../models/template' ),

	comparator : 'name',

	/**
	 * Returns the attributes of a model to use in a search.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @returns {string}
	 */
	getHaystack : function( model ) {
		return [
			model.get( 'id' ),
			model.get( 'label' )
		].join( ' ' );
	}

} );

module.exports = TemplateCollection;
