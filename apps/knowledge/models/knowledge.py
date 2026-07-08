import io
import zipfile
from enum import Enum

import uuid_utils.compat as uuid
from common.db.sql_execute import select_one
from common.mixins.app_model_mixin import AppModelMixin
from common.utils.common import get_sha256_hash
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.search import SearchVectorField
from django.db import models
from django.db.models import QuerySet
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from models_provider.models import Model
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel
from users.models import User


class KnowledgeType(models.IntegerChoices):
    BASE = 0, "GeneralType"
    WEB = 1, "webSiteType"
    LARK = 2, "FeishuType"
    YUQUE = 3, "语雀Type"
    WORKFLOW = 4, "WorkflowType"


class TaskType(Enum):
    # Vector
    EMBEDDING = 1
    # GenerateQuestion
    GENERATE_PROBLEM = 2
    # Sync
    SYNC = 3
    # TokenizationIndex
    TOKENIZE = 4


class State(Enum):
    # Wait
    PENDING = "0"
    # Execute中
    STARTED = "1"
    # Success
    SUCCESS = "2"
    # Failure
    FAILURE = "3"
    # CancelTask
    REVOKE = "4"
    # CancelSuccess
    REVOKED = "5"
    # 忽略
    IGNORED = "n"


class KnowledgeScope(models.TextChoices):
    SHARED = "SHARED", "Shared"
    WORKSPACE = "WORKSPACE", "WorkspaceAvailable"


class HitHandlingMethod(models.TextChoices):
    optimization = "optimization", "ModelOptimization"
    directly_return = "directly_return", "DirectReturn"


class Status:
    type_cls = TaskType
    state_cls = State

    def __init__(self, status: str = None):
        self.task_status = {}
        status_list = list(status[::-1] if status is not None else "")
        for _type in self.type_cls:
            index = _type.value - 1
            _state = self.state_cls(status_list[index] if len(status_list) > index else "n")
            self.task_status[_type] = _state

    @staticmethod
    def of(status: str):
        return Status(status)

    def __str__(self):
        result = []
        for _type in sorted(self.type_cls, key=lambda item: item.value, reverse=True):
            result.insert(len(self.type_cls) - _type.value, self.task_status[_type].value)
        return "".join(result)

    def __setitem__(self, key, value):
        self.task_status[key] = value

    def __getitem__(self, item):
        return self.task_status[item]

    def update_status(self, task_type: TaskType, state: State):
        self.task_status[task_type] = state


def default_status_meta():
    return {"state_time": {}}


class KnowledgeFolder(MPTTModel, AppModelMixin):
    id = models.CharField(primary_key=True, max_length=64, editable=False, verbose_name="Primary keyid")
    name = models.CharField(max_length=64, verbose_name="FolderName", db_index=True)
    desc = models.CharField(max_length=200, null=True, blank=True, verbose_name="Description")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    parent = TreeForeignKey("self", on_delete=models.DO_NOTHING, null=True, blank=True, related_name="children")

    class Meta:
        db_table = "knowledge_folder"

    class MPTTMeta:
        order_insertion_by = ["name"]


class Knowledge(AppModelMixin):
    """
    Knowledge base表
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    name = models.CharField(max_length=150, verbose_name="Knowledge baseName", db_index=True)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    desc = models.CharField(max_length=256, verbose_name="Description")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    type = models.IntegerField(
        verbose_name="Type", choices=KnowledgeType.choices, default=KnowledgeType.BASE, db_index=True
    )
    scope = models.CharField(
        max_length=20,
        verbose_name="AvailableRange",
        choices=KnowledgeScope.choices,
        default=KnowledgeScope.WORKSPACE,
        db_index=True,
    )
    folder = models.ForeignKey(KnowledgeFolder, on_delete=models.DO_NOTHING, verbose_name="Folderid", default="default")
    embedding_model = models.ForeignKey(Model, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    file_size_limit = models.IntegerField(verbose_name="FileSizeLimit", default=100)
    file_count_limit = models.IntegerField(verbose_name="FileCountLimit", default=50)
    meta = models.JSONField(verbose_name="元Data", default=dict)

    class Meta:
        db_table = "knowledge"


class KnowledgeWorkflow(AppModelMixin):
    """
    Knowledge base workflow表
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    knowledge = models.OneToOneField(
        Knowledge, on_delete=models.CASCADE, verbose_name="Knowledge base", db_constraint=False, related_name="workflow"
    )
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    work_flow = models.JSONField(verbose_name="WorkflowData", default=dict)
    is_publish = models.BooleanField(verbose_name="WhetherPublish", default=False, db_index=True)
    publish_time = models.DateTimeField(verbose_name="PublishTime", null=True, blank=True)

    class Meta:
        db_table = "knowledge_workflow"


