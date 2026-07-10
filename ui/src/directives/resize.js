export default {
    install: (app) => {
        app.directive('resize', {
            created(el, binding) {
                // RecordLength/width
                let width = '';
                let height = '';
                function getSize() {
                    const style = document.defaultView.getComputedStyle(el);
                    // IfCurrentLength, width, andHistoryLength/widthDifferent
                    if (width !== style.width || height !== style.height) {
                        // binding.valueHere it refers to the followingresizeChartFunction
                        binding.value({
                            width: parseFloat(style.width),
                            height: parseFloat(style.height)
                        });
                    }
                    width = style.width;
                    height = style.height;
                }
                ;
                el.__vueDomResize__ = setInterval(getSize, 500);
            },
            unmounted(el, binding) {
                clearInterval(el.__vueDomResize__);
            }
        });
    }
};
