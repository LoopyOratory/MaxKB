import bus from '@/bus';
export class ChatRecordManage {
    id;
    ms;
    chat;
    is_close;
    write_ed;
    is_stop;
    loading;
    node_list;
    write_node_info;
    constructor(chat, ms, loading) {
        this.ms = ms ? ms : 10;
        this.chat = chat;
        this.loading = loading;
        this.is_stop = false;
        this.is_close = false;
        this.write_ed = false;
        this.node_list = [];
    }
    append_answer(chunk_answer, reasoning_content, index, chat_record_id, runtime_node_id, child_node, real_node_id) {
        if (chunk_answer || reasoning_content) {
            const set_index = index != undefined ? index : this.chat.answer_text_list.length - 1;
            let card_list = this.chat.answer_text_list[set_index];
            if (!card_list) {
                card_list = [];
                this.chat.answer_text_list[set_index] = card_list;
            }
            const answer_value = card_list.find((item) => item.real_node_id == real_node_id);
            const content = answer_value ? answer_value.content + chunk_answer : chunk_answer;
            const _reasoning_content = answer_value
                ? answer_value.reasoning_content + reasoning_content
                : reasoning_content;
            if (answer_value) {
                answer_value.content = content;
                answer_value.reasoning_content = _reasoning_content;
            }
            else {
                card_list.push({
                    content: content,
                    reasoning_content: _reasoning_content,
                    chat_record_id,
                    runtime_node_id,
                    child_node,
                    real_node_id,
                });
            }
        }
        this.chat.answer_text = this.chat.answer_text + chunk_answer;
        bus.emit('change:answer', { record_id: this.chat.record_id, is_end: false });
    }
    get_current_up_node(run_node) {
        const index = this.node_list.findIndex((item) => item == run_node);
        if (index > 0) {
            const n = this.node_list[index - 1];
            return n;
        }
        return undefined;
    }
    get_run_node() {
        if (this.write_node_info &&
            (this.write_node_info.current_node.reasoning_content_buffer.length > 0 ||
                this.write_node_info.current_node.buffer.length > 0 ||
                !this.write_node_info.current_node.is_end)) {
            return this.write_node_info;
        }
        const run_node = this.node_list.filter((item) => item.reasoning_content_buffer.length > 0 || item.buffer.length > 0 || !item.is_end)[0];
        if (run_node) {
            const index = this.node_list.indexOf(run_node);
            let current_up_node = undefined;
            if (index > 0) {
                current_up_node = this.get_current_up_node(run_node);
            }
            let answer_text_list_index = 0;
            if (current_up_node == undefined ||
                run_node.view_type == 'single_view' ||
                current_up_node.view_type == 'single_view') {
                const none_index = this.findIndex(this.chat.answer_text_list, (item) => (item.length == 1 && item[0].content == '') || item.length == 0, 'index');
                if (none_index > -1) {
                    answer_text_list_index = none_index;
                }
                else {
                    answer_text_list_index = this.chat.answer_text_list.length;
                }
            }
            else {
                const none_index = this.findIndex(this.chat.answer_text_list, (item) => (item.length == 1 && item[0].content == '') || item.length == 0, 'index');
                if (none_index > -1) {
                    answer_text_list_index = none_index;
                }
                else {
                    answer_text_list_index = this.chat.answer_text_list.length - 1;
                }
            }
            this.write_node_info = {
                current_node: run_node,
                current_up_node: current_up_node,
                answer_text_list_index: answer_text_list_index,
            };
            return this.write_node_info;
        }
        return undefined;
    }
    findIndex(array, find, type) {
        let set_index = -1;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (find(element)) {
                set_index = index;
                if (type == 'index') {
                    break;
                }
            }
        }
        return set_index;
    }
    closeInterval() {
        this.chat.write_ed = true;
        this.write_ed = true;
        if (this.loading) {
            this.loading.value = false;
        }
        bus.emit('change:answer', { record_id: this.chat.record_id, is_end: true });
        if (this.id) {
            clearInterval(this.id);
        }
        const last_index = this.findIndex(this.chat.answer_text_list, (item) => (item.length == 1 && item[0].content == '') || item.length == 0, 'last');
        if (last_index > 0) {
            this.chat.answer_text_list.splice(last_index, 1);
        }
    }
    write() {
        this.chat.is_stop = false;
        this.is_stop = false;
        if (!this.is_close) {
            this.is_close = false;
        }
        this.write_ed = false;
        this.chat.write_ed = false;
        if (this.loading) {
            this.loading.value = true;
        }
        this.id = setInterval(() => {
            const node_info = this.get_run_node();
            if (node_info == undefined) {
                if (this.is_close) {
                    this.closeInterval();
                }
                return;
            }
            const { current_node, answer_text_list_index } = node_info;
            if (current_node.buffer.length > 20) {
                const context = current_node.is_end
                    ? current_node.buffer.splice(0)
                    : current_node.buffer.splice(0, current_node.is_end ? undefined : current_node.buffer.length - 20);
                const reasoning_content = current_node.is_end
                    ? current_node.reasoning_content_buffer.splice(0)
                    : current_node.reasoning_content_buffer.splice(0, current_node.is_end ? undefined : current_node.reasoning_content_buffer.length - 20);
                this.append_answer(context.join(''), reasoning_content.join(''), answer_text_list_index, current_node.chat_record_id, current_node.runtime_node_id, current_node.child_node, current_node.real_node_id);
            }
            else if (this.is_close) {
                while (true) {
                    const node_info = this.get_run_node();
                    if (node_info == undefined) {
                        break;
                    }
                    this.append_answer(node_info.current_node.buffer.splice(0).join(''), node_info.current_node.reasoning_content_buffer.splice(0).join(''), node_info.answer_text_list_index, node_info.current_node.chat_record_id, node_info.current_node.runtime_node_id, node_info.current_node.child_node, node_info.current_node.real_node_id);
                    if (node_info.current_node.buffer.length == 0 &&
                        node_info.current_node.reasoning_content_buffer.length == 0) {
                        node_info.current_node.is_end = true;
                    }
                }
                this.closeInterval();
            }
            else {
                const s = current_node.buffer.shift();
                const reasoning_content = current_node.reasoning_content_buffer.shift();
                if (s !== undefined) {
                    this.append_answer(s, '', answer_text_list_index, current_node.chat_record_id, current_node.runtime_node_id, current_node.child_node, current_node.real_node_id);
                }
                if (reasoning_content !== undefined) {
                    this.append_answer('', reasoning_content, answer_text_list_index, current_node.chat_record_id, current_node.runtime_node_id, current_node.child_node, current_node.real_node_id);
                }
            }
        }, this.ms);
    }
    stop() {
        clearInterval(this.id);
        this.is_stop = true;
        this.chat.is_stop = true;
        if (this.loading) {
            this.loading.value = false;
        }
    }
    close() {
        this.is_close = true;
    }
    open() {
        this.is_close = false;
        this.is_stop = false;
    }
    appendChunk(chunk) {
        if (chunk.node_name) {
            this.chat.currentChunk = chunk;
        }
        let n = this.node_list.find((item) => item.real_node_id == chunk.real_node_id);
        if (n) {
            for (const ch of chunk.content) {
                n.buffer.push(ch);
            }
            // n.buffer.push(...chunk.content)
            n.content += chunk.content;
            if (chunk.reasoning_content) {
                for (const ch of chunk.reasoning_content) {
                    n.reasoning_content_buffer.push(ch);
                }
                // n.reasoning_content_buffer.push(...chunk.reasoning_content)
                n.reasoning_content += chunk.reasoning_content;
            }
        }
        else {
            n = {
                buffer: [...chunk.content],
                reasoning_content_buffer: chunk.reasoning_content ? [...chunk.reasoning_content] : [],
                reasoning_content: chunk.reasoning_content ? chunk.reasoning_content : '',
                content: chunk.content,
                real_node_id: chunk.real_node_id,
                node_id: chunk.node_id,
                chat_record_id: chunk.chat_record_id,
                up_node_id: chunk.up_node_id,
                runtime_node_id: chunk.runtime_node_id,
                child_node: chunk.child_node,
                node_type: chunk.node_type,
                index: this.node_list.length,
                view_type: chunk.view_type,
                is_end: false,
            };
            this.node_list.push(n);
        }
        if (chunk.node_is_end) {
            n['is_end'] = true;
        }
    }
    append(answer_text_block, reasoning_content) {
        let set_index = this.findIndex(this.chat.answer_text_list, (item) => item.length == 1 && item[0].content == '', 'index');
        if (set_index <= -1) {
            set_index = 0;
        }
        this.chat.answer_text_list[set_index] = [
            {
                content: answer_text_block,
                reasoning_content: reasoning_content ? reasoning_content : '',
            },
        ];
    }
}
export class ChatManagement {
    static chatMessageContainer = {};
    static addChatRecord(chat, ms, loading) {
        this.chatMessageContainer[chat.id] = new ChatRecordManage(chat, ms, loading);
    }
    static appendChunk(chatRecordId, chunk) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        if (chatRecord) {
            chatRecord.appendChunk(chunk);
        }
    }
    static append(chatRecordId, content, reasoning_content) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        if (chatRecord) {
            chatRecord.append(content, reasoning_content);
        }
    }
    static updateStatus(chatRecordId, code) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        if (chatRecord) {
            chatRecord.chat.status = code;
        }
    }
    /**
     * Continuously write out data from cache zone
     * @param chatRecordId ConversationRecordid
     */
    static write(chatRecordId) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        if (chatRecord) {
            chatRecord.write();
        }
    }
    static open(chatRecordId) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        if (chatRecord) {
            chatRecord.open();
        }
    }
    /**
     * Wait for all data output to complete, then close stream
     * @param chatRecordId ConversationRecordid
     * @returns boolean
     */
    static close(chatRecordId) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        if (chatRecord) {
            chatRecord.close();
        }
    }
    /**
     * StopOutput ImmediatelyCloseScheduledTaskOutput
     * @param chatRecordId ConversationRecordid
     * @returns boolean
     */
    static stop(chatRecordId) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        if (chatRecord) {
            chatRecord.stop();
        }
    }
    /**
     * DetermineWhetherOutputComplete
     * @param chatRecordId ConversationRecordid
     * @returns boolean
     */
    static isClose(chatRecordId) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        return chatRecord ? chatRecord.is_close && chatRecord.write_ed : false;
    }
    /**
     * DetermineWhetherStopOutput
     * @param chatRecordId ConversationRecordid
     * @returns
     */
    static isStop(chatRecordId) {
        const chatRecord = this.chatMessageContainer[chatRecordId];
        return chatRecord ? chatRecord.is_stop : false;
    }
    /**
     * GetSpecifySessionStill inStreaming output(Not yet finished) in-flightMessage
     * Used when switching back to a session: re-connect to streams still running in the background and continue real-time display
     * @param chatId Sessionid (chat.chat_id)
     * @returns In-flight chat ObjectList
     */
    static getActiveByChatId(chatId) {
        return Object.values(this.chatMessageContainer)
            .filter((record) => record.chat.chat_id === chatId && !record.write_ed)
            .map((record) => record.chat);
    }
    /**
     * ClearUselessData Which is beingcloseRemoved andstopData
     */
    static clean() {
        for (const key in Object.keys(this.chatMessageContainer)) {
            if (this.chatMessageContainer[key].is_close) {
                delete this.chatMessageContainer[key];
            }
        }
    }
}
