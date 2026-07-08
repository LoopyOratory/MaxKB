# coding=utf-8
"""
    @project: qabot
    @Author: Tiger
    @file: split_model.py
    @date：2023/9/1 15:12
    @desc:
"""
import re
from functools import reduce
from typing import List, Dict

import jieba


def get_level_block(text, level_content_list, level_content_index, cursor):
    """
    从Text中Get块Data
    :param text: Text
    :param level_content_list: 拆分的titleArray
    :param level_content_index: Specify的下标
    :param cursor: Start的下标Position
    :return: 拆分 afterTextData
    """
    start_content: str = level_content_list[level_content_index].get('content')
    next_content = level_content_list[level_content_index + 1].get("content") if level_content_index + 1 < len(
        level_content_list) else None
    start_index = text.index(start_content, cursor)
    end_index = text.index(next_content, start_index + 1) if next_content is not None else len(text)
    return text[start_index + len(start_content):end_index], end_index


def to_tree_obj(content, state='title'):
    """
    Transform为树形Object
    :param content: TextData
    :param state:   Status: title block
    :return: Transform afterData
    """
    return {'content': content, 'state': state}


def remove_special_symbol(str_source: str):
    """
    DeletionSpecial characters
    :param str_source: NeedsDeletion的TextData
    :return: Deletion afterData
    """
    return str_source


def filter_special_symbol(content: dict):
    """
    FilterText in Special characters
    :param content: NeedsFilter的Object
    :return: Filter后Return
    """
    content['content'] = remove_special_symbol(content['content'])
    return content


def flat(tree_data_list: List[dict], parent_chain: List[dict], result: List[dict]):
    """
    扁平化树形结构Data
    :param tree_data_list: 树形InterfaceData
    :param parent_chain:   父级Data 传[] Used forRecursiveStorageData
    :param result:         ResponseData 传[] Used forRecursive存放Data
    :return: result 扁平化 afterData
    """
    if parent_chain is None:
        parent_chain = []
    if result is None:
        result = []
    for tree_data in tree_data_list:
        p = parent_chain.copy()
        p.append(tree_data)
        result.append(to_flat_obj(parent_chain, content=tree_data["content"], state=tree_data["state"]))
        children = tree_data.get('children')
        if children is not None and len(children) > 0:
            flat(children, p, result)
    return result


def to_paragraph(obj: dict):
    """
    Transform为Paragraph
    :param obj: NeedsTransform的Object
    :return: ParagraphObject
    """
    content = obj['content']
    return {"keywords": get_keyword(content),
            'parent_chain': list(map(lambda p: p['content'], obj['parent_chain'])),
            'content': ",".join(list(map(lambda p: p['content'], obj['parent_chain']))) + content}


def get_keyword(content: str):
    """
    Getcontent in 关键词
    :param content: Text
    :return: 关键词Array
    """
    stopwords = ['：', '“', '！', '”', '\n', '\\s']
    cutworms = jieba.lcut(content)
    return list(set(list(filter(lambda k: (k not in stopwords) | len(k) > 1, cutworms))))


def titles_to_paragraph(list_title: List[dict]):
    """
    将同一父级的titleTransform为块Paragraph
    :param list_title: 同父级title
    :return: 块Paragraph
    """
    if len(list_title) > 0:
        content = "\n,".join(
            list(map(lambda d: d['content'].strip("\r\n").strip("\n").strip("\\s"), list_title)))

        return {'keywords': '',
                'parent_chain': list(
                    map(lambda p: p['content'].strip("\r\n").strip("\n").strip("\\s"), list_title[0]['parent_chain'])),
                'content': ",".join(list(
                    map(lambda p: p['content'].strip("\r\n").strip("\n").strip("\\s"),
                        list_title[0]['parent_chain']))) + content}
    return None


def parse_group_key(level_list: List[dict]):
    """
    将同Level同父级的titleGenerateParagraph,加上本身的ParagraphData形成新的Data
    :param level_list: title n 级Data
    :return: Based ontitleGenerate的Data + ParagraphData
    """
    result = []
    group_data = group_by(list(filter(lambda f: f['state'] == 'title' and len(f['parent_chain']) > 0, level_list)),
                          key=lambda d: ",".join(list(map(lambda p: p['content'], d['parent_chain']))))
    result += list(map(lambda group_data_key: titles_to_paragraph(group_data[group_data_key]), group_data))
    result += list(map(to_paragraph, list(filter(lambda f: f['state'] == 'block', level_list))))
    return result


