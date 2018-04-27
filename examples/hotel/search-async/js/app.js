"use strict";

var app = app || new application() ;

function application() {
  
  /*---variables--- */
  // our search container
  this.container = "dyno_container",

  /*---methods--- */
  // search hotel async method
  this.search = function() {


    // show loader and progress-bar
    $("#progress-bar-status").width('0%');
    $("#progress-bar-status-label").html('0');
    $('#list').html('');
    $("#loader").show();
    $("#progress-bar").show();

  	
    // get search data 
    var data = $('#search').serialize();

  	var self = this;
    // start search request
  	http.get(url.search, data, function(data){

  		// get response
  		var response = data[self.container][0];

  		// if status is running (the search request started) or completed ( in case the search was made before)
      // we continue to make hotels list request until the search is completed
  		if(response.Status == 2 || response.Status == 1){

        /*local variables*/
        // mark as not completed
  			var completed = false;
        // overall progress status
        var status = 1;
        // number of retries until we mark search as completed
        // there are situations when code property is not set from the firsts requests if the search request take longer
        var retries = 5;

        // function to make search summary info call to get search progress
  			var summary = function($code){

          // compose request data
  				var data = 'code='+$code+'&summary=true';
          
          // run hotels search summary
  				http.get(url.hotels, data, function(data){

            // if summary is not available it means the search was made before and is completed
            // if summary is available and the proggress is 100% then search is finnished
  					if( !data.summary || data.summary.progress == 100){

              // mark as completed
              completed = true;
              $("#progress-bar-status").width('100%');
              $("#progress-bar-status-label").html('100');

              // get final hotels
              hotels($code);

  					}else{

              // if search is not completed then update progress
              $("#progress-bar-status").width(data.summary.progress+'%');
              $("#progress-bar-status-label").html(data.summary.progress);

              // if progress has changed then refresh list with the new hotels
              if(status < data.summary.progress){
                // render intermediar page here
                // !!! here we can do a check as an optimisation to see if hotels are already in page !!!
                listing.render(data._embedded.hotels);
                status = data.summary.progress;
              }

              // continue with another summary check to get updated progress
  						summary($code);

  					}

  				});

  			};

        // function to get search result code on base which we will make all request for getting the list
        var getcode = function(rid){ 

          // run request
          http.get(url.sid+rid, '', function(data){
            
            // get the search code
            if(data.code){

              // if there is a code then we can make our summary check
              summary(data.code); 

            }else{

              // if there is no code property then we make some number of retries to make sure code property wont come ever :)
              if(retries > 0){

                // make a delay between requests
                setTimeout(getcode(rid), 721);
                retries--;

              }else{
                // if still no code then that's it: no results
                listing.render([]);
                return;
              }

            }
            
          });

        };

        // function to get hotels based on result search code
        var hotels = function($code){

          // compose request data
          var data = 'code='+$code+'&page=1';

          // run request
          http.get(url.hotels, data, function(data){
            // render first page here
            // console.log(data);
            listing.render(data._embedded.hotels);
          });
        };

        // get search result code based on our search (SID = search identifier)
        getcode(response.Id);

  		} else { 
        //status is failed and we render some alert message 
        $('#list').html('<div class="alert alert-warning" role="alert">No hotels found! Please try again latter!</div>');

      }
  	});

  }

}

