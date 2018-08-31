jQuery(document).ready(function($) {
	"use strict";

	// if config is defined
	if(typeof config != 'undefined') {

		// use this global value, to store the time field selection, to set it as default on the update field events.
		var time_selected = null;
		
		// disable auto complete, don't seem to work
		// $(config.datepickerId).attr("autocomplete", "off");

		// get the placeholder value
		var placeholderValue = getPlaceholder();

		// trigger on datepicker change, before gform_post_render was ever triggered
		$(config.datepickerId).change(function() {
			timeSelectUpdate();
		});

		// trigger form on form render => This includes initial form load, going to the next/previous page on multi-page forms, form rendered with validation errors, confirmation message displayed, etc.
		// https://docs.gravityforms.com/gform_post_render/
		$(document).bind('gform_post_render', function() {
			
			// check if datepicker have a valid date
			if($(config.datepickerId).datepicker("getDate") === null) {
				// console.log("not a valid date");
				// Not a valid date found
			} else {
				// get datepicker date
				var date = $(config.datepickerId).datepicker({ dateFormat: 'dd/mm/yyyy' }).val();
				// update time field
				timeSelectUpdate();
			}
			
			// on datepicker change after gform_post_render was triggered.
			$(config.datepickerId).change(function() {
				timeSelectUpdate();
			});

			// update time global variable
			$(config.timeselectId).change(function() {
				time_selected = $(config.timeselectId).val();
			});

		});

		// update time global variable
		$(config.timeselectId).change(function() {
			time_selected = $(config.timeselectId).val();
		});



	}

	function timeSelectUpdate() {
		// get the date, EXPECTED dd/mm/yyyy format
		var date = $(config.datepickerId).datepicker({ dateFormat: 'dd/mm/yyyy' }).val();
		// get the number of day, starting with 0
		var day = $(config.datepickerId).datepicker('getDate').getUTCDay();
		
		var no_time_found = true;
		// console.log(day);
		timeFilters.map( function( element ) {

			// console.log(date);
			// console.log(day)
			// console.log( element(date,day) );

			// search for available time
			if( element(date,day) ) {
				// update select time form
				no_time_found = false;
				updateSelectTime(element(date, day));
			}
		});

		if(no_time_found) {
			$(config.timeselectId).empty();
		}
	}

	/**
	 * Update the select field with the times
	 */
	function updateSelectTime(numbers) {

		var placeholder = '';
		var option = '';
		var selected = true; // flag for selected value

		// populate option with all the select values
		for (var i=0;i<numbers.length;i++){

			// set option as default value
			if( time_selected != null && numbers[i] == time_selected ) {
				option += '<option selected="selected" value="'+ numbers[i] + '">' + numbers[i] + '</option>';	
				selected = false;
			} else {
				option += '<option value="'+ numbers[i] + '">' + numbers[i] + '</option>';
			}
			
		}

		// no option as default, set placeholder as default
		if(selected) {
			placeholder = '<option value selected="selected" class="gf_placeholder">' + placeholderValue + '</option>';
		} else {
			placeholder = '<option value class="gf_placeholder">' + placeholderValue + '</option>';
		}



		option = placeholder + option;

		$(config.timeselectId).empty().append(option);
	}

	/**
	 * Get the placeholder and keep it on all the inputs list
	 */
	function getPlaceholder() {
		return $(config.timeselectId).find(":selected").text();
	}


});
