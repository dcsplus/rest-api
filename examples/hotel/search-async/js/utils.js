"use strict";

var tb = tb || new toolbox();

function toolbox() {
	
	/*---variables--- */
	this.STRIP_COMMENTS_REGEX = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	/*---methods--- */

	// get current timestamp
	this.timestamp = function(){
	  	return Math.floor(Date.now() / 1000);
	},
	
	this.error = function (error){
	    if(console){
	        console.error(error);
	    }else{
	        var txt="There was an error on this page.\n\n";
	        txt+="Error description: " + error.message + "\n\n";
	        txt+="Click OK to continue.\n\n";
	        alert(txt);
	    }
	    return false;
	}

	// validate params against desired defaults
	this.validateParams = function (params, defaults){
	    try{
	        if (params instanceof Array) {
	            for (var i=0; i < params.length; i++){
	                if(typeof params[i] == 'undefined'){
	                    throw "invalid parameter no " + i + " in " + arguments.callee.caller.name;
	                }
	            }
	            return true;
	        }else{
	            if(typeof params != 'undefined'){
	                return params;
	            }else{
	                if(typeof defaults != 'undefined'){
	                    return params = defaults;
	                }
	                throw "invalid parameter in "
	                + arguments.callee.caller.name
	                + ' with params: ' + this.getParamNames(arguments.callee.caller);
	            }
	        }
	    }catch(e){
	        return this.error(e);
	    }
	}


	this.getParamNames = function (func) {
	    var fnStr = func.toString().replace(this.STRIP_COMMENTS_REGEX, '')
	    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g)
	    if(result === null)
	        result = []

	    var args = Array.slice(func.arguments)
	    .map(function(el){
	        return el.selector;
	    });
	    if(result.length > 0){
	        var response = new Object();
	        var property;
	        var value;
	        for (var i=0; i < result.length; i++){
	            property = result[i];
	            if(this.validateParams(args[i],false)){
	                value=args[i];
	            }else{
	                value = null;
	            }
	            response[property] = value;
	        }
	        return JSON.stringify(response);
	    }

	    return result;
	}

}