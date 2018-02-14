jQuery(document).ready(function($) {
	"use strict";


	// if config is defined
	if(typeof config != 'undefined') {
		// get the placeholder value
		var placeholderValue = getPlaceholder();

		// on datepicker change
		$(config.datepickerId).change(function() {
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

		});


	}

	/**
	 * Update the select field with the times
	 */
	function updateSelectTime(numbers) {

		var option = '<option value selected="selected" class="gf_placeholder">' + placeholderValue + '</option>';

		for (var i=0;i<numbers.length;i++){
			option += '<option value="'+ numbers[i] + '">' + numbers[i] + '</option>';
		}
		$(config.timeselectId).empty().append(option);
	}

	/**
	 * Get the placeholder and keep it on all the inputs list
	 */
	function getPlaceholder() {
		return $(config.timeselectId).find(":selected").text();
	}


});
