<template>
	<div class="user">
		
		<div class="user-name" @mouseenter="enter()" @mouseleave="leave()" @click="clickUser"><img :src="yonghu"/>{{userName}}
		<div class="user-line"></div>
		</div>
		<!-- <el-avatar :size="50" :src="userImgUrl"></el-avatar> -->
		
		<div class="logout" @click="logout">退出登录</div>
	</div>
</template>

<script>
	import './user.less'
	import { mapActions } from 'vuex'
	import yonghu from '@/assets/img1/yonghu.png'
	import yonghu1 from '@/assets/img1/yonghu1.png'
	export default {
		name: 'user',
		props: {
			userName: {
				type: String,
				default: ''
			},
			userImgUrl: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				yonghu:yonghu1,
			}
		},
		methods: {
			 ...mapActions([
			  'handleLogOut'
			]),
			logout () {
			//   this.handleLogOut().then(() => {
			//     this.$router.push({
			//       path: '/login'
			//     })
			//   })
			 this.$router.push({
			      path: '/login'
			    })
			},
			clickUser(){
				this.yonghu = yonghu1

			},
			enter(){
				this.yonghu = yonghu
				// console.log(1)
			},
			leave(){
				this.yonghu = yonghu1
				console.log(2)
			}
		}
	}
</script>
