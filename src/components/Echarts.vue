<template>
	<div id="echarts">
		<div
			class="echarts"
			ref="chart"
			:style="{ height: height, width: width }"
		></div>
	</div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/component/tooltip');
export default {
	props: {
		width: {
			type: String,
			default: '100%',
		},
		height: {
			type: String,
			default: '280px',
		},
		option: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			myChart: null,
		};
	},
	watch: {
		option: {
			handler(newVal, oldVal) {
				if (this.myChart) {
					if (newVal) {
						this.myChart.setOption(newVal, true);
					} else {
						this.myChart.setOption(oldVal, true);
					}
				} else {
					this.init();
				}
			},
			deep: true,
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.init();
		});
	},
	methods: {
		init() {
			this.myChart = echarts.init(this.$refs.chart);
			this.myChart.setOption(this.option, true);
			let myChart = this.myChart;
			window.addEventListener('resize', function() {
				myChart.resize();
			});
		},
	},
};
</script>
<style scoped>
#echarts {
	width: 100%;
}
</style>
