import type { App } from 'vue'
export default {
  install: (app: App) => {
    app.directive('resize', {
      created(el: any, binding: any) {
        // RecordLength/width
        let width = ''
        let height = ''
        function getSize() {
          const style = (document.defaultView as any).getComputedStyle(el)
          // IfCurrentLength, width, andHistoryLength/widthDifferent
          if (width !== style.width || height !== style.height) {
            // binding.valueHere it refers to the followingresizeChartFunction

            binding.value({
              width: parseFloat(style.width),
              height: parseFloat(style.height)
            })
          }
          width = style.width
          height = style.height
        }

        ;(el as any).__vueDomResize__ = setInterval(getSize, 500)
      },
      unmounted(el: any, binding: any) {
        clearInterval((el as any).__vueDomResize__)
      }
    })
  }
}
