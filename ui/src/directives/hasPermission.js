import { hasPermission } from '@/utils/permission';
const display = async (el, binding) => {
    const has = hasPermission(binding.value?.permission || binding.value, binding.value?.compare || 'OR');
    if (!has) {
        el.style.display = 'none';
    }
    else {
        delete el.style.display;
    }
};
export default {
    install: (app) => {
        app.directive('hasPermission', {
            async created(el, binding) {
                display(el, binding);
            },
            async beforeUpdate(el, binding) {
                display(el, binding);
            },
        });
    },
};
