<template>
	<div>
		<div class="btn">
			<div>
				<el-button
					@click="chioce(0)"
					:type="isType === 0 ? 'primary' : ''"
					plain
					>全选</el-button
				>
				<el-button
					@click="chioce(1)"
					:type="isType === 1 ? 'primary' : ''"
					plain
					>选择单页</el-button
				>
				<el-button
					@click="chioce(2)"
					:type="isType === 2 ? 'primary' : ''"
					plain
					>选择双页</el-button
				>
				<el-button
					@click="chioce(3)"
					:type="isType === 3 ? 'primary' : ''"
					plain
					>全不选</el-button
				>
			</div>
			<div>
				<el-button type="primary" @click="printerBtn"
					>开始打印</el-button
				>
				<el-button @click="parent.showPreview = false">关闭</el-button>
			</div>
		</div>
		<el-checkbox-group v-model="checkList" class="imgCheckGroup">
			<div
				v-for="(item, index) in imgList"
				:key="item"
				class="imgCheck"
				:class="imgSrc === item.url ? 'borderColor' : ''"
			>
				<el-checkbox :label="index + 1"></el-checkbox>
				<img
					:src="item.url"
					:id="'img' + index"
					class="img"
					@click="showMax(item.url)"
				/>
			</div>
		</el-checkbox-group>
		<div class="imgBox">
			<el-image
				:src="imgSrc"
				class="img"
				:preview-src-list="imgArr"
			></el-image>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		imgList: Array,
		checkList: Array,
	},
	watch: {
		imgList: {
			handler(val) {
				this.imgSrc = this.imgList.length && this.imgList[0].url;
				this.imgList = val;
				this.imgArr = [];
				this.imgList.forEach((item) => {
					this.imgArr.push(item && item.url);
				});
			},
			immediate: true,
			deep: true,
		},
		checkList: {
			handler(val) {
				this.checkList = val;
			},
			immediate: true,
		},
	},
	data() {
		return {
			isType: 0,
			imgSrc: "",
			imgArr: [],
			parent: this.$parent.$parent,
		};
	},
	beforeDestroy() {
		this.revokeURL();
	},
	created() {
		window.addEventListener("beforeunload", this.revokeURL);
	},
	methods: {
		revokeURL() {
			if (this.parent.isWatermark) {
				const isIE = this.$GetStorage("isIE");
				this.imgList.forEach((item) => {
					isIE
						? this.deleteImgUrl(item.id)
						: window.URL.revokeObjectURL(item.url);
				});
			}
		},
		chioce(type) {
			this.isType = type;
			if (type === 3) {
				this.checkList = [];
				return;
			}
			let arr = [];
			this.imgList.forEach((item, index) => {
				let num = index + 1;
				if (type === 1 && num % 2 !== 0) {
					arr.push(num);
				} else if (type === 2 && num % 2 === 0) {
					arr.push(num);
				} else if (type === 0) {
					arr.push(num);
				}
			});
			this.checkList = arr;
		},
		printerBtn() {
			const parent = this.$parent.$parent;
			this.$emit("checkPreview", this.checkList);
			if (parent.isWatermark) {
				let fileArr = [];
				this.checkList.forEach((item) => {
					fileArr.push(this.imgList[item - 1].blobObj);
				});
				parent.isPreview = 0;
				parent.beginPrinter(fileArr, 0, 3); // 3代表预览页的打印
			} else {
				parent.printerBtn(3);  // 3代表预览页的打印
			}
		},
		showMax(item) {
			this.imgSrc = item;
		},
		deleteImgUrl(id) {
			this.$axios
				.post(this.$axios.base() + this.$api.delTempImg(), { id: id })
				.then(() => {
				})
				.catch(() => {});
		},
	},
};
</script>
<style lang="scss" scoped>
.imgCheckGroup {
	position: absolute;
	top: 140px;
	bottom: 30px;
	overflow: auto;
	.imgCheck {
		display: flex;
		align-items: center;
		height: auto;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		padding: 10px;
		margin: 0 10px 10px 0;
		width: 120px;
		/deep/ {
			.el-checkbox__label {
				display: none;
			}
		}
		.img {
			width: 100px;
			cursor: pointer;
		}
	}
	.borderColor {
		border-color: $color1;
	}
}
.imgBox {
	position: absolute;
	right: 20px;
	left: 220px;
	top: 140px;
	bottom: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgb(233, 233, 235);
	border: 1px solid #e4e7ed;
	.img {
		height: 100%;
		/deep/.el-image__inner {
			width: auto;
			max-height: 100%;
			max-width: 100%;
		}
	}
}
.btn {
	display: flex;
	justify-content: space-between;
}
</style>
