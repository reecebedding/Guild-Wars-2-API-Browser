(function(angular){
	var module = angular.module("apiBrowser", ["ngResource"]);

	module.controller("browserController", ["$scope", "$http", "$window", "$resource", function($scope, $http, $window, $resource){
		$scope.versions = ["v1", "v2"];
		$scope.selectedVersion = "v2";
		
		$scope.endpoints = v2ApiStaticData.endpoints;
		$scope.selectedEndpoint = {};
        
        $scope.formattedUrl = "";
        $scope.currentData = {};
        
		$scope.LoadVersionEndpoints = function(){
			switch($scope.selectedVersion){
				case "v1":
					$scope.endpoints = v1ApiStaticData.endpoints;
					break;
				case "v2":
					$scope.endpoints = v2ApiStaticData.endpoints;
					break;
				default:	
					$scope.endpoints = v2ApiStaticData.endpoints;
					break;
			}			
		}
        
        if(localStorage.apiKey){
            $scope.rememberApi = true;
            $scope.apiKey = localStorage.apiKey;
        }else{
            $scope.rememberApi = false;
            $scope.apiKey = "";
        }
                
        $scope.RememberAPI = function(){
               if($scope.rememberApi){
                    localStorage.apiKey = $scope.apiKey;
               }else{
                   if(localStorage.apiKey){                   
                        localStorage.removeItem("apiKey");
                   }
               }
        }
        
        $scope.displayStyle = 0;
		
		$scope.SearchAPI = function(){						
			if(ValidateFields()){
				$scope.formattedUrl = "https://api.guildwars2.com" + $scope.selectedEndpoint.url;	
				
				var params = [];
				$(".parameter input").each(function(index){
					var value = $(this).val().trim();
					var name = $(this).attr('data-fieldname').trim();
					if(value.length > 0){
						params.push(name + "=" + value);
					}
				});

				if(params.length > 0){
					$scope.formattedUrl = $scope.formattedUrl + "?" + params.join('&');
				}

				var request = CreateCORSRequest($scope.formattedUrl);
				request.onload = function(){
                    $scope.currentData = JSON.parse(request.responseText);
                    $scope.RenderData($scope.currentData);
				};
				request.onerror = function(){
				};			
				request.send();
			}
		}
        
        $scope.RenderData = function(data){
                $("#apiData").text("");            
                var dataMarkup = "";
                    
                if(!$.isEmptyObject(data)){            
                    if($scope.displayStyle == 0){
                        //Display raw JSON
                        dataMarkup = "<pre>" + JSON.stringify(data,null,"    ") + "</pre>";
                    }else if($scope.displayStyle == 1){
                        //Display as collapsable JSON
                        renderjson.set_icons('+', '-');
                        renderjson.set_show_to_level(2);
                        dataMarkup = renderjson(data);                                        
                    }
                }
                $("#apiData").append(dataMarkup);
        }

		$scope.anyFieldErrors = false;
		function ValidateFields(){
			var valid = true;
			if($("#apiVersion option:selected").text().trim().length == 0){
				$("#apiVersion").parent().addClass('has-error');
				valid = false;
			}else{
				$("#apiVersion").parent().removeClass('has-error');
			}
			if($("#apiEndpoint option:selected").text().trim().length == 0){
				$("#apiEndpoint").parent().addClass('has-error');
				valid = false;
			}else{
				$("#apiEndpoint").parent().removeClass('has-error');
			}
			$(".parameter input").each(function(index){
				if($(this).attr('data-fieldrequired') == "true"){
					if($(this).val().trim().length == 0){
						$(this).parent().addClass('has-error');
						valid = false;
					}else{
						$(this).parent().removeClass('has-error');
					}
				}
			});
			$scope.anyFieldErrors = !valid;
			return valid;
		}		

		function CreateCORSRequest(url){
			var request = new XMLHttpRequest();
			if("withCredentials" in request){
				request.open('GET', url, true);
			}else if (typeof XDomainRequest != "undefined"){
				//IE support
				request = new XDomainRequest();
				request.open('GET', url);
			}else{
				//We cant make a CORS request
				request = null;
			}
			return request;
		}
	}]);
})(window.angular);
