<!--
 * @Description: 这是通用列表页新增/编辑页面（组件）
 * @Date: 2020-08-10 15:29:17
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:31
-->
<template>
  <div ref="reservoirArea" class="reservoir-area">
    <div v-drag1 class="scPopBox_c" ref="tablePopC">
      <div class="head">
        {{ reservoirType == '1000' || reservoirType == '1002' ? '新增' : '编辑' }}
        <div class="headImg" @click="cancelFun()">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="tablepopCenten_box" v-stopdrag ref="popCentenBox">
        <div class="input_box">
          <div class="input_key"><span class="red">*</span>
            {{
                reservoirType == '1000' || reservoirType == '1001' ? '库区编号：' : '库位编号：'
            }}
          </div>
          <div class="plc">
            <el-input v-model="code" />
          </div>
        </div>
        <div class="input_box" v-if="reservoirType == '1000' || reservoirType == '1001'">
          <div class="input_key"><span class="red">*</span>库区名称：</div>
          <div class="plc">
            <el-input v-model="name" />
          </div>
        </div>


        <div class="input_box" v-if="reservoirType == '1002' || reservoirType == '1003'">
          <div class="input_key">排列层：</div>
          <div class="plc">
            <span class="chooseBtn" @click="openChoosePLCShow">选择</span>
            <span class="red">*</span>
            <span>排</span>
            <el-input class="plcInput" v-model="p" />
            <span class="red">*</span>
            <span>列</span>
            <el-input class="plcInput" v-model="l" />
            <span class="red">*</span>
            <span>层</span>
            <el-input class="plcInput" v-model="c" />
          </div>
        </div>

        <div class="input_box" v-if="reservoirType == '1002' || reservoirType == '1003'">
          <div class="input_key">隶属库区：</div>
          <div class="plc">
            <el-input v-model="subjection" />
          </div>
        </div>
        <div class="input_box" v-if="reservoirType == '1002' || reservoirType == '1003'">
          <div class="input_key">货位特征值：</div>
          <div class="plc">
            <el-input v-model="characteristic" />
          </div>
        </div>
        <div class="input_box" v-if="reservoirType == '1002' || reservoirType == '1003'">
          <div class="input_key">货位描述：</div>
          <div class="plc">
            <el-input type="textarea" resize="none" v-model="description" />
          </div>
        </div>
        <div class="input_box" v-if="reservoirType == '1000' || reservoirType == '1001'">
          <div class="input_key">备注：</div>
          <div class="plc">
            <el-input type="textarea" resize="none" v-model="description" />
          </div>
        </div>
        <div class="input_box" v-else>
          <div class="input_key">备注：</div>
          <div class="plc">
            <el-input type="textarea" resize="none" v-model="remark" />
          </div>
        </div>

        <div class="input_box2">
          <el-radio-group v-model="chooseValue">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="fool_btn">

        <el-button @click="cancelFun()" class="btn-style22 btn-close auto ">取消</el-button>
        <el-button @click="conserve(1)" class="btn-style21 auto">确定</el-button>
        <el-button @click="conserve(2)" class="btn-style21 auto">提交并继续新增</el-button>
      </div>
    </div>

    <div ref="choosePLC" class="choose-plc" v-if="choosePLCShow">
      <div v-drag1 class="scPopBox_c" ref="tablePopC">
        <div class="head">
          请选择排列层
          <div class="headImg" @click="closeChoosePLCShow">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="tablepopCenten_box" v-stopdrag ref="popCentenBox">
          <div class="item-list">
            <div class="item-key">排</div>
            <div class="item-value">
              <div :class="choosePLCShowData.p == item.index ? 'item-choose' : !item.enabled ? 'item-enabled' : 'item'"
                v-for="item in choosePLCShowList.p" :key="'p' + item.index" @click="popChoosePlc('p', item)">
                {{ item.index }}</div>
            </div>
          </div>
          <div class="item-list">
            <div class="item-key">列</div>
            <div class="item-value" v-if="choosePLCShowList.l.length">
              <div :class="choosePLCShowData.l == item.index ? 'item-choose' : !item.enabled ? 'item-enabled' : 'item'"
                v-for="item in choosePLCShowList.l" :key="'l' + item.index" @click="popChoosePlc('l', item)">
                {{ item.index }}</div>
            </div>
          </div>
          <div class="item-list">
            <div class="item-key">层</div>
            <div class="item-value" v-if="choosePLCShowList.c.length">
              <div :class="choosePLCShowData.c == item.index ? 'item-choose' : !item.enabled ? 'item-enabled' : 'item'"
                v-for="item in choosePLCShowList.c" :key="'c' + item.index" @click="popChoosePlc('c', item)">
                {{ item.index }}</div>
            </div>
          </div>
        </div>
        <div class="fool_btn">
          <el-button class="btn-style22 btn-close auto " @click="closeChoosePLCShow">取消</el-button>
          <el-button class="btn-style21 auto" @click="sumbitChoosePLCShow">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import "./reservoir-area.less";
