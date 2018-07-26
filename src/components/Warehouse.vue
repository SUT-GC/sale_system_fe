<template>
    <div class="warehost">
        <div class="header">
            <div class="search">
                <el-input class="search-input" v-model="searchGoodName" clearable placeholder="请输入商品名"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchGoodByName"></el-button>
                <el-button type="primary" icon="el-icon-edit" @click="insertNewGoods"></el-button>
            </div>
        </div>
        <el-dialog width="100%" title="商品信息" :visible.sync="insertNewGoodsShow">
            <el-form :model="newGoods" :rules="rules" ref="newGoods" label-width="100px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="newGoods.name"></el-input>
                </el-form-item>
                <el-form-item label="商品规格" prop="sku">
                    <el-input v-model="newGoods.sku"></el-input>
                </el-form-item>
                <el-form-item label="商品进价" prop="purchaseFee">
                    <el-input v-model="newGoods.purchaseFee"></el-input>
                </el-form-item>
                <el-form-item label="商品售价" prop="customFee">
                    <el-input v-model="newGoods.customFee"></el-input>
                </el-form-item>
                <el-form-item label="商品库存" prop="stock">
                    <el-input v-model="newGoods.stock"></el-input>
                </el-form-item>
                <el-form-item label="商品货源" prop="stock">
                    <el-radio-group v-model="newGoods.source">
                        <el-radio label="WANG_LI_WEI" name="WANG_LI_WEI"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="insertNewGoodsShow = false" >取 消</el-button>
                <el-button type="primary" @click="submitInsertNewGoods">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog width="100%" title="商品信息" v-if="editingGoods" :visible.sync="editGoodsShow">
            <el-form :model="editingGoods" :rules="rules" ref="newGoods" label-width="100px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="editingGoods.name"></el-input>
                </el-form-item>
                <el-form-item label="商品规格" prop="sku">
                    <el-input v-model="editingGoods.sku"></el-input>
                </el-form-item>
                <el-form-item label="商品进价" prop="purchaseFee">
                    <el-input v-model="editingGoods.purchaseFee"></el-input>
                </el-form-item>
                <el-form-item label="商品售价" prop="customFee">
                    <el-input v-model="editingGoods.customFee"></el-input>
                </el-form-item>
                <el-form-item label="商品库存" prop="stock">
                    <el-input v-model="editingGoods.stock"></el-input>
                </el-form-item>
                <el-form-item label="商品货源" prop="stock">
                    <el-radio-group v-model="editingGoods.source">
                        <el-radio label="WANG_LI_WEI" name="WANG_LI_WEI"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editGoodsShow = false" >取 消</el-button>
                <el-button type="primary" @click="submitEditGoods">确 定</el-button>
            </div>
        </el-dialog>
        <div class="body">
            <el-table :data="showGoods"  style="width: 100%">
                <el-table-column prop="id" label="商品ID"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="sku" label="商品规格"></el-table-column>
                <el-table-column prop="stock" label="商品库存"></el-table-column>
                <el-table-column prop="customFee" label="商品售价"></el-table-column>
                <el-table-column prop="purchaseFee" label="商品定价"></el-table-column>
                <el-table-column prop="sellingNum" label="商品销量 "></el-table-column>
                <el-table-column prop="source" label="商品来源"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="editGoods(scope.$index, showGoods)" >编辑</el-button>
                        <el-button type="text" size="small" @click.native.prevent="deleteGoods(scope.$index, showGoods)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            host: 'http://server.int32.me:9999',
            goods: [],
            showGoods: [],
            searchGoodName: "",
            state2:"",
            insertNewGoodsShow: false,
            newGoods: {
                name:"",
                sku: "",
                purchaseFee: 0.0,
                customFee: 0.0,
                sellingNum: 0,
                stock: 0,
                source: "",
            },
            rules: {
            },
            editingGoods: null,
            editGoodsShow: false
        }
    },
    created: function(){
        let url = this.host + '/commodity/all'
        this.$http.get(url).then(function(response){
            let reps = response.data
            if (reps.status.code == 200) {
                console.log(reps)
                this.goods = reps.data
                this.showGoods = this.goods
            } else {
                this.$message.error(reps.status.desc);  
            }
        }, function(response){
            this.$message.error('服务器错误');
        })
    },
    computed: {
    },
    methods: {
        queryAllGoods(){
            let url = this.host + '/commodity/all'
            this.$http.get(url).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    console.log(reps)
                    this.goods = reps.data
                    this.showGoods = this.goods
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response){
                this.$message.error('服务器错误');
            })
        },
        querySearch(queryString, cb) {
            console.log(queryString)
            var goods = this.goods;
            var inGoods = queryString ? goods.filter(this.createFilter(queryString)) : goods;
            console.log(inGoods)
            
            var result = []
            inGoods.forEach( p => {
                result.push(p.name)
            })

            console.log(result)

            cb(result);
        },
        createFilter(queryString) {
            return (good) => {
                console.log(good.name.toLowerCase().indexOf(queryString.toLowerCase()))
                return (good.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
            };
        },
        selectGoodByName(item) {
            console.log(item)
        },
        searchGoodByName() {
            this.showGoods = this.searchGoodName ? this.goods.filter(this.createFilter(this.searchGoodName)) : this.goods;
        },
        insertNewGoods() {
            this.insertNewGoodsShow = true
        },
        submitInsertNewGoods() {
            let url = this.host + "/commodity/save"
            var newGoods = new Object()
            newGoods.name = this.newGoods.name
            newGoods.sku = this.newGoods.sku
            newGoods.customFee = this.newGoods.customFee
            newGoods.purchaseFee = this.newGoods.purchaseFee
            newGoods.stock = this.newGoods.stock
            newGoods.sellingNum = 0
            newGoods.source = this.newGoods.source
            if(!this.validateGoods(newGoods)) {
                return
            }
            this.$http.post(url, newGoods).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    console.log(reps)
                    this.queryAllGoods()
                    this.insertNewGoodsShow = false
                    this.$message.success("添加成功")
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response){
                this.$message.error('服务器错误');
            })
        },
        validateGoods(newGoods){
            console.log('check')
            if (!newGoods.name){
                this.$message.error("商品名称不难为空")
                return false
            }
            if (isNaN(newGoods.purchaseFee) || newGoods.purchaseFee <= 0) {
                this.$message.error("商品进价要大于0")
                return false
            }
            if (isNaN(newGoods.customFee) || newGoods.customFee <= 0) {
                this.$message.error("商品售价要大于0")
                return false
            }
            if (isNaN(newGoods.stock) || newGoods.stock <= 0) {
                this.$message.error("商品库存要大于0")
                return false
            }
            if (!newGoods.source) {
                this.$message.error("商品货源必须选择")
                return false
            }

            return true
        },
        editGoods(index, goods) {
            this.editingGoods = goods[index]
            console.log(this.editingGoods)
            this.editGoodsShow = true
        },
        submitEditGoods() {
            let url = this.host + "/commodity/save"
            if(!this.validateGoods(this.editingGoods)) {
                return
            }
            this.$http.post(url, this.editingGoods).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    this.queryAllGoods()
                    this.editGoodsShow = false
                    this.$message.success("修改成功")
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response){
                this.$message.error('服务器错误');
            })
        },
        deleteGoods(index, goods) {
            let deleteGoods = goods[index]
            let url = this.host + "/commodity/delete"
            this.$http.delete(url + "?id=" + deleteGoods.id).then(function(response){
                let reps = response.data
                if (reps.status.code == 200) {
                    this.queryAllGoods()
                    this.$message.success("删除成功")
                } else {
                    this.$message.error(reps.status.desc);  
                }
            }, function(response){
                this.$message.error('服务器错误');
            })
        }
    }
}

</script>
<style>
.warehost {
    margin: 30px;
}
.header{
    position: relative;
}
.search {
    float: right;
    margin-top: 20px;
    margin-bottom: 20px;
}

.search-input {
    width: 160px;
}
</style>
