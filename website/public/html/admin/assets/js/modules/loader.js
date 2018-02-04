require.config({
    paths: {
      "jquery": "vendor/dashboard/jquery/jquery.min",
      "bootstrap":"vendor/dashboard/bootstrap/bootstrap.min",
      "jquery_migrate": "vendor/dashboard/jquery/jquery-migrate.min",
      "simplemde": "modules/directives/simplemde",
      "dropzone_directive": "modules/directives/dropzone",
      "datepicker_directive": "modules/directives/datepicker",
      "login_directive": "modules/directives/login",
      "files_directive": "modules/directives/files",
      "SimpleMDE": "vendor/simplemde.min",
      "clipboard": "vendor/clipboard.min",
      "custom": "modules/custom",
      "custom": "modules/custom",
      "angular": "vendor/angular.min",
      "angular_cookies": "vendor/angular-cookies",
      "paging":"vendor/paging",
      "app": "modules/app",
      "router": "vendor/angular-ui-router",
      "translate": "vendor/angular-translate.min",
      
      "users_controller": "modules/controllers/users",
      "user_routers": "modules/routes/users",     
      "user_services": "modules/services/user",      
      
      "root_routers": "modules/routes/root",
      
      "playlist_routers": "modules/routes/playlist",
      "playlist_controllers": "modules/controllers/playlist",   
      "playlist_services": "modules/services/playlist",

      
      "tags_routers": "modules/routes/tags",
      "tags_controllers": "modules/controllers/tags",
      "tags_services": "modules/services/tags",

      "category_controllers": "modules/controllers/category",
      "category_routers": "modules/routes/category",
      "category_services": "modules/services/category",

      "login_controller": "modules/controllers/login",
      "login_routers": "modules/routes/login",
      "login_services": "modules/services/login",

      "media_controller": "modules/controllers/media",
      "media_services": "modules/services/media",
      "media_routers": "modules/routes/media", 
      
      "comments_controller": "modules/controllers/comments",
      "comments_routers": "modules/routes/comments",
      "comments_services": "modules/services/comments",
            
      "I18N_EN":"modules/I18N/EN",
      "I18N_ES":"modules/I18N/ES",
      "directives":"modules/directives",
      "services":"modules/services",
      "dashboard":"modules/dashboard",
      //custom games
  
      "custom_video_controllers": "modules/controllers/custom/video",
      "custom_video_routers": "modules/routes/custom/video",
      "custom_video_services": "modules/services/custom/video",


    },
    baseUrl: '/admin/assets/js/',
    shim: {
      'app': {
        deps: [
          'angular',
          'angular_cookies',
          'paging',
          'simplemde',
          'dropzone_directive',
          'datepicker_directive',
          'login_directive',
          'custom',
          'router',
          'translate',
          'I18N_EN',
          'I18N_ES',
          'directives',
          'services',
          'root_routers',
          'media_controller',
          'media_routers',
          'media_services',

          'login_controller',
          'login_routers',          
          'login_services',

          'comments_controller',          
          'comments_routers',         
          'dashboard',
          'users_controller',
          'user_services',
          'user_routers',
          'playlist_controllers',
          'playlist_routers',
          'playlist_services',
          'category_controllers',
          'category_routers',
          'category_services',
          'tags_controllers',
          'tags_routers',
          'tags_services',
          'comments_services',         
          'files_directive',
          'clipboard',
          'custom_video_controllers',
          'custom_video_routers',
          'custom_video_services',

        ]
      },
      
      "directives": {
        deps: ["angular"]
      },
       "angular_cookies": {
        deps: ["angular"]
      },
     
     
      'router': {
        deps: ['angular']
      },
      'paging': {
        deps: ['angular']
      },
      'translate': {
        deps: ['angular']
      },
      'simplemde': {
        deps: ['angular','SimpleMDE']
      },

      'dropzone_directive': {
        deps: ['angular','dashboard']
      },


      'datepicker_directive': {
        deps: ['angular','jquery']
      },




   
      'angular':{
        exports : "angular",
      },
     'I18N_EN': {
        deps: ['angular']
      },
      'I18N_ES': {
        deps: ['angular']
      },
      'directives': {
        deps: ['angular']
      },
      'services': {
        deps: ['angular']
      },
      'playlist_controllers': {
        deps: ['angular']
      },

      'media_controller': {
        deps: ['angular']
      },

      'users_controller': {
        deps: ['angular']
      },
      'comments_controller': {
        deps: ['angular']
      },
      'comments_routers': {
        deps: ['angular']
      },

      'login_controller': {
        deps: ['angular']
      },

      'user_routers': {
        deps: ['angular']
      },
      'login_routers': {
        deps: ['angular']
      },
      'media_routers': {
        deps: ['angular']
      },
      'playlist_routers': {
        deps: ['angular']
      },
      'root_routers': {
        deps: ['angular']
      },
      'login_routers': {
        deps: ['angular']
      },
      'login_services': {
        deps: ['angular']
      },
      'user_services': {
        deps: ['angular']
      },
      'playlist_services': {
        deps: ['angular']
      },
      
      'playlist_routers': {
        deps: ['angular']
      },
      
      'login_directive': {
        deps: ['angular']
      },

      'category_controllers': {
        deps: ['angular']
      },

      'category_routers': {
        deps: ['angular']
      },
      
      'category_services': {
        deps: ['angular']
      },

      'tags_controllers': {
        deps: ['angular']
      },

      'tags_routers': {
        deps: ['angular']
      },
      
      'tags_services': {
        deps: ['angular']
      },


      'comments_services': {
        deps: ['angular']
      },
      
      'media_services': {
        deps: ['angular']
      },
    

      'files_directive': {
        deps: ['angular']
      },
      'angular_file_upload': {
        deps: ['angular']
      },
      //custom

      'custom_video_controllers': {
        deps: ['angular']
      },
      'custom_video_routers': {
        deps: ['angular']
      },
      'custom_video_services': {
        deps: ['angular']
      },
      



    },
    deps: ['app'],
    waitSeconds: 1880
});

var modules = [];
modules.push('app');

// Start the main app logic.
requirejs(modules, function (App) {
  App.bootstrap();
});