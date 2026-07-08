import uuid_utils.compat as uuid

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone

from application.models import Application
from common.mixins.app_model_mixin import AppModelMixin


class ApplicationApiKey(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    secret_key = models.CharField(max_length=1024, verbose_name="Secret key", unique=True)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, verbose_name="Applicationid")
    is_active = models.BooleanField(default=True, verbose_name="WhetherEnable")
    allow_cross_domain = models.BooleanField(default=False, verbose_name="Whether允许跨域")
    cross_domain_list = ArrayField(verbose_name="跨域List",
                                   base_field=models.CharField(max_length=128, blank=True)
                                   , default=list)
    expire_time = models.DateTimeField(verbose_name="过期Time", default=timezone.now)
    is_permanent = models.BooleanField(default=True, verbose_name="WhetherPermanent")

    class Meta:
        db_table = "application_api_key"
