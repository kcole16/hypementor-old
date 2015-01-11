# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profile', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='education',
            field=models.CharField(default='uva', max_length=500),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='profile',
            name='linkedin_id',
            field=models.CharField(default='required', max_length=500),
            preserve_default=False,
        ),
    ]
