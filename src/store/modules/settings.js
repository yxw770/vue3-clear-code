import {isJson} from "@/utils/validate";
// import { language as _language } from "@/config";
import {getItem, setItem} from "~/src/utils/storage";
import {getWebsiteSettings, getWebsiteSettingsVersion} from "@/api/website";
import {gp} from "@vab/plugins/gp";
import {translate} from "@/i18n";
import {settings} from "@/config";

const getLocalStorage = (key) => {
    const value = getItem("setting_" + key);
    return value && isJson(value) ? JSON.parse(value)[key] : false;
};
const language = getLocalStorage("language") || settings.language;

// 配置项键值对
const key = [
    {
        // 更新时间戳
        key: 'version_timestamp',
        default: 0,
    },
    {
        // 网站标题
        key: 'title',
        default: 'csgo blind box - godfrey(yxw770@gmail.com)'
    },
    {
// 网站seo标题
        key: 'seo_title',
        default: 'csgo blind box'
    },
    {
        // 网站名称
        key: 'application_name',
        default: ''
    },
    {
        // 网站图标
        key: 'icon_32',
        default: ''
    },
    {
        // 网站图标
        key: 'logo',
        default: ''
    },
    {
        // 导航栏图标
        key: 'menu_logo',
        default: ''
    },
    {
        // 盲盒開箱範圍數量返回
        key: 'open_blind_box_count_range',
        default: ''
    },
    {
        // 升級物品最大價差
        key: 'upgrade_max_spread',
        default: ''
    },
    {
        // 升級物品最大概率
        key: 'upgrade_max_winning_rate',
        default: null
    },
    {
        // 升級物品倍率
        key: 'upgrade_price_ratio',
        default: null
    },
    {
        // 文件下載地址集合
        key: 'storage_download_urls',
        default: ''
    },
    {
        // 文件下載地址
        key: 'storage_download_url',
        default: ''
    },
    {
        // 文件下載地址測ping
        key: 'storage_download_ping_test',
        default: ''
    },
    {
        // ROLL房最大物品數量
        key: 'roll_max_items',
        default: ''
    },
    {
        // ROLL房創建最低充值金額
        key: 'roll_create_min_recharge',
        default: ''
    },
    {
        // 聯繫郵箱
        key: 'email',
        default: ''
    },
    {
        // 公司地址
        key: 'location',
        default: ''
    },
    {
        // 版權
        key: 'copyright',
        default: ''
    },
    {
        // 竞技场音乐合集
        key: 'music_battle_group',
        default: {}
    }

];

