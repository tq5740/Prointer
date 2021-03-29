<template>
	<div
		v-loading="loading"
		:element-loading-text="loadingText"
		class="pointer"
	>
		<div class="main">
			<el-form label-width="130px" class="width50">
				<el-form-item label="任务文件：" v-if="!printerObj.filePath">
					<el-upload
						action=""
						:http-request="upLoad"
						drag
						:limit="5"
						:on-exceed="handleExceed"
						:on-change="handleChange"
						:on-remove="handleRemove"
						:file-list="fileList"
						multiple
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到此处，或<em>点击上传</em>
						</div>
					</el-upload>
					<p class="el-upload__tip">
						支持图片, PDF, Office, HTML，最多5个文件，文件大小不超过100M（多文件打印不支持预览）
					</p>
				</el-form-item>
				<el-form-item label="备注：" v-if="!printerObj.filePath">
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入内容"
						v-model="remark"
						style="width: 90%"
					></el-input>
				</el-form-item>
				<el-form-item label="打印纸张尺寸：">
					<el-select v-model="dmPaperSize" placeholder="请选择">
						<el-option
							v-for="item in papersOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<p v-if="dmPaperSize === 0" style="margin-top: 10px;">
						<span
							>高：<el-input
								v-model="dmPaperLength"
								style="width: 60px;"
							></el-input
							>mm</span
						>
						<span style="margin-left: 15px"
							>宽：<el-input
								v-model="dmPaperWidth"
								style="width: 60px;"
							></el-input
							>mm</span
						>
					</p>
				</el-form-item>
				<el-form-item label="打印纸张方向：">
					<el-radio-group v-model="dmOrientation">
						<el-radio :label="1">竖向</el-radio>
						<el-radio :label="2">横向</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="打印份数：">
					<el-input
						v-model="dmCopies"
						style="width: 60px; margin-left: 10px"
					></el-input>
					最大数值：{{ this.maxCopies }}
				</el-form-item>
				<div v-if="printerObj.filePath">
					<el-form-item label="纸张来源：">
						<el-select
							v-model="dmDefaultSource"
							placeholder="请选择"
						>
							<el-option
								v-for="item in defaultSourceOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="打印颜色：">
						<el-radio-group v-model="dmColor">
							<el-radio
								v-for="item in colorOptions"
								:key="item.value"
								:label="item.value"
								>{{ item.label }}</el-radio
							>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="双面打印：">
						<el-radio-group v-model="dmDuplex">
							<el-radio
								v-for="item in duplexOptions"
								:key="item.value"
								:label="item.value"
								>{{ item.label }}</el-radio
							>
						</el-radio-group>
					</el-form-item>
				</div>
			</el-form>
			<el-form label-width="130px" class="width50">
				<div v-if="!printerObj.filePath">
					<el-form-item label="纸张来源：">
						<el-select
							v-model="dmDefaultSource"
							placeholder="请选择"
						>
							<el-option
								v-for="item in defaultSourceOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="打印颜色：">
						<el-radio-group v-model="dmColor">
							<el-radio
								v-for="item in colorOptions"
								:key="item.value"
								:label="item.value"
								>{{ item.label }}</el-radio
							>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="双面打印：">
						<el-radio-group v-model="dmDuplex">
							<el-radio
								v-for="item in duplexOptions"
								:key="item.value"
								:label="item.value"
								>{{ item.label }}</el-radio
							>
						</el-radio-group>
					</el-form-item>
				</div>
				<el-form-item label="打印纸张类型：">
					<el-select v-model="dmMediaType" placeholder="请选择">
						<el-option
							v-for="item in mediaTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文档页数范围：">
					<el-input
						v-model="jpPageRangeMin"
						style="width: 60px"
					></el-input>
					-
					<el-input
						v-model="jpPageRangeMax"
						style="width: 60px"
					></el-input>
				</el-form-item>
				<el-form-item label="自动缩放：">
					<el-select v-model="jpAutoScale" placeholder="请选择">
						<el-option
							v-for="item in jpAutoScaleOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<span v-if="jpAutoScale === -1">
						<el-input
							max="100"
							min="0"
							v-model="jpAutoScaleNum"
							style="width: 60px; margin-left: 10px"
						></el-input
						>%
					</span>
				</el-form-item>
				<el-form-item label="自动对齐：">
					<el-select v-model="jpAutoAlign" placeholder="请选择">
						<el-option
							v-for="item in jpAutoAlignOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="打印质量：">
					<el-radio-group v-model="dmPrintQuality">
						<el-radio
							v-for="item in printQualityOptions"
							:key="item.value"
							:label="item.value"
							>{{ item.label }}</el-radio
						>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否添加水印：">
					<el-switch
						v-model="isWatermark"
						active-text="是"
						inactive-text="否"
					>
					</el-switch>
					<el-button
						type="primary"
						size="mini"
						@click="showWatermark = true"
						v-if="isWatermark"
						style="margin-left: 30px"
						>设置水印</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<div id="container"></div>
		<div style="text-align: right">
			<el-button type="primary" @click="printerBtn(0)"
				>开始打印</el-button
			>
			<el-button type="primary" plain @click="printerBtn(1)" v-if="fileList.length < 2"
				>预览</el-button
			>
			<el-button @click="$emit('close')">取消</el-button>
		</div>
		<el-dialog
			v-if="showPreview"
			:visible.sync="showPreview"
			:before-close="closePre"
			width="80%"
			title="预览"
			append-to-body
			fullscreen
		>
			<Preview
				:imgList="imgList"
				:checkList="checkList"
				@checkPreview="checkPreview"
			/>
		</el-dialog>
		<el-dialog
			:visible.sync="showWatermark"
			width="80%"
			title="设置水印"
			append-to-body
			fullscreen
			:show-close="false"
		>
			<Watermark ref="watermark" />
		</el-dialog>
		<el-dialog
			v-if="showBegin"
			:visible.sync="showBegin"
			width="30%"
			append-to-body
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			class="state-box"
		>
			<p class="name">{{ printerObj.name }}</p>
			<div v-loading="true" style="height: 60px;margin-top: 30px;"></div>
			<p class="text">{{ loadingText }}</p>
			<el-button @click="cancel()" :loading="loadingDel"
				>取消打印</el-button
			>
		</el-dialog>
	</div>
