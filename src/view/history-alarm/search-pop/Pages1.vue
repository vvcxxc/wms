<!--
 * @Description: 分页组件
 * @Date: 2019-11-24 14:57:49
 * @Author: 随风
 * @LastEditors: 随风
 * @LastEditTime: 2019-11-27 15:55:08
 -->
<template>
	<section class="page-container">
		<div class="left">
			共{{ pageData.TotalCount
			}}条，当前第{{ pageData.PageIndex }}页
			总共{{ pageData.TotalPage }}条，每页{{
					pageData.PageSize
			}}条
		</div>
		<div class="right">
			<div class="btn" @click="jump('first')">
				首页
			</div>
			<div class="btn" @click="jump('prev')">
				上一页
			</div>
			<div class="btn" @click="jump('next')">
				下一页
			</div>
			<div class="btn" @click="jump('last')">
				末页
			</div>
			<div class="input">
				第
				<el-input class="pages" v-model="targetPage"></el-input>
				页
			</div>
			<div class="btn" @click="jump('jump')">
				跳转
			</div>
		</div>
	</section>
</template>

<script>
export default {
	props: ['pageData'],
	data() {
		return {
			targetPage: 1,
 		};
	},
	created() {
		this.targetPage = this.pageData.PageIndex;
	},
	methods: {
		jump(flag) {
			if (flag === 'first') {
				if (this.targetPage == 1) {
					return;
				}
				this.targetPage = 1;
				this.$emit('req', this.targetPage, flag);
				return;
			}
			if (flag === 'last') {
				console.log(this.targetPage)
				if (this.targetPage == this.pageData.TotalPage) {
					return;
				}
				this.targetPage = this.pageData.TotalPage;
				this.$emit('req', this.targetPage, flag);
				return;
			}
			if (flag === 'prev') {
				console.log(this.targetPage)
				if (this.targetPage == 1) {
					return;
				}
				this.targetPage = --this.pageData.PageIndex;
				this.$emit('req', this.targetPage, flag);
				return;
			}
			if (flag === 'next') {
				if (
					this.targetPage == this.pageData.TotalPage ||
					this.pageData.TotalPage == 0
				) {
					return;
				}
				this.targetPage = ++this.pageData.PageIndex;

				this.$emit('req', this.targetPage, flag);
				return;
			}
			// this.handlePage();
			// if (this.targetPage == this.pageData.PageIndex) {
			// 	return;
			// }
			this.$emit('req', this.targetPage, flag);
		},
		handlePage() {
			if (
				this.targetPage === '' ||
				!/^\d+$/.test(this.targetPage) ||
				this.targetPage == 0
			) {
				this.targetPage = this.pageData.PageIndex;
				return;
			}
			if (this.targetPage > this.pageData.TotalPage) {
				if (this.pageData.TotalPage == 0) {
					this.targetPage = 1;
					return;
				}
				this.targetPage = this.pageData.TotalPage;
			}
		}
	}
};
</script>

<style lang='less' scoped>
.page-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #888;
	box-sizing: border-box;
}

.left {
	margin-left: 10px;
}

.right {
	display: flex;
	align-items: center;

	.input {
		display: flex;
		align-items: center;
		margin: 0 10px;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 28px;
		background-color: #fff;
		border-radius: 4px;
		border: solid 1px #fda100;
		color: #fda100;
		margin-right: 10px;
		cursor: pointer;
	}
}
</style>
