# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2018-04-11 20:21
from __future__ import unicode_literals

from django.db import migrations
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_postitem_video_blob'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postitem',
            name='video_blob',
            field=django_mysql.models.SizedBinaryField(blank=True, size_class=4, verbose_name='VideoBlob'),
        ),
    ]
