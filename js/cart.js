new Vue({
	el: "#app",
	data: {
		totalMoney: 0,
		productList: [],
		checkAllFlag: false,
		delFlag: false,
		curProduct: ''
	},
	filters: {
		formatMoney: function(value){
			return "￥"+value.toFixed(2);
		}
	},
	mounted: function() {
		this.$nextTick(function() {
			this.cartView();
		});
	},
	methods: {
		cartView: function(){
			var _this = this;
			this.$http.get("data/cartData.json", {"id": 134}).then(function(res) {
				_this.productList = res.data.result.list;
			})
		},
		changeMoney: function(product, way) {
			if (way>1) {
				product.productQuantity++;
			} else {
				product.productQuantity--;
				if (product.productQuantity<1) {
					product.productQuantity = 1;
				};
			};
			this.calcTotalPrice();
		},
		selectedProduct: function(item) {
			this.checkAllFlag = true;
			var _this = this;
			if (typeof item.checked == 'undefined') {
				this.$set(item, 'checked', true);
			} else {
				item.checked = !item.checked;
			};
			this.productList.forEach(function (item, index) {
				if (!item.checked) {
					_this.checkAllFlag = false;
				};
			})
			this.calcTotalPrice();
		},
		checkAll: function(flag) {
			this.checkAllFlag = flag;
			var _this = this;
			this.productList.forEach(function (item, index) {
				if (typeof item.checked == 'undefined') {
					_this.$set(item, 'checked', _this.checkAllFlag);
				} else {
					item.checked = _this.checkAllFlag;
				}
			});
			this.calcTotalPrice();
		},
		calcTotalPrice: function() {
			var _this = this;
			this.totalMoney = 0;
			this.productList.forEach(function (item, index) {
				if (item.checked) {
					_this.totalMoney += item.productPrice*item.productQuantity;
				};
			})
		},
		delConfirm: function(item) {
			this.delFlag = true;
			this.curProduct = item;
		},
		delProduct: function() {
			var index = this.productList.indexOf(this.curProduct);
			this.productList.splice(index, 1);
			this.delFlag = false;
		}
	}
});
// 全局过滤器
Vue.filter('money', function(value, type) {
	return "￥" + value.toFixed(2) + type;
})