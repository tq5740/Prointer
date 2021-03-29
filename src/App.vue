<template>
	<div id="app">
		<Header :userName="userName" :isAdmin="isAdminFn()" />
		<router-view ref="child"></router-view>
		<el-dialog
			v-if="showHide"
			:visible.sync="showHide"
			fullscreen
			:close-on-press-escape="false"
			:show-close="false"
			class="hide-box"
		>
			<img
				src="@img/sorry.png"
				style="width:400px;margin-top: 5%"
				alt=""
			/>
			<p style="font-size: 30px">授权过期，请从OA重新登录</p>
		</el-dialog>
	</div>
</template>

<script>
import Header from "@views/header";
export default {
	name: "App",
	components: {
		Header,
	},
	data() {
		return {
			userName: "",
			userId: "",
			token: "",
			isInit: false,
			showHide: false,
			userArr: [],
			isAdmin: false,
		};
	},
	mounted() {
		if (this.$route.path === "/index") {
			// this.init();
			this.test();
		}
	},
	methods: {
		test() {
			const ticket = this.$route.query.ticket || "";
			// if (ticket) {
				this.$SetStorage("ticket", ticket);
				setTimeout(() => {
					this.token = "5963acc097314a3d8b130032f737fddc";
					this.userId = "dyj";
					this.userName = "积微";
					this.$SetStorage("token", this.token);
					this.$SetStorage("userId", this.userId);
					this.$SetStorage("userName", this.userName);
					this.selectAll();
					if (!this.isInit) {
						this.$refs.child.init();
					}
				}, 0)
			// }
		},
		init() {
			const ticket = this.$route.query.ticket || "";
			if (ticket) {
				this.$SetStorage("ticket", ticket);
				this.$axios
					.post(
						this.$axios.base() + this.$api.getUserInfoByTicket(),
						{
							ticket: ticket,
						}
					)
					.then((res) => {
						if (res.data) {
							this.userName = res.data.userName;
							this.userId = res.data.userId;
							this.token = res.data.token;
							this.$SetStorage("token", this.token);
							this.$SetStorage("userId", this.userId);
							this.$SetStorage("userName", this.userName);
							this.selectAll();
							if (!this.isInit) {
								this.$refs.child.init();
							}
						} else {
							this.showHide = true;
						}
					});
			} else {
				this.showHide = true;
			}
		},
		selectAll() {
			this.$axios
				.post(this.$axios.base() + this.$api.selectAll(), {})
				.then((res) => {
					this.userArr = res.data;
					this.$SetStorage("userArr", this.userArr);
					let arr = [];
					this.userArr.forEach((item) => {
						arr.push(item.userId);
					});
					if (arr.includes(this.$GetStorage('userId'))) {
						this.$SetStorage("isAdmin", true);
						this.isAdmin = true;
					} else {
						this.$SetStorage("isAdmin", false);
						this.isAdmin = false;
					}
				});
		},
		isAdminFn() {
			return this.isAdmin
		}
	},
};
</script>

<style lang="scss" scoped>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.hide-box {
	text-align: center;
}
</style>
<style>
body .el-table th.gutter {
	display: table-cell !important;
}
</style>
