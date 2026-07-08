# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: rsa_util.py
    @date：2023/11/3 11:13
    @desc:
"""
import base64
import threading

from Crypto.Cipher import PKCS1_v1_5 as PKCS1_cipher
from Crypto.PublicKey import RSA
from django.core import cache
from django.db.models import QuerySet

from common.constants.cache_version import Cache_Version
from local_model.models.system_setting import SystemSetting, SettingType

lock = threading.Lock()
rsa_cache = cache.cache
cache_key = "rsa_key"
# 对Secret keyEncrypt的Password
secret_code = "mac_kb_password"


def generate():
    """
    Generate Private keySecret key对
    :return:{key:'Public key',value:'Private key'}
    """
    # GenerateOne 2048 位的Secret key
    key = RSA.generate(2048)

    # GetPrivate key
    encrypted_key = key.export_key(passphrase=secret_code, pkcs=8,
                                   protection="scryptAndAES128-CBC")
    return {'key': key.publickey().export_key(), 'value': encrypted_key}


def get_key_pair():
    rsa_value = rsa_cache.get(cache_key)
    if rsa_value is None:
        with lock:
            rsa_value = rsa_cache.get(cache_key)
            if rsa_value is not None:
                return rsa_value
            rsa_value = get_key_pair_by_sql()
            version, get_key = Cache_Version.SYSTEM.value
            rsa_cache.set(get_key(key='rsa_key'), rsa_value, timeout=None, version=version)
    return rsa_value


def get_key_pair_by_sql():
    system_setting = QuerySet(SystemSetting).filter(type=SettingType.RSA.value).first()
    if system_setting is None:
        kv = generate()
        system_setting = SystemSetting(type=SettingType.RSA.value,
                                       meta={'key': kv.get('key').decode(), 'value': kv.get('value').decode()})
        system_setting.save()
    return system_setting.meta


def encrypt(msg, public_key: str | None = None):
    """
    Encrypt
    :param msg:        EncryptData
    :param public_key: Public key
    :return: Encrypt afterData
    """
    if public_key is None:
        public_key = get_key_pair().get('key')
    cipher = PKCS1_cipher.new(RSA.importKey(public_key))
    encrypt_msg = cipher.encrypt(msg.encode("utf-8"))
    return base64.b64encode(encrypt_msg).decode()


def decrypt(msg, pri_key: str | None = None):
    """
    Decrypt
    :param msg: NeedsDecrypt的Data
    :param pri_key: Private key
    :return: Decrypt后Data
    """
    if pri_key is None:
        pri_key = get_key_pair().get('value')
    cipher = PKCS1_cipher.new(RSA.importKey(pri_key, passphrase=secret_code))
    decrypt_data = cipher.decrypt(base64.b64decode(msg), 0)
    return decrypt_data.decode("utf-8")


def rsa_long_encrypt(message, public_key: str | None = None, length=200):
    """
    Extra longTextEncrypt

    :param message:         NeedsEncrypt的String
    :param public_key   Public key
    :param length:      1024bit certificate for100， 2048bit certificate for 200
    :return: Encrypt afterData
    """
    # ReadPublic key
    if public_key is None:
        public_key = get_key_pair().get('key')
    cipher = PKCS1_cipher.new(RSA.importKey(extern_key=public_key,
                                            passphrase=secret_code))
    # Process：Plaintext is too long. SegmentEncrypt
    if len(message) <= length:
        # 对Encoding的DataPerformEncrypt, andThroughbase64PerformEncoding
        result = base64.b64encode(cipher.encrypt(message.encode('utf-8')))
    else:
        rsa_text = []
        # 对Encoding afterDataPerform切片，原因：EncryptLength不能过长
        for i in range(0, len(message), length):
            cont = message[i:i + length]
            # 对切片 afterDataPerformEncrypt, andAdd到text后面
            rsa_text.append(cipher.encrypt(cont.encode('utf-8')))
        # Encrypt完PerformConcatenate
        cipher_text = b''.join(rsa_text)
        # base64PerformEncoding
        result = base64.b64encode(cipher_text)
    return result.decode()


def rsa_long_decrypt(message, pri_key: str | None = None, length=256):
    """
    Extra longTextDecrypt，Default不Encrypt
    :param  message:    NeedsDecrypt的Data
    :param  pri_key:    Secret key
    :param  length :     1024bit certificate for128，2048bit证书用256位
    :return: Decrypt afterData
    """
    if pri_key is None:
        pri_key = get_key_pair().get('value')
    cipher = PKCS1_cipher.new(RSA.importKey(pri_key, passphrase=secret_code))
    base64_de = base64.b64decode(message)
    res = []
    for i in range(0, len(base64_de), length):
        res.append(cipher.decrypt(base64_de[i:i + length], 0))
    return b"".join(res).decode()
