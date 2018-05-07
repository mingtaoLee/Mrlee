var proxyTable = {
    '/api': {
        // target: 'http://10.73.19.125:8080',//廖韧
        // target: 'http://10.73.15.116:8080',//思瑞
        // target: 'http://10.73.17.52:8080',//谢成
        // target: 'http://10.73.22.111:8080',//科位
        // target: 'http://10.73.15.116:8080',//思瑞
        // target: 'http://10.73.17.61:8080',//祥林
        // target: 'http://10.73.46.177:8080',//振宇
        // target: 'http://10.73.10.63:8080',//文池
        target: 'http://10.16.85.143:8080',
        changeOrigin: true,
        pathRewrite: {
            '/api': '/yh/ihr/api'
            //  '/api': '/'
        }
    }
}



// var proxyTable = {
//     '/api': {
//         target: 'http://10.16.85.135:8080',
//         changeOrigin: true,
//         pathRewrite: {
//             '/api': '/api'
//         }
//     }
// }

module.exports = proxyTable
