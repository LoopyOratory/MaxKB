# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: siliconcloud_reranker.py
    @date：2024/9/10 9:45
    @desc: SiliconCloud Document重排封装
"""
import json
from typing import Sequence, Optional, Any, Dict
import requests

from langchain_core.callbacks import Callbacks
from langchain_core.documents import BaseDocumentCompressor, Document

from models_provider.base_model_provider import MaxKBBaseModel


class DockerAIReranker(MaxKBBaseModel, BaseDocumentCompressor):
    api_base: Optional[str]
    model: Optional[str]

    top_n: Optional[int] = 3  # Take first N 个最Related的Result

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        return DockerAIReranker(
            api_base=model_credential.get('api_base'),
            model=model_name,
            top_n=model_kwargs.get('top_n', 3)
        )

    def compress_documents(self, documents: Sequence[Document], query: str, callbacks: Optional[Callbacks] = None) -> \
            Sequence[Document]:
        if not documents:
            return []

        # 预ProcessText
        texts = [doc.page_content for doc in documents]

        headers = {
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "query": query,
            "documents": texts,
            "top_n": self.top_n,
        }

        response = requests.post(f"{self.api_base}/rerank", data=json.dumps(payload), headers=headers)

        if response.status_code != 200:
            raise RuntimeError(f"Docker AI API RequestFailure: {response.text}")

        res = response.json()

        # ParseReturn result
        return [
            Document(
                page_content=payload['documents'][item.get('index')],
                metadata={'relevance_score': item.get('relevance_score')}
            )
            for item in res.get('results', [])
        ]
