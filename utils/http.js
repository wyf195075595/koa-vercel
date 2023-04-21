const axios = require('axios');
class HttpRequest {
    constructor() {
        this.baseURL = 'https://www.fastmock.site'
        this.timeout = 15000
        this.queue = 0 // 请求队列
        this.cache = []
    }
    setInterceptor(instance, url) {
        instance.interceptors.request.use((config)=> {
            // 开启 loading
            if(!this.queue) {
                // open loading
                // context.$bus.emit('showLoading')
            }

            // 统一增加token
            // const token = store.getters['user/token']
            config.headers['token'] = 'tokentest'

            // 记录请求的取消函数
            let CancelToken =  axios.CancelToken
            config.cancelToken = new CancelToken((c)=> { // 存入 vux,组件销毁时执行
                // c 就是取消请求的token
                this.cache.push(c)
            })
            this.queue++

            return config
        }, (err)=> {
            // 响应就从队列删除 
            this.queue--
            if(this.queue == 0) {
                // close loading
                context.$bus.emit('closeLoading')
            }
            // this.$message.error(err);

            return Promise.reject(err)
        })
        instance.interceptors.response.use((res)=> {
            this.queue--
            if(this.queue == 0) {
                // close loading
                // context.$bus.emit('closeLoading')
                // console.log('关闭 loading');
            }
            // 这里判断要依据后端返回格式而定
            if(res.data.code == 200) {
                return res.data
            } else {
                return Promise.reject(res.msg)
            }
        }, (err)=> {
            this.queue--
            if(this.queue == 0) {
                // close loading
                // context.$bus.emit('closeLoading')
            }
            // this.$message.error(err);
            return Promise.reject(err)
        })
    }
    request(options) {
        let instance = axios.create()
        let config = {
            baseURL: this.baseURL,
            timeout: this.timeout,
            // validateStatus: function (status) {
            //     console.log('当前请求状态:', status);
            //     return status >= 200 && status < 300; // default
            // },
            ...options
        }
        this.setInterceptor(instance, config.url)
        return instance(config) // 返回 promise 对象
    }
    get(url, data) {
        return this.request({
            url,
            method: 'get',
            params: data
        })
    }
    post(url, data, config = {}) {
        return this.request({
            url,
            method: 'post',
            data,
            ...config
        })
    }
}
module.exports = new HttpRequest