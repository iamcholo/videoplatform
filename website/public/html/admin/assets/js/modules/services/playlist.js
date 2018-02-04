define(['angular'],function(angular){

angular.module('app.services.playlist', [] )
.service('Playlist', [ 
    '$q', '$http',  '$rootScope', '$cookies',
    function ($q, $http, $rootScope,$cookies) 
  {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = {
        
        'API_URL': '/api',
        'request': function(args) 
        {
            params = args.params || {}
            args = args || {};
            var deferred = $q.defer(),
                url = this.API_URL + args.url,
                method = args.method || "GET",
                params = params,
                data = args.data || {};
            
            return  $http({
                url: url,
                withCredentials: this.use_session,
                method: method.toUpperCase(),
                //headers: {'X-CSRFToken': $cookies['csrftoken']},
                headers: {
                    'Authorization': 'Token ' + $cookies.get('access_token'),
                    'Content-Type': 'application/json'
                },
                params: params,
                data: data
            });
        },
        'list': function(){
            return this.request({
                'method': "POST",
                'url': "/playlists/",
            });
        },
        'New': function(data){
          
            return this.request({
                'method': "POST",
                'url': "/playlist/",
                'data': data              
            });
        },
        'Update': function(data){
            return this.request({
                'method': "PUT",
                'url': "/playlist/",
                'data': data       
            });
        },
        'Get': function(id){
            return this.request({
                'method': "POST",
                'url': "/playlist/details/",
                'data': {'id':id,}                 
            });
        },
        'RemoveVideo': function(id,playlist_id){
            return this.request({
                'method': "DELETE",
                'url': "/playlist/remove/video/", 
                'data': {'id':id,'playlist_id':playlist_id}             
            });
        },
        'AddVideo': function(id,playlist_ids){
            return this.request({
                'method': "POST",
                'url': "/playlist/add/video/", 
                'data': {'id':id,'playlist_ids':playlist_ids}             
            });
        },
        'Videos': function(playlist_id){
            return this.request({
                'method': "POST",
                'url': "/playlist/videos/", 
                'data': {'post_type':'video','playlist_id':playlist_id}             
            });
        },


       


        

           
        'initialize': function(url){
            this.API_URL = url;         
        }

    }
    return service;
  }]);




});


