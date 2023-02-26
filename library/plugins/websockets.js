
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import request from "@/utils/request";
import {gp} from "./gp";
import {usePlayerStore} from "@/store/modules/player";
import {useHeaderInfosStore} from "@/store/modules/headerInfos";
import {settings} from "@/config";
import {useBattleStore} from "@/store/modules/battle";
import {useBattleRoomStore} from "@/store/modules/battleRoom";
// 狀態庫
export const state = reactive({
    isConnected: false, // 是否已連接
    needBattleList: false, // 是否需要讀取對戰房間列表
    battleListResolve: () => {
    }, // 對戰房間列表callback
    needBattleRoom: false, // 是否需要讀取對戰房間信息
    battleRoomUid: null, // 戰房間UID
    battleRoomResolve: () => {
    }, // 對戰房間信息callback
    battleRoomReject: () => {
    }, // 對戰房間信息callback
});

export function setupWebsocket(app) {
    const websocketPusher = new Echo({
        broadcaster: "pusher",
        key: settings.socketKey,
        secret: settings.socketSecret,
        wsHost: settings.socketHost,
        wssHost: settings.socketHost,
        cluster: "ap1",
        namespace: "Modules.Cases.Events",
        wsPort: 80,
        wssPort: 443,
        enabledTransports: ["ws", "wss"],
        forceTLS: false,
    });

    window.wsPuseher = websocketPusher;
    // // 遊客模式初始化
    // const guestInit = () => {

    // }
    // // 登錄模式初始化
    // const hasLoginInit = () => {

    // // }
    // app.provide("hasLoginInit", hasLoginInit);
    // app.provide("guestInit", guestInit);
    app.provide("websocketPusher", websocketPusher);
    window.wsPuseher.connector.pusher.connection.bind("connected", (payload) => {
        /**
         * The connection to Channels is open and authenticated with your app.
         */

        state.isConnected = true;
        _initNotify();
        console.log("connected!", payload);
    });
    window.wsPuseher.connector.pusher.connection.bind(
        "disconnected",
        function () {
            state.isConnected = false;
            console.error("disconnect");
        }
    );
}

// 遊客模式初始化
export function guestInit() {
    window.wsPuseher
        .channel("headerInfo")
        .listen("HeaderInfoNotification", (data) => {
            headerInfoNotifyHandle(data);
        });

    // setInterval(function () { getOnlinePlayer(); }, 10000);
}

// 登錄模式初始化
export function hasLoginInit() {
    window.wsPuseher.disconnect();
    window.wsPuseher.options.authorizer = (channel) => {
        return {
            // eslint-disable-next-line no-unused-vars
            authorize: (socketId, callback) => {
                var data = {
                    socket_id: socketId,
                    channel_name: channel.name,
                };
                request({
                    url: "/broadcasting/auth",
                    method: "post",
                    data,
                })
                    .then((response) => {
                        callback(false, response);
                    })
                    .catch((error) => {
                        gp.$baseMessage("webwocket error:".error, "error");
                        callback(true, error);
                    });
            },
        };
    };
    window.wsPuseher.connect();
    window.wsPuseher.connector.pusher.connection.bind("connected", (payload) => {
        console.log(state.needBattleList, 888);
        _initNotify();
        /**
         * The connection to Channels is open and authenticated with your app.
         */
        state.isConnected = true;

        console.log("connected!", payload);
    });
    window.wsPuseher.connector.pusher.connection.bind(
        "disconnected",
        function () {
            state.isConnected = false;
            console.error("disconnect");
        }
    );

    window.wsPuseher
        .channel("headerInfo")
        .listen("HeaderInfoNotification", (data) => {
            headerInfoNotifyHandle(data);
        });
    if (window.wsPuseher.options.authorizer) {
        const token = usePlayerStore().token;

        let player = decodeURIComponent(
            encodeURIComponent(window.atob(token.split(".")[1]))
        );
        let player_id = JSON.parse(player).sub;

        // console.log(window.wsPuseher.options.authorizer);
        window.wsPuseher
            .private("Player." + player_id)
            .listen("PlayerNotificationEvent", (data) => {
                console.log([data], "player");
                playerNotificationHandle(data);
            });
        getPlayerAmount(player_id);
        // setInterval(function () { getPlayerAmount(player_id); }, 30000);
    }
    getOnlinePlayer();
    // setInterval(function () { getOnlinePlayer(); }, 10000);
}

