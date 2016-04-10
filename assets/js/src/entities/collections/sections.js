/**
 * Tailor.Collections.Section
 *
 * The section collection.
 *
 * @augments Backbone.Collection
 */
var $ = Backbone.$,
	SectionCollection;

SectionCollection = Backbone.Collection.extend( {
	model : require( '../models/section' )
} );

module.exports = SectionCollection;