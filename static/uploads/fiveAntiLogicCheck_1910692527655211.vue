<template>
  <div class="configurationPage-container">
    <div class="configurationPage-title">五防逻辑查看</div>
    <div class="common_sidebarHide animationTwinkling" v-show="isShowLeftIcon" @click="isShowLeftIcon = !isShowLeftIcon"></div>
    <transition   name="a-fadeinL" >
        <div v-show="!isShowLeftIcon" class="fiveAntiLogicCheck-left common_sidebarBox">
            <div class="fiveAntiLogicCheck-search">
                <el-input placeholder="请输入内容搜索" v-model="deviceFilterName">
                    <div slot="append" class="healthProfile-search-append" @click="searchHandle">
                        <i class="el-icon-search" style="color: #fff;font-size: 24px;"></i>
                    </div>
                </el-input>
            </div>
            <div class="fiveAntiLogicCheck-tree">
                <PopoverTree
                    search="none"
                    :defaultExpandAll="false"
                    :data="deviceTreeData"
                    :defaultExpandedKeys="deviceExpandedKeys"
                    :handleNodeClick="handleNodeClick"
                    ref="PopoverTreeDevice"
                >
                </PopoverTree>
            </div>
            <div class="sidebarShow_right">
                <div class="sidebarShow_close" @click="isShowLeftIcon = !isShowLeftIcon"></div>
            </div>
        </div>
    </transition>
    
    <div class="configurationPage-main-two">
        <div class="fiveAntiLogicCheck-contain">
            
            <div class="fiveAntiLogicCheck-right">
                <div class="fiveAntiLogicCheck-list">
                    <div class="fiveAntiLogicCheck-title">五防逻辑</div>
                    <div class="fiveAntiLogicCheck-lit-content">
                        <el-table
                            :data="tableList"
                            height="calc(100%)"
                            border
                            :fit="true"
                        >
                            <!-- <el-table-column
                                type="index"
                                label="序号"
                                width="70"
                                :show-overflow-tooltip="true"
                                :index="(index) => index + 1 + (current - 1) * pageSize"
                                align="center">
                            </el-table-column> -->
                            <el-table-column
                                label="变电站"
                                width="180"
                                prop="stationName"
                                :show-overflow-tooltip="true"
                                align="center">
                            </el-table-column>
                            <!-- <el-table-column
                                label="电压等级"
                                prop="enname"
                                width="120"
                                :show-overflow-tooltip="true"
                                align="center">
                            </el-table-column> -->
                            <el-table-column
                                label="间隔名称"
                                width="150"
                                prop="jgdy"
                                :show-overflow-tooltip="true"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                label="设备名称"
                                width="150"
                                prop="devName"
                                :show-overflow-tooltip="true"
                                align="center">
                            </el-table-column>
                            <!-- <el-table-column
                                label="设备编码"
                                prop="dataScope"
                                :show-overflow-tooltip="true"
                                align="center">
                            </el-table-column> -->
                            <el-table-column
                                label="分闸逻辑"
                                prop="disconnect"
                                :show-overflow-tooltip="true"
                                align="center">
                                <template slot-scope="{row}">
                                    <p class="over-content" v-for="(item, index) in row.disconnect" :key="index">{{item}}</p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="合闸逻辑"
                                prop="connect"
                                :show-overflow-tooltip="true"
                                align="center">
                                <template slot-scope="{row}">
                                    <p class="over-content" v-for="(item, index) in row.connect" :key="index">{{item}}</p>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="fiveAntiLogicCheck-canvas">
                    <div class="fiveAntiLogicCheck-title">一次接线图</div>
                    <div id="oneTimeWiring-box">
                        <one-time-wiring :data="oneTimeWiringData"></one-time-wiring>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import PopoverTree from '@/components/popoverTree'
