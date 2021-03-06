var fs = require('fs')
var fetch = require('node-fetch')
var service = require('./jfwService')
var path = require('path')

function configFromDb(configrc) {
    service('JFWCONFIG', 'getConfig', configrc)
        .then(function (res) {
            writeProperties(configrc.config_map, res.result)
        })
}

function writeProperties(configMap, data) {
    for (var groupName in configMap) {
        var filePath = configMap[groupName]
        var configDetail = data[groupName]
        writeOneProperties(filePath, configDetail, groupName)
    }
}

function writeOneProperties(filePath, configDetail, groupName) {
    fs.writeFile(path.join(__dirname, filePath), getConfigDetailText(configDetail), function (err) {
        if (err) throw err
        var tips = `配置${groupName}.properties成功`
        console.log(tips);
    })
}

function getConfigDetailText(configDetail) {
    var text = ``
    for (var line of configDetail) {
        text = `${text} \n#${line.description} \n${line.key}=${line.value}`
    }
    return text
}

module.exports = configFromDb