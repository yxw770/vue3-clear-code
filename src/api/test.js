/**
 * Author:  Godfrey
 * Date:    25/2/2023
 * Time:    16:42
 * Email:   yxw770@gmail.com
 * Class test.js
 * @package
 */
import request from '@/utils/request'

export function getList(params=[]) {
    return request({
        url: '/player/info',
        method: 'get',
        params,
    })
}