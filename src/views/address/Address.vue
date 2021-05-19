<template>
  <div id="address" class="address">
    <nav-bar title="地址列表" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <div class="addressList">
      <div class="address_empty" v-if="user_address_list.length === 0">
        <span>您还没有添加收件地址</span>
      </div>
      <ul class="address_not_empty" v-else>
        <li v-for="(item,index) in user_address_list" :key="item.id">
          <van-row>
            <van-col span="20">
              <div class="user_info">
                <span>{{item.realname}}</span>
                <span>{{item.telephone}}</span>
              </div>
              <van-row type="flex" align="center" class="address_info">
                <tag plain type="danger" size="5vw" v-if="item.isDefault === 1">默认</tag>
                <span>{{item.university_name + item.address_details}}</span>
              </van-row>
            </van-col>
            <van-col span="4">
              <van-row class="item_right" @click="update(index)">
                <icon name="edit" size="5vw" />
              </van-row>
            </van-col>
          </van-row>
        </li>
      </ul>
    </div>
    <!--新建弹出-->
    <popup
      v-model="address_info_add"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-form @submit="addAddress" class="addressForm">
        <field
          v-model="realname"
          label="姓名"
          placeholder="收件人姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
          required
          clearable
          style="font-size: 4vw"
        />
        <field
          v-model="telephone"
          label="联系电话"
          placeholder="收件人电话"
          :rules="[{ required: true, message: '请填写联系电话' }]"
          required
          clearable
          style="font-size: 4vw"
        />
        <field
          v-model="university_name"
          label="学校名称"
          placeholder="请输入学校名称，如：某某大学"
          :rules="[{ required: true, message: '请填写学校名称' }]"
          required
          clearable
          style="font-size: 4vw"
        />
        <field
          v-model="address_details"
          label="详细地址"
          placeholder="请输入具体的校区，楼号，寝室号"
          :rules="[{ required: true, message: '请填写详细地址' }]"
          required
          clearable
          style="font-size: 4vw"
        />

        <!--是否设为默认地址-->
        <cell title="是否设为默认地址" icon="star-o">
          <template #right-icon>
            <van-switch v-model="isDefault" active-color="#ffd300" size="5vw" />
          </template>
        </cell>
        <van-button
          round
          size="large"
          native-type="submit"
          color="#ffd300"
          text="保存"
          style="font-size: 4vw; margin-top: 2vw"
        />
      </van-form>
    </popup>
    <!--修改弹出-->
    <popup
      v-model="address_info_update"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-form @submit="updateAddress" class="addressForm">
        <field
          v-model="update_address.realname"
          label="姓名"
          placeholder="收件人姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
          required
          clearable
          style="font-size: 4vw"
        />
        <field
          v-model="update_address.telephone"
          label="联系电话"
          placeholder="收件人电话"
          :rules="[{ required: true, message: '请填写联系电话' }]"
          required
          clearable
          style="font-size: 4vw"
        />
        <field
          v-model="update_address.university_name"
          label="学校名称"
          placeholder="请输入学校名称，如：某某大学"
          :rules="[{ required: true, message: '请填写学校名称' }]"
          required
          clearable
          style="font-size: 4vw"
        />
        <field
          v-model="update_address.address_details"
          label="详细地址"
          placeholder="请输入具体的校区，楼号，寝室号"
          :rules="[{ required: true, message: '请填写详细地址' }]"
          required
          clearable
          style="font-size: 4vw"
        />

        <!--是否设为默认地址-->
        <cell title="是否设为默认地址" icon="star-o">
          <template #right-icon>
            <van-switch v-model="update_address.isDefault" active-color="#ffd300" size="5vw" />
          </template>
        </cell>
        <van-button
          round
          size="large"
          native-type="submit"
          color="#ffd300"
          text="确认修改"
          style="font-size: 4vw; margin-top: 2vw"
        />
      </van-form>
    </popup>
    <van-button
      round
      size="large"
      color="#ffd300"
      text="新增地址"
      class="addButton"
      @click="address_info_add = true"
      style="font-size: 4vw; margin-top: 2vw;"
    />
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Row as VanRow,
  Col as VanCol,
  Button as VanButton,
  Form as VanForm,
  Popup,
  Field,
  Cell,
  Switch as VanSwitch,
  Tag,
  Toast
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Address',
  inject: ['reload'],
  data() {
    return {
      user_address_list: [],
      address_info_add: false,
      address_info_update: false,
      update_address: {
        realname: '',
        telephone: '',
        university_name: '',
        address_details: '',
        isDefault: false
      },
      realname: '',
      telephone: '',
      university_name: '',
      address_details: '',
      isDefault: false
    }
  },
  components: {
    NavBar,
    Icon,
    VanRow,
    VanCol,
    VanButton,
    Popup,
    Field,
    VanForm,
    Cell,
    VanSwitch,
    Tag
  },
  methods: {
    //获取用户地址列表
    getUserAddress() {
      userRequest
        .get('/user/getUserAddress', {
          params: { uid: localStorage.getItem('ID') },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data) {
            this.user_address_list = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //改变默认地址
    onChangeDefault(id) {
      const params = {
        default_address_id: id,
        user_id: localStorage.getItem('ID')
      }
      userRequest
        .post('/user/changeDefaultAddress', params)
        .then(res => {
          if (res.data.successMessage === 'UPDATE_SUCCESS' && res.data.statusCode === 200) {
            this.reload()
            Toast({
              type: 'success',
              message: '设置默认地址成功'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //新增收件地址
    addAddress() {
      const teltphoneRule = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      //校验输入的信息
      if (!this.realname || !this.telephone || !this.university_name || !this.address_details) {
        Toast({
          type: 'fail',
          message: '信息不完整'
        })
        return
      } else if (!teltphoneRule.test(this.telephone)) {
        Toast({
          type: 'fail',
          message: '联系电话不符合'
        })
        return
      }
      const add_address = {
        realname: this.realname,
        telephone: this.telephone,
        university_name: this.university_name,
        address_details: this.address_details,
        isDefault: this.isDefault,
        uid: localStorage.getItem('ID')
      }
      userRequest
        .post('/user/addAddress', add_address, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data.successMessage === 'ADD_SUCCESS' && res.data.statusCode === 200) {
            Toast({
              type: 'success',
              message: '添加成功',
              onClose: () => {
                this.address_info_edit = false
                this.reload()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //编辑地址
    update(index) {
      this.address_info_update = true
      console.log(this.user_address_list[index])
      this.update_address.id = this.user_address_list[index].id
      this.update_address.realname = this.user_address_list[index].realname
      this.update_address.telephone = this.user_address_list[index].telephone
      this.update_address.university_name = this.user_address_list[index].university_name
      this.update_address.address_details = this.user_address_list[index].address_details

      if (this.user_address_list[index].isDefault === 1) {
        this.update_address.isDefault = true
      } else {
        this.update_address.isDefault = false
      }
    },
    //提交修改
    updateAddress() {
      const teltphoneRule = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      //校验输入的信息
      if (
        !this.update_address.realname ||
        !this.update_address.telephone ||
        !this.update_address.university_name ||
        !this.update_address.address_details
      ) {
        Toast({
          type: 'fail',
          message: '信息不完整'
        })
        return
      } else if (!teltphoneRule.test(this.update_address.telephone)) {
        Toast({
          type: 'fail',
          message: '联系电话不符合'
        })
        return
      }
      this.update_address.user_id = localStorage.getItem('ID')
      userRequest
        .post('/user/updateAddress', this.update_address, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data.successMessage === 'UPDATE_SUCCESS') {
            Toast({
              type: 'success',
              message: '更新成功',
              onClose: () => {
                this.address_info_update = false
                this.reload()
              }
            })
          } else {
            Toast({
              type: 'fail',
              message: '更新失败',
              onClose: () => {
                this.address_info_update = false
                this.reload()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUserAddress()
  }
}
</script>

<style>
.address {
  height: 100%;
  padding-top: 12vw;
}
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
.addresList {
  height: 100%;
  overflow-y: scroll;
}
.address_empty {
  margin: 2vw 0;
  text-align: center;
  font-size: 4vw;
}
.address_not_empty {
  margin: 2vw 0;
  padding: 0 2vw;
}
.address_not_empty li {
  padding: 3vw;
  margin-bottom: 2vw;
  background-color: #fff;
  border-radius: 3vw;
}
.default_icon {
  float: right;
}
.user_info {
  font-size: 5vw;
  margin-bottom: 2vw;
}
.user_info :nth-child(1) {
  margin-right: 2vw;
  text-overflow: ellipsis;
  overflow: hidden;
}
.address_info {
  font-size: 4vw;
  text-overflow: ellipsis;
}
.item_right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.addressForm {
  margin-top: 10vw;
  padding: 0 2vw;
  border-radius: 3vw;
}
.addButton {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>