export const useSettingsStore = defineStore("settings", {
    state: () => {
        let obj = {};
        key.forEach((item) => {
            obj[item.key] = getLocalStorage(item.key) || item.default;
        });
        return {
            language,
            ...obj
        }
    },
    /** */
    getters: {
        getLanguage: (state) => state.language,
        getVersionTimestamp: (state) => state.version_timestamp,
        getTitle: (state) => state.title,
        getSeoTitle: (state) => state.seo_title,
        getApplicationname: (state) => state.application_name,
        getIcon32: (state) => state.icon_32,
        getLogo: (state) => state.logo,
        getMenuLogo: (state) => state.menu_logo,
        getEmail: (state) => state.email,
        getLocation: (state) => state.location,
        getCopyright: (state) => state.copyright,
        getOpenblindbboxcountrange: (state) => state.open_blind_bbox_count_range,
        getUpgrademaxspread: (state) => state.upgrade_max_spread,
        getUpgrademaxwinningrate: (state) => state.upgrade_max_winning_rate,
        getUpgradepriceratio: (state) => state.upgrade_price_ratio,
        getStorageDownloadUrl: (state) => state.storage_download_url,
        getStorageDownloadUrls: (state) => state.storage_download_urls,
        getStorageDownloadPingTest: (state) => state.storage_download_ping_test,
        getRollMaxItems: (state) => state.roll_max_items,
        getRollCreateMinRecharge: (state) => state.roll_create_min_recharge,
        getMusicBattleGroup: (state) => state.music_battle_group,
    },
    actions: {
        updateState(obj) {
            Object.getOwnPropertyNames(obj).forEach((key) => {
                this[key] = obj[key];
                setItem(
                    "setting_" + key,
                    typeof obj[key] == "string"
                        ? `{"${key}":"${obj[key]}"}`
                        : typeof obj[key] == "object"
                            ? `{"${key}":` + JSON.stringify(obj[key]) + `}`
                            : `{"${key}":${obj[key]}}`
                );
            });
        },
        /**
         * 改變語言
         * @param language
         */
        changeLanguage(language) {
            this.updateState({language});
        },
        /**
         * 獲取網站設定信息
         * @param failReload 是否失敗重試
         * @returns {Promise<void>}
         */
        async getWebsiteSettings(failReload = false) {
            const obj = await getWebsiteSettingsVersion(failReload);
            if (!obj || obj === {}) {
                gp.$baseMessage(translate("網站版本信息獲取失敗，請刷新重試"), "error");
                return;
            }
            const {
                data: {
                    version
                },
            } = obj;
            if (parseInt(version) !== this.version_timestamp) {
                //版本修改，更新網站設定信息
                const obj1 = await getWebsiteSettings(failReload);
                console.log(obj1, 9999999)
                if (!obj1 || obj1 === {}) {
                    gp.$baseMessage(translate("網站設定信息獲取失敗，請刷新重試"), "error");
                    return;
                }
                obj1.version_timestamp = version
                obj1.storage_download_url = obj1.storage_download_urls[0]
                this.updateState(obj1)
            }
        },
        /**
         * 找到最低延遲的文件下載地址
         * @returns {Promise<void>}
         */
        async selectDownloadUrl() {
            let storage_download_ping_test = Object.values(this.storage_download_ping_test)
            let ping_download_urls = Array();
            let finish_count = 0
            if (storage_download_ping_test.length > 1) {
                this.storage_download_url === "" ? this.setStorageDownloadUrl(storage_download_urls[0]) : ""
                for (let i = 0; i < storage_download_ping_test.length; i++) {
                    const url = storage_download_ping_test[i];
                    const test = (res) => {
                        finish_count += 1;
                        ping_download_urls.push({
                            url: res[1],
                            ping: res[0]
                        })
                        if (finish_count >= storage_download_ping_test.length) {
                            this.findLowPingUrl(ping_download_urls)
                        }
                    }
                    await gp.$pingTest(url)
                        .then(test).catch(() => {
                            // console.log(ping_download_urls, 'test1', finish_count)
                        });
                }
            } else {
                this.setStorageDownloadUrl(this.storage_download_urls[0])
            }

        },
        /**
         * 设置最低延迟的文件下载地址
         * @param url
         */
        setStorageDownloadUrl(url) {
            this.storage_download_url = url
            let website_config = getItem("website_config");
            website_config = JSON.parse(website_config)
            website_config.storage_download_url = this.storage_download_url;
            setItem("website_config", JSON.stringify(website_config))
        },
        /**
         * 找到最低延遲的文件下載地址
         * @param ping_download_urls
         */
        findLowPingUrl(ping_download_urls) {
            let min_ping = 9999
            ping_download_urls.forEach((item) => {
                if (item.ping <= min_ping) {
                    min_ping = item.ping
                    // console.log([item.url, item.ping, 8888])
                    this.storage_download_urls.forEach(element => {
                        var reg = new RegExp('(http|https)://[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\\.?', 'g');
                        var ret = reg.exec(element)
                        if (ret == null) {
                            return;
                        }
                        if (item.url.indexOf(ret[0]) !== -1) {
                            this.setStorageDownloadUrl(element)
                        }
                    });
                }
            })

        },
    },


});
