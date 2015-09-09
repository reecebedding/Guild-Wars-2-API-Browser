(function(angular){
	var module = angular.module("apiBrowser", ["ngResource"]);

	module.controller("browserController", ["$scope", "$http", "$window", "$resource", function($scope, $http, $window, $resource){

		CreateServices($resource);

		$scope.versions = ["v1", "v2"];
		$scope.selectedVersion = "v2";
		
		$scope.endpoints = v2ApiStaticData.endpoints;
		$scope.selectedEndpoint = {};


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

		function CreateServices($resource){
				
		}
	}]);
})(window.angular);