class KnowledgeWorkflowVersion(AppModelMixin):
    """
    Knowledge base workflowVersion表 - RecordWorkflowHistoryVersion
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    knowledge = models.ForeignKey(Knowledge, on_delete=models.CASCADE, verbose_name="Knowledge base", db_constraint=False)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    name = models.CharField(verbose_name="VersionName", max_length=128, default="")
    work_flow = models.JSONField(verbose_name="WorkflowData", default=dict)
    publish_user_id = models.UUIDField(verbose_name="Publish者id", max_length=128, default=None, null=True)
    publish_user_name = models.CharField(verbose_name="Publish者Name", max_length=128, default="")

    class Meta:
        db_table = "knowledge_workflow_version"


def get_default_status():
    return Status("").__str__()


class Document(AppModelMixin):
    """
    Document表
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING, verbose_name="Knowledge baseid")
    name = models.CharField(max_length=150, verbose_name="DocumentName", db_index=True)
    char_length = models.IntegerField(verbose_name="Document字符数 冗余Field")
    status = models.CharField(verbose_name="Status", max_length=20, default=get_default_status, db_index=True)
    status_meta = models.JSONField(verbose_name="StatusStatisticsData", default=default_status_meta)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)
    type = models.IntegerField(
        verbose_name="Type", choices=KnowledgeType.choices, default=KnowledgeType.BASE, db_index=True
    )
    hit_handling_method = models.CharField(
        verbose_name="HitProcessMethod",
        max_length=20,
        choices=HitHandlingMethod.choices,
        default=HitHandlingMethod.optimization,
    )
    directly_return_similarity = models.FloatField(verbose_name="DirectAnswerSimilarity", default=0.9)

    meta = models.JSONField(verbose_name="元Data", default=dict)

    class Meta:
        db_table = "document"


class Tag(AppModelMixin):
    """
    Tag表 - StorageTag的key-valueDefinition
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING, verbose_name="Knowledge base", db_constraint=False)
    key = models.CharField(max_length=64, verbose_name="Tag键", db_index=True)
    value = models.CharField(max_length=128, verbose_name="Tag值", db_index=True)

    class Meta:
        db_table = "tag"
        unique_together = [["knowledge", "key", "value"]]  # 在同一Knowledge base内key-valueCombineUnique
        indexes = [
            models.Index(fields=["knowledge", "key"]),
        ]


class DocumentTag(AppModelMixin):
    """
    DocumentTagAssociation表
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    document = models.ForeignKey(Document, on_delete=models.DO_NOTHING, verbose_name="Document", db_constraint=False)
    tag = models.ForeignKey(Tag, on_delete=models.DO_NOTHING, verbose_name="Tag", db_constraint=False)

    class Meta:
        db_table = "document_tag"
        unique_together = [["document", "tag"]]  # Document和Tag的CombineUnique


