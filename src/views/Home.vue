<template>
	<div>
		<div class="top">
			<el-button type="primary" icon="el-icon-upload" @click="printBtn()"
				>打印文件</el-button
			>
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
					min-width="300"
				></el-table-column>
				<el-table-column
					prop="createName"
					label="上传者"
					min-width="160"
				></el-table-column>
				<el-table-column
					prop="uploadTime"
					label="上传时间"
					min-width="160"
				></el-table-column>
				<el-table-column prop="size" label="大小" min-width="120">
					<template slot-scope="scope">
						{{ bytesToSize(scope.row.fileSize) }}
					</template>
				</el-table-column>
				<el-table-column
					prop="remark"
					label="备注"
					min-width="160"
				></el-table-column>
				<el-table-column prop="handle" label="操作" width="260">
					<template slot-scope="scope">
						<el-button
							@click="printBtn(scope.row)"
							type="primary"
							size="medium"
							>打印</el-button
						>
						<el-button @click="downLoad(scope.row)" size="medium"
							>下载</el-button
						>
						<el-button @click="deleteBtn(scope.row)" size="medium"
							>删除</el-button
						>
					</template>
				</el-table-column>
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
		<el-dialog
			title="选择打印机"
			v-if="showPrinterList"
			:visible.sync="showPrinterList"
			width="70%"
		>
			<div class="printerImg" v-loading="loading1">
				<div v-if="!printerList.length" class="no-data">
					<i class="el-icon-warning-outline icon"></i>
					<span>未查询到打印机</span>
				</div>
				<el-card
					v-for="item in printerList"
					:key="item.id"
					@click.native="choicePrinter(item)"
					class="box"
					v-else
				>
					<div class="box_nr">
						<el-image :src="item.img" :alt="item.name" class="img">
							<div slot="error" class="image">
								<img
									src="@img/dayinji.svg"
									class="img_zw"
								/></div
						></el-image>
						<div class="info">
							<p class="name">{{ item.name }}</p>
							<div
								class="state"
								:class="item.isPrinter ? 'state1' : 'state2'"
							>
								<p class="type1">
									{{ item.isPrinter ? "在线" : "离线" }}
								</p>
								<p class="type2">
									{{
										item.isPrinter
											? "打印机可用"
											: "打印机不可用"
									}}
								</p>
							</div>
						</div>
					</div>
				</el-card>
			</div>
		</el-dialog>
		<el-dialog
			v-if="showPrinter"
			:title="printer.fileName ? printer.name + ' - ' + printer.fileName : printer.name"
			:visible.sync="showPrinter"
			:close-on-click-modal="false"
			width="80%"
		>
			<Pointer :printer="printer" @close="closePointer" />
		</el-dialog>
	</div>
