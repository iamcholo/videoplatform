define(['angular'],function(angular){

    angular.module('app.routes.custom.video', ['ui.router']).config([
      '$stateProvider', '$urlRouterProvider',"$locationProvider",
      function($stateProvider, $urlRouterProvider, $locationProvider) 
      {
        $stateProvider
        .state('root.videos',
        {
          url: '/custom/videos',
          views: {
          'content': {
              templateUrl: '/admin/assets/js/modules/templates/custom/video/lists.html',
              controller: 'VideoListCtrl',
            } 
          }
         
        })
        .state('root.video.current', {
          url: '/page/{page:int}',
          params: {
            page:{ value: 1}
          },
        })
       
      }]);

  
});