class Paragraph(AppModelMixin):
    """
    Paragraph表
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    document = models.ForeignKey(Document, on_delete=models.DO_NOTHING, db_constraint=False)
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING)
    content = models.CharField(max_length=102400, verbose_name="ParagraphContent")
    title = models.CharField(max_length=256, verbose_name="Title", default="", db_index=True)
    status = models.CharField(verbose_name="Status", max_length=20, default=get_default_status, db_index=True)
    status_meta = models.JSONField(verbose_name="StatusData", default=default_status_meta)
    hit_num = models.IntegerField(verbose_name="HitCount", default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    position = models.IntegerField(verbose_name="Paragraph顺序", default=0, db_index=True)
    chunks = ArrayField(verbose_name="块", base_field=models.CharField(), default=list)

    class Meta:
        db_table = "paragraph"


class Problem(AppModelMixin):
    """
    Question表
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING, db_constraint=False)
    content = models.CharField(max_length=256, verbose_name="QuestionContent", db_index=True)
    hit_num = models.IntegerField(verbose_name="HitCount", default=0)

    class Meta:
        db_table = "problem"


class ProblemParagraphMapping(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING, db_constraint=False)
    document = models.ForeignKey(Document, on_delete=models.DO_NOTHING, db_constraint=False)
    problem = models.ForeignKey(Problem, on_delete=models.DO_NOTHING, db_constraint=False)
    paragraph = models.ForeignKey(Paragraph, on_delete=models.DO_NOTHING, db_constraint=False)

    class Meta:
        db_table = "problem_paragraph_mapping"


class Termbase(AppModelMixin):
    """
    术语表
    """

    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING, db_constraint=False)
    content = models.CharField(max_length=256, verbose_name="术语Content", db_index=True)

    class Meta:
        db_table = "termbase"


class SourceType(models.IntegerChoices):
    """OrderType"""

    PROBLEM = 0, "Question"
    PARAGRAPH = 1, "Paragraph"
    TITLE = 2, "Title"


class SearchMode(models.TextChoices):
    embedding = "embedding"
    keywords = "keywords"
    blend = "blend"


class FileSourceType(models.TextChoices):
    # Knowledge base  FollowKnowledge base被DeletionDue toDeletion source_id 为Knowledge baseid
    KNOWLEDGE = "KNOWLEDGE"
    # Application  FollowApplication被DeletionDue toDeletion source_id 为Applicationid
    APPLICATION = "APPLICATION"
    # Tool  FollowTool被DeletionDue toDeletion source_id 为Applicationid
    TOOL = "TOOL"
    # Document
    DOCUMENT = "DOCUMENT"
    # Conversation
    CHAT = "CHAT"
    SYSTEM = "SYSTEM"
    # Temporary30Minutes Data30Minutes后被Cleanup source_id 为TEMPORARY_30_MINUTE
    TEMPORARY_30_MINUTE = "TEMPORARY_30_MINUTE"
    # Temporary120Minutes Data120Minutes后被Cleanup source_id为TEMPORARY_100_MINUTE
    TEMPORARY_120_MINUTE = "TEMPORARY_120_MINUTE"
    # Temporary1天 Data1天后被Cleanup source_id为TEMPORARY_1_DAY
    TEMPORARY_1_DAY = "TEMPORARY_1_DAY"


class VectorField(models.Field):
    def db_type(self, connection):
        return "vector"


class Embedding(models.Model):
    id = models.CharField(max_length=128, primary_key=True, verbose_name="Primary keyid")
    source_id = models.CharField(max_length=128, verbose_name="Resourceid", db_index=True)
    source_type = models.CharField(
        verbose_name="Resource type", max_length=5, choices=SourceType.choices, default=SourceType.PROBLEM, db_index=True
    )
    is_active = models.BooleanField(verbose_name="WhetherAvailable", max_length=1, default=True)
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING, verbose_name="DocumentAssociation", db_constraint=False)
    document = models.ForeignKey(Document, on_delete=models.DO_NOTHING, verbose_name="DocumentAssociation", db_constraint=False)
    paragraph = models.ForeignKey(Paragraph, on_delete=models.DO_NOTHING, verbose_name="ParagraphAssociation", db_constraint=False)
    embedding = VectorField(verbose_name="Vector")
    search_vector = SearchVectorField(verbose_name="Tokenization", default="")
    meta = models.JSONField(verbose_name="元Data", default=dict)

    class Meta:
        db_table = "embedding"