import {
  CreateAsync,
  UpdateAsync,
  DeleteAsync,
  CreateLocationAsync,
  UpdateLocationAsync,
  DeleteLocationAsync,
  GetRowOptionsAsync,
  GetColumnOptionsAsync,
  GetTierOptionsAsync
} from "@/api/home.js";
export default {
  data() {
    return {
      id: '',
      choosePLCShow: false,
      choosePLCShowData: {
        p: '',
        l: '',
        c: '',
      },
      choosePLCShowList: {
        p: [],
        l: [],
        c: [],
      },
      code: '',
      p: '',
      l: '',
      c: '',
      Depth: '',//页面用不上，查回来传回去
      Tunnel: '',
      SizeTypeName: '',
      name: '',
      subjection: '',
      characteristic: '',
      description: '',
      remark: '',
      chooseValue: true,
      reservoirType: ''
    };
  },
  props: ["addTableData", "reservoirTypeInit"],
  mounted() {
    console.log('addTableData', this.addTableData);
    this.reservoirType = this.reservoirTypeInit;//编辑提交完有可以转为新增
    if (this.addTableData.length && this.reservoirType == '1001' || this.reservoirType == '1003') {
      const {
        id,
        Id,
        code,
        Code,
        description,
        name,
        AreaName,
        Remark,
        Line,
        Plie,
        Row,
        Depth,
        Tunnel,
        SizeTypeName,
        IsLocked
      } = this.addTableData[0];
      this.code = code || Code;
      this.name = name || AreaName;
      this.id = id || Id;//库区id
      this.description = description;//库位描述,库区备注
      this.remark = Remark;
      this.p = Row;//排
      this.l = Line;//列
      this.c = Plie;//层
      this.Depth = Depth;//深度
      this.Tunnel = Tunnel;
      this.SizeTypeName = SizeTypeName;
      this.chooseValue = IsLocked;
    } else {
      this.clearData()
    }

  },
  methods: {
    openChoosePLCShow() {
      GetRowOptionsAsync().then(res => {
        this.choosePLCShowList.p = JSON.parse(res.data.resultdata)
        this.choosePLCShowData.p = this.p;
        this.choosePLCShowData.l = this.l;
        this.choosePLCShowData.c = this.c;
        this.choosePLCShow = true;
      })
    },
    closeChoosePLCShow() {
      this.choosePLCShow = false;
    },
    popChoosePlc(type, item) {
      if (!item.enabled) {
        return
      }
      this.choosePLCShowData[type] = item.index;
      if (type == 'p') {
        GetColumnOptionsAsync(item.index).then(res => {
          this.choosePLCShowData.l = '';
          this.choosePLCShowData.c = '';
          this.choosePLCShowList.l = JSON.parse(res.data.resultdata);
          this.choosePLCShowList.c = []
        })
      } else if (type == 'l') {
        GetTierOptionsAsync(this.choosePLCShowData.p, item.index).then(res => {
          this.choosePLCShowData.c = '';
          this.choosePLCShowList.c = JSON.parse(res.data.resultdata)
        })
      }
    },
    sumbitChoosePLCShow() {
      this.p = this.choosePLCShowData.p;
      this.l = this.choosePLCShowData.l;
      this.c = this.choosePLCShowData.c;
      this.choosePLCShow = false;
    },

    //保存
    conserve(type) {
      //...提交操作
      if (this.reservoirType == '1000') {
        if (!this.code) {
          this.$parent.showTips('7', '请输入库区编号');
          return
        }
        if (!this.name) {
          this.$parent.showTips('7', '请输入库区名称');
          return
        }
        CreateAsync({
          code: this.code,
          name: this.name,
          description: this.description,
        }).then((res) => {
          if (res.data.type != 1) {
            this.$parent.showTips('7', res.data.message);
            return
          } else {
            this.$parent.showTips('7', '添加成功');
          }
          this.$parent.init();
          if (type == 1) {
            this.cancelFun();
          } else if (type == 2) {
            this.clearData();
          }
        })
      } else if (this.reservoirType == '1002') {
        CreateLocationAsync({
          warehouseId: this.id,
          code: this.code,
          tunnel: this.Tunnel,
          remark: this.remark,
          row: this.c,
          line: this.l,
          plie: this.p,
          depth: this.c,
          sizeTypeId: this.SizeTypeName
        }).then((res) => {
          if (res.data.type != 1) {
            this.$parent.showTips('7', res.data.message);
            return
          } else {
            this.$parent.showTips('7', '添加成功');
          }
          this.$parent.init();
          if (type == 1) {
            this.cancelFun();
          } else if (type == 2) {
            this.clearData();
          }
        })
      } else if (this.reservoirType == '1001') {
        if (!this.code) {
          this.$parent.showTips('7', '请输入库区编号');
          return
        }
        if (!this.name) {
          this.$parent.showTips('7', '请输入库区名称');
          return
        }
        UpdateAsync({
          id: this.id,
          code: this.code,
          name: this.name,
          description: this.description,
        }).then((res) => {
          if (res.data.type != 1) {
            this.$parent.showTips('7', res.data.message);
            return
          } else {
            this.$parent.showTips('7', '更新成功');
          }
          this.$parent.init();

          if (type == 1) {
            this.cancelFun();
          } else if (type == 2) {
            this.reservoirType = '1000'
            this.clearData();
          }
        })
      } else if (this.reservoirType == '1003') {
        UpdateLocationAsync({
          warehouseId: this.id,
          code: this.code,
          tunnel: this.Tunnel,
          remark: this.remark,
          row: this.c,
          line: this.l,
          plie: this.p,
          depth: this.c,
          sizeTypeId: this.SizeTypeName
        }).then((res) => {
          if (res.data.type != 1) {
            this.$parent.showTips('7', res.data.message);
            return
          } else {
            this.$parent.showTips('7', '更新成功');
          }
          this.$parent.init();
          if (type == 1) {
            this.cancelFun();
          } else if (type == 2) {
            this.reservoirType = '1002'
            this.clearData();
          }
        })
      }
    },
    clearData() {
      this.choosePLCShow = false;
      this.code = '';
      this.p = '';
      this.l = '';
      this.c = '';
      this.name = '';
      this.subjection = '';
      this.characteristic = '';
      this.description = '';
      this.remark = '';
      this.chooseValue = true;
    },
    //关闭
    cancelFun() {
      this.$parent.closeReservoirArea();
    },
  },
};
</script>
<style lang="less">
.reservoir-area {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #3399FF;
    background: #3399FF;
  }

  .el-radio__input.is-checked+.el-radio__label {
    color: #3399FF;
  }

  .el-radio__input {
    float: right;
    margin-left: 5px;
  }
}
</style>
  
