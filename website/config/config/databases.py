
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'video_platform',
        'USER': 'root',
        'PASSWORD': 'demo',
        'CONN_MAX_AGE': 0,
        'OPTIONS': {
            'sql_mode': 'traditional',
        }
    }
}

