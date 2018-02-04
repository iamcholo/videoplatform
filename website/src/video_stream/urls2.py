
from django.conf.urls import url
from video_stream import views 
# Create your views here.
urlpatterns = [
    

   url(r'^video/{0,1}$',
            views.stream,
            name='stream'
        ),
    
   url(r'^video/(?P<pk>\d+)/{0,1}$',
            views.stream,
            name='stream'
        ),
    
]