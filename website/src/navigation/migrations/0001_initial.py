# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2018-01-25 21:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='NavigationItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='CREATED_LABEL')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='MODIFIED_LABEL')),
                ('publish', models.BooleanField(default=True, verbose_name='PUBLISH_LABEL')),
                ('object_id', models.PositiveIntegerField(null=True, verbose_name='RELATED_ITEM_LABEL')),
                ('view_name', models.TextField(blank=True, max_length=255, null=True, verbose_name='VIEW_NAME_LABEL')),
                ('slug', models.CharField(max_length=255, unique=True, verbose_name='SLUG_LABEL')),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('content_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType', verbose_name='CONTENT_TYPE_LABEL')),
                ('parent', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='navigation_item_parent', to='navigation.NavigationItem', verbose_name='PARENT_LABEL')),
            ],
            options={
                'get_latest_by': 'created',
                'ordering': ('-id',),
                'verbose_name_plural': 'NAVIGATION_ITEM_PLURAL_LABEL',
                'db_table': 'navigation_item',
                'verbose_name': 'NAVIGATION_ITEM_LABEL',
            },
        ),
        migrations.CreateModel(
            name='NavigationPosition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='CREATED_LABEL')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='MODIFIED_LABEL')),
                ('publish', models.BooleanField(default=True, verbose_name='PUBLISH_LABEL')),
                ('name', models.CharField(blank=True, max_length=255, unique=True, verbose_name='NAME_LABEL')),
            ],
            options={
                'get_latest_by': 'created',
                'ordering': ('-id',),
                'verbose_name_plural': 'NAVIGATION_POSITION_TITLE_PLURAL',
                'db_table': 'navigation_position',
                'verbose_name': 'NAVIGATION_POSITION_TITLE',
            },
        ),
        migrations.AddField(
            model_name='navigationitem',
            name='position',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='navigation_item_position_parent', to='navigation.NavigationPosition', verbose_name='NAVIGATION_POSITION_TITLE'),
        ),
    ]