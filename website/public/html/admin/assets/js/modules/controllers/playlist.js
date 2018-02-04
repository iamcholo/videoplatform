define(['angular','clipboard'],function(angular,clipboard){
 	angular.module('app.controllers.playlist', [])
 	.controller('PlaylistListCtrl', 
	[ '$scope','$state','$translate','Playlist',
	  function ($scope,$state,$translate, Playlist) 
	  {

	  	$scope.filteredTodos = [];
	  	$scope.itemsPerPage = 8;
	  	$scope.currentPage = 1;
		$scope.model = {'query':''};
	  	$scope.search = function()
	  	{	if($scope.model.query.length > 0)
	  		{
	  			$scope.todos = $scope.todos.filter(function(item){
	  			re = new RegExp($scope.model.query);

				return re.test(item.title) ;
				});
				$scope.figureOutTodosToDisplay(1);
	  		}else
	  		{
	  			$scope.makeTodos(); 
	  		}
	  		
	  	}

		$scope.makeTodos = function()
		{
			$scope.todos = [];
			$scope.filteredTodos = [];
		    Playlist.list().then(function successCallback(response)
		    {
	         	angular.forEach(response.data, function(value, key){
				 	this.push({
			        	id: value.id,
				        title: value.name,
				        status: value.publish,
				        created: value.created,
				        modified: value.modified,
			      	});
			      	if(response.data.length-1 >= key)
			      	{
			      		$scope.figureOutTodosToDisplay(1);
			      	}
			      	
				},$scope.todos);
				if(response.data.length > 0)
				{
					$scope.figureOutTodosToDisplay(1);
				}
        	}, function errorCallback(response) {});


		};

		$scope.DELETE = function(id)
		{
			Playlist.Delete(id).then(function successCallback(response){
				$scope.makeTodos(); 
			}, function errorCallback(response) {});
		}

		$scope.figureOutTodosToDisplay = function(page) 
		{
		    $scope.currentPage  = page
		    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
		    var end = begin + $scope.itemsPerPage;
		    $scope.filteredTodos = $scope.todos.slice(begin, end);
		    //reset items each pagination
		 
	    	if($scope.HasallItems!=null)
	    	{
	      		$scope.HasallItems = false;
	    	}
	  	};

		$scope.makeTodos();
		$scope.pageChanged =  function(page) 
		{
		  $scope.figureOutTodosToDisplay(page);
		};

	}]).controller('PlaylistEditCtrl', 
	[ '$scope','$state','$translate','$stateParams','Playlist',
	  function ($scope,$state,$translate,$stateParams,Playlist) 
	  {

	  	$scope.model = { 
	  		'name':'', 
	  		'publish': true,
	  		'slug':'',
	  		'meta_title':'',
	  		'meta_description':''
	  	} 

	  	
	  	$scope.ChangeTitle = function()
	  	{
	  		 $scope.model.meta_title = $scope.model.name
	  		 $scope.model.slug = window.string_to_slug($scope.model.name)
	  	}


	  	Playlist.Get( $stateParams.id ).then(function successCallback(response){
	  			$scope.model.name = response.data.name;
	  			$scope.model.publish = response.data.publish;
	  			$scope.model.content = response.data.content;
	  			$scope.model.meta_title = response.data.meta_title;
	  			$scope.model.meta_description = response.data.meta_description;
	  			$scope.model.slug = response.data.slug;

			}, function errorCallback(response) {});
	  	
	  	$scope.save = function()
	  {
	  	$scope.model.id = $stateParams.id;
	  	Playlist.Update($scope.model);
	  }

	}]).controller('PlaylistNewCtrl', 
	[ '$scope','$state','$translate','Playlist',
	  function ($scope,$state,$translate, Playlist) 
	  {

	  	$scope.model = {
	  		'name':'',
	  		'publish': true,
	  		'slug':'',
	  		'meta_title':'',
	  		'meta_description':''
	  	} 

	  	$scope.ChangeTitle = function()
	  	{
	  		$scope.model.meta_title = $scope.model.name
	  		$scope.model.slug = window.string_to_slug($scope.model.name)
	  	}

	  	$scope.save = function()
		{
		  
		  	Playlist.New($scope.model).then(function successCallback(response)
		    {
		    	$state.go('root.playlist_edit',{'id':response.data.id});

		    }, function errorCallback(response) {});;;
		}

	 
	  

	}]).controller('PlaylistAddVideoCtrl', 
	[ '$scope','$state','$translate','$stateParams','Playlist','Video',
	  function ($scope,$state,$translate,$stateParams,Playlist,Video) 
	  {
	  

	  	$scope.model = { 
	  		'name':'', 
	  		'query':'',
	  		'id':$stateParams.id,

	  	} 

		$scope.todos = [];
		$scope.filteredTodos = [];

 		$scope.itemsPerPage = 8;
	  	$scope.currentPage = 1;

	  
	  	Playlist.Get( $stateParams.id ).then(function successCallback(response){
	  			$scope.model.name = response.data.name;
	  		

			}, function errorCallback(response) {});
	  	
	

	  	$scope.search = function()
	  	{	if($scope.model.query.length > 0)
	  		{
	  			$scope.todos = $scope.todos.filter(function(item){
	  			re = new RegExp($scope.model.query);

				return re.test(item.title) ;
				});
				$scope.figureOutTodosToDisplay(1);
	  		}else
	  		{
	  			$scope.makeTodos(); 
	  		}
	  		
	  	}



		$scope.makeTodos = function()
		{
			
		    Video.list().then(function successCallback(response)
		    {
	         	angular.forEach(response.data, function(value, key){
				 	this.push({
			        	id: value.id,
				        title: value.title,
				        img: value.featured_image,
				        status: value.publish,
				        created: value.created,
				        modified: value.modified,
			      	});
			      	if(response.data.length-1 >= key)
			      	{
			      		$scope.figureOutTodosToDisplay(1);
			      	}
			      	
				},$scope.todos);
				if(response.data.length > 0)
				{
					$scope.figureOutTodosToDisplay(1);
				}
        	}, function errorCallback(response) {});


		};
		$scope.AddVideo = function(id) 
		{

			$scope.todos = $scope.todos.filter(function(item)
			{        
              return item.id !== id;
          	});
          	$scope.filteredTodos = $scope.filteredTodos.filter(function(item)
          	{        
              return item.id !== id;
          	});

			Playlist.AddVideo( id,$stateParams.id).then(function successCallback(response){
	  			$state.go('root.playlist_videos',{'id': $stateParams.id});
			}, function errorCallback(response) {});
          	

		};

		$scope.figureOutTodosToDisplay = function(page) 
		{
		    $scope.currentPage  = page
		    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
		    var end = begin + $scope.itemsPerPage;
		    $scope.filteredTodos = $scope.todos.slice(begin, end);
		    //reset items each pagination
		 
	    	if($scope.HasallItems!=null)
	    	{
	      		$scope.HasallItems = false;
	    	}
	  	};

		$scope.makeTodos();
		$scope.pageChanged =  function(page) 
		{
		  $scope.figureOutTodosToDisplay(page);
		};

	}]).controller('PlaylistVideosCtrl', 
	[ '$scope','$state','$translate','$stateParams','Playlist','Video',
	  function ($scope,$state,$translate,$stateParams,Playlist,Video) 
	  {

	  	$scope.model = { 
	  		'name':'', 
	  		'query':'',
	  		'id':$stateParams.id,
	  	} 
 
	  	$scope.itemsPerPage = 8;
	  	$scope.currentPage = 1;

	  	$scope.todos = [];
		$scope.filteredTodos = [];
	  	
	  	Playlist.Get( $stateParams.id ).then(function successCallback(response){
	  		$scope.model.name = response.data.name;
		}, function errorCallback(response) {});
	  	

	  	$scope.search = function()
	  	{	
	  		if($scope.model.query.length > 0)
	  		{
	  			$scope.todos = $scope.todos.filter(function(item){
	  			re = new RegExp($scope.model.query);

				return re.test(item.title) ;
				});
				$scope.figureOutTodosToDisplay(1);
	  		}else
	  		{
	  			$scope.makeTodos(); 
	  		}
	  		
	  	}


	  	$scope.removeVideo = function(id) 
		{

			$scope.todos = $scope.todos.filter(function(item)
			{        
              return item.id !== id;
          	});
          	$scope.filteredTodos = $scope.filteredTodos.filter(function(item)
          	{        
              return item.id !== id;
          	});
          	Playlist.RemoveVideo( id,$stateParams.id).then(function successCallback(response){
	  			$scope.makeTodos();
			}, function errorCallback(response) {});

		};
	
		$scope.makeTodos = function()
		{
			
		    Playlist.Videos($stateParams.id).then(function successCallback(response)
		    {
	         	angular.forEach(response.data, function(value, key){
				 	this.push({
			        	id: value.id,
				        title: value.title,
				        img: value.featured_image,
				        status: value.publish,
				        created: value.created,
				        modified: value.modified,
			      	});
			      	if(response.data.length-1 >= key)
			      	{
			      		$scope.figureOutTodosToDisplay(1);
			      	}
			      	
				},$scope.todos);
				if(response.data.length > 0)
				{
					$scope.figureOutTodosToDisplay(1);
				}
        	}, function errorCallback(response) {});
		};

	  	$scope.figureOutTodosToDisplay = function(page) 
		{
		    $scope.currentPage  = page
		    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
		    var end = begin + $scope.itemsPerPage;
		    $scope.filteredTodos = $scope.todos.slice(begin, end);
		    
	    	if($scope.HasallItems!=null)
	    	{
	      		$scope.HasallItems = false;
	    	}
	  	};

		$scope.makeTodos();
		$scope.pageChanged =  function(page) 
		{
		  $scope.figureOutTodosToDisplay(page);
		};
	}]);
});


