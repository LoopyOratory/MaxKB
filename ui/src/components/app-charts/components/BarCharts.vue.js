/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { numberFormat } from '@/utils/common';
const props = defineProps({
    id: {
        type: String,
        default: 'barChartId',
    },
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '200px',
    },
    option: {
        type: Object,
        required: true,
    }, // option: { title , xData, yData, formatStr  }
});
const color = ['rgba(82, 133, 255, 1)', 'rgba(255, 207, 47, 1)'];
const areaColor = ['rgba(82, 133, 255, 0.2)', 'rgba(255, 207, 47, 0.2)'];
function initChart() {
    let myChart = echarts?.getInstanceByDom(document.getElementById(props.id));
    if (myChart === null || myChart === undefined) {
        myChart = echarts.init(document.getElementById(props.id));
    }
    const series = [];
    if (props.option?.yData?.length) {
        props.option?.yData.forEach((item, index) => {
            series.push({
                type: 'bar',
                barWidth: '20',
                itemStyle: {
                    color: color[index],
                },
                areaStyle: item.area
                    ? {
                        color: areaColor[index],
                    }
                    : null,
                ...item,
            });
        });
    }
    const option = {
        title: {
            text: props.option?.title,
            textStyle: {
                fontSize: '16px',
                color: '#1f2329',
            }
        },
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => numberFormat(value),
        },
        legend: {
            top: 0,
            right: 0,
            itemWidth: 8,
            textStyle: {
                color: '#646A73',
            },
            icon: 'circle',
        },
        grid: {
            left: '1%',
            right: '1%',
            bottom: '0',
            top: '18%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: props.option.xData,
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: '#EFF0F1',
                },
            },
            axisLabel: {
                formatter: (value) => {
                    return numberFormat(value);
                },
            },
        },
        dataZoom: [
            {
                type: 'inside',
                show: props.option.dataZoom,
            },
            {
                type: 'slider',
                show: props.option.dataZoom,
            },
        ],
        series: series,
    };
    // RenderData
    myChart.setOption(option, true);
}
function changeChartSize() {
    echarts.getInstanceByDom(document.getElementById(props.id))?.resize();
}
watch(() => props.option, (val) => {
    if (val) {
        nextTick(() => {
            initChart();
        });
    }
});
onMounted(() => {
    nextTick(() => {
        initChart();
        window.addEventListener('resize', changeChartSize);
    });
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', changeChartSize);
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    id: (__VLS_ctx.id),
    ref: "BarChartRef",
    ...{ style: ({ height: __VLS_ctx.height, width: __VLS_ctx.width }) },
});
// @ts-ignore
[id, height, width,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        id: {
            type: String,
            default: 'barChartId',
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '200px',
        },
        option: {
            type: Object,
            required: true,
        }, // option: { title , xData, yData, formatStr  }
    },
});
export default {};
