<template>
  <div id="record" class="record">
    <nav-bar title="余额账单" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      offset="300"
      @load="getUserRecord"
      class="record_list"
    >
      <cell v-for="item in record" :key="item.id">
        <van-row type="flex" justify="space-between" align="center">
          <van-col span="12">
            <tag v-if="item.type === '充值'" type="success" size="medium">{{item.type}}</tag>
            <tag v-else-if="item.type === '提现'" type="primary" size="medium">{{item.type}}</tag>
            <tag v-else-if="item.type === '任务支出'" color="#ffd300" plain size="medium">{{item.type}}</tag>
            <tag v-else-if="item.type === '代跑收入'" color="#ffd300" plain size="medium">{{item.type}}</tag>
            <tag v-else-if="item.type === '预付金返还'" color="#ffd300" plain size="medium">{{item.type}}</tag>
            <div>{{item.createAt}}</div>
          </van-col>
          <van-col span="4">
            <p class="money">{{item.money}}</p>
          </van-col>
        </van-row>
      </cell>
    </list>
  </div>
</template>

<script>
import { NavBar, Icon, List, Cell, Tag, Col as VanCol, Row as VanRow } from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Record',
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      record: [],
      total: null,
      pageNo: 1
    }
  },
  components: {
    NavBar,
    Icon,
    List,
    Cell,
    Tag,
    VanCol,
    VanRow
  },
  methods: {
    getUserRecord() {
      userRequest
        .get('/balance/getUserRecord/' + localStorage.getItem('ID'), {
          params: { pageNo: this.pageNo, pageSize: 9 },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          res.data.forEach(item => {
            switch (item.type) {
              case 1:
                item.type = '充值'
                break
              case 2:
                item.type = '提现'
                break
              case 3:
                item.type = '任务支出'
                break
              case 4:
                item.type = '代跑收入'
                break
              case 5:
                item.type = '预付金返还'
                break
              default:
                break
            }
            item.createAt = this.$moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
            this.record.push(item)
          })
          this.loading = false
          if (this.record.length === this.total) {
            this.finished = true
          }
        })
        .catch(err => {
          console.log(err)
          this.error = true
        })

      this.pageNo++
    },
    getUserRecordTotal() {
      userRequest
        .get('/balance/getUserRecordTotal/' + localStorage.getItem('ID'), {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data.num)
          this.total = res.data.num
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUserRecord()
    this.getUserRecordTotal()
  }
}
</script>

<style scoped>
.navbar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.record {
  height: 100%;
  padding-top: 12vw;
}
.record_list {
  height: 100%;
  overflow: scroll;
}
.money {
  font-size: 4vw;
}
</style>