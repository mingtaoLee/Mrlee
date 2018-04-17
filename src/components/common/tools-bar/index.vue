<template>
  <menu class="tools-bar">
    <transition-group name="tools-bar-fade">
      <!-- v-show="editable && checkRole(item)" -->
      <!-- :type="mapType(item)" -->
      <el-button v-for="(item, idx) of btns"
        v-if="checkRole(item)"
        :key="idx"
        @click.native="edit(item)"
        type="primary">
       {{ mapTitle(item) }}
      </el-button>

      <el-button
        v-if="checkRole('operate')"
        key="operate"
        @click.native="edit('operate')"
        :type=" editable ? '' : 'primary' " :disabled="false">
        {{ editable ? '完成' : '编辑' }}
      </el-button>
    </transition-group>
  </menu>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      required: true
    },
    tool: {
      type: Object,
      default: {}
    },
    disable: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      type: {
        // create: 'success',
        // delete: 'danger'
      },
      title: {
        create: '添加',
        delete: '删除'
      }
    }
  },

  computed: {
    btns () {
      return Object.keys(this.tool).filter(role => role !== 'operate')
    }
  },

  methods: {
    checkRole (role) {
      return typeof this.tool[role] === 'function'
    },

    edit (role) {
      this.tool[role]()
    },

    _map (target) {
      const { config = {} } = this.tool

      return config[target] || {}
    },

    // mapType (role) {
    //   return this._map('type')[role] ||
    //     this.type[role] ||
    //     ''
    // },

    mapTitle (role) {
      return this._map('type')[role] ||
        this.title[role] ||
        role
    }
  }
}
</script>

<style lang="scss" scoped>
.tools-bar {
  // .tools-bar-fade-enter-active, .tools-bar-fade-leave-active {
  //   transition: all .3s ease-out;
  // }
  // .tools-bar-fade-enter, .tools-bar-fade-leave-to {
  //   opacity: 0;
  //   transform: translateX(5px);
  // }
}
</style>
