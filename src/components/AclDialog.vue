<template>
  <el-dialog
    :title="acl_dialog.title"
    :modal-append-to-body="false"
    :visible.sync="acl_dialog.show"
    :close-on-click-modal="false"
  >
    <el-form ref="aclFormRef" :rules="acl_rules" :model="add_acl">
      <el-form-item label="权限点名称" prop="name">
        <el-input
          v-model="add_acl.name"
          placeholder="请输入权限点名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="add_acl.type" placeholder="请选择权限点类型">
          <el-option
            v-for="(value, key, index) in type_enum"
            :key="index"
            :label="value"
            :value="key"
          >
            <span style="float: left">{{ value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              key
            }}</span></el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input
          v-model="add_acl.url"
          placeholder="请输入url,可以为正则表达式"
        ></el-input>
      </el-form-item>
      <el-form-item prop="aclModuleId" label="所属权限模块">
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
      <el-form-item prop="status" label="状态">
        <!-- @change="$forceUpdate()"如果层级太深强制触发渲染 -->
        <el-select v-model="add_acl.status" placeholder="请选择权限点状态">
          <el-option
            v-for="(value, key, index) in status_enum"
            :key="index"
            :label="value"
            :value="key"
          >
            <span style="float: left">{{ value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              key
            }}</span></el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item prop="seq" label="显示顺序序号">
        <el-input-number
          v-model="add_acl.seq"
          :min="1"
          :max="10"
          :value="add_acl.seq"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="memo" label="备注">
        <el-input
          type="textarea"
          v-model="add_acl.memo"
          maxlength="150"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="acl_dialog.show = false">取 消</el-button>
      <el-button type="primary" @click="submitAcl('aclFormRef')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import SelectTree from '../components/treeSelect'
import { isNumber } from 'util'
export default {
  name: 'acl_dialog',
  components: {
    SelectTree
  },
  props: {
    acl_dialog: Object,
    option_list: Array,
    add_acl: Object,
    module_id: Number,
    status_enum: Object,
    type_enum: Object
  },
  data() {
    return {
      placeholderContent: '请选择所属权限模块',
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: this.module_id, // 初始显示ID（可选）
      tree_props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'aclModuleList'
        // disabled:true
      },
      acl_rules: {
        name: [
          { required: true, message: '权限点名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: 'URL不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 100,
            message: '长度在 6 到 100 个字符',
            trigger: 'blur'
          }
        ],
        aclModuleId: [
          {
            type: 'number',
            required: true,
            message: '所属权限模块不能为空',
            trigger: 'blur'
          }
        ],
        status: [
          {
            // type: 'string',因为object的key是string而不是number,key可以是String或Symbol,用其它类型的值作为key去取值或设值,会先转为字符串再进行get或set
            required: true,
            message: '状态不能为空',
            trigger: 'change'
          }
        ],
        type: [
          {
            // type: 'string',
            required: true,
            message: '类型不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    // valueId(newv, oldv) {
    //   console.log('Dialog tree valueId changed', oldv + ' to ' + newv)
    // },
    //由于自己写的不像其他input有el封装的双向绑定填充数据变化而变化功能，
    //select-tree组件需要在父组件监听每次dialog弹出并传递给子组件重新赋值当前初始化value
    acl_dialog(d) {
      if (d.show) {
        this.valueId = this.module_id
      }
    }
  },
  methods: {
    // SelectTree取选择中的option值
    getValue(value) {
      this.valueId = value
      this.add_acl.aclModuleId = this.valueId
    },
    submitAcl(formRef) {
      this.$refs[formRef].validate(valid => {
        if (valid) {
          console.log(this.add_acl)
          const url = this.acl_dialog.option == 'add' ? 'add' : 'update'
          const op = this.acl_dialog.option == 'add' ? '添加' : '编辑'
          this.$axios
            .post(`api/sys/acl/${url}`, this.add_acl)
            .then(res => {
              let result = res.data
              if (result.code == 200) {
                this.$message({
                  message: op + '权限点成功',
                  type: 'success'
                })
                this.acl_dialog.show = false
                //通知父组件刷新列表
                this.$emit('updateAcl')
              } else {
                this.$message({
                  message: op + '权限点失败' + result.msg,
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