//獲取在線玩家
export function getOnlinePlayer() {
    const headerInfo = useHeaderInfosStore();
    var inter = setInterval(() => {
        if (headerInfo.online_player == null) {
            window.wsPuseher.connector.pusher.send_event("getOnlinePlayer", {});
        } else {
            clearInterval(inter);
        }
    }, 10000);
}

//獲取用戶金額
export function getPlayerAmount(player_id) {
    window.wsPuseher.connector.pusher.send_event("getPlayerAmount", {
        player_id: player_id,
    });
}

// 初始化讀取戰鬥房間列表
export function initBattlesList(resolve) {
    window.wsPuseher.leave("BattlesList");
    state.needBattleList = true;
    state.battleListResolve = resolve;

    if (state.isConnected) {
        battlesListNotify();
    }
}

/**
 * 初始化讀取戰鬥房間数据集
 * @param {*} resolve  回调
 * @param {*} reject  回调
 * @param {*} uid     房間Uid
 */
export function initBattlesRoom(resolve, reject, uid) {
    if (state.battleRoomUid) {
        window.wsPuseher.leave("BattlesRoom." + state.battleRoomUid);
    }
    state.needBattleRoom = true;
    state.battleRoomResolve = resolve;
    state.battleRoomReject = reject;
    state.battleRoomUid = uid;
    if (state.isConnected) {
        battlesRoomNotify();
    }
}

/**
 * 離開房間
 * @param {*} uid
 */
export function leaveBattlesRoom(uid) {
    if (state.battleRoomUid) {
        window.wsPuseher.leave("BattlesRoom." + state.battleRoomUid);
    }
    if (uid) {
        window.wsPuseher.leave("BattlesRoom." + uid);
    }
}

/**
 * 離開列表讀取
 * @param {*} uid
 */
export function leaveBattlesList() {
    window.wsPuseher.leave("BattlesList");
}

//頂部信息處理
function headerInfoNotifyHandle(data) {
    // console.log(data.data, 'websocket');
    const headerInfo = useHeaderInfosStore();
    if (data && data.data) {
        //數據存在
        if (data.data.online_player) {
            //更新在線玩家數量
            headerInfo.setOnlinePlayer(data.data.online_player);
        }
        if (data.data.users_count) {
            //更新在玩家總數
            headerInfo.setUsersCount(data.data.users_count);
        }
        if (data.data.battles_count) {
            //更新戰鬥數量
            headerInfo.setBattlesCount(data.data.battles_count);
        }
        if (data.data.upgrades_count) {
            //更新升級數量
            headerInfo.setUpgradesCount(data.data.upgrades_count);
        }
        if (data.data.blind_boxes_count) {
            //更新開箱數量
            headerInfo.setBlindBoxesCount(data.data.blind_boxes_count);
        }
        if (data.data.new_drops) {
            //新掉落
            headerInfo.addLiveDrop(data.data.new_drops);
        }
    }
}

//玩家信息處理
function playerNotificationHandle(data) {
    const player = usePlayerStore();
    if (data && data.data) {
        data.data = JSON.parse(data.data);

        if (typeof data.data.amount != "undefined") {
            player.setAmount(data.data.amount);
        }
        if (typeof data.data.bag_amount != "undefined") {
            player.setBagAmount(data.data.bag_amount);
        }
        console.log(data.data.aaa);
        if (data.data.first_use_promo_code) {
            player.setInviteType(null);
            player.setRechargeGift(null);
        }
    }
}

/**
 * 战斗列表通知
 */
function battlesListNotify() {
    const battleStore = useBattleStore();
    window.wsPuseher
        .channel("BattlesList")
        .listen("BattlesListNotificationEvent", (e) => {
            console.log([e], "BattlesList");

            if (e.type) {
                const data = JSON.parse(e.data);
                console.log([data], "BattlesList-oooo");
                if (e.code == 1) {
                    battlesNotifyHandle(e.type || "", data);
                } else if (e.msg) {
                    gp.$baseMessage(e.msg, "error");
                }
            } else {
                const res = JSON.parse(e.data);
                console.log([res], "BattlesList");

                if (res.code == 1 && res.type === "battleList") {
                    // 讀取戰鬥列表
                    battleStore.setRoomList(res.data);
                    state.battleListResolve();
                }
            }
        });
    window.wsPuseher.connector.pusher.send_event("battles", {
        join: {room: "list", userId: 213123},
    });
}

