(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
( function( tinymce, $ ) {

    'use strict';

    tinymce.create( 'tinymce.plugins.tailoricon', {

	    /**
	     * Adds the icon button and action to the WordPress editor.
	     *
	     * @since 1.0.0
	     *
	     * @param ed
	     * @param url
	     */
        init : function( ed, url ) {

		    // Add the button
            ed.addButton( 'tailoricon', {
                title  : ed.getLang( 'tailoricon.title' ),
                icon : 'wp_code',
                cmd : 'tailor:add:icon'
            } );

		    // Add the command/action
            ed.addCommand( 'tailor:add:icon', function() {
                var content = ed.selection.getContent();

	            /**
	             * Opens the icon selection dialog.
	             *
	             * @since 1.0.0
	             */
	            app.channel.trigger( 'dialog:open', {
		            title : ed.getLang( 'tailoricon.title' ),
		            button : ed.getLang( 'tailoricon.select' ),

		            /**
		             * Returns the content for the Select Icon dialog.
		             *
		             * @since 1.0.0
		             *
		             * @returns {*}
		             */
		            content : function() {
			            var kits = window._kits || {};
			            if ( _.keys( kits ).length ) {
				            return _.template( document.getElementById( 'tmpl-tailor-control-icon-select' ).innerHTML)( {
					            kits : kits,
					            value : ''
				            } );
			            }
			            return document.getElementById( 'tmpl-tailor-control-icon-empty' ).innerHTML;
		            },

		            /**
		             * Adds the required event listeners to the dialog window content.
		             *
		             * @since 1.0.0
		             */
		            onOpen : function() {
			            var $el = this.$el;
			            var $li = $el.find( 'li' );
			            var $kits = $el.find( '.icon-kit' );

			            this.$el.find( '.search--icon' ).on( 'input', function( e ) {
				            var term =  this.value.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );
				            term = term.replace( / /g, ')(?=.*' );
				            var match = new RegExp( '^(?=.*' + term + ').+', 'i' );

				            $li.each( function() {
					            this.classList.toggle( 'is-hidden', ! match.test( this.getAttribute( 'title' ) ) );
				            } );
			            } );

			            this.$el.find( '.select--icon' ).on( 'change', function( e ) {
				            var kit = this.value;
				            $kits
					            .removeClass( 'is-hidden' )
					            .filter( function() {
						            return this.id != kit;
					            } )
					            .addClass( 'is-hidden' );
			            } );
		            },

		            /**
		             * Returns true if an icon has been selected.
		             *
		             * @since 1.0.0
		             *
		             * @returns {*}
		             */
		            onValidate : function() {
			            return $( 'input[name=icon]:checked' ).val();
		            },

		            /**
		             * Inserts the selected icon into the editor.
		             *
		             * @since 1.0.0
		             */
		            onSave : function() {
			            var icon = '<i class="tailor-icon mceNonEditable ' + $( 'input[name=icon]:checked' ).val() + '"></i>';
			            ed.execCommand( 'mceInsertContent', 0, '<span>' + icon + '&nbsp;&nbsp;' + content + '</span><br>' );
		            },

		            /**
		             * Cleans up event listeners.
		             *
		             * @since 1.0.0
		             */
		            onClose : function() {
			            this.$el.find( '.search--icon' ).off( 'input' );
		            }
	            } );
            } );
        }
    } );

	// Add the icon selector plugin
    tinymce.PluginManager.add( 'tailoricon', tinymce.plugins.tailoricon );

} ) ( tinymce, jQuery );

},{}]},{},[1]);
