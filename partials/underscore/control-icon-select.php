<?php

/**
 * Underscore JS template for the Select Icon dialog window content.
 *
 * @package Tailor
 * @subpackage Underscore Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<script id="tmpl-tailor-control-icon-select" type="text/html">
	<div class="dialog__container">

		<% if ( _.keys( kits ).length > 1 ) { %>
		<select class="select--icon">

			<% _.each( kits, function( kit, index ) { %>
			<option value="<%= kit.id %>"><%= kit.name %></option>
			<%  } ); %>

		</select>
		<% } %>

		<input class="search--icon" type="search" role="search" placeholder="Search">
		<div class="icon-control">

			<% var keys = _.keys( kits ); %>
			<% if ( keys.length >= 1 ) { %>
                <% var first = keys[0]; %>
                <% _.each( kits, function( kit, id ) { %>

                <div id="<%= kit.id %>" class="icon-kit <%= ( first !== id ) ? 'is-hidden' : '' %>">
                    <ul class="icon-list">

                        <% _.each( kit.icons, function( name, id ) { %>
                        <li class="icon-list__icon" title="<%= name %>">
                            <label>
                                <input type="radio" name="icon" id="icon" value="<%= id %>" <%= ( value === id ) ? checked="checked" : '' %>>
                                <i class="<%= id %>"></i>
                            </label>
                        </li>
                        <% } ) %>

                    </ul>
                </div>

                <% } ); %>
			<% } %>

		</div>
	</div>
</script>