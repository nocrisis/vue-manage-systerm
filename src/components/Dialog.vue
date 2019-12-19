<template>
  <el-dialog
    title="添加部门"
    :modal-append-to-body="false"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="部门名称">
        <el-input autocomplete="off" maxlength="10"></el-input>
      </el-form-item>
      <!-- <el-form-item label="上级部门">
        <el-select placeholder="请选择上级部门">
          <el-option
            v-for="dept in list"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="上级部门">
        <SelectTree
          :props="props"
          :options="list"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
        />
      </el-form-item>
      <el-form-item label="排序比重">
        <el-input-number min="0" max="7"></el-input-number>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" maxlength="300"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog.show = false">取 消</el-button>
      <el-button type="primary" @click="dialog.show = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SelectTree from '../components/treeSelect.vue'
export default {
  name: 'dialog',
  components: {
    SelectTree
  },
  props: {
    dialog: Object,
    list: Array
  },
  data() {
    return {
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 1, // 初始ID（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'deptList'
        // disabled:true
      }
    }
  },
  methods: {
    // 取值
    getValue(value) {
      this.valueId = value
      console.log(this.valueId)
    }
  }
}
</script>
<style scoped></style>
