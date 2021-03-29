<template>
	<header v-if="$route.fullPath !== '/login'">
		<div class="logo">
			<img src="@img/logo.png" class="img" />
			<p class="logotext">能投物流</p>
			<p class="text">
				<span class="zh">文件云打印系统</span><br /><span class="en"
					>File remote printing system</span
				>
			</p>
		</div>
		<div class="menu">
			<el-menu
				:default-active="$route.fullPath"
				class="el-menu-demo"
				mode="horizontal"
				background-color="#284376"
				text-color="#fff"
				active-text-color="#fff"
				router
			>
				<el-menu-item :index="indexUrl">首页</el-menu-item>
				<el-menu-item index="/user">个人打印记录</el-menu-item>
				<el-menu-item
					index="/company"
					v-if="isAdmin || $GetStorage('isAdmin')"
					>公司打印明细</el-menu-item
				>
			</el-menu>
		</div>
		<div class="user">
			<img src="@img/user.svg" alt="" class="img" />
			<span>{{ userName || $GetStorage("userName") }}</span>
		</div>
	</header>
</template>

<script>
export default {
	props: {
		userName: String,
		isAdmin: Function,
	},
	data() {
		return {
			indexUrl: "",
		};
	},
	created() {
		if (this.$route.path === "/index") {
			this.indexUrl = this.$route.fullPath;
		}
	},
};
</script>

<style lang="scss" scoped>
header {
	padding: 0 3%;
	background: #284376; //rgb(52, 72, 181);
	display: flex;
	color: $fff;
	.logo {
		padding: 10px 0;
		display: flex;
		align-items: center;
		letter-spacing: 1px;
		.img {
			margin-right: 10px;
		}
		.logotext {
			font-weight: bold;
			letter-spacing: 3px;
			margin-right: 16px;
			margin-left: -10px;
			font-size: 22px;
		}
		.text {
			margin-top: 3px;
		}
		.zh {
			letter-spacing: 2px;
			font-weight: bold;
		}
		.en {
			font-weight: normal;
			font-size: 12px;
		}
	}
	.user {
		display: flex;
		align-items: center;
		margin-left: auto;
		font-size: 14px;
		.img {
			margin-right: 10px;
		}
	}
}
.menu {
	margin-left: 20px;
	.el-menu-demo {
		border: none;
	}
	/deep/ {
		.el-menu--horizontal > .el-menu-item.is-active {
			background-color:#4363a0 !important;
		}
		.el-submenu__title:hover {
			background-color:#4363a0 !important;
		}
		.el-menu-item:hover {
			background-color:#4363a0 !important;
		}
	}
}
</style>
