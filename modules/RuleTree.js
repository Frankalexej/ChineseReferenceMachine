/**
 * 樹結構及結構示例
 * 模板樹需要手動搭建，後期可以支持前端gui修改模板樹
 */
class RuleTree {
    constructor(data="", left={}, right={}, preOr="", postOr="") {
        this.data = data; 
        this.right = right; 
        this.left = left; 
        this.preOr = preOr; 
        this.postOr = postOr; 
    }
}

var 括號内 = {
    data: "，", 
    left: {
        data: "：", 
        left: {
            data: "{出版地}", 
            left: {}, 
            right: {}, 
            preOr: "", 
            postOr: ""
        }, 
        right: {
            data: "{出版社}", 
            left: {}, 
            right: {}, 
            preOr: "", 
            postOr: ""
        }, 
        preOr: "", 
        postOr: ""
    }, 
    right: {
        data: "{年}", 
        left: {}, 
        right: {}, 
        preOr: "", 
        postOr: ""
    }, 
    preOr: "（", 
    postOr: "）"
}

var 括號前 = {
    data: "：", 
    left: {
        data: "{作者}", 
        left: {}, 
        right: {}, 
        preOr: "", 
        postOr: ""
    }, 
    right: {
        data: "{作品}", 
        left: {}, 
        right: {}, 
        preOr: "《", 
        postOr: "》"
    }, 
    preOr: "", 
    postOr: ""
}
var 模板 = {
    data: "", 
    left: 括號前, 
    right: 括號内, 
    preOr: "", 
    postOr: ""
}

/**
 * 處理函數
 * 
 */

function treeIsNone(value) {
    if (value == null || value == undefined) {
        return true; 
    } else if (value == "") {
        return true; 
    } else if (JSON.stringify(value) == "{}") {
        // console.log("EmptyObj! ")
        return true; 
    } else {
        return false; 
    }
}

function tidyUp(ruleTree) { // return if self is empty
    // console.log(ruleTree); 
    if (treeIsNone(ruleTree)) {
        console.log("有問題！")
        // should be impossible
        return true; 
    } else if (treeIsNone(ruleTree.left) && treeIsNone(ruleTree.right)) {
        ruleTree.empty = treeIsNone(ruleTree.data); 
        ruleTree.preOr = ruleTree.empty ? "": ruleTree.preOr; 
        ruleTree.postOr = ruleTree.empty ? "": ruleTree.postOr;  
        return true; 
    } else {
        let leftChild = ruleTree.left; 
        let rightChild = ruleTree.right; 
        tidyUp(leftChild); 
        tidyUp(rightChild); 
        if (leftChild.empty || rightChild.empty) {
            ruleTree.data = ""; 
        }
        if (leftChild.empty && rightChild.empty) {
            ruleTree.empty = true; 
            ruleTree.preOr = ""; 
            ruleTree.postOr = ""; 
        }
    }
}

function printTree(ruleTree) {
    // console.log(ruleTree); 
    if (treeIsNone(ruleTree)) {
        return ""; 
    }
    var output = ""; 
    output += ruleTree.preOr; 
    output += printTree(ruleTree.left); 
    output += ruleTree.data; 
    output += printTree(ruleTree.right); 
    output += ruleTree.postOr; 
    return output; 
}

function fill(ruleTree, content) {
    return JSON.parse(JSON.stringify(ruleTree).format(content)); 
}

/**
 * 流程示例
 * 
 */

// var 内容 = {"作者": " 張廷玉等", "作品": "明史", "出版地": "北京", "出版社": "中華書局", "年": "1959年"}; 
// var 填充 = fill(模板, 内容); 
// tidyUp(填充); 
// var outprint = printTree(填充); 
// console.log(outprint);