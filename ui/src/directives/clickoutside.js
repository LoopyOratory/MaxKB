import { ClickOutside as vClickOutside } from 'element-plus';
export default {
    install: (app) => {
        app.directive('click-outside', vClickOutside);
    }
};
