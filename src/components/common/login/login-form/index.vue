<template>
  <section>
    <div class="login-title">
      <h3>欢迎登录</h3>
    </div>
    <el-form class="login-form" :model="formData" :rules="rules" ref="loginForm">
      <el-form-item prop="username">
        <div class="inputbox">
          <el-input autofocus v-model="formData.username" name="username" placeholder="账号"></el-input>
        </div>
      </el-form-item>
      <el-form-item prop="password">
        <div class="inputbox">
        <el-tooltip 
          ref="tooltip"
          v-model="capsLock" 
          manual 
          placement="left-start"
          content="大写锁定已打开">
          <el-input 
          v-model="formData.password"
          @keyup.native="handlePasswordChange($event)"
          @keyup.enter.native="handleLogin"
          name="username" 
          type="password" 
          placeholder="密码"></el-input>
        </el-tooltip>
        </div>
      </el-form-item>
      <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loading">登&nbsp;录</el-button>
      <el-form-item>
        <!-- <el-checkbox v-model="checked">记住账号</el-checkbox> -->
        <a class="forget-pwd" :href="EDIT_PASSWORD_LINK" target="_blank">忘记密码</a>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import NodeRSA from 'node-rsa'
  import req from 'api/common/user'
  export default {
    name: 'LoginForm',
    props: {
      jumpUrl: {
        type: Boolean,
        default: true
      }
    },
    data () {
      const validateUsername = (rule, value, callback) => {
        // TODO: 条件判断函数
        if (!value) {
          callback(new Error('请输入账号'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        // if (value.length < 6) {
          // callback(new Error('密码不能小于6位'))
        if (!value) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        checked: false,
        formData: {
          username: '',
          password: ''
        },
        rules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        // 是否开启了大写capsLock
        capsLock: false
      }
    },
    computed: {
      url () {
        return this.$route.query.url
      },
      EDIT_PASSWORD_LINK () {
        return this.$store.state.user.EDIT_PASSWORD_LINK
      }
    },
    mounted () {
      const tooltipDom = this.$refs.tooltip ? this.$refs.tooltip.$el : null
      if (tooltipDom) tooltipDom.removeAttribute('tabindex')

      this.$store.dispatch('GET_EDITPASSWORDLINK')
    },
    methods: {
      handlePasswordChange (e) {
        if (!e.key) return

        var valueCapsLock = e.keyCode // 按键
        if (/^[a-zA-Z]$/.test(e.key)) {
          valueCapsLock = e.key.charCodeAt()
        }

        var valueShift = e.shiftKey ? e.shiftKey : ((valueCapsLock === 16)) // shift键是否按住
        if (((valueCapsLock >= 65 && valueCapsLock <= 90) && !valueShift) || // 输入了大写字母，并且shift键没有按住，说明Caps Lock打开
       ((valueCapsLock >= 97 && valueCapsLock <= 122) && valueShift)) { // 输入了小写字母，并且按住 shift键说明打开
          this.capsLock = true
        } else if (valueCapsLock >= 97 && valueCapsLock <= 122) {
          this.capsLock = false
        }
      },
      handleLogin () {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true

            this.getRSAPublicKey()
            .then(({ key, sid }) => {
              this.login({
                username: this.formData.username,
                password: key.encrypt(this.formData.password, 'base64')
              }, sid)
            })
            .catch(() => {
              console.error('获取RSA公钥失败')
            })
          } else {
            return false
          }
        })
      },
      login ({username = '', password = ''}, sid = '') {
        return this.$store.dispatch('login', { username, password, sid })
        .then(() => {
          this.$store.dispatch('getUserInfo')
          .then(() => {
            this.loading = false
            if (this.$store.state.user.info.firstLogin) {
              this.$alert('首次登陆，请修改密码', '', {
                confirmButtonText: '确定',
                showClose: false
              }).then(() => {
                window.location.href = this.EDIT_PASSWORD_LINK
              })
            } else if (this.$store.state.user.info.empSelfAuth) {
              window.location.href = '/self.html'
            } else if (this.jumpUrl) {
              this.$router.push({ path: this.url ? this.url : '/' })
            }
          })
          .catch(() => {
            this.loading = false
            if (this.jumpUrl) this.$router.push({ path: this.url ? this.url : '/' })
          })
        }, err => {
          this.loading = false
          if (err.status === 400) {
            this.$message({
              message: '账号或密码错误',
              type: 'error'
            })
          }
        })
      },
      /**
       * 获取RSA公钥
       */
      getRSAPublicKey () {
        return req('getRSAPublicKey', {}, false).then((data) => {
          if (data.modulus && data.exponent) {
            let key = new NodeRSA()
            key.setOptions({
              encryptionScheme: 'pkcs1'
            })
            key.importKey({
              n: new Buffer(data.modulus, 'base64'),
              e: new Buffer(data.exponent, 'base64')
            })
            return { key, sid: data.sid }
          } else {
            return Promise.reject()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.login-title {
  margin-bottom:24px;
  text-align:center;
  font-size:18px;
  color:#000;
}
.forget-pwd {
  float: right;
  font-size:12px;
}

.login-form {
  margin: 0 auto;
  width: 270px;
}

.el-button {
  width: 270px;
}

.el-checkbox
{
  color: #999999;
}
</style>