def to_block_paragraph(tree_data_list: List[dict]):
    """
    Transform为块ParagraphObject
    :param tree_data_list: 树Data
    :return: 块Paragraph
    """
    flat_list = flat(tree_data_list, [], [])
    level_group_dict: dict = group_by(flat_list, key=lambda f: f['level'])
    return list(map(lambda level: parse_group_key(level_group_dict[level]), level_group_dict))


def parse_title_level(text, content_level_pattern: List, index):
    if index >= len(content_level_pattern):
        return []
    result = parse_level(text, content_level_pattern[index])
    if len(result) == 0 and len(content_level_pattern) > index:
        return parse_title_level(text, content_level_pattern, index + 1)
    return result


def mask_code_blocks(text: str) -> str:
    """
    将Code块ContentReplace为等长空格,防止Code块内的#被识别为Title
    """
    result = list(text)
    for match in re.finditer(r'```[^\n]*\n.*?```', text, re.DOTALL):
        start = match.start()
        end = match.end()
        inner_start = text.index('\n', start) + 1
        closing_fence_start = text.rindex('```', start, end)
        for i in range(inner_start, closing_fence_start):
            if result[i] != '\n':
                result[i] = ' '
    return ''.join(result)


def parse_level(text, pattern: str):
    """
    Get正则Match toText
    :param text: NeedsMatch的Text
    :param pattern:  正则
    :return: Matches正则的Text
    """
    masked_text = mask_code_blocks(text)
    level_content_list = list(map(to_tree_obj, [r[0:255] for r in re_findall(pattern, masked_text) if r is not None]))
    # Filter掉空Title或只Contains#和Blank字符的Title
    filtered_list = [item for item in level_content_list
                     if item['content'].strip(' ') and item['content'].replace('#', '').strip(' ')]
    return list(map(filter_special_symbol, filtered_list))


def re_findall(pattern, text):
    # Check pattern Is空或无效
    if pattern is None:
        return []

    # IfStringType，CheckIs空String
    if isinstance(pattern, str) and (not pattern or not pattern.strip()):
        return []

    try:
        result = re.findall(pattern, text, flags=0)
    except re.error:
        return []

    return list(filter(lambda r: r is not None and len(r) > 0, reduce(lambda x, y: [*x, *y], list(
        map(lambda row: [*(row if isinstance(row, tuple) else [row])], result)),
                                                                      [])))


def to_flat_obj(parent_chain: List[dict], content: str, state: str):
    """
    将树形属性Transform为扁平Object
    :param parent_chain:
    :param content:
    :param state:
    :return:
    """
    return {'parent_chain': parent_chain, 'level': len(parent_chain), "content": content, 'state': state}


def flat_map(array: List[List]):
    """
    将二位Array转为一维Array
    :param array: 二维Array
    :return: 一维Array
    """
    result = []
    for e in array:
        result += e
    return result


def group_by(list_source: List, key):
    """
    將數組分組
    :param list_source: Needs分組的數組
    :param key: 分組函數
    :return: key->[]
    """
    result = {}
    for e in list_source:
        k = key(e)
        array = result.get(k) if k in result else []
        array.append(e)
        result[k] = array
    return result


def result_tree_to_paragraph(result_tree: List[dict], result, parent_chain, with_filter: bool):
    """
    Transform为SegmentObject
    :param result_tree: ParseText的树
    :param result:      传[]  Used forRecursive
    :param parent_chain: 传[] UserRecursiveStorageData
    :param with_filter: WhetherFilterblock
    :return: List[{'problem':'xx','content':'xx'}]
    """
    for item in result_tree:
        if item.get('state') == 'block':
            result.append({'title': " ".join(parent_chain),
                           'content': filter_special_char(item.get("content")) if with_filter else item.get("content")})
        children = item.get("children")
        if children is not None and len(children) > 0:
            result_tree_to_paragraph(children, result,
                                     [*parent_chain, remove_special_symbol(item.get('content'))], with_filter)
    return result


