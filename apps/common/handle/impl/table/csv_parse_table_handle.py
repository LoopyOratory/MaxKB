# coding=utf-8
import csv
import io
import traceback

from charset_normalizer import detect
from common.handle.base_parse_qa_handle import get_title_row_index_dict, get_row_value
from common.handle.base_parse_table_handle import BaseParseTableHandle
from common.utils.logger import maxkb_logger


class CsvParseTableHandle(BaseParseTableHandle):
    def support(self, file, get_buffer):
        file_name: str = file.name.lower()
        if file_name.endswith(".csv"):
            return True
        return False

    def handle(self, file, get_buffer, save_image):
        buffer = get_buffer(file)
        try:
            content = buffer.decode(detect(buffer)['encoding'])
        except BaseException as e:
            maxkb_logger.error(f"Error processing CSV file {file.name}: {e}, {traceback.format_exc()}")
            return [{'name': file.name, 'paragraphs': []}]

        csv_model = content.split('\n')
        paragraphs = []
        # First row为Title
        title = csv_model[0].split(',')
        for row in csv_model[1:]:
            if not row:
                continue
            line = '; '.join([f'{key}:{value}' for key, value in zip(title, row.split(','))])
            paragraphs.append({'title': '', 'content': line})

        return [{'name': file.name, 'paragraphs': paragraphs}]

    def get_content(self, file, save_image):
        buffer = file.read()
        try:
            reader = csv.reader(io.TextIOWrapper(io.BytesIO(buffer), encoding=detect(buffer)['encoding']))
            rows = list(reader)

            if not rows:
                return ""

            # Build Markdown Table
            md_lines = []

            # AddHeader
            header = [cell.replace('\n', '<br>').replace('\r', '') for cell in rows[0]]
            md_lines.append('| ' + ' | '.join(header) + ' |')

            # Add分隔线
            md_lines.append('| ' + ' | '.join(['---'] * len(header)) + ' |')

            # AddData行
            for row in rows[1:]:
                if row:  # 跳过空行
                    # Ensure行Length与HeaderConsistent,并将NewlineTransform为 <br>
                    padded_row = [
                                     cell.replace('\n', '<br>').replace('\r', '') for cell in row
                                 ] + [''] * (len(header) - len(row))
                    md_lines.append('| ' + ' | '.join(padded_row[:len(header)]) + ' |')

            return '\n'.join(md_lines)

        except Exception as e:
            maxkb_logger.error(f"Error processing CSV file {file.name}: {e}, {traceback.format_exc()}")
            return ""