/**
 * 戰鬥房間通知
 */
function battlesRoomNotify() {
    if (!state.battleRoomUid) return;
    const battleRoomStore = useBattleRoomStore();
    console.log("BattlesRoom." + state.battleRoomUid);
    window.wsPuseher
        .channel("BattlesRoom." + state.battleRoomUid)
        .listen("BattlesRoomNotificationEvent", (e) => {
            console.log([e], "BattlesRoom ");
            if (e.type) {
                const data = JSON.parse(e.data);
                console.log([data], "BattlesRoom-aaaa");

                battlesRoomNotifyHandle(e.type || "", data, state.battleRoomUid);
            } else {
                const res = JSON.parse(e.data);
                console.log([res], "BattlesRoom123123");

                if (res.type === "battleShow") {
                    // 讀取戰鬥列表
                    if (res.code == 1) {
                        battleRoomStore.setBaseData(res.data);
                        state.battleRoomResolve();
                    } else {
                        gp.$baseMessage(res.msg, "error");
                        state.battleRoomReject();
                    }
                }
            }
        });
    window.wsPuseher.connector.pusher.send_event("battles", {
        viewBattle: state.battleRoomUid,
    });
}

/**
 * 處理戰鬥通知
 * @param {*} type 類型
 * @param {*} data 數據
 * @returns
 */
function battlesNotifyHandle(type, data) {
    const battleStore = useBattleStore();
    const battleRoomStore = useBattleRoomStore();
    console.log(type, data, 15611451);
    const types = {
        // 創建房間
        battleCreated: function () {
            return battleStore.insertRoom(data);
        },
        // 刪除房間
        battleIsEmpty: function () {
            return battleStore.removeRoom(data);
        },
        // 房間結束
        battleFinished: function () {
            return battleStore.removeRoom(data);
        },
        // 更新房間信息
        updateBattleData: function () {
            return battleStore.updateRoom(data.data);
        },
        // 玩家加入房間
        battleUserJoined: function () {
            battleRoomStore.joinUser(data.data);
            // return battleStore.removeRoom(data);
        },
        // 玩家離開房間
        battleUserLeaved: function () {
            // return battleStore.removeRoom(data);
        },
    };
    if (typeof types[type] !== "function") {
        return false;
    }
    return types[type]();
}

/**
 * 處理戰鬥房間通知
 * @param {*} type 類型
 * @param {*} data 數據
 * @returns
 */
function battlesRoomNotifyHandle(type, data, uid) {
    const battleRoomStore = useBattleRoomStore();
    console.log(type, data, 58588848);
    const types = {
        // 讀取房間信息
        battleShow: function () {
            return battleRoomStore.setBaseData(data.data);
        },
        // 房間清空
        battleIsEmpty: function () {
            window.dispatchEvent(new CustomEvent("battleIsEmpty-" + uid));

            return;
        },
        // 更新房間信息
        updateRoomData: function () {
            return battleRoomStore.setBaseData(data.data);
        },
        // 更新房間信息
        battlePlaying: function () {
            console.log("battlePlaying-" + uid, "213213");
            window.dispatchEvent(
                new CustomEvent("battlePlaying-" + uid, {
                    detail: data,
                })
            );
            // return battleRoomStore.setBaseData(data.data);
        },
        // battle完成
        battleFinished: function () {
            window.dispatchEvent(
                new CustomEvent("battleFinished-" + uid, {
                    detail: data,
                })
            );
            // return battleRoomStore.setBaseData(data.data);
        },
    };
    if (typeof types[type] !== "function") {
        return false;
    }
    return types[type]();
}

// 初始化通知
function _initNotify() {
    if (state.needBattleList) {
        battlesListNotify();
    }
    console.log(state.needBattleRoom, 8888888888888888);
    if (state.needBattleRoom) {
        battlesRoomNotify();
    }
}
