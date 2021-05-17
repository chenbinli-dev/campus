<template>
  <div id="verify">
    <nav-bar title="学生认证">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
      <template #right>
        <span style="font-size: 5vw">帮助</span>
      </template>
    </nav-bar>
    <div v-if="showToVerify || verifying" class="show_verifying_image">
      <img src="~assets/img/student_verify_no_info.svg" />
    </div>
    <div v-else class="show_verifying_image">
      <img src="~assets/img/student_verify_pass.svg" />
    </div>

    <div id="verifyList" class="verifyList">
      <cell v-if="showToVerify" title="去认证" is-link to="/user/Verify/submitInfo" class="cell" />
      <cell v-else-if="verifying" title="认证中" is-link class="cell" />
      <cell v-else-if="verify_pass" title="已认证" is-link class="cell" />
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Cell } from 'vant'
import userRequest from 'network/http'

export default {
  name: 'Verify',
  inject: ['reload'],
  data() {
    return {
      isLoading: false,
      description: '',
      showToVerify: true,
      verifying: false,
      verify_pass: false
    }
  },
  components: {
    NavBar,
    Cell,
    Icon
  },
  methods: {
    onRefresh() {
      this.isLoading = false
    },
    getUserRight() {
      userRequest
        .get('/user/getVerifyStatusByUid', {
          params: {
            uid: localStorage.getItem('ID')
          }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.audit_status === 0) {
            this.description = '等待审核中'
            this.showToVerify = false
            this.verifying = true
            this.verify_pass = false
          } else if (res.data.audit_status === 1) {
            this.description = '审核通过'
            this.showToVerify = false
            this.verifying = false
            this.verify_pass = true
          } else if (res.data.audit_status === 2) {
            this.showToVerify = true
            this.description = '审核未通过'
          } else if (!res.data.audit_status) {
            this.description = '还未提交学生信息'
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUserRight()
  }
}
</script>

<style scoped>
.show_verifying_image {
  margin-top: 5vw;
  width: 100%;
  display: flex;
  justify-content: center;
}
.show_verifying_image img {
  width: 20vw;
  height: 20vw;
}
.verifyList {
  margin-top: 10vw;
  padding: 0 2vw;
}
.cell {
  border-radius: 3vw;
  font-size: 4vw;
  margin-bottom: 2vw;
}
</style>