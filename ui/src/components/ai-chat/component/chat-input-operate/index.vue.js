/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { t } from '@/locales';
import Recorder from 'recorder-core';
import TouchChat from './TouchChat.vue';
import applicationApi from '@/api/application/application';
import { MsgAlert, MsgWarning } from '@/utils/message';
import { useRoute, useRouter } from 'vue-router';
import { getImgUrl } from '@/utils/common';
import bus from '@/bus';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
import chatAPI from '@/api/chat/chat';
const router = useRouter();
const route = useRoute();
const { query: { mode, question }, } = route;
const quickInputRef = ref();
const props = withDefaults(defineProps(), {
    applicationDetails: () => ({}),
    available: true,
});
const emit = defineEmits(['update:chatId', 'update:loading', 'update:showUserInput', 'backBottom']);
const chartOpenId = ref();
const chatId_context = computed({
    get: () => {
        if (chartOpenId.value) {
            return chartOpenId.value;
        }
        return props.chatId;
    },
    set: (v) => {
        chartOpenId.value = v;
        emit('update:chatId', v);
    },
});
// Speech-to-text request spinner, independent of loading prop (loading is now parent unidirectional "current session generating state")
const speechLoading = ref(false);
const showURLSetting = ref(false);
const urlForm = reactive({
    source_url: '',
    type: '',
});
const uploadLoading = computed(() => {
    return Object.values(filePromisionDict.value).length > 0;
});
const inputPlaceholder = computed(() => {
    return recorderStatus.value === 'START'
        ? `${t('aiChat.inputPlaceholder.speaking')}...`
        : recorderStatus.value === 'TRANSCRIBING'
            ? `${t('aiChat.inputPlaceholder.recorderLoading')}...`
            : `${t('aiChat.inputPlaceholder.default')}`;
});
const upload = ref();
const imageExtensions = ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP'];
const documentExtensions = ['PDF', 'DOCX', 'TXT', 'XLS', 'XLSX', 'MD', 'HTML', 'CSV'];
const videoExtensions = ['MP4', 'AVI', 'MKV', 'MOV', 'FLV', 'WMV'];
const audioExtensions = ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'];
const otherExtensions = ref(['PPT', 'DOC']);
const getAcceptList = () => {
    const { image, document, audio, video, other } = props.applicationDetails.file_upload_setting;
    let accepts = [];
    if (image) {
        accepts = [...imageExtensions];
    }
    if (document) {
        accepts = [...accepts, ...documentExtensions];
    }
    if (audio) {
        accepts = [...accepts, ...audioExtensions];
    }
    if (video) {
        accepts = [...accepts, ...videoExtensions];
    }
    if (other) {
        // OtherFileType
        otherExtensions.value = props.applicationDetails.file_upload_setting.otherExtensions;
        accepts = [...accepts, ...otherExtensions.value];
    }
    if (accepts.length === 0) {
        return `.${t('aiChat.uploadFile.tipMessage')}`;
    }
    return accepts.map((ext) => '.' + ext).join(',');
};
const checkMaxFilesLimit = () => {
    return (props.applicationDetails.file_upload_setting.maxFiles <=
        uploadImageList.value.length +
            uploadDocumentList.value.length +
            uploadAudioList.value.length +
            uploadVideoList.value.length +
            uploadOtherList.value.length);
};
const filePromisionDict = ref({});
const uploadFile = async (file, fileList) => {
    const { maxFiles, fileLimit } = props.applicationDetails.file_upload_setting;
    // SingleUploadFileCountLimit
    const file_limit_once = uploadImageList.value.length +
        uploadDocumentList.value.length +
        uploadAudioList.value.length +
        uploadVideoList.value.length +
        uploadOtherList.value.length;
    if (file_limit_once >= maxFiles) {
        MsgWarning(t('aiChat.uploadFile.limitMessage1') + maxFiles + t('aiChat.uploadFile.limitMessage2'));
        fileList.splice(0, fileList.length, ...fileList.slice(0, maxFiles));
        return;
    }
    if (file.size == 0) {
        MsgWarning(t('aiChat.uploadFile.sizeLimit2'));
        fileList.splice(0, fileList.length, ...fileList.filter((f) => f.size > 0));
        return;
    }
    if (file.size > fileLimit * 1024 * 1024) {
        // MB
        MsgWarning(t('aiChat.uploadFile.sizeLimit') + fileLimit + 'MB');
        fileList.splice(0, fileList.length, ...fileList.filter((f) => f.size <= fileLimit * 1024 * 1024));
        return;
    }
    filePromisionDict.value[file.uid] = false;
    const inner = reactive(file);
    fileAllList.value.push(inner);
    if (!chatId_context.value) {
        chatId_context.value = await props.openChatId();
    }
    const api = props.type === 'debug-ai-chat'
        ? applicationApi.postUploadFile(file.raw, 'TEMPORARY_120_MINUTE', 'TEMPORARY_120_MINUTE')
        : chatAPI.postUploadFile(file.raw, chatId_context.value, 'CHAT');
    api.then((ok) => {
        inner.url = ok.data;
        const split_path = ok.data.split('/');
        inner.file_id = split_path[split_path.length - 1];
        delete filePromisionDict.value[file.uid];
    });
    showURLSetting.value = false;
};
// PasteProcess
const handlePaste = (event) => {
    if (!props.applicationDetails.file_upload_enable)
        return;
    const clipboardData = event.clipboardData;
    if (!clipboardData)
        return;
    // GetClipboard in File
    const files = clipboardData.files;
    if (files.length === 0)
        return;
    // Transform FileList to array and traverse for processing
    Array.from(files).forEach((rawFile) => {
        // CreationMatches el-upload RequiresFileObject
        const elFile = {
            uid: Date.now(), // GenerateUniqueID
            name: rawFile.name,
            size: rawFile.size,
            raw: rawFile, // OriginalFileObject
            status: 'ready', // FileState
            percentage: 0, // UploadProgress
        };
        // ManualTriggerUploadLogic(Simulate on-change Event）
        uploadFile(elFile, [elFile]);
    });
    // BlockDefaultPasteBehavior
    event.preventDefault();
};
// AddDragProcess
const handleDrop = (event) => {
    if (!props.applicationDetails.file_upload_enable)
        return;
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (!files)
        return;
    Array.from(files).forEach((rawFile) => {
        const elFile = {
            uid: Date.now(),
            name: rawFile.name,
            size: rawFile.size,
            raw: rawFile,
            status: 'ready',
            percentage: 0,
        };
        uploadFile(elFile, [elFile]);
    });
};
// Voice recordingTaskid
const intervalId = ref(null);
// Voice recordingStartSeconds
const recorderTime = ref(0);
// START:StartRecording TRANSCRIBING:TransformIn text
const recorderStatus = ref('STOP');
const inputValue = ref('');
const fileAllList = ref([]);
const fileFilter = (fileList, extensionList) => {
    return fileList.filter((f) => {
        return extensionList.includes(f.name.split('.').pop().toUpperCase());
    });
};
const uploadImageList = computed(() => fileFilter(fileAllList.value, imageExtensions));
const uploadDocumentList = computed(() => fileFilter(fileAllList.value, documentExtensions));
const uploadVideoList = computed(() => fileFilter(fileAllList.value, videoExtensions));
const uploadAudioList = computed(() => fileFilter(fileAllList.value, audioExtensions));
const uploadOtherList = computed(() => fileFilter(fileAllList.value, otherExtensions.value.map((item) => item.toUpperCase())));
const showDelete = ref('');
const isDisabledChat = computed(() => !((inputValue.value.trim() ||
    uploadImageList.value.length > 0 ||
    uploadDocumentList.value.length > 0 ||
    uploadVideoList.value.length > 0 ||
    uploadAudioList.value.length > 0 ||
    uploadOtherList.value.length > 0) &&
    (props.appId || props.applicationDetails?.name)));
