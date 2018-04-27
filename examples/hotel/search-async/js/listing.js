"use strict";

var listing = listing || new Listing() ;

function Listing(){

	/*variables*/
	// list container
	this.container =  $('#list'),
	// hotel template
	this.template = _.template($('#hotel-tpl').html()),

	// function to render hotel list
	this.render = function($hotels){
		// empty listing container
		this.container.empty();
		$("#loader").hide();
		// if there are no hotels render some alert message
		if($hotels.length < 1){

			this.container.html('<div class="alert alert-warning" role="alert">No hotels found! Please try again latter!</div>');
		}else{

			var self = this;
			// generate a new list
			_.forEach($hotels, function(hotel) {
				// append rendered hotel to container
			  	self.container.append(self.template(hotel));
			});	
		}
		
	}

}

