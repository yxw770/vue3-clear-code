/**
 * Author:  Godfrey
 * Date:    25/2/2023
 * Time:    16:46
 * Email:   yxw770@gmail.com
 * Class auth.js
 * @package
 */
import request from "@/utils/request";
export function getSteamLoginUrl() {
    return request({
        url: "/auth/steamLogin",
        method: "get",
    });
}
export function refreshToken(data) {
    return request({
        url: "/auth/refresh",
        method: "post",
        data,
    });
}
export function logout(player_id) {
    return request({
        url: "/auth/player/logout?player_id=" + player_id,
        method: "get",
    });
}


export function loginOfPassword(data) {
    return request({
        url: "/auth/loginOfPassword",
        method: "post",
        data
    });
}
export function registerByEmail(data) {
    return request({
        url: "/auth/registerByEmail",
        method: "post",
        data
    });
}
export function sendVerifyCode(data) {
    return request({
        url: "/auth/sendVerifyCode",
        method: "post",
        data
    });
}
export function sendVerifyCode2(data) {
    return request({
        url: "/auth/sendVerifyCode",
        method: "post",
        data
    });
}