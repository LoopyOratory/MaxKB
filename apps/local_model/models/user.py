# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: user.py
    @date：2025/4/14 10:20
    @desc:
"""
import uuid_utils.compat as uuid

from django.db import models

from common.utils.common import password_encrypt


class User(models.Model):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    email = models.EmailField(unique=True, null=True, blank=True, verbose_name="Email", db_index=True)
    phone = models.CharField(max_length=20, verbose_name="Phone", default="", db_index=True)
    nick_name = models.CharField(max_length=150, verbose_name="Nickname", unique=True, db_index=True)
    username = models.CharField(max_length=150, unique=True, verbose_name="User名", db_index=True)
    password = models.CharField(max_length=150, verbose_name="Password")
    role = models.CharField(max_length=150, verbose_name="Role")
    source = models.CharField(max_length=10, verbose_name="Source", default="LOCAL", db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    language = models.CharField(max_length=10, verbose_name="Language", null=True, default=None)
    create_time = models.DateTimeField(verbose_name="Creation time", auto_now_add=True, null=True, db_index=True)
    update_time = models.DateTimeField(verbose_name="ModificationTime", auto_now=True, null=True, db_index=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "user"

    def set_password(self, row_password):
        self.password = password_encrypt(row_password)
        self._password = row_password
