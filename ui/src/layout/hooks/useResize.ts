import { nextTick, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import useStore from '@/stores'
import { DeviceType } from '@/enums/common'
/** Reference Bootstrap ResponseStyle design WIDTH = 768 */
const WIDTH = 768

/** Based onSizeChangeRe-Layout */
export default () => {
  const { common } = useStore()
  const _isMobile = () => {
    const rect = document.body?.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  // const _resizeHandler = () => {
  //   if (!document.hidden) {
  //     const isMobile = _isMobile()
  //     common.toggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
  //   }
  // }

  // onBeforeMount(() => {
  //   window.addEventListener('resize', _resizeHandler)
  // })

  onMounted(() => {
    nextTick(() => {
      if (_isMobile()) {
        common.toggleDevice(DeviceType.Mobile)
      }
    })
  })

  // onBeforeUnmount(() => {
  //   window.removeEventListener('resize', _resizeHandler)
  // })
}
