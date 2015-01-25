# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profile', '0004_authorized'),
    ]

    operations = [
        migrations.AddField(
            model_name='authorized',
            name='client_code',
            field=models.CharField(default='c6846271b6174a0b9831ea1d34e4665c', max_length=500),
            preserve_default=False,
        ),
    ]
