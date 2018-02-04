
import json
import os 
import sys
import hashlib
import time

from django.conf import settings
from django.http import Http404, HttpResponseRedirect, HttpResponse
from django.conf.urls import url, include
from rest_framework import routers, serializers, viewsets, generics
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import generics
from posts.models import PostCategory
from posts.models import PostItem
from globaly.models import GlobalyTags
from posts.models import Playlist
from globaly.rest_api import GlobalyTagsSerializer
from django.contrib.auth.models import User
from user.rest_authentication import IsAuthenticated
from django.db.models import Q
from decimal import Decimal as D
from django.db.models import Max
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.template import defaultfilters


class PostCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PostCategory
        fields =    (
            'id', 
            'name',
            'slug',
            'meta_title',
            'meta_description',
            'publish',
            'post_type', 
            'created', 
            'modified',
        )

class PlaylistSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Playlist
        fields =    (
            'id', 
            'name',
            'slug',
            'meta_title',
            'meta_description',
            'publish',
            'created', 
            'modified',
        )


class PostItemSerializer(serializers.HyperlinkedModelSerializer):
    categories_lists = PostCategorySerializer(source='categories', many=True, read_only = True)
    tags_lists = GlobalyTagsSerializer(source='tags', many=True, read_only = True)
    playlist_lists = PlaylistSerializer(source='playlist', many=True, read_only = True)
    autor_id = serializers.ReadOnlyField(source='autor.id')

    class Meta:
        model = PostItem
        fields = (
            'id',
            'autor_id',
            'categories_lists',
            'tags_lists',
            'playlist_lists',
            'title',

            #'slug',
            #'meta_title',
            #'meta_description',
            'publish',
            'thumbnail',
            'thumbnail_text',
            'featured_image',
            'featured_image_text',
            'content',
            'excerpt',
            'publish_date',
            'featured_start_date',
            'featured_end_date',
            'post_type',
            'is_featured',
            'is_on_feed',
        )
class PostItemSerializer2(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = PostItem
        fields = (
            'id',
        ) 
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def post_list(request):
        
    if request.method == 'POST':
        post_type = request.data.get('post_type','post')

        posts = PostItem.objects.filter(
            post_type=post_type,
            autor=request.user
        ).order_by('-id')
        serializer = PostItemSerializer(
            posts, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)


@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def upload_create(request):
        
    if request.method == 'PUT':
        file_name = request.FILES['file']
        file_path = os.path.join(settings.MEDIA_ROOT, 'uploads')
        filenamex, file_extension = os.path.splitext(file_name.name)
        millis = int(round(time.time() * 1000))

        m = hashlib.sha224("%s%d" %(filenamex,millis)).hexdigest()
        filename = "%s%s" %(m,file_extension)
        url = 'uploads/%s'% filename
        file_path = os.path.join(file_path, filename)
        path = default_storage.save(
            file_path, 
            ContentFile(file_name.read())
        )
 
        image = PostItem()
        image.title = request.data.get('name',None) or filenamex 
        image.autor = request.user
        image.post_type = "video"
        image.video = filename
       

        image.save()
    return Response(
                {'id':image.id}
            )

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def post_details(request):
    if request.method == 'POST':
        try:
            pk = request.data.get('id')
            post = PostItem.objects.get(
                pk=pk
            )
        except PostItem.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = PostItemSerializer(
            post,
            context={'request': request}
        )
        return Response(serializer.data)
    return Response(
                status=status.HTTP_204_NO_CONTENT
            )

@api_view(['PUT','POST','DELETE'])
@permission_classes((IsAuthenticated,))
def post(request):
    
    if request.method == 'POST':
        serializer = PostItemSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
              
            if request.data.has_key('categories_lists'):
                d = request.data['categories_lists']
                data = [ value.get('id') for value in d]
              
                categories = PostCategory.objects.filter(                   
                    pk__in=data
                )
                
                serializer.save(
                    autor=request.user,
                    categories=categories                      
                )
               
            else:
                serializer.save(autor=request.user)

            return Response(serializer.data)
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )      
    if request.method == 'PUT' or request.method == 'DELETE':
        try:
            pk = request.data.get('id')
            post = PostItem.objects.get(
                pk=int(pk)
            )
        except PostItem.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'PUT':
            serializer = PostItemSerializer(
                post,
                data=request.data,
                context={'request': request}
            )
            if serializer.is_valid():
                if request.data.has_key('categories_lists') or \
                request.data.has_key('tag_lists'):
                    if request.data.has_key('categories_lists') and \
                        not request.data.has_key('tag_lists'):
                        d = request.data['categories_lists']
                        data = [ value.get('id') for value in d]
                        categories = PostCategory.objects.filter(                   
                            pk__in=data
                        )
                        serializer.save(
                            categories=categories                      
                        )

                    if request.data.has_key('categories_lists') and \
                        request.data.has_key('tag_lists'):
                        d = request.data['categories_lists']
                        t = request.data['tag_lists']
                        data = [ value.get('id') for value in d]
                        datat = [ value.get('id') for value in t]
                        tags = GlobalyTags.objects.filter(                   
                            pk__in=datat
                        )
                        categories = PostCategory.objects.filter(                   
                            pk__in=data
                        )
                        serializer.save(
                            categories=categories,
                            tags=tags  
                        )
                    if request.data.has_key('tag_lists') and \
                        not request.data.has_key('categories_lists'):
                        t = request.data['tag_lists']
                        data = [ value.get('id') for value in t]
                        tags = GlobalyTags.objects.filter(                   
                            pk__in=data
                        )
                        serializer.save(
                           tags=tags                     
                        )

                else:
                    serializer.save()
                instance = serializer.instance
                instance.slug =  defaultfilters.slugify(instance.title )
                instance.meta_title = instance.title
                instance.meta_description = instance.title
                instance.save()
                return Response(serializer.data)

        if request.method == 'DELETE':
            post.delete()
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

    return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )    


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def categories_list(request):

    if request.method == 'GET':
        posts = PostCategory.objects.all().order_by('-id')
        serializer = PostCategorySerializer(
            posts, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def category_details(request):
    if request.method == 'POST':
        try:
            pk = request.data.get('id')
            category = PostCategory.objects.get(
                pk=pk
            )
        except PostCategory.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = PostCategorySerializer(
            category,
            context={'request': request}
        )
        return Response(serializer.data)
    return Response(
                status=status.HTTP_204_NO_CONTENT
            )


@api_view(['PUT','POST','DELETE'])
@permission_classes((IsAuthenticated,))
def category(request):
    
    if request.method == 'POST':
        serializer = PostCategorySerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )      
    if request.method == 'PUT' or request.method == 'DELETE':
        try:
            pk = request.data.get('id')
            category = PostCategory.objects.get(
                pk=int(pk)
            )
        except PostCategory.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'PUT':
            serializer = PostCategorySerializer(
                category,
                data=request.data,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                instance = serializer.instance
              
                return Response(serializer.data)

        if request.method == 'DELETE':
            category.delete()
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

    return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )    



