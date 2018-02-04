define(['angular'],function(angular){

    angular.module('app.routes.playlist', ['ui.router']).config([
      '$stateProvider', '$urlRouterProvider',"$locationProvider",
      function($stateProvider, $urlRouterProvider, $locationProvider) 
      {
        $stateProvider
        .state('root.playlist',
        {
          url: '/playlist',
          views: {
          'content': {
              templateUrl: '/admin/assets/js/modules/templates/playlist/lists.html',
              controller: 'PlaylistListCtrl',
            } 
          }
         
        })
        .state('root.playlist.current', {
          url: '/page/{page:int}',
          params: {
            page:{ value: 1}
          },
        })
        .state('root.playlist_edit', {
          url: '/playlist/edit/{id:int}',
          params: {
            id:{ value: 0}
          },
          views: {
          'content': {
              controller: 'PlaylistEditCtrl',
              templateUrl: '/admin/assets/js/modules/templates/playlist/edit.html',
            } 
          }
         
        })  
        .state('root.playlist_new', {
          url: '/playlist/new',
          views: {
          'content': {
              controller: 'PlaylistNewCtrl',
              templateUrl: '/admin/assets/js/modules/templates/playlist/edit.html',
            } 
          }
        }).state('root.playlist_add_video', {
           url: '/playlist/add/video/{id:int}',
            params: {
              id:{ value: 0}
            },
          views: {
          'content': {
              controller: 'PlaylistAddVideoCtrl',
              templateUrl: '/admin/assets/js/modules/templates/playlist/add_video.html',
            } 
          }
        });;
      }]);

  
});
