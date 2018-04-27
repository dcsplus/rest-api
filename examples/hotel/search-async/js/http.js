"use strict";

var http = http || new Http();

function Http() {

	/*---variables---*/
	// application id
	this.id = "application1_test",

	// application token
	this.token = {
	  	ts: null,
	  	value: null
	},

	/*---methods---*/

	/** 
	 * get request 
	 * return jquery Promise interface (http://api.jquery.com/category/deferred-object/)
	*/ 
	this.get = function($url, $data, $callback){

		var requrl = url.base + $url + "?applicationId=" + this.id + "&timestamp=" + tb.timestamp();
		var self = this;

		this.getToken().then(
			function(tokendata){

				if($data){
					var uri = encodeURIComponent(requrl+'&'+$data);
				}else{
					var uri = encodeURIComponent(requrl);
				}
				
				return self.hash("GET", uri, {});

			}).then(function(hashkey){

			var headers = {
		        'x-hash': hashkey,
		        'Authorization' : self.token.value
		    };
			return $.ajax({
				url : requrl,
				method : "GET",
				data: $data,
				headers: headers,
			});
			
		}).then(function(response){
			// call user defined callback
			$callback(response);
		});
	},

	/** 
	 * post request 
	 * return jquery Promise interface (http://api.jquery.com/category/deferred-object/)
	*/ 
	this.post = function($url, $data, $callback){
		return this.request("POST", $url, $data, $callback);
	},

	/** 
	 * patch request 
	 * return jquery Promise interface (http://api.jquery.com/category/deferred-object/)
	*/ 
	this.patch = function($url, $data, $callback){
		return this.request("PATCH", $url, $data, $callback);
	},

	/** 
	 * delete request 
	 * return jquery Promise interface (http://api.jquery.com/category/deferred-object/)
	*/ 
	this.delete = function($url, $data, $callback){
		return this.request("DELETE", $url, $data);
	},

	/** 
	 * http request 
	 * return jquery Promise interface (http://api.jquery.com/category/deferred-object/)
	*/ 
	this.request = function($method, $url, $data, $callback) {

		// compose request url for dynapack
		var requrl = url.base + $url + "?applicationId=" + this.id + "&timestamp=" + tb.timestamp();

		var self = this;
		// run request
		return this.getToken().then(
			function(tokendata){
				return self.hash($method, encodeURIComponent(requrl), $data)
			}).then(function(hashkey){

			// add dynapack application specific headers		
			var headers = {
		        'x-hash': hashkey,
		        'Authorization' : self.token.value
		    };
			return $.ajax({
				url : requrl,
				method : $method,
				data: $data,
				headers: headers,
			});
		}).then(function(response){
			// call user defined callback
			$callback(response);
		});
	}

	/** 
	 * generate hash for comunication 
	 * return jquery Promise interface (http://api.jquery.com/category/deferred-object/)
	*/ 
	this.hash = function($method, $url, $data){
		return $.ajax({
			url : url.hash + "?url=" + $url,
			method : $method,
			data: $data
		});
	},

	/** 
	 * generate token if needed
	 * return jquery Promise interface (http://api.jquery.com/category/deferred-object/)
	*/ 
	this.getToken = function(){

		var response;

		// if token was not generated or is about to expire
		if(!this.token.value || tb.timestamp() - this.token.ts > 1600) {

			this.token.ts = tb.timestamp();
			var requrl = url.base + url.generate + "?applicationId=" + this.id + "&timestamp=" + this.token.ts;

			var self = this;

			response = this.hash("GET", encodeURIComponent(requrl), {}).then(function(hashkey){
				var headers = {
			        'x-hash': hashkey
			    };
				return $.ajax({
					url : requrl,
					method : "GET",
					headers: headers,
				}).then(function(data){
					self.token.value = data.Object.Value;
					return self.token.value;
				});
			});
			

		}else{

			// if token is already generated then just return it's value
			response = $.Deferred();
			var data = {
				"Status":1,
				"Succeded":0,
				"Failed":0,
				"Message":"Success!",
				"Object":{
					"Value":this.token.value,
					"TTL":1800,
					"Lifes":100
				}
			};
			response.resolve(data);

		}

		return response;
	}
}