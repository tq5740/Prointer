<template>
	<div>
		<div class="top">
			<div></div>
			<div>
				<el-input style="display:none"></el-input>
				<el-input
					v-model="searchKey"
					placeholder="输入文件名搜索"
					class="w280"
					@keyup.13.native="getTable"
					clearable
					><el-button
						type="primary"
						icon="el-icon-search"
						slot="append"
						@click="getTable"
					></el-button
				></el-input>
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
export default {
	data() {
		return {
			tableData: [],
			pageSize: 10,
			pageNum: 1,
			total: 0,
			searchKey: "",
			loading: false,
			userId: "",
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.getData();
			this.getTable();
		},
		getData() {
			// 必须初始化赋值，不能写在data
			this.userId = this.$GetStorage("userId");
		},
		getTable() {
			this.loading = true;
			this.$axios
				.get(this.$axios.base() + this.$api.queryPrintInfo(), {
					userId: this.userId,
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
<style scoped></style>
