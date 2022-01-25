/**
 * 這個文件是程序的配置文件，如有需要可在此處更改内容
 */


/**
 * 引號前為索引值，name后的名稱爲顯示在下拉選單中的名稱
 * sub中的項目將在選擇文獻類型后顯示
 */
var 徵引書目類型 = {
    "論文": {name: "論文", sub: {
        "期刊": {name: "期刊"}, 
        "報章": {name: "報章"}, 
        "論文集": {name: "論文集"}, 
    }}, 
    "高級學位論文": {name: "高級學位論文", sub: {}}, 
    "今版書籍": {name: "今版書籍", sub: {}}, 
    "古版書籍": {name: "古版書籍", sub: {}}, 
}; 
class CatSub {
    constructor(category="", subcategory="") {
        this.category = category; 
        this.subcategory = subcategory;
    }
}

var 徵引書目類型反查 = {
    "JournalEssayRef": new CatSub("論文", "期刊"), 
    "NewspaperEssayRef": new CatSub("論文", "報章"), 
    "CollectionEssayRef": new CatSub("論文", "論文集"), 
    "ThesisRef": new CatSub("高級學位論文", ""), 
    "TodayBookRef": new CatSub("今版書籍", ""), 
    "OldBookRef": new CatSub("古版書籍", ""), 
}


/**
 * 引號前為索引值兼上傳值，將被填入reference中，name后的名稱僅爲顯示在下拉選單中的名稱
 */
var 學段表 = {
    "": {name: "無"}, 
    "本科": {name: "本科"},
    "碩士": {name: "碩士"},
    "博士": {name: "博士"},
}

var 編校選字表 = {
    "": {name: "無"}, 
    "編": {name: "編"}, 
    "校": {name: "校"},
    "點校": {name: "點校"}, 
    "監修": {name: "監修"}, 
}


var 字符映射 = {
    選擇是否添加_等_字処顯示的信息: "以某某某等顯示",
    等: "等" , 
}

var signs = {
    單書名號: {
        左: "〈", 
        右: "〉"
    }, 
    雙書名號: {
        左: "《", 
        右: "》"
    }, 
    圓括號: {
        左: "（", 
        右: "）"
    }, 
    行文符號: {
        逗號: "，", 
        句號: "。", 
        冒號: "：", 
        短橫綫: "—", 
        頓號: "、"
    }
}; 