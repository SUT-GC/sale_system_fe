<template>
    <div class="booking">
        <div class="booking-header">
            <el-collapse accordion v-model="accordionActive">
                <el-collapse-item title="新建" name="1">
                    <div class="insert-order">
                        <el-form ref="form" :model="newOrder" label-width="80px">
                            <el-form-item label="姓名">
                                <el-input clearable size="small" v-model="newOrder.userName"></el-input>
                            </el-form-item>
                            <el-form-item label="昵称">
                                <el-input clearable  size="small" v-model="newOrder.userNick"></el-input>
                            </el-form-item>
                            <el-form-item label="电话">
                                <el-input clearable size="small" v-model="newOrder.userPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="地址">
                                <el-input clearable size="small" v-model="newOrder.userAddress"></el-input>
                            </el-form-item>
                            <el-form-item label="快递号">
                                <el-input clearable size="small" v-model="newOrder.deliveryNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="订单状态">
                                <el-select size="small" v-model="newOrder.orderStatus" placeholder="请选择">
                                    <el-option
                                    v-for="item in orderStatus"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="订单商品">
                                <el-table v-if="newOrder.commodities" :data="newOrder.commodities" style="width: 100%">
                                    <el-table-column prop="name" label="商品名"></el-table-column>
                                    <el-table-column prop="sku" label="规格"></el-table-column>
                                    <el-table-column prop="sellingNumber" label="数量"></el-table-column>
                                    <el-table-column prop="sellingFee" label="售价"></el-table-column>
                                    <el-table-column prop="profit" label="盈利"></el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="text" size="small" @click.native.prevent="deleteOrderGoods(scope.$index, newOrder.commodities)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                            <div class="order-button">
                                <el-button size="small" type="primary" @click="insertOrderCommodityShow = true">添加商品</el-button>
                                <el-button size="small" type="primary" @click="insertOrderForm">立即创建</el-button>
                                <el-button size="small" type="primary" @click="resetOrderForm">重置信息</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="搜索" name="2">
                    <div>程序员小哥正在努力开发中......</div>
                </el-collapse-item>
            </el-collapse>
            <el-dialog
                title="商品信息"
                :visible.sync="insertOrderCommodityShow"
                width="100%">
                <el-row class="demo-autocomplete">
                    <el-autocomplete
                        style="width:100%"
                        size="small"
                        class="inline-input"
                        v-model="hitCommodityName"
                        :fetch-suggestions="queryGoodsSearch"
                        placeholder="请输入商品名"
                        @select="handlerGoodsSelect"
                        >
                        <template slot-scope="{ item }">
                            <div v-if="item.sku" >{{ item.name }} - {{ item.sku }}</div>
                            <div v-else >{{ item.name }}</div>
                        </template>
                    </el-autocomplete>
                    </el-col>
                </el-row>
                <br/>
                <hr/>
                <br/>
                <el-form v-if="hitCommodity" ref="hitCommodity" label-width="80px">
                    <el-form-item label="商品ID">
                        <el-input size="small" v-model="hitCommodity.id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名">
                        <el-input size="small" v-model="hitCommodity.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="规格名">
                        <el-input size="small" v-model="hitCommodity.sku" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="进价">
                        <el-input size="small" v-model="hitCommodity.purchaseFee" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="定价">
                        <el-input size="small" v-model="hitCommodity.customFee" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="库存">
                        <el-input size="small" v-model="hitCommodity.stock" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="售价">
                        <el-input size="small" v-model="hitCommodity.sellingFee"  ></el-input>
                    </el-form-item>
                    <el-form-item label="数量">
                        <el-input size="small" v-model="hitCommodity.sellingNumber"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="insertOrderCommodityShow = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="insertOrderCommodity">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="booking-content">
            <el-table :data="showOrders" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="姓名:">
                                <span>{{ props.row.userName }}</span>
                            </el-form-item>
                            <el-form-item label="昵称:">
                                <span>{{ props.row.userNick }}</span>
                            </el-form-item>
                            <el-form-item label="电话:">
                                <span>{{ props.row.userPhone }}</span>
                            </el-form-item>
                            <el-form-item label="地址:">
                                <span>{{ props.row.userAddress }}</span>
                            </el-form-item>
                            <el-form-item label="快递:">
                                <span>{{ props.row.deliveryNumber }}</span>
                            </el-form-item>
                            <el-form-item label="状态:">
                                <span>{{ props.row.orderStatus }}</span>
                            </el-form-item>
                            <el-form-item label="盈利:">
                                <span>{{ props.row.totalProfit }}</span>
                            </el-form-item>
                            <el-form-item label="时间:">
                                <span>{{ props.row.createdAt }}</span>
                            </el-form-item>
                            <br/>
                            <el-form-item label="商品:">
                                <br/>
                                <div class="order-commodity" v-for="cart in props.row.carts">
                                    <el-form-item label="名称:">
                                        <span>{{ cart.commodity.name }}</span>
                                    </el-form-item>
                                    <el-form-item label="规格:">
                                        <span>{{ cart.commodity.sku }}</span>
                                    </el-form-item>
                                    <el-form-item label="进价:">
                                        <span>{{ cart.commodity.purchaseFee }}</span>
                                    </el-form-item>
                                    <el-form-item label="定价:">
                                        <span>{{ cart.commodity.customFee }}</span>
                                    </el-form-item>
                                    <el-form-item label="售价:">
                                        <span>{{ cart.sellingFee }}</span>
                                    </el-form-item>
                                    <el-form-item label="数量:">
                                        <span>{{ cart.sellingNumber }}</span>
                                    </el-form-item>
                                    <el-form-item label="盈利:">
                                        <span>{{ cart.profit }}</span>
                                    </el-form-item>
                                </div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="userNick" label="昵称"></el-table-column>
                <el-table-column prop="deliveryNumber" label="快递号"></el-table-column>
                <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showUpdateOrder(scope.$index, orders)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                title="修改订单"
                :visible.sync="editOrderShow"
                width="100%">
                <el-form ref="form" v-if="updateOrder" :model="updateOrder" label-width="80px">
                    <el-form-item label="订单ID">
                        <el-input v-model="updateOrder.id" disabled ></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-select size="small" v-model="updateOrder.orderStatus" placeholder="请选择">
                            <el-option
                            v-for="item in orderStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editOrderShow = false">取 消</el-button>
                    <el-button type="primary" @click="submitUpdateOrder">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            host: 'http://server.int32.me:9999',
            accordionActive: 0,
            newOrder: {
                userName: "",
                userNick: "",
                userPhone: "",
                userAddress: "",
                deliveryNumber: "",
                orderStatus: "",
                commodities: [
                    
                ]
            },
            hitCommodity: null,
            hitCommodityName: "",
            insertOrderCommodityShow: false,
            editOrderShow: false,
            updateOrder: null,
            goods: [],
            orders: [],
            showGoods: [],
            orderStatus: [{
                value: 'INVALID',
                label: '无效订单'
            },{
                value: 'UNPAID',
                label: '未收钱'
            },{
                value: 'PAID_UN_DELIVERY',
                label: '已收钱未发货'
            },{
                value: 'PAID_DELIVERY',
                label: '收钱已发货'
            },{
                value: 'SIGNED',
                label: '签收'
            }]
        }
    },
    methods: {
        queryGoodsSearch(queryString, cb) {
            var goods = this.goods;
            console.log(goods)
            var results = queryString ? goods.filter(this.createFilter(queryString)) : goods;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handlerGoodsSelect(item) {
            this.hitCommodity = item
            this.hitCommodityName = item.name
            console.log(this.hitCommodity)  
        },
        createFilter(queryString) {
            return (good) => {
            return (good.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        insertOrderForm() {
            if (!this.validateOrder(this.newOrder)) {
                return
            }

            console.log(this.newOrder)
            let url = this.host + '/order/booking'
            this.$http.post(url, this.newOrder).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    this.queryAllOrders()
                    this.$message.success("创建成功")
                    this.accordionActive = 0
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response){
                this.$message.error("服务器错误");  
            })
        },
        insertOrderCommodity() {
            if(isNaN(this.hitCommodity.sellingNumber) || this.hitCommodity.sellingNumber <= 0.0) {
                this.$message.error("数量必须大于0")
                return false
            }

            if(isNaN(this.hitCommodity.sellingFee) || this.hitCommodity.sellingFee <= 0.0) {
                this.$message.error("售价比如大于0")
                return false
            }

            var bookingCommodity = new Object()
            bookingCommodity.id = this.hitCommodity.id
            bookingCommodity.name = this.hitCommodity.name
            bookingCommodity.sku = this.hitCommodity.sku
            bookingCommodity.sellingNumber = this.hitCommodity.sellingNumber
            bookingCommodity.sellingFee = this.hitCommodity.sellingFee
            bookingCommodity.profit = this.hitCommodity.sellingNumber * (this.hitCommodity.sellingFee - this.hitCommodity.purchaseFee)

            this.newOrder.commodities.push(bookingCommodity)

            console.log(this.newOrder)

            this.insertOrderCommodityShow = false
        },
        deleteOrderGoods(index, goods) {
            goods.splice(index, 1)
        },
        resetOrderForm() {
            this.newOrder.userName = ""
            this.newOrder.userNick = ""
            this.newOrder.userPhone = ""
            this.newOrder.userAddress = ""
            this.newOrder.deliveryNumber = ""
            this.newOrder.orderStatus = ""
            this.newOrder.commodities = []
        },
        validateOrder(newOrder) {
            if (!newOrder) {
                this.$message.error("订单不能为空")
                return false
            }

            if (!newOrder.userName) {
                this.$message.error("用户名必须填写")
                return false
            }

            if (!newOrder.userPhone) {
                this.$message.error("用户电话必须填写")
                return false
            }

            if (!newOrder.deliveryNumber) {
                this.$message.error("快递号必须填写")
                return false
            }

            if (!newOrder.userAddress) {
                this.$message.error("用户地址必须填写")
                return false
            }

            if (!newOrder.orderStatus) {
                this.$message.error("订单状态必须选择")
                return false
            }

            if (!newOrder.commodities || newOrder.commodities.length <= 0) {
                this.$message.error("订单必须添加商品")
                return false
            }

            for(let i = 0; i < newOrder.commodities.length; i++) {
                let commodity = newOrder.commodities[i]

                if (!commodity.name) {
                    this.$message.error('商品名称必须填写')
                    return false
                }

                if(isNaN(commodity.sellingNumber) || commodity.sellingNumber <= 0.0) {
                    this.$message.error('商品小数数量必须大于0')
                    return false
                }

                if(isNaN(commodity.sellingFee) || commodity.sellingFee <= 0.0) {
                    this.$message.error('商品售价必须大于0')
                    return false
                }
            }

            return  true
        },
        queryAllGoods(){
            let goodUrl = this.host + '/commodity/all'
            this.$http.get(goodUrl).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    this.goods = reps.data
                    this.showGoods = this.goods
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response){
                this.$message.error('服务器错误');
            })
        },
        queryAllOrders() {
            let orderUrl = this.host + '/order/all'
            this.$http.get(orderUrl).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    console.log(reps)
                    this.orders = reps.data
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response){
                this.$message.error('服务器错误');
            })
        },
        showUpdateOrder(index, orders) {
            this.editOrderShow = true
            this.updateOrder = orders[index]
        },
        submitUpdateOrder() {
            if (!this.updateOrder) {
                this.$message.error("要更新的订单不存在")
                return
            }

            if (isNaN(this.updateOrder.id) || this.updateOrder.is <= 0.0) {
                this.$message.error("订单id不存在")
                return
            }

            if (!this.updateOrder.orderStatus) {
                this.$message.error("订单状态错误")
                return
            }

            this.orderStatus.forEach(p => {
                if (this.updateOrder.orderStatus === p.label) {
                    this.updateOrder.orderStatus = p.value
                }
            })

            let url = this.host + '/order/update'
            this.$http.post(url, this.updateOrder).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    this.editOrderShow = false
                    this.$message.success("更新成功")
                    this.queryAllOrders()
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response) {
                this.$message.error('服务器错误');
            })
        }
    },
    created: function(){
        let goodUrl = this.host + '/commodity/all'
        this.$http.get(goodUrl).then(function(response){
            let reps = response.data
            if (reps.status.code == 200) {
                this.goods = reps.data
                this.showGoods = this.goods
            } else {
                this.$message.error(reps.status.desc);  
            }
        }, function(response){
            this.$message.error('服务器错误');
        })

        let orderUrl = this.host + '/order/all'
        this.$http.get(orderUrl).then(function(response){
            let reps = response.data
            if (reps.status.code == 200) {
                console.log(reps)
                this.orders = reps.data
            } else {
                this.$message.error(reps.status.desc);  
            }
        }, function(response){
            this.$message.error('服务器错误');
        })
    },
    computed: {
        showOrders: {
            get() {
                let result = this.orders
                if (result) {
                    result.forEach( p => {
                        this.orderStatus.forEach( q => {
                            if (q.value === p.orderStatus) {
                                p.orderStatus = q.label
                            }
                        })
                    })
                }
                console.log('showOrder',result)
                return result
            }
        }
    }
}
</script>
<style>
.booking {
    margin: 30px;
}
.order-button {
    float: right;
    margin-bottom: 30px;
}
.booking-content {
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>
