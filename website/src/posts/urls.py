from django.conf.urls import include, url
from posts import rest_api as views 
from utilities.rest_api_urls import router 

register_url = True
urlpatterns = [
	url(r'^posts/{0,1}$', views.post_list),
	url(r'^post/{0,1}$', views.post),
	url(r'^post/upload/{0,1}$', views.upload_create),
	url(r'^playlists/{0,1}$', views.playlist_list),
	url(r'^playlist/{0,1}$', views.playlist),
	url(r'^playlist/details/{0,1}$', views.playlist_details),
	url(r'^post/details/{0,1}$', views.post_details),
	url(r'^pages/{0,1}$', views.post_list),
	url(r'^page/{0,1}$', views.post),
	url(r'^page/details/{0,1}$', views.post_details),
	url(r'^videos/{0,1}$', views.post_list),
	url(r'^video/{0,1}$', views.post),
	url(r'^video/details/{0,1}$', views.post_details),
	url(r'^category/{0,1}$', views.category),
	url(r'^category/details/{0,1}$', views.category_details),
	url(r'^categories/{0,1}$', views.categories_list),
]






