import { defineStore } from 'pinia';
import { t } from '@/locales';
const usePromptStore = defineStore('prompt', {
    state: () => JSON.parse(localStorage.getItem('PROMPT_CACHE') || '[]'),
    actions: {
        save(user, formValue) {
            this.$state.forEach((item, index) => {
                if (item.user === user) {
                    this.$state.splice(index, 1);
                }
            });
            this.$state.push({ user, formValue });
            localStorage.setItem('PROMPT_CACHE', JSON.stringify(this.$state));
        },
        get(user) {
            for (let i = 0; i < this.$state.length; i++) {
                if (this.$state[i].user === user) {
                    return this.$state[i].formValue;
                }
            }
            return {
                model_id: '',
                model_params_setting: {},
                prompt: t('views.document.generateQuestion.prompt1', { data: '{data}' }) +
                    '<question></question>' +
                    t('views.document.generateQuestion.prompt2'),
            };
        },
    },
});
export default usePromptStore;
