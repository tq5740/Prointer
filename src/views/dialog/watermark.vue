<template>
	<div class="watermark">
		<div class="leftBox">
			<el-form label-width="110px">
				<h5 class="title">水印参数</h5>
				<el-form-item label="选择水印图片：">
					<el-upload
						action=""
						:class="{ hideUpload: watermarkFile != '' }"
						list-type="picture-card"
						:http-request="upLoadMark"
						:file-list="markList"
						:limit="1"
						:on-exceed="handleExceed"
						accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG"
					>
						<i slot="default" class="el-icon-plus"></i>
						<div slot="file" slot-scope="{ file }">
							<img class="avatar" :src="file.url" alt="" />
							<span class="el-upload-list__item-actions">
								<span
									v-if="!disabled"
									class="el-upload-list__item-delete"
									@click="handleRemove(file)"
								>
									<i class="el-icon-delete"></i>
								</span>
							</span>
						</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="水印行数：">
					<el-input
						v-model="markNumRow"
						placeholder="请输入水印行数"
						style="width: 100px"
					></el-input>
				</el-form-item>
				<el-form-item label="水印列数：">
					<el-input
						v-model="markNumCol"
						placeholder="请输入水印列数"
						style="width: 100px"
					></el-input>
				</el-form-item>
				<el-form-item label="水印大小：">
					<el-input
						v-model="watermarkSize"
						style="width: 100px"
					></el-input>
					%
				</el-form-item>
				<el-form-item label="水印透明度：">
					<el-input
						v-model="waterAlpha"
						style="width: 100px"
					></el-input>
					（0-1，例：0.5）
				</el-form-item>
				<el-form-item label="水印旋转角度：">
					<el-input
						v-model="waterRotate"
						style="width: 100px"
					></el-input>
					度
				</el-form-item>
			</el-form>
			<h5 class="title">预览设置</h5>
			<el-form label-width="110px">
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
					<p v-if="dmPaperSize === '0'" style="margin-top: 10px;">
						<span
							>高：<el-input
								v-model="paperLength"
								style="width: 60px;"
							></el-input
							>mm</span
						>
						<span style="margin-left: 15px"
							>宽：<el-input
								v-model="paperWidth"
								style="width: 60px;"
							></el-input
							>mm</span
						>
					</p>
				</el-form-item>
				<el-form-item label="方向：">
					<el-radio-group v-model="orientation">
						<el-radio :label="1">竖向</el-radio>
						<el-radio :label="2">横向</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</div>
		<div class="rightBox">
			<img :src="imgSrc" alt="" @load="load()" />
		</div>
		<div class="btn">
			<el-button type="primary" plain @click="look()"
				>预览水印效果</el-button
			>
			<el-button type="primary" @click="save">保存水印设置</el-button>
			<el-button
				@click="
					parent.showWatermark = false;
					init();
				"
				>关闭</el-button
			>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			parent: this.$parent.$parent,

			markList: [],
			watermarkFile: "",
			markNumRow: 1,
			markNumCol: 1,
			watermarkW: "",
			watermarkH: "",
			watermarkSize: "100",
			waterAlpha: 1,
			waterRotate: 0,
			imgSrc: "",

			orientation: 1,
			dmPaperSize: "2480,3508",
			paperLength: "",
			paperWidth: "",
			papersOptions: [
				{
					label: "自定义",
					value: "0",
				},
				{
					label: "A4",
					value: "2480,3508",
				},
				{
					label: "A5",
					value: "1748,2480",
				},
				{
					label: "A6",
					value: "1240,1748",
				},
			],
		};
	},
	methods: {
		upLoadMark(e) {
			if (!e.file.type.includes("image/")) {
				this.$Notif({
					type: `error`,
					title: "提示",
					message: "文件必须为图片格式！",
					customClass: "zZindex",
				});
				return;
			}
			if (e.file.size > 1048576) {
				this.$Notif({
					type: `error`,
					title: "提示",
					message: "文件大小不能超过1M！",
					customClass: "zZindex",
				});
				return;
			}
			this.watermarkFile = e.file;
			let _this = this;
			let img = new Image();
			img.src = window.URL.createObjectURL(this.watermarkFile);
			img.onload = function() {
				_this.watermarkW = img.width;
				_this.watermarkH = img.height;
				window.URL.revokeObjectURL(img.src);
			};
		},
		handleRemove() {
			this.markList = [];
			this.watermarkFile = "";
			this.watermarkW = "";
			this.watermarkH = "";
		},
		init() {
			this.handleRemove();
			this.markNumRow = 1;
			this.markNumCol = 1;
			this.waterAlpha = 1;
			this.waterRotate = 0;
			this.imgSrc = "";
		},
		formatData() {
			let notif = {
				type: `error`,
				title: "提示",
				message: "请选择任务文件",
				customClass: "zZindex",
			};
			if (!this.watermarkFile) {
				notif.message = "请选择水印图片";
				this.$Notif(notif);
				return false;
			}
			if (
				this.watermarkW === "" ||
				this.watermarkH === "" ||
				this.waterAlpha === "" ||
				this.markNumRow === "" ||
				this.markNumCol === "" ||
				this.waterRotate === ""
			) {
				notif.message = "水印参数不能为空，请完整填写";
				this.$Notif(notif);
				return false;
			}
			return true;
		},
		look() {
			if (!this.formatData()) return;
			let width, height, bgSizeArr, markH, markW;
			if (this.dmPaperSize === "0") {
				bgSizeArr = [
					Number(this.paperWidth) * 11.8,
					Number(this.paperLength) * 11.8,
				];
			} else {
				bgSizeArr = this.dmPaperSize.split(",");
			}
			if (this.orientation === 1) {
				width = bgSizeArr[0];
				height = bgSizeArr[1];
			} else {
				width = bgSizeArr[1];
				height = bgSizeArr[0];
			}
			markH = Number(this.watermarkSize) / 100 * this.watermarkH;
			markW = Number(this.watermarkSize) / 100 * this.watermarkW;
			const _this = this;
			this.parent.blobToImg(this.watermarkFile).then((waterImg) => {
				let canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				let ctx = canvas.getContext("2d");
				let numRow = parseInt(_this.markNumRow, 10),
					numCol = parseInt(_this.markNumCol, 10),
					top = 0,
					left = 0;
				let t = Math.floor(height / numRow),
					l = Math.floor(width / numCol);
				for (let i = 1; i < numRow + 1; i++) {
					for (let j = 1; j < numCol + 1; j++) {
						left = l * j - l / 2;
						top = t * i - t / 2;
						ctx.save();
						ctx.globalAlpha = Number(_this.waterAlpha);
						ctx.translate(left, top);
						ctx.rotate(Number(_this.waterRotate) * Math.PI / 180);
						ctx.drawImage(waterImg, - markW / 2, - markH / 2, markW, markH);
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
				_this.imgSrc = URL.createObjectURL(theBlob);
			});
		},
		save() {
			if (!this.formatData()) return;
			this.parent.showWatermark = false;
		},
		load() {
			URL.revokeObjectURL(this.imgSrc);
		},
	},
};
</script>
<style lang="scss" scoped>
.watermark {
	font-family: "Microsoft YaHei";
}
.btn {
	position: absolute;
	right: 20px;
	bottom: 20px;
}
.leftBox {
	width: 370px;
	.hideUpload /deep/ .el-upload {
		display: none; /* 上传按钮隐藏 */
	}
}
.title {
	font-weight: bold;
	margin-bottom: 20px;
}
.rightBox {
	position: absolute;
	right: 20px;
	left: 400px;
	top: 85px;
	bottom: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgb(233, 233, 235);
	border: 1px solid #e4e7ed;
	img {
		background: #fff;
		max-width: 100%;
		max-height: 100%;
	}
}
</style>
