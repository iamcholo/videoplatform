define(['angular','jquery'],function(angular,jquery){
 	angular.module('app.controllers.media', [])
 	.controller('MediaNewCtrl', 
	[ '$scope','$state','$translate','$stateParams','Tags','Category','MediaAlbum','Media',
	  function ($scope,$state,$translate,$stateParams,Tags,Category,MediaAlbum,Media) 
	  {

	  	
	  	$scope.model = {
	  		'title':'',
	  		'id':0,
	  		'image':'',
	  		'categories_lists': [], 
	  		'tags_lists': [], 
	  	} 
	  	$scope.progress = 0;
	  	$scope.image = null;
	  	$scope.tags = [];
		$scope.todos = [];
		$scope.tags = [];
		$scope.makeTodos = function()
		{
			
		    Category.list().then(function successCallback(response)
		    {
		    	angular.forEach(response.data, function(value, key){

	         			checked =  $scope.model.categories_lists.filter(function(item){
				              	return item.id === value.id;
				          	});
					     			
					 	this.push({
				        	id: value.id,
					        title: value.name,
					        status: value.publish,
					        checked: checked.length > 0,
					        created: value.created,
					        modified: value.modified,
				      	});
			      	},$scope.todos);
        	}, function errorCallback(response) {});
        	Tags.list().then(function successCallback(response)
		    {
		    	angular.forEach(response.data, function(value, key){

	         			checked =  $scope.model.tags_lists.filter(function(item){
				              	return item.id === value.id;
				          	});
					     			
					 	this.push({
				        	id: value.id,
					        title: value.name,
					        status: value.publish,
					        checked: checked.length > 0,
					        created: value.created,
					        modified: value.modified,
				      	});
			      	},$scope.tags);
        	}, function errorCallback(response) {});
		};
		$scope.makeTodos();
	  	$scope.Save = function()
	  	{
          	$scope.model.categories_lists = $scope.todos.filter(function(item){        
              return item.checked === true;
          	});

          	$scope.model.tag_lists = $scope.tags.filter(function(item){        
              return item.checked === true;
          	});
		  

		 	Media.Save($scope.model).then(function successCallback(response)
		    {
		    	$state.go('root.media_edit',{'id':response.data.id});

		    }, function errorCallback(response) {});;;
		}

		$scope.Redirect = function()
	  	{
	  		

	  		$state.go('root.media_edit',{'id':$scope.model.id});
		}

	}]).controller('MediaEditCtrl', 
	[ '$scope','$state','$translate','$stateParams','Tags','Category','MediaAlbum','Media',
	  function ($scope,$state,$translate,$stateParams,Tags,Category,MediaAlbum,Media) 
	  {

	  	
	  	$scope.model = {
	  		'title':'',
	  		'content':'',
	  		'image':'',
	  		'tags_lists': [],
	  		'categories_lists': [], 
	  	} 
	  	$scope.image = null;
		$scope.tags = [];
		$scope.todos = [];
	  	Media.Get( $stateParams.id ).then(function successCallback(response){
	  			$scope.model.title = response.data.title;
	  			$scope.model.image = response.data.image;
	  			$scope.model.content = response.data.content;
	  			$scope.model.tags_lists = response.data.tags_lists;	 	
	  			$scope.model.album_lists = response.data.albums_lists;	 			
	  			$scope.makeTodos();

			}, function errorCallback(response) {});
	  	

		$scope.makeTodos = function()
		{
		
			
        	Tags.list().then(function successCallback(response)
		    {
		    	angular.forEach(response.data, function(value, key){

	         			checked =  $scope.model.tags_lists.filter(function(item){
				              	return item.id === value.id;
				          	});
					     			
					 	this.push({
				        	id: value.id,
					        title: value.name,
					        status: value.publish,
					        checked: checked.length > 0,
					        created: value.created,
					        modified: value.modified,
				      	});
			      	},$scope.tags);
        	}, function errorCallback(response) {});
        	Category.list().then(function successCallback(response)
		    {
		    	angular.forEach(response.data, function(value, key){

	         			checked =  $scope.model.categories_lists.filter(function(item){
				              	return item.id === value.id;
				          	});
					     			
					 	this.push({
				        	id: value.id,
					        title: value.name,
					        status: value.publish,
					        checked: checked.length > 0,
					        created: value.created,
					        modified: value.modified,
				      	});
			      	},$scope.todos);
        	}, function errorCallback(response) {});
        	
		};

	  	$scope.Save = function()
	  	{

          	$scope.model.categories_lists = $scope.todos.filter(function(item){        
              return item.checked === true;
          	});

          	$scope.model.tag_lists = $scope.tags.filter(function(item){        
              return item.checked === true;
          	});

		  	$scope.model.id = $stateParams.id;

		 	Media.Update($scope.model);
		}

	}])
  
});


