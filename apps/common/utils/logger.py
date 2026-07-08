from datetime import datetime, timedelta
from logging.handlers import TimedRotatingFileHandler
import os
import logging

maxkb_logger = logging.getLogger('max_kb')


class DailyTimedRotatingFileHandler(TimedRotatingFileHandler):
    def rotator(self, source, dest):
        """ Override the original method to rotate the log file daily."""
        dest = self._get_rotate_dest_filename(source)
        if os.path.exists(source) and not os.path.exists(dest):
            # Exists多个Service进程时, 保证只有One进程Success rotate
            os.rename(source, dest)

    @staticmethod
    def _get_rotate_dest_filename(source):
        date_yesterday = (
            datetime.now() - timedelta(days=1)
        ).strftime('%Y-%m-%d')
        path = [
            os.path.dirname(source),
            date_yesterday,
            os.path.basename(source)
        ]
        filename = os.path.join(*path)
        os.makedirs(os.path.dirname(filename), 0o700, exist_ok=True)
        return filename
