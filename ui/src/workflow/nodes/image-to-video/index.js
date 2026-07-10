import VideoGenerateNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class VideoNode extends AppNode {
    constructor(props) {
        super(props, VideoGenerateNodeVue);
    }
}
export default {
    type: 'image-to-video-node',
    model: AppNodeModel,
    view: VideoNode
};
