# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2018-04-10 18:12
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('globaly', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='globalytags',
            name='autor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='globaly_tags_item_autor', to=settings.AUTH_USER_MODEL, verbose_name='AUTOR_LABEL'),
        ),
    ]