// WhetherShowMobile voice inputButton
const isMicrophone = ref(false);
const switchMicrophone = (status) => {
    if (status) {
        // IfShowRequest microphonePermission
        recorderManage.open(() => {
            isMicrophone.value = true;
        });
    }
    else {
        // CloseMicrophone
        recorderManage.close();
        isMicrophone.value = false;
    }
};
const TouchEnd = (bool) => {
    if (bool) {
        stopRecording();
        recorderStatus.value = 'STOP';
    }
    else {
        stopTimer();
        recorderStatus.value = 'STOP';
    }
};
// CancelRecordingConsoleLog
Recorder.CLog = function () { };
class RecorderManage {
    recorder;
    uploadRecording;
    constructor(uploadRecording) {
        this.uploadRecording = uploadRecording;
    }
    open(callback) {
        const recorder = new Recorder({
            type: 'mp3',
            bitRate: 128,
            sampleRate: 16000,
        });
        if (!this.recorder) {
            recorder.open(() => {
                this.recorder = recorder;
                if (callback) {
                    callback();
                }
            }, this.errorCallBack);
        }
    }
    start() {
        if (this.recorder) {
            this.recorder.start();
            recorderStatus.value = 'START';
            handleTimeChange();
        }
        else {
            const recorder = new Recorder({
                type: 'mp3',
                bitRate: 128,
                sampleRate: 16000,
            });
            recorder.open(() => {
                this.recorder = recorder;
                recorder.start();
                recorderStatus.value = 'START';
                handleTimeChange();
            }, this.errorCallBack);
        }
    }
    stop() {
        if (this.recorder) {
            this.recorder.stop((blob, duration) => {
                if (mode !== 'mobile') {
                    this.close();
                }
                this.uploadRecording(blob, duration);
            }, (err) => {
                MsgAlert(t('common.tip'), err, {
                    confirmButtonText: t('aiChat.tip.confirm'),
                    dangerouslyUseHTMLString: true,
                    customClass: 'record-tip-confirm',
                });
            });
        }
    }
    close() {
        if (this.recorder) {
            this.recorder.close();
            this.recorder = undefined;
        }
    }
    errorCallBack(err, isUserNotAllow) {
        if (isUserNotAllow) {
            MsgAlert(t('common.tip'), err, {
                confirmButtonText: t('aiChat.tip.confirm'),
                dangerouslyUseHTMLString: true,
                customClass: 'record-tip-confirm',
            });
        }
        else {
            MsgAlert(t('common.tip'), `${err}
        <div style="width: 100%;height:1px;border-top:1px var(--el-border-color) var(--el-border-style);margin:10px 0;"></div>
        ${t('aiChat.tip.recorderTip')}
    <img src="${new URL(`/tipIMG.jpg`, import.meta.url).href}" style="width: 100%;" />`, {
                confirmButtonText: t('aiChat.tip.confirm'),
                dangerouslyUseHTMLString: true,
                customClass: 'record-tip-confirm',
            });
        }
    }
}
const getSpeechToTextAPI = () => {
    if (props.type === 'ai-chat') {
        return (id, data, loading) => {
            return chatAPI.speechToText(data, loading);
        };
    }
    else {
        return applicationApi.speechToText;
    }
};
const speechToTextAPI = getSpeechToTextAPI();
// UploadRecordingFile
const uploadRecording = async (audioBlob) => {
    try {
        // Non-automatic send mode input box
        if (!props.applicationDetails.stt_autosend) {
            switchMicrophone(false);
        }
        recorderStatus.value = 'TRANSCRIBING';
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.mp3');
        if (props.applicationDetails.stt_autosend) {
            bus.emit('on:transcribing', true);
        }
        speechToTextAPI(props.applicationDetails.id, formData, speechLoading)
            .then((response) => {
            const newText = typeof response.data === 'string' ? response.data : '';
            inputValue.value = inputValue.value ? `${inputValue.value} ${newText}` : newText;
            // AutomaticSend
            if (props.applicationDetails.stt_autosend) {
                nextTick(() => {
                    autoSendMessage();
                });
            }
            else {
                switchMicrophone(false);
            }
        })
            .catch((error) => {
            console.error(`${t('aiChat.uploadFile.errorMessage')}:`, error);
        })
            .finally(() => {
            recorderStatus.value = 'STOP';
            bus.emit('on:transcribing', false);
        });
    }
    catch (error) {
        recorderStatus.value = 'STOP';
        console.error(`${t('aiChat.uploadFile.errorMessage')}:`, error);
    }
};
const recorderManage = new RecorderManage(uploadRecording);
// StartRecording
const startRecording = () => {
    recorderManage.start();
};
// StopRecording
const stopRecording = () => {
    recorderManage.stop();
};
const handleTimeChange = () => {
    recorderTime.value = 0;
    if (intervalId.value) {
        return;
    }
    intervalId.value = setInterval(() => {
        if (recorderStatus.value === 'STOP') {
            clearInterval(intervalId.value);
            intervalId.value = null;
            return;
        }
        recorderTime.value++;
        if (recorderTime.value === 60) {
            if (mode !== 'mobile') {
                stopRecording();
                clearInterval(intervalId.value);
                intervalId.value = null;
                recorderStatus.value = 'STOP';
            }
        }
    }, 1000);
};
// Stop timer function
const stopTimer = () => {
    if (intervalId.value !== null) {
        clearInterval(intervalId.value);
        recorderTime.value = 0;
        intervalId.value = null;
    }
};
const getQuestion = () => {
    if (!inputValue.value.trim()) {
        const fileLength = [
            uploadImageList.value.length > 0,
            uploadDocumentList.value.length > 0,
            uploadAudioList.value.length > 0,
            uploadVideoList.value.length > 0,
            uploadOtherList.value.length > 0,
        ];
        if (fileLength.filter((f) => f).length > 1) {
            return t('aiChat.uploadFile.otherMessage');
        }
        else if (fileLength[0]) {
            return t('aiChat.uploadFile.imageMessage');
        }
        else if (fileLength[1]) {
            return t('aiChat.uploadFile.documentMessage');
        }
        else if (fileLength[2]) {
            return t('aiChat.uploadFile.audioMessage');
        }
        else if (fileLength[3]) {
            return t('aiChat.uploadFile.videoMessage');
        }
        else if (fileLength[4]) {
            return t('aiChat.uploadFile.otherMessage');
        }
    }
    return inputValue.value.trim();
};
function autoSendMessage() {
    props
        .validate()
        .then(() => {
        props.sendMessage(getQuestion(), {
            image_list: uploadImageList.value,
            document_list: uploadDocumentList.value,
            audio_list: uploadAudioList.value,
            video_list: uploadVideoList.value,
            other_list: uploadOtherList.value,
        });
        inputValue.value = '';
        fileAllList.value = [];
        if (upload.value) {
            upload.value.clearFiles();
        }
        if (quickInputRef.value) {
            quickInputRef.value.textarea.style.height = '45px';
        }
    })
        .catch(() => { });
}
function sendChatHandle(event) {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // IfMoveEnd, andPressEnter key, notDirectSend
    if ((isMobile || mode === 'mobile') && event?.key === 'Enter') {
        // BlockDefaultEvent
        return;
    }
    if (!event?.ctrlKey && !event?.shiftKey && !event?.altKey && !event?.metaKey) {
        // If no modifier key is pressed, block the default event
        event?.preventDefault();
        if (!isDisabledChat.value && !props.loading && !event?.isComposing && !uploadLoading.value) {
            if (inputValue.value.trim() || fileAllList.value.length > 0) {
                autoSendMessage();
            }
        }
    }
    else {
        // If ctrl/shift/cmd/opt + enter is pressed simultaneously, insert a newline
        insertNewlineAtCursor(event);
    }
}
const insertNewlineAtCursor = (event) => {
    const textarea = quickInputRef.value.$el.querySelector('.el-textarea__inner');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    // Block default behavior (avoid extra newlines)
    event.preventDefault();
    // At cursor, insert newline
    inputValue.value = inputValue.value.slice(0, startPos) + '\n' + inputValue.value.slice(endPos);
    nextTick(() => {
        textarea.setSelectionRange(startPos + 1, startPos + 1); // Position cursor after newline
    });
};
function deleteFile(item) {
    fileAllList.value = fileAllList.value.filter((i) => i != item);
}
function mouseenter(row) {
    showDelete.value = row.url;
}
function mouseleave() {
    showDelete.value = '';
}
function stopChat() {
    bus.emit('chat:stop');
}
onMounted(() => {
    bus.on('chat-input', (message) => {
        inputValue.value = message;
    });
    if (question) {
        inputValue.value = decodeURIComponent(question.trim());
        sendChatHandle();
        setTimeout(() => {
            // GetCurrentRouteInfo
            const route = router.currentRoute.value;
            // CopyqueryObject
            const query = { ...route.query };
            // DeletionSpecificParameters
            delete query.question;
            const newRoute = Object.entries(query)?.length > 0
                ? route.path +
                    '?' +
                    Object.entries(query)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&')
                : route.path;
            history.pushState(null, '', '/chat' + newRoute);
        }, 100);
    }
    setTimeout(() => {
        nextTick(() => {
            quickInputRef.value.textarea.style.height = '0';
        });
    }, 800);
});
const mime_types = {
    html: 'text/html',
    htm: 'text/html',
    shtml: 'text/html',
    css: 'text/css',
    xml: 'text/xml',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'application/javascript',
    atom: 'application/atom+xml',
    rss: 'application/rss+xml',
    mml: 'text/mathml',
    txt: 'text/plain',
    jad: 'text/vnd.sun.j2me.app-descriptor',
    wml: 'text/vnd.wap.wml',
    htc: 'text/x-component',
    avif: 'image/avif',
    png: 'image/png',
    svg: 'image/svg+xml',
    svgz: 'image/svg+xml',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    wbmp: 'image/vnd.wap.wbmp',
    webp: 'image/webp',
    ico: 'image/x-icon',
    jng: 'image/x-jng',
    bmp: 'image/x-ms-bmp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    jar: 'application/java-archive',
    war: 'application/java-archive',
    ear: 'application/java-archive',
    json: 'application/json',
    hqx: 'application/mac-binhex40',
    doc: 'application/msword',
    pdf: 'application/pdf',
    ps: 'application/postscript',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    eps: 'application/postscript',
    ai: 'application/postscript',
    rtf: 'application/rtf',
    m3u8: 'application/vnd.apple.mpegurl',
    kml: 'application/vnd.google-earth.kml+xml',
    kmz: 'application/vnd.google-earth.kmz',
    xls: 'application/vnd.ms-excel',
    eot: 'application/vnd.ms-fontobject',
    ppt: 'application/vnd.ms-powerpoint',
    odg: 'application/vnd.oasis.opendocument.graphics',
    odp: 'application/vnd.oasis.opendocument.presentation',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odt: 'application/vnd.oasis.opendocument.text',
    wmlc: 'application/vnd.wap.wmlc',
    wasm: 'application/wasm',
    '7z': 'application/x-7z-compressed',
    cco: 'application/x-cocoa',
    jardiff: 'application/x-java-archive-diff',
    jnlp: 'application/x-java-jnlp-file',
    run: 'application/x-makeself',
    pl: 'application/x-perl',
    pm: 'application/x-perl',
    prc: 'application/x-pilot',
    pdb: 'application/x-pilot',
    rar: 'application/x-rar-compressed',
    rpm: 'application/x-redhat-package-manager',
    sea: 'application/x-sea',
    swf: 'application/x-shockwave-flash',
    sit: 'application/x-stuffit',
    tcl: 'application/x-tcl',
    tk: 'application/x-tcl',
    der: 'application/x-x509-ca-cert',
    pem: 'application/x-x509-ca-cert',
    crt: 'application/x-x509-ca-cert',
    xpi: 'application/x-xpinstall',
    xhtml: 'application/xhtml+xml',
    xspf: 'application/xspf+xml',
    zip: 'application/zip',
    bin: 'application/octet-stream',
    exe: 'application/octet-stream',
    dll: 'application/octet-stream',
    deb: 'application/octet-stream',
    dmg: 'application/octet-stream',
    iso: 'application/octet-stream',
    img: 'application/octet-stream',
    msi: 'application/octet-stream',
    msp: 'application/octet-stream',
    msm: 'application/octet-stream',
    mid: 'audio/midi',
    midi: 'audio/midi',
    kar: 'audio/midi',
    mp3: 'audio/mpeg',
    ogg: 'audio/ogg',
    m4a: 'audio/x-m4a',
    ra: 'audio/x-realaudio',
    '3gpp': 'video/3gpp',
    '3gp': 'video/3gpp',
    ts: 'video/mp2t',
    mp4: 'video/mp4',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg',
    mov: 'video/quicktime',
    webm: 'video/webm',
    flv: 'video/x-flv',
    m4v: 'video/x-m4v',
    mng: 'video/x-mng',
    asx: 'video/x-ms-asf',
    asf: 'video/x-ms-asf',
    wmv: 'video/x-ms-wmv',
    avi: 'video/x-msvideo',
    wav: 'audio/wav',
    flac: 'audio/flac',
    aac: 'audio/aac',
    opus: 'audio/opus',
    csv: 'text/csv',
    tsv: 'text/tab-separated-values',
    ics: 'text/calendar',
};
function getExtensionsByMime(mime) {
    return Object.entries(mime_types)
        .filter(([key, value]) => value === mime)
        .map(([key]) => key);
}
const fileUploadOptions = computed(() => [
    {
        label: t('common.fileUpload.image'),
        value: 'image',
        visible: props.applicationDetails.file_upload_setting.image,
    },
    {
        label: t('common.fileUpload.document'),
        value: 'document',
        visible: props.applicationDetails.file_upload_setting.document,
    },
    {
        label: t('common.fileUpload.video'),
        value: 'video',
        visible: props.applicationDetails.file_upload_setting.video,
    },
    {
        label: t('common.fileUpload.audio'),
        value: 'audio',
        visible: props.applicationDetails.file_upload_setting.audio,
    },
    {
        label: t('common.fileUpload.other'),
        value: 'other',
        visible: props.applicationDetails.file_upload_setting.other,
    },
]);
function openUrlSetting() {
    showURLSetting.value = true;
    const visibleOptions = fileUploadOptions.value.filter((option) => option.visible);
    if (visibleOptions.length > 0) {
        urlForm.type = visibleOptions[0].value;
    }
}
async function saveUrl() {
    const urls = urlForm.source_url.split('\n');
    if (urls.length === 0) {
        MsgWarning(t('aiChat.uploadFile.invalidUrl'));
        return;
    }
    const { maxFiles, fileLimit } = props.applicationDetails.file_upload_setting;
    const file_limit_once = uploadImageList.value.length +
        uploadDocumentList.value.length +
        uploadAudioList.value.length +
        uploadVideoList.value.length +
        uploadOtherList.value.length;
    if (file_limit_once >= maxFiles ||
        urls.length + file_limit_once >= fileLimit ||
        urls.length > fileLimit) {
        MsgWarning(t('aiChat.uploadFile.limitMessage1') + maxFiles + t('aiChat.uploadFile.limitMessage2'));
        return;
    }
    // Allowed MIME Type
    const allowedTypes = {
        image: imageExtensions
            .map((ext) => mime_types[ext.toLowerCase()])
            .filter(Boolean),
        document: documentExtensions
            .map((ext) => mime_types[ext.toLowerCase()])
            .filter(Boolean),
        audio: audioExtensions
            .map((ext) => mime_types[ext.toLowerCase()])
            .filter(Boolean),
        video: videoExtensions
            .map((ext) => mime_types[ext.toLowerCase()])
            .filter(Boolean),
        other: otherExtensions.value
            .map((ext) => mime_types[ext.toLowerCase()])
            .filter(Boolean),
    };
    // Validate URL WhetherValid
    const validUrls = urls
        .map((u) => u.trim())
        .filter((u) => {
        try {
            new URL(u);
            return u !== '';
        }
        catch {
            return false;
        }
    });
    if (validUrls.length === 0) {
        MsgWarning(t('aiChat.uploadFile.invalidUrl'));
        return;
    }
    const type = urlForm.type;
    const expectedTypes = allowedTypes[type] || [];
    const validFiles = [];
    // AsyncValidateSingle URL
    async function processUrl(url) {
        try {
            const appId = props.appId || props.applicationDetails?.id;
            const res = props.type === 'debug-ai-chat'
                ? await applicationApi.getFile(appId, { url })
                : await chatAPI.getFile(appId, { url });
            if (res.data['status_code'] !== 200) {
                MsgWarning(url + ' ' + t('aiChat.uploadFile.invalidUrl'));
                return;
            }
            const contentType = res.data['Content-Type'] || '';
            const contentLength = res.data['Content-Length'];
            const fileSize = contentLength ? parseInt(contentLength, 10) : 0;
            // TypeValidate
            if (expectedTypes.length > 0 && !expectedTypes.some((type) => contentType.includes(type))) {
                MsgWarning(url + ' ' + t('aiChat.uploadFile.urlErrorMessage'));
                return;
            }
            if (fileSize > fileLimit * 1024 * 1024) {
                MsgWarning(url + ' ' + t('aiChat.uploadFile.sizeLimit') + fileLimit + 'MB');
                return;
            }
            // File name processing
            let fileName = url.substring(url.lastIndexOf('/') + 1);
            if (!fileName)
                fileName = `file_${Date.now()}`;
            if (!fileName.includes('.') && getExtensionsByMime(contentType)) {
                fileName += '.' + getExtensionsByMime(contentType)[0];
            }
            const fileItem = {
                uid: `${Date.now()}_${Math.random()}`,
                name: fileName,
                url: url,
                type: contentType,
                size: fileSize,
                status: 'success',
            };
            // Document/audio type needs download before upload
            if (type === 'document' || type === 'audio' || type === 'other') {
                const base64Data = res.data.content;
                const byteString = atob(base64Data.split(',')[1] || base64Data);
                const mimeString = base64Data.split(',')[0]?.split(':')[1]?.split(';')[0] || contentType;
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++)
                    ia[i] = byteString.charCodeAt(i);
                const fileBlob = new Blob([ab], { type: mimeString });
                const fileObj = new File([fileBlob], fileName, { type: mimeString });
                const uploadFileItem = {
                    uid: fileItem.uid,
                    name: fileName,
                    size: fileSize,
                    raw: fileObj,
                    status: 'ready',
                    percentage: 0,
                };
                await uploadFile(uploadFileItem, [uploadFileItem]);
            }
            else {
                validFiles.push(reactive(fileItem));
            }
        }
        catch (e) {
            console.error(e);
            return;
        }
    }
    // ParallelProcessAll URL
    await Promise.all(validUrls.map((url) => processUrl(url)));
    if (validFiles.length > 0) {
        fileAllList.value.push(...validFiles);
    }
    showURLSetting.value = false;
    urlForm.source_url = '';
    urlForm.type = '';
}
const __VLS_defaults = {
    applicationDetails: () => ({}),
    available: true,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-textarea__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-chat__operate']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popperURLSetting']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onDrop: (__VLS_ctx.handleDrop) },
    ...{ onDragover: () => { } },
    ...{ class: "ai-chat__operate p-16" },
});
/** @type {__VLS_StyleScopedClasses['ai-chat__operate']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        ...{ class: "border-primary video-stop-button" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        ...{ class: "border-primary video-stop-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = {
        /** @type {typeof __VLS_5.click} */
        onClick: (__VLS_ctx.stopChat),
    };
    /** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['video-stop-button']} */ ;
    const { default: __VLS_7 } = __VLS_3.slots;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon | typeof __VLS_components['app-icon'] | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon | typeof __VLS_components['app-icon']} */
    appIcon;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        iconName: "app-video-stop",
        ...{ class: "mr-8" },
    }));
    const __VLS_10 = __VLS_9({
        iconName: "app-video-stop",
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('aiChat.operation.stopChat'));
    // @ts-ignore
    [handleDrop, loading, stopChat, $t,];
    var __VLS_3;
    var __VLS_4;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate-textarea" },
});
/** @type {__VLS_StyleScopedClasses['operate-textarea']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    maxHeight: "136",
}));
const __VLS_15 = __VLS_14({
    maxHeight: "136",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
if (__VLS_ctx.uploadDocumentList.length ||
    __VLS_ctx.uploadImageList.length ||
    __VLS_ctx.uploadAudioList.length ||
    __VLS_ctx.uploadVideoList.length ||
    __VLS_ctx.uploadOtherList.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8-12" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.uploadLoading) }, null, null);
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        gutter: (10),
    }));
    const __VLS_21 = __VLS_20({
        gutter: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.uploadDocumentList))) {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            key: (index),
            xs: (24),
            sm: (props.type === 'debug-ai-chat' ? 24 : 12),
            md: (props.type === 'debug-ai-chat' ? 24 : 12),
            lg: (props.type === 'debug-ai-chat' ? 24 : 12),
            xl: (props.type === 'debug-ai-chat' ? 24 : 12),
            ...{ class: "mb-8" },
        }));
        const __VLS_27 = __VLS_26({
            key: (index),
            xs: (24),
            sm: (props.type === 'debug-ai-chat' ? 24 : 12),
            md: (props.type === 'debug-ai-chat' ? 24 : 12),
            lg: (props.type === 'debug-ai-chat' ? 24 : 12),
            xl: (props.type === 'debug-ai-chat' ? 24 : 12),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_30 } = __VLS_28.slots;
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "file cursor" },
        }));
        const __VLS_33 = __VLS_32({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "file cursor" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        /** @type {__VLS_StyleScopedClasses['file']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        const { default: __VLS_36 } = __VLS_34.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseenter(item);
                    // @ts-ignore
                    [uploadDocumentList, uploadDocumentList, uploadImageList, uploadAudioList, uploadVideoList, uploadOtherList, vLoading, uploadLoading, mouseenter,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseleave();
                    // @ts-ignore
                    [mouseleave,];
                } },
            ...{ class: "flex-between align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(item && item?.name)),
            alt: "",
            width: "24",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ml-4 ellipsis-1" },
            title: (item && item?.name),
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (item && item?.name);
        if (__VLS_ctx.showDelete === item.url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.uploadDocumentList.length ||
                            __VLS_ctx.uploadImageList.length ||
                            __VLS_ctx.uploadAudioList.length ||
                            __VLS_ctx.uploadVideoList.length ||
                            __VLS_ctx.uploadOtherList.length))
                            throw 0;
                        if (!(__VLS_ctx.showDelete === item.url))
                            throw 0;
                        return __VLS_ctx.deleteFile(item);
                        // @ts-ignore
                        [getImgUrl, showDelete, deleteFile,];
                    } },
                ...{ class: "delete-icon color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['delete-icon']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            let __VLS_37;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
                ...{ style: {} },
            }));
            const __VLS_39 = __VLS_38({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_38));
            const { default: __VLS_42 } = __VLS_40.slots;
            let __VLS_43;
            /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
            CircleCloseFilled;
            // @ts-ignore
            const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
            const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
            // @ts-ignore
            [];
            var __VLS_40;
        }
        // @ts-ignore
        [];
        var __VLS_34;
        // @ts-ignore
        [];
        var __VLS_28;
        // @ts-ignore
        [];
    }
    for (const [item, index] of __VLS_vFor((__VLS_ctx.uploadOtherList))) {
        let __VLS_48;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            key: (index),
            xs: (24),
            sm: (props.type === 'debug-ai-chat' ? 24 : 12),
            md: (props.type === 'debug-ai-chat' ? 24 : 12),
            lg: (props.type === 'debug-ai-chat' ? 24 : 12),
            xl: (props.type === 'debug-ai-chat' ? 24 : 12),
            ...{ class: "mb-8" },
        }));
        const __VLS_50 = __VLS_49({
            key: (index),
            xs: (24),
            sm: (props.type === 'debug-ai-chat' ? 24 : 12),
            md: (props.type === 'debug-ai-chat' ? 24 : 12),
            lg: (props.type === 'debug-ai-chat' ? 24 : 12),
            xl: (props.type === 'debug-ai-chat' ? 24 : 12),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_53 } = __VLS_51.slots;
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "file cursor" },
        }));
        const __VLS_56 = __VLS_55({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "file cursor" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        /** @type {__VLS_StyleScopedClasses['file']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        const { default: __VLS_59 } = __VLS_57.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseenter(item);
                    // @ts-ignore
                    [uploadOtherList, mouseenter,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseleave();
                    // @ts-ignore
                    [mouseleave,];
                } },
            ...{ class: "flex-between align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(item && item?.name)),
            alt: "",
            width: "24",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ml-4 ellipsis-1" },
            title: (item && item?.name),
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (item && item?.name);
        if (__VLS_ctx.showDelete === item.url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.uploadDocumentList.length ||
                            __VLS_ctx.uploadImageList.length ||
                            __VLS_ctx.uploadAudioList.length ||
                            __VLS_ctx.uploadVideoList.length ||
                            __VLS_ctx.uploadOtherList.length))
                            throw 0;
                        if (!(__VLS_ctx.showDelete === item.url))
                            throw 0;
                        return __VLS_ctx.deleteFile(item);
                        // @ts-ignore
                        [getImgUrl, showDelete, deleteFile,];
                    } },
                ...{ class: "delete-icon color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['delete-icon']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            let __VLS_60;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
                ...{ style: {} },
            }));
            const __VLS_62 = __VLS_61({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            const { default: __VLS_65 } = __VLS_63.slots;
            let __VLS_66;
            /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
            CircleCloseFilled;
            // @ts-ignore
            const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
            const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
            // @ts-ignore
            [];
            var __VLS_63;
        }
        // @ts-ignore
        [];
        var __VLS_57;
        // @ts-ignore
        [];
        var __VLS_51;
        // @ts-ignore
        [];
    }
    for (const [item, index] of __VLS_vFor((__VLS_ctx.uploadAudioList))) {
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            xs: (24),
            sm: (props.type === 'debug-ai-chat' ? 24 : 12),
            md: (props.type === 'debug-ai-chat' ? 24 : 12),
            lg: (props.type === 'debug-ai-chat' ? 24 : 12),
            xl: (props.type === 'debug-ai-chat' ? 24 : 12),
            ...{ class: "mb-8" },
            key: (index),
        }));
        const __VLS_73 = __VLS_72({
            xs: (24),
            sm: (props.type === 'debug-ai-chat' ? 24 : 12),
            md: (props.type === 'debug-ai-chat' ? 24 : 12),
            lg: (props.type === 'debug-ai-chat' ? 24 : 12),
            xl: (props.type === 'debug-ai-chat' ? 24 : 12),
            ...{ class: "mb-8" },
            key: (index),
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_76 } = __VLS_74.slots;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "file cursor" },
        }));
        const __VLS_79 = __VLS_78({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "file cursor" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        /** @type {__VLS_StyleScopedClasses['file']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        const { default: __VLS_82 } = __VLS_80.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseenter(item);
                    // @ts-ignore
                    [uploadAudioList, mouseenter,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseleave();
                    // @ts-ignore
                    [mouseleave,];
                } },
            ...{ class: "flex-between align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(item && item?.name)),
            alt: "",
            width: "24",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ml-4 ellipsis-1" },
            title: (item && item?.name),
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (item && item?.name);
        if (__VLS_ctx.showDelete === item.url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.uploadDocumentList.length ||
                            __VLS_ctx.uploadImageList.length ||
                            __VLS_ctx.uploadAudioList.length ||
                            __VLS_ctx.uploadVideoList.length ||
                            __VLS_ctx.uploadOtherList.length))
                            throw 0;
                        if (!(__VLS_ctx.showDelete === item.url))
                            throw 0;
                        return __VLS_ctx.deleteFile(item);
                        // @ts-ignore
                        [getImgUrl, showDelete, deleteFile,];
                    } },
                ...{ class: "delete-icon color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['delete-icon']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            let __VLS_83;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                ...{ style: {} },
            }));
            const __VLS_85 = __VLS_84({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            const { default: __VLS_88 } = __VLS_86.slots;
            let __VLS_89;
            /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
            CircleCloseFilled;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({}));
            const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
            // @ts-ignore
            [];
            var __VLS_86;
        }
        // @ts-ignore
        [];
        var __VLS_80;
        // @ts-ignore
        [];
        var __VLS_74;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_22;
    let __VLS_94;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        wrap: true,
    }));
    const __VLS_96 = __VLS_95({
        wrap: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    const { default: __VLS_99 } = __VLS_97.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.uploadImageList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseenter(item);
                    // @ts-ignore
                    [uploadImageList, mouseenter,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseleave();
                    // @ts-ignore
                    [mouseleave,];
                } },
            ...{ class: "file file-image cursor border border-r-6" },
        });
        /** @type {__VLS_StyleScopedClasses['file']} */ ;
        /** @type {__VLS_StyleScopedClasses['file-image']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        if (__VLS_ctx.showDelete === item.url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.uploadDocumentList.length ||
                            __VLS_ctx.uploadImageList.length ||
                            __VLS_ctx.uploadAudioList.length ||
                            __VLS_ctx.uploadVideoList.length ||
                            __VLS_ctx.uploadOtherList.length))
                            throw 0;
                        if (!(__VLS_ctx.showDelete === item.url))
                            throw 0;
                        return __VLS_ctx.deleteFile(item);
                        // @ts-ignore
                        [showDelete, deleteFile,];
                    } },
                ...{ class: "delete-icon color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['delete-icon']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            let __VLS_100;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
                ...{ style: {} },
            }));
            const __VLS_102 = __VLS_101({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            const { default: __VLS_105 } = __VLS_103.slots;
            let __VLS_106;
            /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
            CircleCloseFilled;
            // @ts-ignore
            const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({}));
            const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
            // @ts-ignore
            [];
            var __VLS_103;
        }
        if (item.url) {
            let __VLS_111;
            /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
            elImage;
            // @ts-ignore
            const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
                src: (item.url),
                alt: "",
                fit: "cover",
                ...{ style: {} },
                ...{ class: "border-r-6" },
            }));
            const __VLS_113 = __VLS_112({
                src: (item.url),
                alt: "",
                fit: "cover",
                ...{ style: {} },
                ...{ class: "border-r-6" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_112));
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_97;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        wrap: true,
    }));
    const __VLS_118 = __VLS_117({
        wrap: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    const { default: __VLS_121 } = __VLS_119.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.uploadVideoList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseenter(item);
                    // @ts-ignore
                    [uploadVideoList, mouseenter,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.uploadDocumentList.length ||
                        __VLS_ctx.uploadImageList.length ||
                        __VLS_ctx.uploadAudioList.length ||
                        __VLS_ctx.uploadVideoList.length ||
                        __VLS_ctx.uploadOtherList.length))
                        throw 0;
                    return __VLS_ctx.mouseleave();
                    // @ts-ignore
                    [mouseleave,];
                } },
            ...{ class: "file file-image cursor border border-r-6" },
        });
        /** @type {__VLS_StyleScopedClasses['file']} */ ;
        /** @type {__VLS_StyleScopedClasses['file-image']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        if (__VLS_ctx.showDelete === item.url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.uploadDocumentList.length ||
                            __VLS_ctx.uploadImageList.length ||
                            __VLS_ctx.uploadAudioList.length ||
                            __VLS_ctx.uploadVideoList.length ||
                            __VLS_ctx.uploadOtherList.length))
                            throw 0;
                        if (!(__VLS_ctx.showDelete === item.url))
                            throw 0;
                        return __VLS_ctx.deleteFile(item);
                        // @ts-ignore
                        [showDelete, deleteFile,];
                    } },
                ...{ class: "delete-icon color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['delete-icon']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            let __VLS_122;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
                ...{ style: {} },
            }));
            const __VLS_124 = __VLS_123({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_123));
            const { default: __VLS_127 } = __VLS_125.slots;
            let __VLS_128;
            /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
            CircleCloseFilled;
            // @ts-ignore
            const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({}));
            const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
            // @ts-ignore
            [];
            var __VLS_125;
        }
        if (item.url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                src: (item.url),
                controls: true,
                ...{ style: {} },
                ...{ class: "border-r-6" },
                autoplay: true,
            });
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_119;
}
// @ts-ignore
[];
var __VLS_16;
if (__VLS_ctx.isMicrophone) {
    const __VLS_133 = TouchChat;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
        ...{ 'onTouchStart': {} },
        ...{ 'onTouchEnd': {} },
        time: (__VLS_ctx.recorderTime),
        start: (__VLS_ctx.recorderStatus === 'START'),
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_135 = __VLS_134({
        ...{ 'onTouchStart': {} },
        ...{ 'onTouchEnd': {} },
        time: (__VLS_ctx.recorderTime),
        start: (__VLS_ctx.recorderStatus === 'START'),
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    let __VLS_138;
    const __VLS_139 = {
        /** @type {typeof __VLS_138.TouchStart} */
        onTouchStart: (__VLS_ctx.startRecording),
    };
    const __VLS_140 = {
        /** @type {typeof __VLS_138.TouchEnd} */
        onTouchEnd: (__VLS_ctx.TouchEnd),
    };
    var __VLS_136;
    var __VLS_137;
}
else {
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        ...{ 'onKeydown': {} },
        ...{ 'onPaste': {} },
        ref: "quickInputRef",
        modelValue: (__VLS_ctx.inputValue),
        autosize: ({ minRows: 1, maxRows: __VLS_ctx.isMobile ? 4 : 10 }),
        type: "textarea",
        placeholder: (__VLS_ctx.inputPlaceholder),
        maxlength: (100000),
        ...{ class: "chat-operate-textarea" },
        clearable: true,
    }));
    const __VLS_143 = __VLS_142({
        ...{ 'onKeydown': {} },
        ...{ 'onPaste': {} },
        ref: "quickInputRef",
        modelValue: (__VLS_ctx.inputValue),
        autosize: ({ minRows: 1, maxRows: __VLS_ctx.isMobile ? 4 : 10 }),
        type: "textarea",
        placeholder: (__VLS_ctx.inputPlaceholder),
        maxlength: (100000),
        ...{ class: "chat-operate-textarea" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    let __VLS_146;
    const __VLS_147 = {
        /** @type {typeof __VLS_146.keydown} */
        onKeydown: (...[$event]) => {
            if (!!(__VLS_ctx.isMicrophone))
                throw 0;
            return __VLS_ctx.sendChatHandle($event);
            // @ts-ignore
            [loading, isMicrophone, recorderTime, recorderStatus, startRecording, TouchEnd, inputValue, isMobile, inputPlaceholder, sendChatHandle,];
        },
    };
    const __VLS_148 = {
        /** @type {typeof __VLS_146.paste} */
        onPaste: (__VLS_ctx.handlePaste),
    };
    var __VLS_149;
    /** @type {__VLS_StyleScopedClasses['chat-operate-textarea']} */ ;
    var __VLS_144;
    var __VLS_145;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate flex-between" },
});
/** @type {__VLS_StyleScopedClasses['operate']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
var __VLS_151 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (props.applicationDetails.stt_model_enable) {
    if (__VLS_ctx.mode === 'mobile') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        let __VLS_153;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_155 = __VLS_154({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        let __VLS_158;
        const __VLS_159 = {
            /** @type {typeof __VLS_158.click} */
            onClick: (...[$event]) => {
                if (!(props.applicationDetails.stt_model_enable))
                    throw 0;
                if (!(__VLS_ctx.mode === 'mobile'))
                    throw 0;
                return __VLS_ctx.switchMicrophone(!__VLS_ctx.isMicrophone);
                // @ts-ignore
                [isMicrophone, handlePaste, mode, switchMicrophone,];
            },
        };
        const { default: __VLS_160 } = __VLS_156.slots;
        if (__VLS_ctx.isMicrophone) {
            let __VLS_161;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
                iconName: "app-keyboard",
                size: (20),
            }));
            const __VLS_163 = __VLS_162({
                iconName: "app-keyboard",
                size: (20),
            }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        }
        else {
            let __VLS_166;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
                size: (20),
            }));
            const __VLS_168 = __VLS_167({
                size: (20),
            }, ...__VLS_functionalComponentArgsRest(__VLS_167));
            const { default: __VLS_171 } = __VLS_169.slots;
            let __VLS_172;
            /** @ts-ignore @type { | typeof __VLS_components.Microphone} */
            Microphone;
            // @ts-ignore
            const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({}));
            const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
            // @ts-ignore
            [isMicrophone,];
            var __VLS_169;
        }
        // @ts-ignore
        [];
        var __VLS_156;
        var __VLS_157;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (__VLS_ctx.recorderStatus === 'STOP') {
            let __VLS_177;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
                ...{ 'onClick': {} },
                disabled: (__VLS_ctx.loading),
                text: true,
            }));
            const __VLS_179 = __VLS_178({
                ...{ 'onClick': {} },
                disabled: (__VLS_ctx.loading),
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_178));
            let __VLS_182;
            const __VLS_183 = {
                /** @type {typeof __VLS_182.click} */
                onClick: (__VLS_ctx.startRecording),
            };
            const { default: __VLS_184 } = __VLS_180.slots;
            let __VLS_185;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
                size: (20),
            }));
            const __VLS_187 = __VLS_186({
                size: (20),
            }, ...__VLS_functionalComponentArgsRest(__VLS_186));
            const { default: __VLS_190 } = __VLS_188.slots;
            let __VLS_191;
            /** @ts-ignore @type { | typeof __VLS_components.Microphone} */
            Microphone;
            // @ts-ignore
            const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({}));
            const __VLS_193 = __VLS_192({}, ...__VLS_functionalComponentArgsRest(__VLS_192));
            // @ts-ignore
            [loading, recorderStatus, startRecording,];
            var __VLS_188;
            // @ts-ignore
            [];
            var __VLS_180;
            var __VLS_181;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "operate flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['operate']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_196;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
                type: "info",
            }));
            const __VLS_198 = __VLS_197({
                type: "info",
            }, ...__VLS_functionalComponentArgsRest(__VLS_197));
            const { default: __VLS_201 } = __VLS_199.slots;
            (__VLS_ctx.recorderTime < 10 ? `0${__VLS_ctx.recorderTime}` : __VLS_ctx.recorderTime);
            // @ts-ignore
            [recorderTime, recorderTime, recorderTime,];
            var __VLS_199;
            let __VLS_202;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
                ...{ 'onClick': {} },
                text: true,
                type: "primary",
                loading: (__VLS_ctx.recorderStatus === 'TRANSCRIBING'),
            }));
            const __VLS_204 = __VLS_203({
                ...{ 'onClick': {} },
                text: true,
                type: "primary",
                loading: (__VLS_ctx.recorderStatus === 'TRANSCRIBING'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_203));
            let __VLS_207;
            const __VLS_208 = {
                /** @type {typeof __VLS_207.click} */
                onClick: (__VLS_ctx.stopRecording),
            };
            const { default: __VLS_209 } = __VLS_205.slots;
            let __VLS_210;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
                iconName: "app-video-stop",
                size: (20),
            }));
            const __VLS_212 = __VLS_211({
                iconName: "app-video-stop",
                size: (20),
            }, ...__VLS_functionalComponentArgsRest(__VLS_211));
            // @ts-ignore
            [recorderStatus, stopRecording,];
            var __VLS_205;
            var __VLS_206;
        }
    }
}
if (__VLS_ctx.recorderStatus === 'STOP' || __VLS_ctx.mode === 'mobile') {
    if (props.applicationDetails.file_upload_enable) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        if (props.applicationDetails.file_upload_setting.url_upload) {
            let __VLS_215;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
                ...{ 'onClick': {} },
                text: true,
                disabled: (__VLS_ctx.checkMaxFilesLimit() || __VLS_ctx.loading),
                ...{ class: "mt-4" },
            }));
            const __VLS_217 = __VLS_216({
                ...{ 'onClick': {} },
                text: true,
                disabled: (__VLS_ctx.checkMaxFilesLimit() || __VLS_ctx.loading),
                ...{ class: "mt-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_216));
            let __VLS_220;
            const __VLS_221 = {
                /** @type {typeof __VLS_220.click} */
                onClick: (__VLS_ctx.openUrlSetting),
            };
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            const { default: __VLS_222 } = __VLS_218.slots;
            let __VLS_223;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
                size: (20),
            }));
            const __VLS_225 = __VLS_224({
                size: (20),
            }, ...__VLS_functionalComponentArgsRest(__VLS_224));
            const { default: __VLS_228 } = __VLS_226.slots;
            let __VLS_229;
            /** @ts-ignore @type { | typeof __VLS_components.Paperclip} */
            Paperclip;
            // @ts-ignore
            const __VLS_230 = __VLS_asFunctionalComponent1(__VLS_229, new __VLS_229({}));
            const __VLS_231 = __VLS_230({}, ...__VLS_functionalComponentArgsRest(__VLS_230));
            // @ts-ignore
            [loading, recorderStatus, mode, checkMaxFilesLimit, openUrlSetting,];
            var __VLS_226;
            // @ts-ignore
            [];
            var __VLS_218;
            var __VLS_219;
        }
        else {
            let __VLS_234;
            /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
            elUpload;
            // @ts-ignore
            const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                accept: (__VLS_ctx.getAcceptList()),
                onChange: ((file, fileList) => __VLS_ctx.uploadFile(file, fileList)),
                ref: "upload",
            }));
            const __VLS_236 = __VLS_235({
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                accept: (__VLS_ctx.getAcceptList()),
                onChange: ((file, fileList) => __VLS_ctx.uploadFile(file, fileList)),
                ref: "upload",
            }, ...__VLS_functionalComponentArgsRest(__VLS_235));
            var __VLS_239;
            const { default: __VLS_241 } = __VLS_237.slots;
            let __VLS_242;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
                disabled: (__VLS_ctx.mode === 'mobile'),
                effect: "dark",
                placement: "top",
                popperClass: "upload-tooltip-width",
            }));
            const __VLS_244 = __VLS_243({
                disabled: (__VLS_ctx.mode === 'mobile'),
                effect: "dark",
                placement: "top",
                popperClass: "upload-tooltip-width",
            }, ...__VLS_functionalComponentArgsRest(__VLS_243));
            const { default: __VLS_247 } = __VLS_245.slots;
            {
                const { content: __VLS_248 } = __VLS_245.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "break-all pre-wrap" },
                });
                /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                (__VLS_ctx.$t('aiChat.uploadFile.label'));
                (__VLS_ctx.$t('aiChat.uploadFile.most'));
                (props.applicationDetails.file_upload_setting.maxFiles);
                (__VLS_ctx.$t('aiChat.uploadFile.limit'));
                (props.applicationDetails.file_upload_setting.fileLimit);
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                (__VLS_ctx.$t('aiChat.uploadFile.fileType'));
                (__VLS_ctx.getAcceptList().replace(/\./g, '').replace(/,/g, '、').toUpperCase());
                // @ts-ignore
                [$t, $t, $t, $t, mode, getAcceptList, getAcceptList, uploadFile,];
            }
            let __VLS_249;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
                text: true,
                disabled: (__VLS_ctx.checkMaxFilesLimit() || __VLS_ctx.loading),
                ...{ class: "mt-4" },
            }));
            const __VLS_251 = __VLS_250({
                text: true,
                disabled: (__VLS_ctx.checkMaxFilesLimit() || __VLS_ctx.loading),
                ...{ class: "mt-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_250));
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            const { default: __VLS_254 } = __VLS_252.slots;
            let __VLS_255;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
                size: (20),
            }));
            const __VLS_257 = __VLS_256({
                size: (20),
            }, ...__VLS_functionalComponentArgsRest(__VLS_256));
            const { default: __VLS_260 } = __VLS_258.slots;
            let __VLS_261;
            /** @ts-ignore @type { | typeof __VLS_components.Paperclip} */
            Paperclip;
            // @ts-ignore
            const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({}));
            const __VLS_263 = __VLS_262({}, ...__VLS_functionalComponentArgsRest(__VLS_262));
            // @ts-ignore
            [loading, checkMaxFilesLimit,];
            var __VLS_258;
            // @ts-ignore
            [];
            var __VLS_252;
            // @ts-ignore
            [];
            var __VLS_245;
            // @ts-ignore
            [];
            var __VLS_237;
        }
    }
    if (props.applicationDetails.file_upload_enable ||
        props.applicationDetails.stt_model_enable) {
        let __VLS_266;
        /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
        elDivider;
        // @ts-ignore
        const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
            direction: "vertical",
        }));
        const __VLS_268 = __VLS_267({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_267));
    }
    let __VLS_271;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "sent-button" },
        disabled: (__VLS_ctx.isDisabledChat || __VLS_ctx.loading || __VLS_ctx.uploadLoading),
    }));
    const __VLS_273 = __VLS_272({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "sent-button" },
        disabled: (__VLS_ctx.isDisabledChat || __VLS_ctx.loading || __VLS_ctx.uploadLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_272));
    let __VLS_276;
    const __VLS_277 = {
        /** @type {typeof __VLS_276.click} */
        onClick: (__VLS_ctx.sendChatHandle),
    };
    /** @type {__VLS_StyleScopedClasses['sent-button']} */ ;
    const { default: __VLS_278 } = __VLS_274.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/chat/icon_send.svg",
        alt: "",
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.isDisabledChat || __VLS_ctx.loading || __VLS_ctx.uploadLoading) }, null, null);
    let __VLS_279;
    /** @ts-ignore @type { | typeof __VLS_components.SendIcon} */
    SendIcon;
    // @ts-ignore
    const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({}));
    const __VLS_281 = __VLS_280({}, ...__VLS_functionalComponentArgsRest(__VLS_280));
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isDisabledChat && !__VLS_ctx.loading && !__VLS_ctx.uploadLoading) }, null, null);
    // @ts-ignore
    [loading, loading, loading, uploadLoading, uploadLoading, uploadLoading, sendChatHandle, isDisabledChat, isDisabledChat, isDisabledChat,];
    var __VLS_274;
    var __VLS_275;
}
if (__VLS_ctx.applicationDetails.disclaimer) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    if (__VLS_ctx.applicationDetails.disclaimer) {
        let __VLS_284;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
            type: "info",
            ...{ class: "font-small" },
        }));
        const __VLS_286 = __VLS_285({
            type: "info",
            ...{ class: "font-small" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_285));
        /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
        const { default: __VLS_289 } = __VLS_287.slots;
        let __VLS_290;
        /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
        autoTooltip;
        // @ts-ignore
        const __VLS_291 = __VLS_asFunctionalComponent1(__VLS_290, new __VLS_290({
            content: (__VLS_ctx.applicationDetails.disclaimer_value),
        }));
        const __VLS_292 = __VLS_291({
            content: (__VLS_ctx.applicationDetails.disclaimer_value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_291));
        const { default: __VLS_295 } = __VLS_293.slots;
        (__VLS_ctx.applicationDetails.disclaimer_value);
        // @ts-ignore
        [applicationDetails, applicationDetails, applicationDetails, applicationDetails,];
        var __VLS_293;
        // @ts-ignore
        [];
        var __VLS_287;
    }
}
if (__VLS_ctx.showURLSetting) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "popperURLSetting" },
    });
    /** @type {__VLS_StyleScopedClasses['popperURLSetting']} */ ;
    if (props.applicationDetails.file_upload_setting.url_upload) {
        let __VLS_296;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
            shadow: "always",
            ...{ class: "border-r-8" },
            ...{ style: {} },
        }));
        const __VLS_298 = __VLS_297({
            shadow: "always",
            ...{ class: "border-r-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_297));
        /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
        const { default: __VLS_301 } = __VLS_299.slots;
        let __VLS_302;
        /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
        elForm;
        // @ts-ignore
        const __VLS_303 = __VLS_asFunctionalComponent1(__VLS_302, new __VLS_302({
            labelPosition: "top",
            ref: "urlFormRef",
            model: (__VLS_ctx.urlForm),
        }));
        const __VLS_304 = __VLS_303({
            labelPosition: "top",
            ref: "urlFormRef",
            model: (__VLS_ctx.urlForm),
        }, ...__VLS_functionalComponentArgsRest(__VLS_303));
        var __VLS_307;
        const { default: __VLS_309 } = __VLS_305.slots;
        let __VLS_310;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({}));
        const __VLS_312 = __VLS_311({}, ...__VLS_functionalComponentArgsRest(__VLS_311));
        const { default: __VLS_315 } = __VLS_313.slots;
        {
            const { label: __VLS_316 } = __VLS_313.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.$t('aiChat.uploadFile.urlTitle'));
            let __VLS_317;
            /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
            elSelect;
            // @ts-ignore
            const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({
                teleported: (false),
                modelValue: (__VLS_ctx.urlForm.type),
                size: "small",
                ...{ style: {} },
            }));
            const __VLS_319 = __VLS_318({
                teleported: (false),
                modelValue: (__VLS_ctx.urlForm.type),
                size: "small",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_318));
            const { default: __VLS_322 } = __VLS_320.slots;
            for (const [option] of __VLS_vFor((__VLS_ctx.fileUploadOptions))) {
                let __VLS_323;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_324 = __VLS_asFunctionalComponent1(__VLS_323, new __VLS_323({
                    key: (option.value),
                    label: (option.label),
                    value: (option.value),
                }));
                const __VLS_325 = __VLS_324({
                    key: (option.value),
                    label: (option.label),
                    value: (option.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_324));
                __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (option.visible) }, null, null);
                // @ts-ignore
                [$t, showURLSetting, urlForm, urlForm, fileUploadOptions,];
            }
            // @ts-ignore
            [];
            var __VLS_320;
            // @ts-ignore
            [];
        }
        let __VLS_328;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_329 = __VLS_asFunctionalComponent1(__VLS_328, new __VLS_328({
            modelValue: (__VLS_ctx.urlForm.source_url),
            placeholder: (__VLS_ctx.$t('aiChat.uploadFile.urlPlaceholder')),
            rows: (5),
            type: "textarea",
        }));
        const __VLS_330 = __VLS_329({
            modelValue: (__VLS_ctx.urlForm.source_url),
            placeholder: (__VLS_ctx.$t('aiChat.uploadFile.urlPlaceholder')),
            rows: (5),
            type: "textarea",
        }, ...__VLS_functionalComponentArgsRest(__VLS_329));
        // @ts-ignore
        [$t, urlForm,];
        var __VLS_313;
        // @ts-ignore
        [];
        var __VLS_305;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        let __VLS_333;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
            ...{ 'onClick': {} },
        }));
        const __VLS_335 = __VLS_334({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_334));
        let __VLS_338;
        const __VLS_339 = {
            /** @type {typeof __VLS_338.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showURLSetting))
                    throw 0;
                if (!(props.applicationDetails.file_upload_setting.url_upload))
                    throw 0;
                return __VLS_ctx.showURLSetting = false;
                // @ts-ignore
                [showURLSetting,];
            },
        };
        const { default: __VLS_340 } = __VLS_336.slots;
        (__VLS_ctx.$t('common.cancel'));
        // @ts-ignore
        [$t,];
        var __VLS_336;
        var __VLS_337;
        let __VLS_341;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_342 = __VLS_asFunctionalComponent1(__VLS_341, new __VLS_341({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_343 = __VLS_342({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_342));
        let __VLS_346;
        const __VLS_347 = {
            /** @type {typeof __VLS_346.click} */
            onClick: (__VLS_ctx.saveUrl),
        };
        const { default: __VLS_348 } = __VLS_344.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, saveUrl,];
        var __VLS_344;
        var __VLS_345;
        if (props.applicationDetails.file_upload_setting.local_upload) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            let __VLS_349;
            /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
            elDivider;
            // @ts-ignore
            const __VLS_350 = __VLS_asFunctionalComponent1(__VLS_349, new __VLS_349({
                ...{ style: {} },
            }));
            const __VLS_351 = __VLS_350({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_350));
            let __VLS_354;
            /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
            elUpload;
            // @ts-ignore
            const __VLS_355 = __VLS_asFunctionalComponent1(__VLS_354, new __VLS_354({
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                accept: (__VLS_ctx.getAcceptList()),
                onChange: ((file, fileList) => __VLS_ctx.uploadFile(file, fileList)),
                ref: "upload",
                ...{ class: "import-button" },
            }));
            const __VLS_356 = __VLS_355({
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                accept: (__VLS_ctx.getAcceptList()),
                onChange: ((file, fileList) => __VLS_ctx.uploadFile(file, fileList)),
                ref: "upload",
                ...{ class: "import-button" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_355));
            var __VLS_359;
            /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
            const { default: __VLS_361 } = __VLS_357.slots;
            let __VLS_362;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_363 = __VLS_asFunctionalComponent1(__VLS_362, new __VLS_362({
                ...{ class: "w-full url-upload-button" },
            }));
            const __VLS_364 = __VLS_363({
                ...{ class: "w-full url-upload-button" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_363));
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['url-upload-button']} */ ;
            const { default: __VLS_367 } = __VLS_365.slots;
            (__VLS_ctx.$t('aiChat.uploadFile.localUpload'));
            // @ts-ignore
            [$t, getAcceptList, uploadFile,];
            var __VLS_365;
            // @ts-ignore
            [];
            var __VLS_357;
        }
        // @ts-ignore
        [];
        var __VLS_299;
    }
}
// @ts-ignore
var __VLS_150 = __VLS_149, __VLS_152 = __VLS_151, __VLS_240 = __VLS_239, __VLS_308 = __VLS_307, __VLS_360 = __VLS_359;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
