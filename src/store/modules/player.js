import {
    getToken,
    removeToken,
    setToken,
    getRefreshStatus,
    setRefreshStatus,
} from "@/utils/token";
import {isArray, isString} from "@/utils/validate";
import {useAclStore} from "./acl";
import {resetRouter} from "@/router";
import {gp} from "@gp";
import {getUserInfo, setPromoCode} from "@/api/player";
import {getItem, removeItem, setItem} from "@/utils/storage";
import {parseNumber} from "@/utils";
import { hasLoginInit } from "@vab/plugins/websockets";
export const usePlayerStore = defineStore("player", {
    state: () => ({
        token: getToken(),
        refreshStatus: getRefreshStatus(),
        player_id: getItem("player_player_id") || 0,
        init: getItem("player_init") || true,
        steamid: getItem("player_steamid") || "",
        email: getItem("player_email") || "",
        nick_name: getItem("player_nick_name") || "",
        amount: getItem("player_amount") || 0,
        bag_amount: getItem("player_bag_amount") || 0,
        profile_avatar_url:
            getItem("player_profile_avatar_url") ||
            "https://i.gtimg.cn/club/item/face/img/2/15922_100.gif",
        promo_code: getItem("player_promo_code") || null,
        invite_type: getItem("player_invite_type") || null,
        recharge_gift: getItem("player_recharge_gift") || null,
        trade_url: getItem("player_trade_url") || null,
        backpack_visible: getItem("backpack_visible") || null,
        is_refresh_token: false,
    }),
    getters: {
        getToken: (state) => state.token,
        getSteamid: (state) => state.steamid,
        getEmail: (state) => state.email,
        getNickName: (state) => state.nick_name,
        getAmount: (state) => state.amount,
        getBagAmount: (state) => state.bag_amount,
        getProfileAvatarUrl: (state) => state.profile_avatar_url,
        getPromoCode: (state) => state.promo_code,
        getInviteType: (state) => state.invite_type,
        getRechargeGift: (state) => state.recharge_gift,
        getTradeUrl: (state) => state.trade_url,
        getBackpackVisible: (state) => state.backpack_visible,
        getIsRefreshToken: (state) => state.is_refresh_token,
        getInit: (state) => state.init,
    },
    actions: {
        setIsRefreshToken(data) {
            setRefreshStatus(data);
        },
        /**
         * @description ??????token
         * @param {*} token
         */
        setToken(token) {
            this.token = token;
            if (token != null && token != "null") {
                try {
                    let player_data = decodeURIComponent(
                        encodeURIComponent(window.atob(token.split(".")[1]))
                    );
                    let player_id = JSON.parse(player_data).sub;

                    this.player_id = player_id;
                    setItem("player_player_id", player_id);
                } catch (e) {
                    this.player_id = 0;
                    setItem("player_player_id", 0);
                }
            } else {
                this.player_id = 0;
                setItem("player_player_id", 0);
            }

            setToken(token);
        },

        /**
         * @description ??????steamid
         * @param {*} steamid
         */
        setSteamid(steamid) {
            this.steamid = steamid;
            setItem("player_steamid", steamid);
        },
        /**
         * @description ??????email
         * @param {*} email
         */
        setEmail(email) {
            this.email = email;
            setItem("player_email", email);
        },
        setInit(init) {
            this.init = init;
            setItem("player_init", init);
        },
        /**
         * @description ??????????????????
         * @param {*} amount
         */
        setAmount(amount) {
            amount = parseNumber(amount)
            setItem("player_amount", amount);
            this.amount = amount;
        },
        /**
         * @description ????????????
         * @param {*} nick_name
         */
        setNickName(nick_name) {
            setItem("player_nick_name", nick_name);

            this.nick_name = nick_name;
        },
        /**
         * @description ?????????????????????
         * @param {*} bag_amount
         */
        setBagAmount(bag_amount) {
            bag_amount = parseNumber(bag_amount)
            setItem("player_bag_amount", bag_amount);
            this.bag_amount = bag_amount;
        },
        /**
         * @description ??????????????????
         * @param {*} profile_avatar_url
         */
        setProfileAvatarUrl(profile_avatar_url) {
            setItem("player_profile_avatar_url", profile_avatar_url);

            this.profile_avatar_url = profile_avatar_url;
        },
        /**
         * ???????????????
         * @param {*} profile_avatar_url
         */
        setPromoCode(promo_code) {
            setItem("player_promo_code", promo_code);

            this.promo_code = promo_code;
        },
        /**
         * ??????????????????
         * @param {*} profile_avatar_url
         */
        setRechargeGift(recharge_gift) {
            setItem("player_recharge_gift", recharge_gift);

            this.recharge_gift = recharge_gift;
        },
        /**
         * ???????????????????????? 1??????????????????  2???????????????
         * @param {*} profile_avatar_url
         */
        setInviteType(invite_type) {
            setItem("player_invite_type", invite_type);

            this.invite_type = invite_type;
        },
        /**
         * ??????????????????
         * @param {*} trade_url
         */
        setTradeUrl(trade_url) {
            setItem("player_trade_url", trade_url);
            this.trade_url = trade_url;
        },
        /**
         * ????????????????????????
         * @param {*} backpack_visible
         */
        setBackpackVisibility(backpack_visible) {
            setItem("backpack_visible", backpack_visible);
            this.backpack_visible = backpack_visible;
        },

        /**
         * @description ??????????????????????????????????????????
         */
        // setVirtualRoles() {
        //   const aclStore = useAclStore();
        //   aclStore.setFull(true);
        //   this.setUsername("player(??????????????????)");
        //   this.setAvatar("https://i.gtimg.cn/club/item/face/img/2/15922_100.gif");
        // },
        /**
         * @description ??????token???????????????
         * @param {string} token ????????????
         * @param {string} tokenName ????????????
         */
        afterLogin(token, tokenName) {
            if (token) {
                // eslint-disable-next-line no-unused-vars
                this.setToken(token);
            } else {
                const err = `????????????????????????????????????${tokenName}...`;
                gp.$baseMessage(err, "error");
                throw err;
            }
        },
        /**
         * @description ??????
         * @param {*} userInfo
         */
        async login(userInfo) {
            const {
                data: {[tokenName]: token},
            } = await login(userInfo);
            this.afterLogin(token, tokenName);
        },
        /**
         * @description ???????????????
         * @param {*} tokenData
         */
        async socialLogin(tokenData) {
            const {
                data: {[tokenName]: token},
            } = await socialLogin(tokenData);
            this.afterLogin(token, tokenName);
        },

        /**
         * @description ???????????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
         * @returns
         */
        async getUserInfo() {
            const obj = await getUserInfo();
            if (!obj || obj == {}) {
                return;
            }
            const {
                data: {
                    steamid,
                    email,
                    nick_name,
                    profile_avatar_url,
                    amount,
                    bag_amount,
                    roles,
                    trade_url,
                },
            } = obj;
            this.setInit(false);
            // const obj= await getUserInfo();
            // const {
            //   data: { username, avatar, roles },
            // } = {
            //   data: {
            //     username: "guest",
            //     avatar: "www.baidu.com",
            //     roles: ["Admin"],
            //   },
            // };
            // console.log(roles, 88888);
            /**
             * ???????????????????????????????????????????????????????????????????????????,??????,Roles???Permissions
             * username {String}
             * avatar {String}
             * roles {List}
             * ability {List}
             */
            if (
                (steamid && !isString(steamid)) ||
                (email && !isString(email)) ||
                (nick_name && !isString(nick_name)) ||
                (profile_avatar_url && !isString(profile_avatar_url)) ||
                (roles && !isArray(roles))
            ) {
                const err = "?????????????????????";
                gp.$baseMessage(err, "error");
                throw err;
            } else {
                const aclStore = useAclStore();
                if (steamid) this.setSteamid(steamid);
                if (email) this.setEmail(email);
                if (nick_name) this.setNickName(nick_name);
                if (profile_avatar_url) this.setProfileAvatarUrl(profile_avatar_url);
                if (amount) this.setAmount(amount);
                if (trade_url) this.setTradeUrl(trade_url);
                if (bag_amount) this.setBagAmount(bag_amount);
                if (obj.data.promo_code) {
                    this.setPromoCode(obj.data.promo_code);
                } else {
                    this.setPromoCode(null);
                }
                if (obj.data.recharge_gift)
                    this.setRechargeGift(obj.data.recharge_gift);
                if (obj.data.invite_type && obj.data.invite_type > 0) {
                    this.setInviteType(obj.data.invite_type);
                } else {
                    this.setInviteType(null);
                    this.setRechargeGift(null);
                }

                if (typeof obj.data.backpack_visible != "undefined")
                    this.setBackpackVisibility(obj.data.backpack_visible);

                if (roles) aclStore.setRole(roles);
                let promo_code = getItem("promoCode", "sessionStorage");

                if (promo_code) {
                    removeItem("promoCode", "sessionStorage");

                    if (this.promo_code == null || this.promo_code == "") {
                        //?????????
                        try {
                            let result = await setPromoCode({promo_code: promo_code});
                            if (result.code == 1) {
                                this.setPromoCode(promo_code);
                                this.getUserInfo();
                            }
                        } catch (e) {
                            //
                        }
                    }
                }
            }

            hasLoginInit();
        },
        /**
         * @description ????????????
         */
        async logout() {
            await logout();
            await this.resetAll();
        },
        /**
         * @description ??????token???roles???permission???router???tabsBar???
         */
        async resetAll() {
            if (this.token){
                this.setToken(null);
                this.setAmount(-1);
                this.setBagAmount(-1);
                this.setEmail(null);
                this.setNickName("");
                this.setProfileAvatarUrl("");
                this.setSteamid("");

                const aclStore = useAclStore();
                aclStore.setFull(false);
                aclStore.setRole([]);
                aclStore.setPermission([]);
                await resetRouter();
                removeToken();
                window.location.reload();

            }

        },
    },
});
