/**
 * Ensures a string does not contain numeric values.
 *
 * @since 1.7.2
 *
 * @param string
 * @returns {*|void|{style, text, priority, click}|XML}
 */
window.tailorValidateString = function( string ) {
	return string.replace( /[0-9]/g, '' );
};

/**
 * Ensures a string contains only numeric values.
 *
 * @since 1.7.2
 *
 * @param string
 * @returns {*|void|{style, text, priority, click}|XML}
 */
window.tailorValidateNumber = function( string ) {
	string = string.replace( /[^0-9,.]+/i, '' );
	return ! _.isEmpty( string ) ? string : '0';
};

/**
 * Ensures a hex or RGBA color value is valid.
 *
 * Since 1.7.2
 *
 * @param color
 * @returns {*}
 */
window.tailorValidateColor = function( color ) {
	if ( /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test( color ) ) {
		return color;
	}
	if ( isRGBA( color ) ) {
		return color;
	}
	return '';
};

/**
 * Returns true if the given color is RGBA.
 *
 * @since 1.7.2
 *
 * @param color
 * @returns {boolean}
 */
function isRGBA( color ) {
	return /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/.test( color )
}

/**
 * Ensures a string contains a valid numeric value and unit.
 *
 * @since 1.7.2
 *
 * @param value
 * @returns {string}
 */
window.tailorValidateUnit = function( value ) {
	var sign = '';
	if ( '-' == value.charAt( 0 ) ) {
		sign = '-';
		value = value.substring( 1 );
	}
	return ( sign + tailorValidateNumber( value ) + getUnit( value ) );
};

/**
 * Returns the unit within a given string.
 *
 * @since 1.7.2
 *
 * @param string
 * @returns {*}
 */
function getUnit( string ) {
	var map = [
		"px",
		"%",
		"in",
		"cm",
		"mm",
		"pt",
		"pc",
		"em",
		"rem",
		"ex",
		"vw",
		"vh"
	];
	var matches = string.match( new RegExp( map.join( '|' ) ) );
	if ( matches ) {
		return matches[0];
	}
	return 'px';
}