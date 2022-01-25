/**
 * 注釋輸出模板
 */
{
    var 頁碼模板 = {
        data: signs.行文符號.短橫綫, 
        left: {
            data: "{起始頁}", 
            left: {}, 
            right: {}, 
            preOr: "", 
            postOr: ""
        }, 
        right: {
            data: "{結束頁}", 
            left: {}, 
            right: {}, 
            preOr: "", 
            postOr: ""
        }, 
        preOr: "頁", 
        postOr: ""
    }; 
    var 卷文模板 = {
        data: signs.行文符號.逗號, 
        left: {
            data: "{卷}", 
            left: {}, 
            right: {}, 
            preOr: "", 
            postOr: ""
        }, 
        right: {
            data: "{文章名稱}", 
            left: {}, 
            right: {}, 
            preOr: signs.單書名號.左, 
            postOr: signs.單書名號.右
        }, 
        preOr: "", 
        postOr: ""
    }; 
    var 注釋輸出模板 = {
        data: signs.行文符號.逗號, 
        left: 卷文模板, 
        right: 頁碼模板, 
        preOr: "", 
        postOr: ""
    }

}

/**
 * 頁碼輸出模板
 */
 {
    var 頁碼輸出模板 = {
        data: signs.行文符號.短橫綫, 
        left: {
            data: "{起始頁}", 
            left: {}, 
            right: {}, 
            preOr: "", 
            postOr: ""
        }, 
        right: {
            data: "{結束頁}", 
            left: {}, 
            right: {}, 
            preOr: "", 
            postOr: ""
        }, 
        preOr: "頁", 
        postOr: ""
    }; 
}


/**
 * 文章引用頭輸出模板
 * 即
 * 作者：<文章>部分
 */
{
    var 作者 = {
        data: "{作者}", 
        left: {}, 
        right: {}, 
        preOr: "", 
        postOr: ""
    }

    var 作品 = {
        data: "{作品}", 
        left: {}, 
        right: {}, 
        preOr: signs.單書名號.左, 
        postOr: signs.單書名號.右
    }

    var 文章引用頭輸出模板 = {
        data: signs.行文符號.冒號, 
        left: 作者, 
        right: 作品, 
        preOr: "", 
        postOr: ""
    }
}


/**
 * 通用模板打印
 */
function printTemplate(template, outputFormatter) {
    var cloneTemplate = JSON.parse(JSON.stringify(template));
    var 填充 = fill(cloneTemplate, outputFormatter); 
    tidyUp(填充); 
    var outprint = printTree(填充); 
    return outprint; 
}