@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def playlist_list(request):

    if request.method == 'POST':
        playlist = Playlist.objects.all()
        serializer = PlaylistSerializer(
            playlist, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def playlist_details(request):
    if request.method == 'POST':
        try:
            pk = request.data.get('id')
            playlist = Playlist.objects.get(
                pk=pk
            )
        except Playlist.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = PlaylistSerializer(
            playlist,
            context={'request': request}
        )
        return Response(serializer.data)
    return Response(
                status=status.HTTP_204_NO_CONTENT
            )


@api_view(['PUT','POST','DELETE'])
@permission_classes((IsAuthenticated,))
def playlist(request):
    
    if request.method == 'POST':
        serializer = PlaylistSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )      
    if request.method == 'PUT' or request.method == 'DELETE':
        try:
            pk = request.data.get('id')
            playlist = Playlist.objects.get(
                pk=int(pk)
            )
        except Playlist.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'PUT':
            serializer = PlaylistSerializer(
                playlist,
                data=request.data,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

        if request.method == 'DELETE':
            playlist.delete()
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

    return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )    

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_to_playlist(request):
    if request.method == 'POST':
        try:
            pk = request.data.get('id')
            post = PostItem.objects.get(
                pk=pk
            )
        except PostItem.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            pk = request.data.get('playlist_ids')
            playlist = Playlist.objects.get(
                pk=pk
            )
        except Playlist.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        
        post.playlist.add(playlist)
       
     
        
    return Response(
            status=status.HTTP_204_NO_CONTENT
        )

@api_view(['DELETE'])
@permission_classes((IsAuthenticated,))
def remove_from_playlist(request):
    if request.method == 'DELETE':
        try:
            pk = request.data.get('id')
            post = PostItem.objects.get(
                pk=pk
            )
        except PostItem.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            pk = request.data.get('playlist_id')
            playlist = Playlist.objects.get(
                pk=pk
            )
        except Playlist.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        
        post.playlist.remove(playlist)
        
    return Response(
            status=status.HTTP_204_NO_CONTENT
        )

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def playlist_video_list(request):
        
    if request.method == 'POST':
        post_type = request.data.get('post_type','post')
        pk = request.data.get('playlist_id')
        posts = PostItem.objects.filter(
            post_type=post_type,
            playlist__pk=int(pk)
        ).order_by('-id')
        serializer = PostItemSerializer(
            posts, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    return Response(
            status=status.HTTP_204_NO_CONTENT
        )

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def get_video(request):
        
    if request.method == 'POST':
        post_type = request.data.get('post_type','post')
        pk = request.data.get('playlist_id')
        posts = PostItem.objects.filter(
            post_type=post_type,
            autor=request.user,
            playlist__pk=int(pk)
        ).order_by('-id')
        serializer = PostItemSerializer(
            posts, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    return Response(
            status=status.HTTP_204_NO_CONTENT
        )