def post_handler_paragraph(content: str, limit: int):
    """
    Based onText的Maximum字符Segment
    :param content: NeedsSegment的TextField
    :param limit:   MaximumSegment字符
    :return: Segment后Data
    """
    result = []
    temp_char, start = '', 0
    while (pos := content.find("\n", start)) != -1:
        split, start = content[start:pos + 1], pos + 1
        if len(temp_char + split) > limit:
            if len(temp_char) > 4096:
                pass
            result.append(temp_char)
            temp_char = ''
        temp_char = temp_char + split
    temp_char = temp_char + content[start:]
    if len(temp_char) > 0:
        if len(temp_char) > 4096:
            pass
        result.append(temp_char)

    pattern = "[\\S\\s]{1," + str(limit) + '}'
    # If\n 单段超过Limit,则继续拆分
    return reduce(lambda x, y: [*x, *y], map(lambda row: re.findall(pattern, row), result), [])


def smart_split_paragraph(content: str, limit: int):
    """
    智能Segment:在limit前找到合适的Split点(句号、回车等)
    :param content: NeedsSegment的Text
    :param limit: Maximum字符Limit
    :return: Segment afterTextList
    """
    if len(content) <= limit:
        return [content]

    result = []
    start = 0

    while start < len(content):
        end = start + limit

        if end >= len(content):
            # 剩余Text不超过Limit,DirectAdd
            result.append(content[start:])
            break

        # 在limitRange内寻找最佳Split点
        best_split = end

        # 优先级:句号 > 感叹号/问号 > 回车
        split_chars = [
            ('。', 0), ('.', 0),  # 中英文句号
            ('!', 0), ('!', 0),  # 中英文感叹号
            ('?', 0), ('?', 0),  # 中英文问号
        ]

        # 从后往前找Split点
        for i in range(end - 1, start + limit // 2, -1):  # 至少Retain一半Content
            for char, offset in split_chars:
                if content[i] == char:
                    best_split = i + 1  # Contains分隔符在Current段
                    break
            if best_split != end:
                break

        # If找不到合适Split点,UseOriginallimit
        if best_split == end and end < len(content):
            best_split = end

        result.append(content[start:best_split])
        start = best_split

    return [text for text in result if text.strip()]


replace_map = {
    re.compile('\n+'): '\n',
    re.compile(' +'): ' ',
    re.compile('#+'): "",
    re.compile("\t+"): ''
}


def filter_special_char(content: str):
    """
    Filter特殊Field
    :param content: Text
    :return: Filter后Field
    """
    items = replace_map.items()
    for key, value in items:
        content = re.sub(key, value, content)
    return content


class SplitModel:

    def __init__(self, content_level_pattern, with_filter=True, limit=100000):
        self.content_level_pattern = content_level_pattern
        self.with_filter = with_filter
        if type(limit) is not int:
            limit = int(limit)
        if limit is None or limit > 100000:
            limit = 100000
        if limit < 50:
            limit = 50
        self.limit = limit

    def parse_to_tree(self, text: str, index=0):
        """
         ParseText
        :param text: NeedsParse的Text
        :param index: 从那个正则StartParse
        :return: Parse after树形ResultData
        """
        level_content_list = parse_title_level(text, self.content_level_pattern, index)
        if len(level_content_list) == 0:
            return [to_tree_obj(row, 'block') for row in smart_split_paragraph(text, limit=self.limit)]
        if index == 0 and text.lstrip().index(level_content_list[0]["content"].lstrip()) != 0:
            level_content_list.insert(0, to_tree_obj(""))

        cursor = 0
        level_title_content_list = [item for item in level_content_list if item.get('state') == 'title']
        for i in range(len(level_title_content_list)):
            start_content: str = level_title_content_list[i].get('content')
            if cursor < text.index(start_content, cursor):
                for row in smart_split_paragraph(text[cursor:   text.index(start_content, cursor)], limit=self.limit):
                    level_content_list.insert(0, to_tree_obj(row, 'block'))

            block, cursor = get_level_block(text, level_title_content_list, i, cursor)
            if len(block) == 0:
                continue
            children = self.parse_to_tree(text=block, index=index + 1)
            level_title_content_list[i]['children'] = children
            first_child_idx_in_block = block.lstrip().index(children[0]["content"].lstrip())
            if first_child_idx_in_block != 0:
                inner_children = self.parse_to_tree(block[:first_child_idx_in_block], index + 1)
                level_title_content_list[i]['children'].extend(inner_children)
        return level_content_list

    def parse(self, text: str):
        """
        ParseText
        :param text: TextData
        :return: Parse后Data {content:ParagraphData,keywords:[‘Paragraph关键词’],parent_chain:['Paragraph父级链路']}
        """
        text = text.replace('\r\n', '\n')
        text = text.replace('\r', '\n')
        text = text.replace("\0", '')
        result_tree = self.parse_to_tree(text, 0)
        result = result_tree_to_paragraph(result_tree, [], [], self.with_filter)
        for e in result:
            if len(e['content']) > 4096:
                pass
        title_list = list(set([row.get('title') for row in result]))
        return [item for item in [self.post_reset_paragraph(row, title_list) for row in result] if
                'content' in item and len(item.get('content').strip()) > 0]

    def post_reset_paragraph(self, paragraph: Dict, title_list: List[str]):
        result = self.content_is_null(paragraph, title_list)
        result = self.filter_title_special_characters(result)
        result = self.sub_title(result)
        return result

    @staticmethod
    def sub_title(paragraph: Dict):
        if 'title' in paragraph:
            title = paragraph.get('title')
            if len(title) > 255:
                return {**paragraph, 'title': title[0:255], 'content': title[255:len(title)] + paragraph.get('content')}
        return paragraph

    @staticmethod
    def content_is_null(paragraph: Dict, title_list: List[str]):
        if 'title' in paragraph:
            title = paragraph.get('title')
            content = paragraph.get('content')
            if (content is None or len(content.strip()) == 0) and (title is not None and len(title) > 0):
                find = [t for t in title_list if t.__contains__(title) and t != title]
                if find:
                    return {'title': '', 'content': ''}
                return {'title': '', 'content': title}
        return paragraph

    @staticmethod
    def filter_title_special_characters(paragraph: Dict):
        title = paragraph.get('title') if 'title' in paragraph else ''
        for title_special_characters in title_special_characters_list:
            title = title.replace(title_special_characters, '')
        return {**paragraph,
                'title': title}


title_special_characters_list = ['#', '\n', '\r', '\\s']

default_split_pattern = {
    'md': [re.compile('(?<=^)# .*|(?<=\\n)# .*'),
           re.compile('(?<=\\n)(?<!#)## (?!#).*|(?<=^)(?<!#)## (?!#).*'),
           re.compile("(?<=\\n)(?<!#)### (?!#).*|(?<=^)(?<!#)### (?!#).*"),
           re.compile("(?<=\\n)(?<!#)#### (?!#).*|(?<=^)(?<!#)#### (?!#).*"),
           re.compile("(?<=\\n)(?<!#)##### (?!#).*|(?<=^)(?<!#)##### (?!#).*"),
           re.compile("(?<=\\n)(?<!#)###### (?!#).*|(?<=^)(?<!#)###### (?!#).*")],
    'default': [re.compile("(?<!\n)\n\n+")]
}


def get_split_model(filename: str, with_filter: bool = False, limit: int = 100000):
    """
    Based onFileNameGetSegmentModel
    :param limit:        每段Size
    :param with_filter: WhetherFilterSpecial characters
    :param filename: FileName
    :return: SegmentModel
    """
    if filename.endswith(".md"):
        pattern_list = default_split_pattern.get('md')
    else:
        pattern_list = default_split_pattern.get('default')
    return SplitModel(pattern_list, with_filter=with_filter, limit=limit)


def to_title_tree_string(result_tree: List):
    f = flat(result_tree, [], [])
    return "\n│".join(list(map(lambda r: title_tostring(r), list(filter(lambda row: row.get('state') == 'title', f)))))


def title_tostring(title_obj):
    f = "│ ".join(list(map(lambda index: " ", range(0, len(title_obj.get("parent_chain"))))))
    return f + "├───" + title_obj.get('content')
