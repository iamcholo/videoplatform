from django.http import StreamingHttpResponse
from django.http import HttpResponse
from wsgiref.util import FileWrapper
from django.template.response import TemplateResponse
from django.core.files.base import ContentFile
import mimetypes
import os
import re
import base64
from django.conf import settings
from posts.models import PostItem
from django.shortcuts import get_object_or_404
from django.http import Http404

range_re = re.compile(
    r'bytes\s*=\s*(\d+)\s*-\s*(\d*)', 
    re.I
)



 
class RangeFileWrapper (object):
    def __init__(self, filelike, blksize=8192, offset=0, length=None):
        self.filelike = filelike
        self.filelike.seek(offset, os.SEEK_SET)
        self.remaining = length
        self.blksize = blksize
 
    def close(self):
        if hasattr(self.filelike, 'close'):
            self.filelike.close()
 
    def __iter__(self):
        return self
 
    def next(self):
        
        if self.remaining is None:
            # If remaining is None, we're reading the entire file.
            data = self.filelike.read(self.blksize)
            if data:
                return data
            raise StopIteration()
        else:
            if self.remaining <= 0:
                raise StopIteration()
            data = self.filelike.read(min(self.remaining, self.blksize))
            if not data:
                raise StopIteration()
            self.remaining -= len(data)
            return data
 
def stream(request, pk=None):
    referer = request.META.get('HTTP_REFERER')
    #if referer is None:
    #    raise Http404
    
    #if referer.hostname not in settings.ALLOWED_HOSTS:
    #    raise Http404
    post = get_object_or_404(PostItem,pk=pk)

    file_path = os.path.join(settings.MEDIA_ROOT, 'uploads')
    filename = post.video
    path = os.path.join(file_path, filename)
    #path = post.video_blob
    range_header = request.META.get('HTTP_RANGE', '').strip()
    range_match = range_re.match(range_header)
    size = os.path.getsize(path)
    
    content_type, encoding = mimetypes.guess_type(path)
    
    content_type = content_type or 'application/octet-stream'
    if range_match:

        first_byte, last_byte = range_match.groups()
        first_byte = int(first_byte) if first_byte else 0
        last_byte = int(last_byte) if last_byte else size - 1
        if last_byte >= size:
            last_byte = size - 1
        length = last_byte - first_byte + 1
        resp = StreamingHttpResponse(RangeFileWrapper(open(path, 'rb'), offset=first_byte, length=length), status=206, content_type=content_type)
        resp['Content-Length'] = str(length)
        resp['Content-Range'] = 'bytes %s-%s/%s' % (first_byte, last_byte, size)
    else:
        resp = StreamingHttpResponse(FileWrapper(open(path, 'rb')), content_type=content_type)
        resp['Content-Length'] = str(size)
    resp['Accept-Ranges'] = 'bytes'
    return resp


def stream2(request, pk=None):
    referer = request.META.get('HTTP_REFERER')
    #if referer is None:
    #    raise Http404
    
    #if referer.hostname not in settings.ALLOWED_HOSTS:
    #    raise Http404
    post = get_object_or_404(PostItem,pk=pk)

    file_path = os.path.join(settings.MEDIA_ROOT, 'uploads')
    filename = post.video
    path = os.path.join(file_path, filename)
    content_type, encoding = mimetypes.guess_type(path)
    file = open(path, "r") 

    context = {
        'video':base64.encodestring(file.read() ),
        'content_type': content_type
    }

    template_name = [
            'home.html'
        ]
    return TemplateResponse(request, template_name, context)
