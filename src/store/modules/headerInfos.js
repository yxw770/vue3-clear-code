/**頂部信息 */
import { getHeaderInfos } from "@/api/home";

export const useHeaderInfosStore = defineStore("headerInfo", {
  state: () => ({
    // 初始化狀態
    init_state: false,
    // 实时掉落
    live_drop: [],
    // 最佳掉落列表
    best_drop_list: [],
    // 最佳掉落
    best_drop: {},
    // 在线玩家
    online_player: null,
    // 用户总数
    users_count: null,
    // 战斗总数
    battles_count: null,
    // 升级总数
    upgrades_count: null,
    // 盲盒总数
    blind_boxes_count: null,
  }),
  getters: {
    getLiveDrop: state => state.live_drop,
    getOnlinePlayer: state => state.online_player,
    getUsersCount: state => state.users_count,
    getBattlesCount: state => state.battles_count,
    getUpgradesCount: state => state.upgrades_count,
    getBlindBoxesCount: state => state.blind_boxes_count,
    getInit: (state) => state.init_state,
    getBestDrop: (state) => state.best_drop,
    getBestDropList: (state) => state.best_drop_list,
  },
  actions: {
    async init() {
      try {
        if (this.init_state == false) {
          const { data } = await getHeaderInfos();
          this.setLiveDrop(data.all_new_drops);
          this.setUsersCount(data.users_count);
          this.setBlindBoxesCount(data.blind_boxes_count);
          this.setBattlesCount(data.battles_count);
          this.setUpgradesCount(data.upgrades_count);
          this.setOnlinePlayer(data.online_player);
          this.setBestDropList(data.best_drop);
          this.findBestDrop()

          this.init_state = true;
        }

      } catch (e) {
        console.error(e, 'FAILED TO GET HEADER INFO');
      }
    },
    setLiveDrop(data) {
      this.live_drop = data;
    },
    setOnlinePlayer(data) {
      this.online_player = data;
    },
    setUsersCount(data) {
      this.users_count = data;
    },
    setBattlesCount(data) {
      this.battles_count = data;
    },
    setUpgradesCount(data) {
      this.upgrades_count = data;
    },
    setBlindBoxesCount(data) {
      this.blind_boxes_count = data;
    },
    setBestDrop(data) {
      this.best_drop = data;
    },
    setBestDropList(data) {
      this.best_drop_list = data;
    },
    addLiveDrop(live_drop) {
      //添加掉落
      var flag = false;
      this.live_drop.forEach(item => {
        // console.log(item.uid, live_drop.uid)
        if (item.uid == live_drop.uid) {
          //發現重複
          flag = true;
        }
        // 當前賺的最多的物品
      });
      if (!flag) {
        this.live_drop.unshift(live_drop);
        if (this.live_drop.length > 18) {
          this.live_drop.pop();
        }
        switch (live_drop.source) {
          case 1:
            // 盲盒掉落
            this.blind_boxes_count++;
            break;
          case 5:
            // 升級掉落
            this.upgrades_count++;
            break;
        }
        if (live_drop.amount_earned > 0) {
          this.best_drop_list.unshift(live_drop);
          if (this.best_drop_list.length > 18) {
            this.best_drop_list.pop();
          }
          // 尋找最值錢的掉落
          var best_flag = false;
          this.best_drop_list.forEach(item => {
            if (item.uid === this.best_drop.uid && item.amount_earned <= live_drop.amount_earned) {
              // 需要重置排序
              best_flag = true;
            }
          });
          if (best_flag) {
            this.findBestDrop()
          }
        }
      }
    },
    findBestDrop() {
      var top_amount = 0;
      var new_top;
      this.best_drop_list.forEach(item => {
        if (item.amount_earned > top_amount) {
          top_amount = item.amount_earned;
          new_top = item;
        }
      });
      if (this.best_drop_list.length > 0) {
        let random_text_arr = ['Stop it!', 'Awesome', 'Rich!?']
        random_text_arr.sort(() => Math.random() - 0.5)
        new_top.hype_text = random_text_arr[0]
        this.best_drop = new_top;
      }

    }

  },
});