// import Pagination from '@/components/Pagination'
import {  fiveDevTree, fivePreventiondevId, lineInterval } from '@/api/fiveAntiLogic'
import { initTree } from '@/utils/common'
import OneTimeWiring from './oneTimeWiring.vue'
export default {
    data() {
        return {
            isShowLeftIcon: true,
            deviceTreeData: [],
            deviceFilterName: "",
            deviceExpandedKeys: [],
            oneTimeWiringData: null,

            tableList: [],
            // current: 1,
            // pageSize: 15,
            // total: 0,

            treeId: "",
            pId: ''
        }
    },
    components: {
        PopoverTree,
        // Pagination,
        OneTimeWiring
    },
    async mounted() {
        this.initDeviceTreeData();
        // this.initTable()
    },
    watch: {
        treeId: {
            handler: function(val, oldVal) {
                if(!val) return
                this.initTable()
                this.getLineData()
            }
        }
    },
    methods: {
        searchHandle() {
            this.$refs.PopoverTreeDevice.$refs.tree.filter(this.deviceFilterName);
        },
        handleNodeClick(obj, node, ref) {
            console.log(obj);
            if(!obj.click) return
            this.treeId = obj.id;
            this.pId = obj.pid;
        },
        async initDeviceTreeData() {
            const response = await fiveDevTree();
            if(response.connected) {
                this.deviceTreeData = initTree(response.data, "id", "pid");

                // this.treeId = "80CD80AC-0B2F-4EFE-8F31-3D953A605CBD-00672_616_104";
                this.$nextTick(function() {
                    this.$refs.PopoverTreeDevice.$refs.tree.setCurrentKey("80CD80AC-0B2F-4EFE-8F31-3D953A605CBD-00672_616_104");
                    this.deviceExpandedKeys = ["80CD80AC-0B2F-4EFE-8F31-3D953A605CBD-00672_616_104"];
                })
            }
        },
        async initTable() {
            let rs = await fivePreventiondevId({devId: this.treeId});
            let data = rs.data;
            let connect = [];
            let states = ['分位', '合位'];
            data.connect.map((items, index)=> {
                let str = `${index+1}：`;
                items.map((item, last)=> {
                    str += `${item.name}${states[item.state]}${(items.length == last+1)?'。\r\n': '，'}`
                })
                connect.push(str)
            })
            let disconnect = [];
            data.disconnect.map((items, index)=> {
                let str= `${index+1}：`;
                items.map((item, last)=> {
                    str += `${item.name}${states[item.state]}${(items.length == last+1)?'。\r\n': '，'}`
                })
                disconnect.push(str)
            })
            this.tableList = [
                {
                    ...data,
                    connect,
                    disconnect
                }
            ]
        },
        // 获取一次接线图数据
        async getLineData() {

            try {
                let rs = await lineInterval({intervalId: this.pId});
                let datas = rs.data;
                this.oneTimeWiringData =  {
                    name: datas.name,
                    bus1: datas.inDisconnectings[0].busId,
                    bus2: datas.inDisconnectings[1].busId,
                    ground1: datas.inEarthingDisconnecting.name,
                    ground2: datas.outEarthingDisconnecting.name,
                    ground3: datas.beforEarthingDisconnecting.name,
                    barrier1: datas.inDisconnectings[0].name,
                    barrier2: datas.inDisconnectings[1].name,
                    barrier3: datas.outDisconnecting.name,
                    breakName: datas.breakerName
                }
            } catch (error) {
                
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
.fiveAntiLogicCheck-left {
    // width: 270px;
    // box-sizing: border-box;
    // padding: 30px 15px 15px;
    // background-image: url("~@/assets/images/healthProfile/bg_dhbjk.png");
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    // background-position: 0 0;
    .fiveAntiLogicCheck-search {
        height: 35px;
        width: 90%;
        margin-bottom: 10px;
        ::v-deep .el-input__inner {
            border-color: #1F9EFF;
        }
        ::v-deep  .el-input-group__append {
            background-color: #1F9EFF;
            border-color: #1F9EFF;
            &:hover {
                background: #66b1ff;
                border-color: #66b1ff;
            }
            &:focus {
                background: #66b1ff;
                border-color: #66b1ff;
            }
            &:active {
                background: #3a8ee6;
                border-color: #3a8ee6;
            }
            .healthProfile-search-append {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
        }
    }
    .fiveAntiLogicCheck-tree {
        height: calc(100% - 35px - 10px);
        width: 95%;
        overflow-y: auto;
        ::v-deep .el-tree-node__label {
            font-size: 16px;
        }
    }
}
.fiveAntiLogicCheck-contain {
    height: 100%;
    box-sizing: border-box;
    padding-top: 0.3%;
    display: flex;
    
    .fiveAntiLogicCheck-right {
        width: 100%;
        margin-left: 15px;
        box-sizing: border-box;
        .fiveAntiLogicCheck-list {
            height: 300px;
            margin-bottom: 15px;
            box-sizing: border-box;
            border: 1px solid #1D769A;
            .fiveAntiLogicCheck-lit-content {
                height: calc(100% - 43px);
            }
        }
        .fiveAntiLogicCheck-canvas {
            height: calc(100% - 300px - 15px);
            box-sizing: border-box;
            border: 1px solid #1D769A;
            #oneTimeWiring-box {
                width: 100%;
                height: calc(100% - 43px);
                border: 1px solid orange;
                box-sizing: border-box;
            }
        }
        .fiveAntiLogicCheck-title {
            height: 43px;
            padding-left: 47px;
            padding-bottom: 12px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            position: relative;
            font-size: 18px;
            color: #fff;
            letter-spacing: 2px;
            background-image: url("~@/assets/images/healthProfile/bg_zbt.png");
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: auto 100%;
            &::before {
                content: url("~@/assets/images/healthProfile/icon_ty.png");
                display: inline-block;
                width: 30px;
                height: 30px;
                margin-right: 0px;
                margin-bottom: -17px;
            }
        }
    }
}
.over-content {
    white-space: normal;
    text-align: left;
}
</style>