</template>
<script>
import Pointer from "./dialog/pointer";
import { bytesToSize } from "@utils/index";
export default {
	components: {
		Pointer,
	},
	data() {
		return {
			bytesToSize: bytesToSize,
			deviceId: "",
			deviceKey: "",
			devicePort: "",
			tableData: [],
			printerList: [],
			printerData: [],
			printer: {},
			printerLength: 0,
			loading: false,
			loading1: false,
			showPrinterList: false,
			showPrinter: false,
			pageSize: 10,
			pageNum: 1,
			total: 0,
			searchKey: "",
			filesNum: 0,
			driverName: "",
			userName: "",
			userId: "",
		};
	},
	mounted() {
		if (this.$parent.isInit) {
			this.init();
		}
		var _this = this;
		var table = document.querySelector(".table");
		table.addEventListener(
			"dragenter",
			function(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);
		table.addEventListener(
			"dragover",
			function(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);
		table.addEventListener(
			"dragleave",
			function(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);
		table.addEventListener("drop", function(e) {
			e.preventDefault();
			e.stopPropagation();
			// 处理拖拽文件的逻辑
			var files = e.dataTransfer.files;
			_this.filesNum = files.length;
			if (files.length > 5) {
				_this.$Notif({
					type: `error`,
					title: "提示",
					message: "一次最多只能拖拽5个文件",
				});
				return;
			}
			files.forEach((item, index) => {
				if (item.size > 102400000) {
					_this.$Notif({
						type: `error`,
						title: "提示",
						message: `上传${item.name}失败！最大支持100MB！`,
					});
				} else {
					_this.$Notif({
						type: `info`,
						title: "提示",
						message: `正在上传${item.name}`,
					});
					_this.fileUpload(item, index);
				}
			});
		});
	},
	methods: {
		init() {
			this.$parent.isInit = true;
			this.getData();
			this.getTable();
			this.getPrinterList();
		},
		getData() {
			// 必须初始化赋值，不能写在data,因为子页面要使用该值
			this.userName = this.$parent.userName;
			this.userId = this.$parent.userId;
		},
		refreshDeviceInfo(item) {
			return new Promise((resolve, reject) => {
				this.$axios
				.get(this.$api.url1() + this.$api.refreshDeviceInfo(), {
					deviceId: item.deviceId,
				})
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
			})
		},
		getTable() {
			this.loading = true;
			this.$axios
				.get(this.$axios.base() + this.$api.getFileList4Page(), {
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
		printBtn(row = {}) {
			this.printer = row;
			this.showPrinterList = true;
			this.getPrinterList();
		},
		getPrinterList() {
			this.printerList = [];
			this.loading1 = true;
			this.$axios
				.post(this.$axios.base() + this.$api.getPrinter(), {})
				.then((res) => {
					this.printerData = res.data;
					this.deviceId = this.printerData[0].deviceId; // 获取默认打印机Id、打印机Key，用于获取打印页数接口
					this.deviceKey = this.printerData[0].deviceKey;
					this.printerData.forEach((item, index) => {
						this.refreshDeviceInfo(item).then((res) => {
							this.getPrinterInfo(item, index, res.code);
						})
					});
				})
		},
		getPrinterInfo(item, index, code) {
			this.loading1 = true;
			this.$axios
				.get(this.$api.url1() + this.$api.printerList(), {
					deviceId: item.deviceId,
					deviceKey: item.deviceKey,
				})
				.then((res) => {
					let obj = res.data.row[0];
					if (index === 0) {
						// 获取默认打印机端口号、打印机型号，用于获取打印页数接口
						this.devicePort = obj.port;
						this.driverName = obj.driver_name;
					}
					Object.keys(obj).forEach((item) => {
						if (item === "isPrinter") {
							this.printerData[index][item] = obj[item] && code == 200;
						} else {
							this.printerData[index][item] = obj[item];
						}
					});
					this.printerList = this.printerData;
					// console.log(this.printerData)
				})
				.finally(() => {
					this.loading1 = false;
				});
		},
		choicePrinter(item) {
			if (!item.isPrinter) {
				this.$Notif({
					type: `error`,
					title: "提示",
					message: "该打印机不可用",
					customClass: "zZindex",
				});
				return;
			}
			// console.log(this.printer, item)
			this.printer = { ...this.printer, ...item };
			this.showPrinter = true;
		},
		fileUpload(files = "", num = 0) {
			let formData = new FormData();
			formData.append("files", files);
			formData.append("createName", this.userName);
			formData.append("updateUser", this.userId);
			formData.append("deviceId", this.deviceId);
			formData.append("deviceKey", this.deviceKey);
			formData.append("driverName", this.driverName);
			formData.append("port", this.devicePort);
			this.$axios
				.post(this.$axios.base() + this.$api.fileUpload(), formData)
				.then((res) => {
					if ("success" in res && res.success) {
						if (!files || num === this.filesNum - 1) {
							// 拖拽多个上传时，列表只刷新一次
							this.getTable();
							this.$Notif({
								type: `success`,
								title: "提示",
								message: "上传成功",
							});
						}
					}
				})
				.catch(() => {
					this.$Notif({
						type: `error`,
						title: "提示",
						message: "上传文件失败！请联系技术人员！",
					});
				})
		},
		downLoad(row) {
			if (window.navigator.msSaveOrOpenBlob) {
				this.$axios
					.get(this.$axios.base() + this.$api.download(), {
						id: row.id,
					})
					.then((res) => {
						let blob = new Blob([res.data]);
						window.navigator.msSaveOrOpenBlob(blob, row.fileName);
					});
			} else {
				this.$axios
					.post(this.$axios.base() + this.$api.download(), {
						id: row.id,
					})
					.then(() => {
						let url =
							this.$axios.base() + this.$api.download() + "?id=" + row.id;
						var divFrame = window.parent.document.getElementById(
							"downLoadListFrame"
						);
						if (divFrame != null) {
							window.parent.document.body.removeChild(divFrame);
						}
						var iframe = document.createElement("iframe");
						iframe.setAttribute("id", "downLoadListFrame");
						iframe.style.display = "none";
						iframe.src = url;
						document.body.appendChild(iframe);
						setTimeout(function() {
							iframe.src = "";
						}, 1000);
					})
			}
		},
		deleteBtn(row) {
			this.$MessageBox.confirm(`确认删除 ${row.fileName} ？`).then(() => {
				this.$axios
					.post(this.$axios.base() + this.$api.deleteFiles(), {
						id: row.id,
					})
					.then(() => {
						this.$Notif({
							type: `success`,
							title: "提示",
							message: "删除成功！",
						});
						this.getTable();
					})
					.finally(() => {});
			});
		},
		closePointer(type = false) {
			this.showPrinter = false;
			if (type) {
				this.showPrinterList = false;
				this.getTable();
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.printerImg {
	display: flex;
	flex-wrap: wrap;
	.box {
		width: 47%;
		min-width: 330px;
		max-width: 430px;
		cursor: pointer;
		margin: 10px;
		.box_nr {
			display: flex;
		}
		.img {
			height: auto;
			background-color: rgb(252, 252, 252);
			border: 1px solid rgb(246, 246, 246);
			padding: 5px 25px;
			margin-right: 10px;
			.img_zw {
				width: 80px;
			}
		}
		/deep/.image {
			text-align: center;
		}
		.name {
			margin: 10px 0 20px 0px;
			font-size: 16px;
		}
		.state {
			display: flex;
			align-items: center;
			p {
				margin-right: 10px;
				padding: 7px 11px 8px 10px;
				border-radius: 4px;
				font-size: 12px;
			}
		}
		.state1 {
			.type1 {
				color: $fff;
				background: $color3;
			}
			.type2 {
				background: $color3-1;
				color: $color3;
			}
		}
		.state2 {
			.type1 {
				background: $color4;
			}
			.type2 {
				background: $color4-1;
				color: $color4;
			}
		}
	}
}
.no-data {
	width: 100%;
	text-align: center;
	.icon {
		font-size: 16px;
	}
	span {
		margin-left: 5px;
	}
}
</style>
