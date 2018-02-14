#TODO:

1. 1st aproach
	[] Emulate Gravity Perks Conditional Logic Dates
	[] Emulate Gravity Perks Limit Dates
	[~] Use Regex to write the selected value to a hidden form.

2. 2nd aproach
	[X] Dynamically populate select based on logical condition field


#How to use
Add in function.php
```
function form_time_conditions() {
	ob_start();
?>

	var timeFilters = [
		function time_only_lunch(date, day) {
			var regex = new RegExp(/^15[\/-]02[\/-]2018$/);
			if( regex.test(date) )
				return ['12:00', '12:30', '13:00', '13:30', '14:00'];
			else
				return false;
		},

		function time_only_dinner(date, day) {
			var regex = new RegExp(/^14[\/-]02[\/-]2018$/);
			if( regex.test(date) )
				return ['19:00', '19:30', '20:00', '20:30', '21:00'];
			else
				return false;
		},

		function monday_only(date, day) {
			if( day == 0 )
				return ['17:00','18:00'];
			else
				return false;
		},

		function sunday_only(date,day) {
			if( day == 6 )
				return ['23:00', '23:30'];
			else
				return false;
		}
	];

<?php
	$conditions = ob_get_clean();
	// var_dump( $conditions );

	wp_add_inline_script( 'Idearia\Gf_Time_Conditional_Fieldcustom', $conditions );
	$config = ['datepickerId' => '#input_1_5', 'timeselectId' => '#input_1_4'];
	wp_localize_script( 'Idearia\Gf_Time_Conditional_Fieldcustom', 'config', $config );
}
add_action( 'wp_enqueue_scripts', 'form_time_conditions' );

```

In timeFilters you can add all the functions you want to be called on date update, but keep in mind:
 1. every function have to return false or the list of times
 2. every function must have 2 parameters `date`[dd/mm/yyy] and `day`[int from 0(monday) to 6(sunday)]
The handler for all the scripts is `Idearia\Gf_Time_Conditional_Fieldcustom`

Here is a clean Javascript example of timeFilters, you can use a js file to, and register it as a script.
```
var timeFilters = [
	function time_only_lunch(date, day) {
		var regex = new RegExp(/^15[\/-]02[\/-]2018$/);
		if( regex.test(date) )
			return ['12:00', '12:30', '13:00', '13:30', '14:00'];
		else
			return false;
	},

	function time_only_dinner(date, day) {
		var regex = new RegExp(/^14[\/-]02[\/-]2018$/);
		if( regex.test(date) )
			return ['19:00', '19:30', '20:00', '20:30', '21:00'];
		else
			return false;
	},

	function monday_only(date, day) {
		if( day == 0 )
			return ['17:00','18:00'];
		else
			return false;
	}
];

```
