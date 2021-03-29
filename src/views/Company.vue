<template>
	<div>
		<div class="top">
			<div class="left" v-loading="loading1">
				<img src="@img/perpar.svg" alt="" class="img" />
				<div>
					<p class="num">{{ allPage }} <span>张</span></p>
					<span>打印总纸张</span>
				</div>
			</div>
			<div class="right">
				<div class="title"><p>打印张数前十名：</p></div>
				<Echarts
					:option="echartOption"
					height="340px"
					v-loading="loading"
					class="echart"
				/>
			</div>
		</div>
		<div class="table">
			<el-table :data="tableData" border v-loading="loading">
				<el-table-column
					prop="fileName"
					label="文件名"
				></el-table-column>
				<el-table-column
					prop="printer"
					label="打印机"
				></el-table-column>
				<el-table-column
					prop="userName"
					label="打印人"
				></el-table-column>
				<el-table-column
					prop="filePages"
					label="打印页数"
				></el-table-column>
				<el-table-column
					prop="printTime"
					label="打印时间"
				></el-table-column>
				<el-table-column prop="status" label="打印结果"
					><template slot-scope="scope">
						{{ $commonData.statusObj[scope.row.status] }}
					</template></el-table-column
				>
			</el-table>
			<div class="page">
				<el-pagination
					background
					@size-change="getTable"
					@current-change="getTable"
					:current-page.sync="pageNum"
					:page-sizes="[10, 20, 50]"
					:page-size.sync="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
					style="margin: 0 20px"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
import Echarts from "@c/Echarts";
export default {
	components: {
		Echarts,
	},
	data() {
		return {
			parent: this.$parent,

			tableData: [],
			pageSize: 10,
			pageNum: 1,
			total: 0,
			searchKey: "",
			loading: false,
			loading1: false,
			loading2: false,
			allPage: 0,
			echartOption: {
				tooltip: {
					trigger: "axis",
				},
				xAxis: {
					type: "category",
					data: [],
				},
				yAxis: {
					type: "value",
				},
				series: [
					{
						data: [],
						type: "bar",
						backgroundStyle: {
							color: "rgba(220, 220, 220, 0.8)",
						},
					},
				],
			},
		};
	},
	mounted() {
		this.init();
		this.getAllPage();
		this.getSort();
		this.getTable();
	},
	methods: {
		init() {
			let dataArr = this.$GetStorage("userArr");
			let len = dataArr.length;
			let arr = [];
			for (let i = 0; i < len; i ++) {
				arr.push(dataArr[i].userId)
			}
			if (!arr.includes(this.$GetStorage("userId"))) {
				this.$Notif({
					type: `error`,
					title: "提示",
					message: "您没有权限！",
				});
				this.$router.replace({
					path: "/index",
					query: {
						ticket: this.$GetStorage("ticket") || ""
					}
				})
			}
		},
		getAllPage() {
			this.loading1 = true;
			this.$axios
				.get(this.$axios.base() + this.$api.queryPageCount())
				.then((res) => {
					this.allPage = res.data;
				})
				.finally(() => {
					this.loading1 = false;
				});
		},
		getSort() {
			this.loading2 = true;
			this.$axios
				.get(this.$axios.base() + this.$api.queryPrintBySort())
				.then((res) => {
					let arr = res.data;
					arr.splice(10);
					let data = [],
						series = [];
					arr.forEach((item, index) => {
						data[index] = item.userName;
						series[index] = item.sum;
					});
					this.echartOption.xAxis.data = data;
					this.echartOption.series[0].data = series;
				})
				.finally(() => {
					this.loading2 = false;
				});
		},
		getTable() {
			this.loading = true;
			this.$axios
				.get(this.$axios.base() + this.$api.queryAllPrintInfo(), {
					rows: this.pageSize,
					page: this.pageNum,
					fileName: this.searchKey,
				})
				.then((res) => {
					this.tableData = res.rows;
					this.total = res.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>
<style lang="scss" scoped>
.left {
	width: 30%;
	display: flex;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
	img {
		width: 70px;
		margin-right: 30px;
	}
	.num {
		color: $color7;
		font-size: 48px;
		margin-bottom: 10px;
		span {
			// color: $color6;
			font-size: 14px;
		}
	}
	span {
		color: $color8;
	}
}
.right {
	width: 70%;
	display: flex;
	align-items: center;
	.title {
		width: 30%;
		text-align: right;
	}
	.echart {
		width: 70%;
	}
}
</style>