class File(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    file_name = models.CharField(max_length=256, verbose_name="FileName", default="")
    file_size = models.IntegerField(verbose_name="FileSize", default=0)
    sha256_hash = models.CharField(verbose_name="Filesha256_hash标识", default="")
    source_type = models.CharField(
        verbose_name="Resource type",
        choices=FileSourceType,
        default=FileSourceType.TEMPORARY_120_MINUTE.value,
        db_index=True,
    )
    source_id = models.CharField(
        verbose_name="Resourceid", default=FileSourceType.TEMPORARY_120_MINUTE.value, db_index=True
    )
    loid = models.IntegerField(verbose_name="loid")
    meta = models.JSONField(verbose_name="FileAssociationData", default=dict)

    class Meta:
        db_table = "file"

    def save(self, bytea=None, force_insert=False, force_update=False, using=None, update_fields=None):
        if bytea is None:
            raise ValueError("byteaParameters不能为空")

        sha256_hash = get_sha256_hash(bytea)
        self.sha256_hash = sha256_hash
        existing_file = QuerySet(File).filter(sha256_hash=sha256_hash).first()
        if existing_file:
            self.loid = existing_file.loid
            self.file_size = existing_file.file_size
            return super().save()

        compressed_data = self._compress_data(bytea)
        self.file_size = len(compressed_data)

        self.loid = self._create_large_object()

        self._write_compressed_data(compressed_data)
        # Call父类Save
        return super().save()

    def _compress_data(self, data, compression_level=9):
        """压缩Data到Memory"""
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            zipinfo = zipfile.ZipInfo(self.file_name)
            zipinfo.compress_type = zipfile.ZIP_DEFLATED
            zip_file.writestr(zipinfo, data, compresslevel=compression_level)

        return buffer.getvalue()

    def _create_large_object(self):
        result = select_one("SELECT lo_creat(-1)::int8 as lo_id;", [])
        return result["lo_id"]

    def _write_compressed_data(self, data, block_size=64 * 1024):
        buffer = io.BytesIO(data)
        offset = 0

        while True:
            chunk = buffer.read(block_size)
            if not chunk:
                break

            offset += len(chunk)
            select_one(
                "SELECT lo_put(%s::oid, %s::bigint, %s::bytea)::VARCHAR;", [self.loid, offset - len(chunk), chunk]
            )

    def get_bytes(self):
        buffer = io.BytesIO()
        for chunk in self.get_bytes_stream():
            buffer.write(chunk)
        data = buffer.getvalue()
        try:
            # DecompressData
            with zipfile.ZipFile(buffer) as zip_file:
                names = [name for name in zip_file.namelist() if not name.endswith("/")]
                if len(names) != 1:
                    return data
                # 用 zip 内ActualStorage的条目名，避免File名不Match
                name = names[0]
                return zip_file.read(name)
        except zipfile.BadZipFile:
            # IfData不是zipFormat，DirectReturnOriginalData
            return data

    def get_bytes_stream(self, start=0, end=None, chunk_size=64 * 1024):
        def _read_with_offset():
            offset = start
            while True:
                result = select_one(
                    "SELECT lo_get(%s::oid, %s, %s) as chunk",
                    [self.loid, offset, end - offset if end and (end - offset) < chunk_size else chunk_size],
                )
                chunk = result["chunk"] if result else None
                if not chunk:
                    break
                yield chunk
                offset += len(chunk)
                if len(chunk) < chunk_size:
                    break
                if end and offset > end:
                    break

        return _read_with_offset()


@receiver(pre_delete, sender=File)
def on_delete_file(sender, instance, **kwargs):
    exist = QuerySet(File).filter(loid=instance.loid).exclude(id=instance.id).exists()
    if not exist:
        select_one(f"SELECT lo_unlink({instance.loid})", [])
