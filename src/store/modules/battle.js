import { getArrItem, setArrItem } from "@/utils/storage";
import {parseNumber} from "@/utils";


/**訪問控制 */
export const useBattleStore = defineStore("battle", {
  state: () => ({
    // 盲盒列表
    box_list: getArrItem("battle_box_list") || [],
    // 盲盒購物車
    case_cart: [],
    // 房間列表
    room_list: [],
  }),
  getters: {
    getBoxList: (state) => state.box_list,
    getCaseCart: (state) => state.case_cart,
    getRoomList: (state) => state.room_list,
    getCartCount: (state) => {
      let count = 0;
      state.case_cart.map(item => {
        count += item.count;
      })
      return count;
    },

    getCartTotal: (state) => {
      let total = 0;
      state.case_cart.map(item => {
        total += item.price * item.count;
      })
      return parseNumber(total, 2);
    }

  },
  actions: {
    /**
     * 設置盲盒列表
     * @param {*} data 
     */
    setBoxList(data) {
      setArrItem("battle_box_list", data)
      this.box_list = data;
    },
    /**
     * 添加進盲盒購物車
     * @param {*} data 
     */
    addCaseCart(data) {
      data.count = 1;
      this.case_cart.push(data)

    },
    /**
     * 添加盲盒購物車項目數量
     * @param {*} data 
     */
    incCaseCart(data) {

      this.case_cart.map(item => {
        if (item.id === data.id) {
          item.count++;
        }
      })

    },
    /**
     * 減少盲盒購物車項目數量
     * @param {*} data 
     */
    decCaseCart(data) {
      this.case_cart.map(item => {
        if (item.id === data.id) {
          item.count--;
          if (item.count <= 0) {
            this.case_cart = this.case_cart.filter(item => item.id !== data.id);
          }
        }

      })
    },
    /**
     * 刪除盲盒購物車項目
     * @param {*} data 
     */
    delCaseCart(data) {
      this.case_cart = this.case_cart.filter(item => item.id !== data.id);
    },
    /**
     * 更改盲盒購物車項目排序
     * @param {*} oldIndex  旧的索引
     * @param {*} newIndex  新的索引
     */
    sortCaseCart(oldIndex, newIndex) {
      let tmp = this.case_cart[oldIndex];
      this.case_cart.splice(oldIndex, 1);
      this.case_cart.splice(newIndex, 0, tmp);
    },
    /**
     * 清空購物車
     */
    resetCart() {
      this.case_cart = [];
    },
    /**
     * 清空房間列表
     */
    resetRoomList() {
      this.room_list = [];
    },
    /**
     *  設置房間列表
     * @param {*} data 
     */
    setRoomList(data) {
      this.room_list = data;
    },
    /**
     * 插入房間
     * @param {*} data 
     */
    insertRoom(data) {
      console.log(data, 'insertRoom')
      if (data) {
        this.room_list.unshift(data);
      }
    },
    /**
     * 刪除房間
     * @param {*} uid 房間UID
     */
    removeRoom(uid) {
      console.log(uid, this.room_list)
      this.room_list = this.room_list.filter(item => item.uid !== uid);
    },
    /**
     * 更新房間信息
     * @param {*} data 房間信息
     */
    updateRoom(data) {

      this.room_list = this.room_list.map(item => {
        console.log(item.uid === data.uid)
        if (item.uid === data.uid) {
          item = data;
        }
        return item;
      })

      console.log(this.room_list)
    },
  },
});
