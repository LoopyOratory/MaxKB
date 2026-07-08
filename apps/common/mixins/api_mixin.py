# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: ApiMixin.py
    @date：2025/4/14 18:03
    @desc:
"""


class APIMixin:
    @staticmethod
    def get_request():
        return None

    @staticmethod
    def get_response():
        return None

    @staticmethod
    def get_parameters():
        """
         return OpenApiParameter(
            # Parameters的Name是done
            name="done",
            # 对Parameters的Remark
            description="WhetherComplete",
            # SpecifyParameters的Type
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            # SpecifyMust给
            required=True,
            # Specify枚举项
            enum=[True, False],
        )

        """
        return None
