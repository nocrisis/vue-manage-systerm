<template>
  <el-dialog
    :title="module_dialog.title"
    :modal-append-to-body="false"
    :visible.sync="module_dialog.show"
    :close-on-click-modal="false"
  >
    <el-form ref="moduleFormRef" :rules="module_rules" :model="add_module">
      <el-form-item prop="name" label="权限模块名称">
        <el-input
          autocomplete="off"
          v-model="add_module.name"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="上级权限模块">
        <el-select placeholder="请选择上级权限模块">
          <el-option
            v-for="module in list"
            :key="module.id"
            :label="module.name"
            :value="module.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="parentId" label="上级权限模块">
        <SelectTree
          :props="tree_props"
          :options="option_list"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          :placeholder="placeholderContent"
          @getValue="getValue($event)"
        />
      </el-form-item>
      <el-form-item prop="seq" label="显示顺序序号">
        <el-input-number
          v-model="add_module.seq"
          :min="1"
          :max="10"
          :value="add_module.seq"
        ></el-input-number> </el-form-item
      ><el-form-item prop="status" label="状态">
        <!-- @change="$forceUpdate()"如果层级太深强制触发渲染 -->
        <el-select v-model="add_module.status" placeholder="请选择用户状态">
          <el-option
            v-for="(value, key) in status_enum"
            :key="key"
            :label="value"
            :value="key"
          >
            <span style="float: left">{{ value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              key
            }}</span></el-option
          >
        </el-select></el-form-item
      >
      <el-form-item prop="memo" label="备注">
        <el-input
          type="textarea"
          v-model="add_module.memo"
          maxlength="150"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="module_dialog.show = false">取 消</el-button>
      <el-button type="primary" @click="submitDept('moduleFormRef')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import SelectTree from '../components/treeSelect'
export default {
  name: 'module_dialog',
  components: {
    SelectTree
  },
  props: {
    status_enum: Object,
    module_dialog: Object,
    option_list: Array,
    add_module: Object
  },
  data() {
    return {
      placeholderContent: '请选择上级权限模块',
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: null, // 初始显示ID（可选）
      tree_props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'aclModuleList'
        // disabled:true
      },
      module_rules: {
        name: [
          { required: true, message: '权限模块名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // valueId(newv, oldv) {
    //   console.log('Dialog tree valueId changed', oldv + ' to ' + newv)
    // },
    //由于自己写的不像其他input有el封装的双向绑定填充数据变化而变化功能，
    //select-tree组件需要在父组件监听每次dialog弹出并传递给子组件重新赋值当前value
    module_dialog(d) {
      if (d.show) {
        this.valueId =
          d.option == 'edit'
            ? this.add_module.parentId == 0
              ? null
              : this.add_module.parentId
            : null
      }
    }
  },
  methods: {
    // SelectTree取选择中的option值
    getValue(value) {
      this.valueId = value
      this.add_module.parentId = this.valueId
    },
    submitDept(formRef) {
      this.$refs[formRef].validate(valid => {
        if (valid) {
          console.log(this.add_module)
          const url =
            this.module_dialog.option == 'add' ? 'save.json' : 'update.json'
          const op = this.module_dialog.option == 'add' ? '添加' : '编辑'
          this.$axios
            .post(`api/sys/aclModule/${url}`, this.add_module)
            .then(res => {
              let result = res.data
              if (result.code == 200) {
                this.$message({
                  message: op + '权限模块成功',
                  type: 'success'
                })
                this.module_dialog.show = false
                //通知父组件刷新列表
                this.$emit('updateData')
              } else {
                this.$message({
                  message: op + '权限模块失败' + result.msg,
                  type: 'fail'
                })
              }
            })
            .catch(error => {
              this.$message({
                message: error,
                type: 'fail'
              })
            })
        }
      })
    }
  }
}
</script>
<style scoped></style>
