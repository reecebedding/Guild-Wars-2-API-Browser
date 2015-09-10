(function(angular){
	var module = angular.module("apiBrowser", ["ngResource"]);

	module.controller("browserController", ["$scope", "$http", "$window", "$resource", function($scope, $http, $window, $resource){
		$scope.versions = ["v1", "v2"];
		$scope.selectedVersion = "v2";
		
		$scope.endpoints = v2ApiStaticData.endpoints;
		$scope.selectedEndpoint = {};

		$scope.apiData = "";

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

		$scope.SearchAPI = function(){						
			var formattedUrl = "https://api.guildwars2.com" + $scope.selectedEndpoint.url;
			$scope.apiData = "";			

			var request = CreateCORSRequest(formattedUrl);
			request.onload = function(){
				$scope.apiData = request.responseText;
				$scope.$apply();
			};
			request.onerror = function(){
			};			
			request.send();
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