</template>
<script>
import Preview from "./preview";
import Watermark from "./watermark";
export default {
	components: {
		Preview,
		Watermark,
	},
	props: {
		printer: Object,
	},
	data() {
		return {
			parent: this.$parent.$parent,
			isIE: false,

			papersOptions: [],
			defaultSourceOptions: [],
			colorOptions: [],
			duplexOptions: [],
			mediaTypeOptions: [],
			jpAutoScaleOptions: [],
			jpAutoAlignOptions: [],
			printQualityOptions: [],

			dmPaperSize: "",
			dmOrientation: "",
			dmCopies: "",
			dmDefaultSource: "",
			dmColor: 1,
			dmDuplex: 1,
			dmMediaType: "",
			jpPageRange: "",
			jpAutoScale: "100%",
			jpAutoScaleNum: 0,
			jpAutoAlign: "z1",
			dmPaperLength: "",
			dmPaperWidth: "",
			isPreview: 0,
			targetIp: "0.0.0.0",
			dmPrintQuality: -3,

			jpPageRangeMin: "",
			jpPageRangeMax: "",
			printerObj: this.printer,
			jobFilePath: "",
			loading: false,
			loadingDel: false,
			maxCopies: 0,
			timers: {},
			time: 5000,
			timeInterval: 800,
			imgList: [],
			checkList: [],
			showPreview: false,
			showBegin: false,
			loadingText: "文件上传中，请稍等...",
			remark: "",
			fileList: [],
			userName: "",
			userId: "",
			pageCountNow: 1,
			pageBroadCountNow: 1,
			taskInfoArr: [],
			imgListObj: {},
			isCheckList: false,

			isWatermark: false, // 是否是水印打印
			showWatermark: false,
		};
	},
	created() {
		this.init();
		this.lookPrinter();
	},
	beforeDestroy() {
		Object.keys(this.timers).forEach((item) => {
			clearInterval(this.timers[item]);
			delete this.timers[item];
		});
	},
	methods: {
		init() {
			this.isIE = this.$GetStorage("isIE");
			this.userName = this.parent.userName;
			this.userId = this.parent.userId;
			this.jobFilePath = this.printer.filePath
				? this.$axios.baseUrl() +
				this.printer.filePath.replace("/opt/app", "") // /data/print/
				: "";
			this.papersOptions = [
				{
					label: "自定义",
					value: 0,
				},
			];
			this.dmCopies = 1;
			this.jpAutoScaleOptions = [
				{
					label: "100%",
					value: "100%",
				},
				{
					label: "自适应",
					value: 4,
				},
				{
					label: "原图打印",
					value: 0,
				},
				{
					label: "宽度优先(超出时裁剪高度)",
					value: 1,
				},
				{
					label: "高度优先(超出时裁剪宽度)",
					value: 2,
				},
				{
					label: "拉伸全图",
					value: 3,
				},
				{
					label: "自定义，占纸张的百分比",
					value: -1,
				},
			];
			this.jpAutoAlignOptions = [
				{
					label: "左上",
					value: "z1",
				},
				{
					label: "左中",
					value: "z4",
				},
				{
					label: "左下",
					value: "z7",
				},
				{
					label: "中上",
					value: "z2",
				},
				{
					label: "中",
					value: "z5",
				},
				{
					label: "中下",
					value: "z8",
				},
				{
					label: "右上",
					value: "z3",
				},
				{
					label: "右中",
					value: "z6",
				},
				{
					label: "右下",
					value: "z9",
				},
			];
			this.printQualityOptions = [
				{
					label: "最低",
					value: -1,
				},
				{
					label: "普通",
					value: -2,
				},
				{
					label: "偏高",
					value: -3,
				},
				{
					label: "最高",
					value: -4,
				},
			];
		},
		lookPrinter() {
			this.$axios
				.get(this.$api.url1() + this.$api.printerParams(), {
					printerModel: this.printer.driver_name,
				})
				.then((res) => {
					let Papers = res.data.Capabilities.Papers,
						DevMode = res.data.DevMode,
						Capabilities = res.data.Capabilities;

					Object.keys(Papers).forEach((item, index) => {
						this.papersOptions[index + 1] = {
							label: item,
							value: Papers[item],
						};
					});
					Object.keys(Capabilities.Bins).forEach((item, index) => {
						this.defaultSourceOptions[index] = {
							label: item,
							value: Capabilities.Bins[item],
						};
					});
					Object.keys(Capabilities.Color).forEach((item, index) => {
						this.colorOptions[index] = {
							label: item,
							value: Capabilities.Color[item],
						};
					});
					if (this.colorOptions[0].value != 1) {
						this.colorOptions.reverse();
					}
					Object.keys(Capabilities.Duplex).forEach((item, index) => {
						this.duplexOptions[index] = {
							label: this.$commonData.duplexObj[item] || item,
							value: Capabilities.Duplex[item],
						};
					});
					Object.keys(Capabilities.MediaTypes).forEach(
						(item, index) => {
							this.mediaTypeOptions[index] = {
								label: item,
								value: Number(Capabilities.MediaTypes[item]),
							};
						}
					);

					this.dmPaperSize = DevMode.PaperSize;
					this.dmOrientation = DevMode.Orientation;
					this.dmDefaultSource = DevMode.DefaultSource;
					// this.dmColor = DevMode.Color || 1;
					// this.dmDuplex = DevMode.Duplex;
					this.dmMediaType = Number(DevMode.MediaType);
					this.maxCopies = Capabilities.Copies;
				})
				.catch(function(err) {
					console.log(err);
				});
		},
		formatData(btnType) {
			let notif = {
				type: `error`,
				title: "提示",
				message: "请选择任务文件",
				customClass: "zZindex",
			};
			if (!(this.jobFilePath || this.fileList.length) || (this.isPreview && !this.checkList.length)) {
				this.$Notif(notif);
				return false;
			}
			if (
				this.dmPaperSize === 0 &&
				(this.dmPaperLength === "" || this.dmPaperWidth === "")
			) {
				notif.message = "请输入自定义尺寸的宽、高";
				this.$Notif(notif);
				return false;
			}
			if (
				(this.jpPageRangeMin !== "" && this.jpPageRangeMax === "") ||
				(this.jpPageRangeMin === "" && this.jpPageRangeMax !== "")
			) {
				notif.message = "请输入完整的页码范围或者不填该项";
				this.$Notif(notif);
				return false;
			}
			if (this.isWatermark) {
				if (!this.$refs.watermark) {
					notif.message = "请设置水印";
					this.$Notif(notif);
					return false;
				}
				if (this.$refs.watermark.watermarkFile === "") {
					notif.message = "请选择水印图片";
					this.$Notif(notif);
					return false;
				}
				if (
					this.$refs.watermark.watermarkSize === "" ||
					this.$refs.watermark.waterAlpha === "" ||
					this.$refs.watermark.markNumRow === "" ||
					this.$refs.watermark.markNumCol === "" ||
					this.$refs.watermark.waterRotate === ""
				) {
					notif.message = "水印参数不能为空，请完整填写";
					this.$Notif(notif);
					return false;
				}
			}
			if (
				this.jpPageRangeMin !== "" &&
				this.jpPageRangeMax !== "" &&
				this.showPreview === false
			) {
				this.jpPageRange =
					this.jpPageRangeMin + "-" + this.jpPageRangeMax;
			} else {
				this.jpPageRange = "";
			}
			if (btnType === 3) {
				if (this.checkList.length === 0) {
					notif.message = "请勾选需要打印的页码";
					this.$Notif(notif);
					this.loading = false;
					return false;
				} else if (this.checkList.length === 1) {
					this.jpPageRange = this.checkList[0];
				} else {
					this.jpPageRange = this.checkList.join(",");
				}
			}
			return true;
		},
		printerBtn(btnType = 0) {
			this.loading = true;
			if (btnType === 3) {
				this.loading = false;
			}
			this.jobFilePath
				? (this.loadingText = "文件加载中，请稍等...")
				: (this.loadingText = "文件上传中，请稍等...");
			this.parent.refreshDeviceInfo(this.printer)
				.then(() => {
					this.taskInfoArr = [];
					if (this.jobFilePath) {
						this.taskInfoArr = [{
							alterIsPreview: false, // 是否已经把打印修改成预览过
							havePreviewImg: false, // 是否已经拿到预览图片
							pages: 1, // 当前文件的张数
							fileName: this.printer.fileName, // 当前文件名称
							taskId: "",
							isFailed: false, // 是否请求失败过
							getTaskStateNum: 0, // 任务请求次数
						}];
						this.beginPrinter("", 0, btnType);
					} else {
						this.fileList.forEach((item, index) => {
							this.taskInfoArr[index] = {
								file: item.raw,
								alterIsPreview: false, // 是否已经把打印修改成预览过
								havePreviewImg: false, // 是否已经拿到预览图片
								pages: 1, // 当前文件的张数
								fileName: item.raw.name, // 当前文件名称
								taskId: "",
								isFailed: false, // 是否请求失败过
								getTaskStateNum: 0, // 任务请求次数
							};
							const _this = this;
							setTimeout(function() {
								_this.beginPrinter(item.raw, index, btnType);
							}, _this.timeInterval * index)
						})
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		beginPrinter(file = "", taskNum = 0, btnType = 0) { // taskNum: 第几个文件,0开始
			if (!this.formatData(btnType)) {
				this.loading = false;
				return;
			}
			if (btnType === 3) {
				this.showBegin = true;
			}
			this.isPreview = btnType === 3 ? 0 : btnType;
			if (file && this.isPreview === 0 && !Array.isArray(file)) {
				if (file.type.includes("application/")) { // 该格式可以获取页数
					this.getFilePages(file); // 把打印页数查出来及上传文件
				} else {
					this.fileUpload(1, 1, 1, 1, file); // 不能获取页数，打印页数为1并保存
				}
			}
			let params = {
				deviceId: this.printer.deviceId,
				deviceKey: this.printer.deviceKey,
				devicePort: this.printer.port,
				printerModel: this.printer.driver_name,
				jobFile: this.jobFilePath,
				dmPaperSize: this.dmPaperSize,
				dmOrientation: this.dmOrientation,
				dmCopies: this.dmCopies,
				dmDefaultSource: this.dmDefaultSource,
				dmColor: this.dmColor,
				dmDuplex: this.dmDuplex,
				dmMediaType: this.dmMediaType,
				jpPageRange: this.jpPageRange,
				jpAutoScale:
					this.jpAutoScale === -1
						? this.jpAutoScaleNum
						: this.jpAutoScale,
				jpAutoAlign: this.jpAutoAlign,
				dmPaperLength: this.dmPaperLength,
				dmPaperWidth: this.dmPaperWidth,
				isPreview: this.isPreview, // 预览，默认0，isPreview=1任务结果返回预览图片
				htmlKernel: "wkhtml",
				targetIp: this.targetIp,
				dmPrintQuality: this.dmPrintQuality,
			};
			if (this.dmOrientation == 2 && this.dmDuplex != 1) {
				// 如果是横向打印，那么双面打印相反
				params.dmDuplex = this.dmDuplex == 2 ? 3 : 2;
			}
			if (this.isWatermark && !this.taskInfoArr[taskNum].havePreviewImg) {
				// 在加水印的情况下第一次任务先拿到预览图片
				params.isPreview = 1;
				this.taskInfoArr[taskNum].alterIsPreview = true;
			}
			if (params.isPreview === 0) {
				console.log(params, file)
				// return;
			}
			let formData = new FormData();
			if (file) {
				delete params.jobFile;
				if (Array.isArray(file)) {
					file.forEach((item) => {
						formData.append("jobFile", item);
					});
				} else {
					formData.append("jobFile", file);
				}
			}
			Object.keys(params).forEach((item) => {
				formData.append(item, params[item]);
			});
			this.$axios
				.post(this.$api.url1() + this.$api.job(), formData)
				.then((res) => {
					const taskId = res.data.task_id;
					this.taskId = taskId;
					if (this.isPreview === 0) {
						if ((this.isWatermark && !this.taskInfoArr[taskNum].havePreviewImg) || !this.isWatermark) {
							this.loading = false;
							this.showBegin = true;
						}
					}
					this.taskInfoArr[taskNum].taskId = this.taskId;
					this.timers[taskId] = setInterval(() => {
						this.getTaskState(taskId, taskNum);
						this.showBegin = false;
					}, this.time);
				})
				.catch(() => { // 失败的话再打印一次
					if (this.taskInfoArr[taskNum].file && this.taskInfoArr[taskNum].isFailed === false) {
						this.taskInfoArr[taskNum].isFailed === true;
						this.beginPrinter(this.taskInfoArr[taskNum].file, taskNum, btnType)
					} else {
						this.loading = false;
					}
				});
		},
		saveDetails(taskId, taskNum) {
			let pages = 1;
			if (this.isWatermark) {
				pages = this.taskInfoArr[taskNum].pages;
			} else {
				if (this.printer.pageCount !== undefined) {
					this.pageBroadCountNow = this.printer.pageBroadCount;
					this.pageCountNow = this.printer.pageCount;
				}
				let maxNum = this.dmOrientation == 1 ? Number(this.pageCountNow) : Number(this.pageBroadCountNow);
				if (this.jpPageRange !== "") {
					if (this.jpPageRange.includes("-")) {
						pages =
							Math.min(Number(this.jpPageRangeMax), maxNum) - (Number(this.jpPageRangeMin) > 0 ? Number(this.jpPageRangeMin) : 1) + 1;
					} else if (this.jpPageRange.includes(",")) {
						pages = this.jpPageRange.split(",").length;
					}
				} else {
					pages = maxNum;
				}
			}
			this.$axios
				.post(this.$axios.base() + this.$api.saveDetails(), {
					userId: this.userId,
					userName: this.userName,
					fileName: this.printer.fileName || this.taskInfoArr[taskNum].fileName,
					filePages:
						this.dmDuplex === 1 ? pages : Math.ceil(pages / 2),
					printer: this.printer.name,
					taskId: taskId,
					deviceId: this.printer.deviceId,
					deviceKey: this.printer.deviceKey,
					devicePort: this.printer.port,
				})
				.then(() => {});
		},
		getTaskState(taskId, taskNum) {
			this.$axios
				.get(this.$api.url1() + this.$api.job(), {
					deviceId: this.printer.deviceId,
					deviceKey: this.printer.deviceKey,
					devicePort: this.printer.port,
					task_id: taskId,
				})
				.then((res) => {
					const data = res.data;
					const state = data.task_state;
					this.state = state;
					let params = {
						type: `info`,
						title: "提示",
						message: "",
						customClass: "zZindex",
					};
					const fileName = this.taskInfoArr[taskNum].fileName;
					if (state === "READY") {
						this.loadingText = "排队中，请稍等...";
					} else if (state === "PARSING") {
						if (this.taskInfoArr[taskNum].getTaskStateNum === 0 && this.isPreview === 0) {
							if ((this.isWatermark && !this.taskInfoArr[taskNum].havePreviewImg) || !this.isWatermark) {
								this.$Notif({
									type: `info`,
									title: "提示",
									message: `开始打印 ${fileName}`,
									customClass: "zZindex",
								});
							}
						}
						this.taskInfoArr[taskNum].getTaskStateNum += 1;
						this.loadingText = "解析文件中，请稍等...";
					} else if (state === "SENDING") {
						this.loadingText = "发送中，请稍等...";
					} else if (state === "SUCCESS") {
						clearInterval(this.timers[taskId]);
						delete this.timers[taskId];
						let _this = this;
						if (this.isPreview === 0) {
							if ((this.isWatermark && this.taskInfoArr[taskNum].havePreviewImg) || !this.isWatermark) {
								params.type = "success";
								params.message = `${fileName} 打印成功！`;
								this.$Notif(params);
								this.saveDetails(taskId, taskNum); // 把打印信息传给后台，一个任务保存一次
							}
						}
						if (data.task_result.code == 200) {
							const list = data.task_result.data.img_list || [];
							this.taskInfoArr[taskNum].pages = list.length;
							this.imgList = [];
							this.checkList = [];
							if (this.isWatermark) {
								if (!this.taskInfoArr[taskNum].havePreviewImg) {
									// 预览打印
									if (this.taskInfoArr[taskNum].alterIsPreview) {
										this.taskInfoArr[taskNum].havePreviewImg = true;
									}
									let fileArr = [];
									this.blobToImg(this.$refs.watermark.watermarkFile).then((res) => {
										//这里拿到水印的图片
										list.forEach((item, index) => {
											_this.imgWatermark(item, res) //合并水印和图片
												.then((res) => {
													_this.imgList[index] = res;
													fileArr[index] = res.blobObj;
													if (_this.isPreview === 1) {
														_this.checkList.push(index + 1);
													}
													if (fileArr.length === list.length && !fileArr.includes(undefined)) {
														if (_this.isPreview === 1) {
															_this.showPreview = true;
															_this.loading = false;
														} else {
															_this.beginPrinter(
																fileArr, taskNum
															);
														}
													}
												})
												.catch(function(err) {
													console.log(err);
												});
										});
									});
								}
							} else {
								if (this.isPreview === 0) {
									params.type = "success";
									params.message = `${fileName} 打印成功！`;
									this.$Notif(params);
								} else {
									list.forEach((item, index) => {
										this.imgList.push({
											url: item,
										});
										this.checkList.push(
											index + 1
										);
									});
									this.showPreview = true;
								}
							}
						} else {
							params.type = "error";
							params.message = data.task_result.msg;
							this.$Notif(params);
							this.loading = false;
							this.showBegin = false;
						}
					} else if (state === "FAILURE") {
						params.type = "error";
						params.message = `${fileName} 打印失败！`;
						clearInterval(this.timers[taskId]);
						delete this.timers[taskId];
						this.$Notif(params);
					} else if (state === "SET_REVOKE") {
						this.loadingText = `${fileName} 任务正在撤回`;
					} else if (state === "REVOKED") {
						params.type = "success";
						params.message = `${fileName} 任务撤回成功`;
						clearInterval(this.timers[taskId]);
						delete this.timers[taskId];
						this.showBegin = this.loadingDel = false;
						this.$Notif(params);
					}
				})
				.catch(() => {
					this.showBegin = this.loadingDel = false;
				});
		},
		cancel() {
			this.loadingText = "打印任务正在撤回";
			this.loadingDel = true;
			this.taskInfoArr.forEach(item => {
				this.$axios
					.del(this.$api.url1() + this.$api.job(), {
						deviceId: this.printer.deviceId,
						deviceKey: this.printer.deviceKey,
						devicePort: this.printer.port,
						task_id: item.taskId,
					})
					.finally(() => {
						this.getTaskState(item.taskId);
					});
			})
		},
		upLoad() {
		},
		handleChange(file, fileList) {
			this.fileList = fileList;
			if (file.size > 102400000) {
				this.$Notif({
					type: `error`,
					title: "提示",
					message: "文件大小不能超过100M！",
					customClass: "zZindex",
				});
				this.fileList.pop();
			}
		},
		handleRemove(file, fileList) {
			this.fileList = fileList;
		},
		handleExceed() {
			this.$Notif({
				type: `error`,
				title: "提示",
				message: "一次最多只能打印5个文件，如需替换请先删除",
				customClass: "zZindex",
			});
		},
		fileUpload(
			pageCount = 1,
			pageBroadCount = 1,
			pageCountFlag = 1,
			pageBroadCountFlag = 1,
			file = ""
		) {
			this.pageCountNow = pageCount;
			this.pageBroadCountNow = pageBroadCount;
			let formData = new FormData();
			formData.append("files", file);
			formData.append("remark", this.remark);
			formData.append("createName", this.userName);
			formData.append("updateUser", this.userId);
			formData.append("pageCount", pageCount);
			formData.append("pageBroadCount", pageBroadCount);
			formData.append("deviceId", this.printer.deviceId);
			formData.append("deviceKey", this.printer.deviceKey);
			formData.append("driverName", this.printer.driver_name);
			formData.append("port", this.printer.port);
			formData.append("pageCountFlag", pageCountFlag);
			formData.append("pageBroadCountFlag", pageBroadCountFlag);
			this.$axios
				.post(this.$axios.base() + this.$api.fileUpload(), formData)
				.then(() => {
					this.parent.getTable();
				});
		},
		getFilePages(file) {
			const params = {
				deviceId: this.printer.deviceId,
				deviceKey: this.printer.deviceKey,
				devicePort: this.printer.port,
				printerModel: this.printer.driver_name,
				jobFile: file,
				dmPaperSize: this.dmPaperSize || 9,
			};
			let pageCount = 1,
				pageBroadCount = 1,
				pageCountFlag = 0,
				pageBroadCountFlag = 0;
			Promise.all([
				new Promise((resolve, reject) => {
					let formData = new FormData();
					Object.keys(params).forEach((item) => {
						formData.append(item, params[item]);
					});
					formData.append("dmOrientation", 1);
					this.$axios
						.post(
							this.$api.url1() + this.$api.filePages(),
							formData
						)
						.then((res) => {
							pageCount = Number(res.data.pages);
							pageCountFlag = 1;
							resolve(pageCount);
						})
						.catch((err) => {
							console.log(JSON.parse(JSON.stringify(err)));
							reject("获取竖向页码失败");
						});
				}),
				new Promise((resolve, reject) => {
					let formData = new FormData();
					Object.keys(params).forEach((item) => {
						formData.append(item, params[item]);
					});
					formData.append("dmOrientation", 2);
					this.$axios
						.post(
							this.$api.url1() + this.$api.filePages(),
							formData
						)
						.then((res) => {
							pageBroadCount = Number(res.data.pages);
							pageBroadCountFlag = 1;
							resolve(pageBroadCount);
						})
						.catch((err) => {
							console.log(JSON.parse(JSON.stringify(err)));
							reject("获取横向页码失败");
						});
				}),
			])
				.then(() => {})
				.finally(() => {
					this.fileUpload(
						pageCount,
						pageBroadCount,
						pageCountFlag,
						pageBroadCountFlag,
						file
					); // 获取到打印页数传给后台
				});
		},
		checkPreview(checkArr) {
			this.isCheckList = true;
			this.checkList = checkArr;
		},
		closePre() {
			// 关闭预览，取消再去获取状态
			Object.keys(this.timers).forEach((item) => {
				clearInterval(this.timers[item]);
				delete this.timers[item];
			});
			this.showPreview = false;
		},
		blobToImg(blob) {
			return new Promise((resolve) => {
				let reader = new FileReader();
				reader.addEventListener("load", () => {
					let img = new Image();
					img.src = reader.result;
					img.addEventListener("load", () => resolve(img));
				});
				reader.readAsDataURL(blob);
			});
		},
		watermark(imgSrc, waterImg) {
			const _this = this;
			return new Promise((resolve) => {
				let img = new Image();
				img.crossOrigin = "anonymous";
				this.getDataUrlBySrc(imgSrc)
					.then((b64) => {
						img.src = b64;
						img.onload = function() {
							// window.URL.revokeObjectURL(img.src);
							let canvas = document.createElement("canvas");
							let width = img.width;
							let height = img.height;
							canvas.width = width;
							canvas.height = height;
							let ctx = canvas.getContext("2d");
							ctx.drawImage(img, 0, 0, width, height);
							const watermarkRef = _this.$refs.watermark;
							let numRow = parseInt(watermarkRef.markNumRow, 10),
								numCol = parseInt(watermarkRef.markNumCol, 10),
								top = 0,
								left = 0,
								watermarkH =
									(Number(watermarkRef.watermarkSize) / 100) *
									watermarkRef.watermarkH,
								watermarkW =
									(Number(watermarkRef.watermarkSize) / 100) *
									watermarkRef.watermarkW;
							let t = Math.floor(height / numRow),
								l = Math.floor(width / numCol);
							let markH = watermarkH * 1.92,
								markW = watermarkW * 1.92;
							for (let i = 1; i < numRow + 1; i++) {
								for (let j = 1; j < numCol + 1; j++) {
									left = l * j - l / 2;
									top = t * i - t / 2;
									ctx.save();
									ctx.globalAlpha = Number(
										watermarkRef.waterAlpha
									);
									ctx.translate(left, top);
									ctx.rotate(
										(Number(watermarkRef.waterRotate) *
											Math.PI) /
											180
									);
									ctx.drawImage(
										waterImg,
										-markW / 2,
										-markH / 2,
										markW,
										markH
									);
									ctx.restore();
								}
							}
							let dataURI = canvas.toDataURL(), // "image/png", 0.5
								arr = dataURI.split(","),
								bstr = window.atob(arr[1]),
								ab = new ArrayBuffer(bstr.length),
								u8arr = new Uint8Array(ab);
							for (let i = 0; i < bstr.length; i++) {
								u8arr[i] = bstr.charCodeAt(i);
							}
							let theBlob = new Blob([u8arr]);
							resolve(theBlob);
						};
					})
					.catch(function(err) {
						console.log(err);
					});
			});
		},
		async imgWatermark(imgSrc, waterImg) {
			let theBlob = await this.watermark(imgSrc, waterImg);
			let res = this.isIE
				? await this.imgToUrl(theBlob)
				: URL.createObjectURL(theBlob);
			// let res = await this.imgToUrl(theBlob);
			let result = {};
			if (this.isIE) {
				result = {
					blobObj: theBlob,
					url: res.url,
					id: res.id,
				};
			} else {
				result = {
					blobObj: theBlob,
					url: res,
				};
			}
			return result;
		},
		getDataUrlBySrc(src) {
			return new Promise((resolve) => {
				const transmitSrc =
					this.$axios.baseUrl().replace("8080", "8081") +
					src.replace("https://preview.wisiyilink.com", "");
				var xhr = new XMLHttpRequest();
				xhr.open("get", transmitSrc, true);
				xhr.responseType = "blob";
				xhr.onload = function() {
					if (this.status == 200) {
						var blob = this.response;
						var url = window.URL.createObjectURL(blob);
						resolve(url);
					}
				};
				xhr.send();
			});
		},
		imgToUrl(img) {
			return new Promise((resolve) => {
				let formData = new FormData();
				formData.append("files", img);
				this.$axios
					.post(
						this.$axios.base() + this.$api.saveTempImg(),
						formData
					)
					.then((res) => {
						resolve({
							url: this.$axios.baseUrl() + res.data.path,
							id: res.data.id,
						});
					})
					.catch(() => {
						resolve({ url: "", id: "" });
					});
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	justify-content: space-between;
}
.width50 {
	width: 49%;
}
.imgCheckGroup {
	display: flex;
	flex-wrap: wrap;
	.imgCheck {
		display: flex;
		align-items: center;
		height: auto;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		padding: 10px;
		margin: 0 10px 10px 0;
		/deep/ {
			.el-checkbox__label {
				display: none;
			}
		}
		.img {
			width: 100px;
		}
	}
}

.state-box {
	text-align: center;
	.name {
		font-weight: bold;
	}
	.text {
		font-size: 16px;
		margin-bottom: 50px;
		line-height: normal;
	}
}
/deep/ {
	.el-upload,
	.el-upload-dragger {
		width: 100%;
		max-width: 360px;
		min-width: 102px;
	}
	.el-upload--picture-card {
		width: 100px;
		height: 100px;
		line-height: 100px;
	}
	.el-upload-list--picture-card .el-upload-list__item {
		width: 100px;
		height: 100px;
		.avatar {
			max-width: 100%;
		}
	}
}
</style>
