const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);

/**
 * 輔助功能定義區
*/
function isNone(value) {
    if (value == null || value == undefined) {
        return true; 
    } else if (value == "") {
        return true; 
    } else {
        return false; 
    }
}

function isNotNone(value) {
    return !isNone(value); 
}

function isNotMatch(value, matcher) {
    return !matcher.test(value); 
}

/**
 * 數據儲存類定義區
 */

class Reconstructor {
    constructor() {
        var classmap = {
            'FootNote': FootNote, 
            'BaseRef': BaseRef, 
            'EssayRef': EssayRef, 
            'JournalEssayRef': JournalEssayRef, 
            'NewspaperEssayRef': NewspaperEssayRef, 
            'CollectionEssayRef': CollectionEssayRef, 
            'ThesisRef': ThesisRef, 
            'TodayBookRef': TodayBookRef, 
            'OldBookRef': OldBookRef, 
            
        }

        this.ClassMap = classmap
        
        // this.classArray = [BaseRef, EssayRef, JournalEssayRef, NewspaperEssayRef, CollectionEssayRef]
        this.classArray = Object.values(classmap); 
    }
}

class FootNote {
    constructor(起始頁="", 結束頁="", 文章名稱="", 卷="") {
        this.type = 'FootNote'; 
        this.起始頁 = 起始頁;
        this.結束頁 = 結束頁;
        this.卷 = 卷; 
        this.文章名稱 = 文章名稱; 
    }; 

    static print(outputFormatter) {
        // var outputFormatter = {
        //     起始頁: this.起始頁, 
        //     結束頁: this.結束頁, 
        //     卷: this.卷, 
        //     文章名稱: this.文章名稱, 
        // }; 
        var 輸出模板 = 注釋輸出模板; 
        var 填充 = fill(輸出模板, outputFormatter); 
        tidyUp(填充); 
        var outprint = printTree(填充); 
        return outprint; 
    }
}

// var test = new FootNote(
//     "2下", "", 
//     "寒松齋兄弟之三．萬布衣斯大", "卷 77"
// ); 
// console.log(test.print()); 

class BaseRef {
    constructor(作者, 作品) {
        this.type = 'BaseRef'; 
        this.作者 = 作者;
        this.作品 = 作品;
        this.注釋 = []; 
    }; 

    print() {
        throw new Error("Method 'print()' must be implemented.");
    }

    printNoPageRef() {
        throw new Error("Method 'print()' must be implemented.");
    }

    printOneFootnote(printedNoPageRef, printedFootnote) {
        var refFootnoteConcatTemplate = {
            data: signs.行文符號.逗號, 
            left: new RuleTree(printedNoPageRef), 
            right: new RuleTree(printedFootnote), 
            preOr: "", 
            postOr: signs.行文符號.句號
        }
        var outputFormatter = {
            去頁碼徵引格式: printedNoPageRef, 
            注釋: printedFootnote, 
        }; 
        var 填充 = fill(refFootnoteConcatTemplate, outputFormatter); 
        tidyUp(填充); 
        var outprint = printTree(填充); 
        return outprint; 
    }

    static printPage(起始頁, 結束頁) {
        var outputFormatter = {
            起始頁: 起始頁, 
            結束頁: 結束頁
        }
        var 輸出模板 = 頁碼輸出模板; 
        return printTemplate(輸出模板, outputFormatter); 
    }

    disassociateAuthors() {
        var disassociated = this.作者.split(signs.行文符號.頓號); 
        this.authors = []
        disassociated.forEach(author => {
            this.authors.push({name: author}); 
        });
    }

    disassociate編者著者() {
        if (this.編者) {
            var disassociated = this.編者.split(signs.行文符號.頓號); 
            this.編者s = []
            disassociated.forEach(author => {
                this.編者s.push({name: author}); 
            });
        } else if (this.著者) {
            var disassociated = this.著者.split(signs.行文符號.頓號); 
            this.著者s = []
            disassociated.forEach(author => {
                this.著者s.push({name: author}); 
            });
        }
    }
}

class EssayRef extends BaseRef {
    constructor(作者, 作品, 集合) {
        super(作者, 作品); 
        this.type = 'EssayRef'; 
        this.集合 = 集合;
    }

    print() {
        // var output = ""; 
        // output = output + this.作者 + signs.行文符號.冒號 + signs.單書名號.左 + this.作品 + 
        // signs.單書名號.右 + signs.行文符號.逗號 + signs.雙書名號.左 + this.集合 + signs.雙書名號.右; 
        // return output; 
    }

    printWithCollection(集合信息) {
        var outputFormatter = {
            作者: this.作者, 
            作品: this.作品, 
        }; 

        var 輸出模板 = 文章引用頭輸出模板;

        var outprint = printTemplate(文章引用頭輸出模板, outputFormatter); 

        var outputFormatter = {}; 
        var 文章引用頭 = outprint; 
        var 輸出模板 = {
            data: signs.行文符號.逗號, 
            left: new RuleTree(文章引用頭), 
            right: new RuleTree(集合信息),  
            preOr: "", 
            postOr: ""
        }

        var outprint = printTemplate(輸出模板, outputFormatter); 
        return outprint; 
    }
}

class JournalEssayRef extends EssayRef {
    constructor(作者, 作品, 集合, 年, 月, 日, 卷, 期, 縂期, 起始頁, 結束頁) {
        super(作者, 作品, 集合); 
        this.type = 'JournalEssayRef'; 
        this.年 = 年;
        this.月 = 月;
        this.日 = 日;
        this.卷 = 卷;
        this.期 = 期;
        this.縂期 = 縂期;
        this.起始頁 = 起始頁;
        this.結束頁 = 結束頁;
    }

    printCollection() {
        var outputFormatter = {
            集合: this.集合
        }; 
        var 輸出模板 = {
            data: "{集合}", 
            left: {}, 
            right: {}, 
            preOr: signs.雙書名號.左, 
            postOr: signs.雙書名號.右
        }
        // console.log(outputFormatter); 
        var 填充 = fill(輸出模板, outputFormatter); 
        tidyUp(填充); 
        var outprint = printTree(填充); 
        // var outprint = "測試"; 
        return outprint; 
    }

    print卷期_年月日(卷期) {
        var outputFormatter = {
            卷期: 卷期, 
            年: this.年, 月: this.月, 日: this.日
        }
        var 輸出模板 = {
            data: "", 
            preOr: "", 
            postOr: "", 
            left: {
                data: "{卷期}", 
                preOr: "", 
                postOr: "", 
                left: {}, 
                right: {}, 
            }, 
            right: {
                data: "", 
                preOr: signs.圓括號.左, 
                postOr: signs.圓括號.右, 
                left: {
                    data: "{年}", 
                    preOr: "", 
                    postOr: "年", 
                    left: {}, 
                    right: {}, 
                }, 
                right: {
                    data: "", 
                    preOr: "", 
                    postOr: "", 
                    left: {
                        data: "{月}", 
                        preOr: "", 
                        postOr: "月", 
                        left: {}, 
                        right: {}, 
                    }, 
                    right: {
                        data: "{日}", 
                        preOr: "", 
                        postOr: "日", 
                        left: {}, 
                        right: {}, 
                    }, 
                }, 
            }, 
        }

        return printTemplate(輸出模板, outputFormatter); 
    }

    printNoPageRef() {
        var collectionPrint = this.printCollection(); 
        var header = super.printWithCollection(collectionPrint); 
        /**
         * header = 論文作者：〈論文名稱〉，《期刊名稱》
        1. 論文作者：〈論文名稱〉，《期刊名稱》，□卷□期（□□年□月），頁□—□。
        2. 論文作者：〈論文名稱〉，《期刊名稱》，□□年□期（□□年□月□日），頁□—□。
        3. 論文作者：〈論文名稱〉，《期刊名稱》，總□□□期（□□年□月□日），頁□—□。
         */

        // 卷期
        var 卷期 = ""; 
        if (!isNone(this.縂期)) {
            // 3
            卷期 = 卷期 + "縂" + this.縂期 + "期"; 
        } else {
            if (!isNone(this.卷)) {
                // 1
                卷期 = 卷期 + this.卷 + "卷"; 
            } else {
                // 2
                卷期 = 卷期 + this.年 + "年"; 
            }
            if (!isNone(this.期)) {
                卷期 = 卷期 + this.期 + "期"; 
            }
        }

        var 卷期_年月日 = this.print卷期_年月日(卷期); 
        var 連接模板 = new RuleTree(signs.行文符號.逗號, new RuleTree(header), new RuleTree(卷期_年月日)); 
        var output = printTemplate(連接模板, {}); 
        return output; 
    }

    print() {
        var noPageRef = this.printNoPageRef(); 
        var page = BaseRef.printPage(this.起始頁, this.結束頁); 
        var 連接模板 = new RuleTree(signs.行文符號.逗號, new RuleTree(noPageRef), new RuleTree(page), "", ""); 
        var output = printTemplate(連接模板, {});
        output += signs.行文符號.句號; 
        return output; 
    }
}

class NewspaperEssayRef extends EssayRef {
    constructor(作者, 作品, 集合, 年, 月, 日, 張, 版, 副刊, 期) {
        super(作者, 作品, 集合); 
        this.type = 'NewspaperEssayRef'; 
        this.年 = 年;
        this.月 = 月;
        this.日 = 日;
        this.張 = 張;
        this.版 = 版;
        this.副刊 = 副刊;
        this.期 = 期;
    }

    printCollection() {
        var outputFormatter = {
            集合: this.集合
        }; 
        var 輸出模板 = {
            data: "{集合}", 
            left: {}, 
            right: {}, 
            preOr: signs.雙書名號.左, 
            postOr: signs.雙書名號.右
        }
        var 填充 = fill(輸出模板, outputFormatter); 
        tidyUp(填充); 
        var outprint = printTree(填充); 
        return outprint; 
    }

    print年月日() {
        var outputFormatter = {
            年: this.年, 月: this.月, 日: this.日
        }
        var 輸出模板 = {
            data: "", 
            preOr: "", 
            postOr: "", 
            left: {
                data: "{年}", 
                preOr: "", 
                postOr: "年", 
                left: {}, 
                right: {}, 
            }, 
            right: {
                data: "", 
                preOr: "", 
                postOr: "", 
                left: {
                    data: "{月}", 
                    preOr: "", 
                    postOr: "月", 
                    left: {}, 
                    right: {}, 
                }, 
                right: {
                    data: "{日}", 
                    preOr: "", 
                    postOr: "日", 
                    left: {}, 
                    right: {}, 
                }, 
            }, 
        }

        return printTemplate(輸出模板, outputFormatter); 
    }

    print張版() {
        var outputFormatter = {
            張: this.張, 版: this.版
        }
        var 輸出模板 = new RuleTree("", new RuleTree("{張}", {}, {}, "", "張"), new RuleTree("{版}", {}, {}, "", "版"))
        return printTemplate(輸出模板, outputFormatter); 
    }

    print副刊期() {
        var outputFormatter = {
            副刊: this.副刊, 期: this.期
        }
        var 輸出模板 = new RuleTree(signs.行文符號.逗號, new RuleTree("{副刊}", {}, {}, signs.單書名號.左, signs.單書名號.右), new RuleTree("{期}", {}, {}, "", "期"))
        return printTemplate(輸出模板, outputFormatter); 
    }

    printNoPageRef() {
        var collectionPrint = this.printCollection(); 
        var header = super.printWithCollection(collectionPrint); 
        /**
        1. 論文作者：〈論文名稱〉，《報章名稱》，□□年□月□日，□張□版。
        2. 論文作者：〈論文名稱〉，《報章名稱》，□□年□月□日，〈副刊名稱〉，□□期，□張□版。
         */

        var 年月日 = this.print年月日(); 
        var 張版 = this.print張版();
        var 副刊期 = this.print副刊期(); 
        var 連接模板 = {
            data: signs.行文符號.逗號, 
            preOr: "", 
            postOr: "", 
            left: new RuleTree(年月日), 
            right: {
                data: signs.行文符號.逗號, 
                preOr: "", 
                postOr: "", 
                left: new RuleTree(副刊期), 
                right: new RuleTree(張版)
            }, 
        }; 
        var 後半部分 = printTemplate(連接模板, {}); 

        var 連接模板 = new RuleTree(signs.行文符號.逗號, new RuleTree(header), new RuleTree(後半部分)); 
        var output = printTemplate(連接模板, {}); 
        return output; 
    }

    print() {
        var noPageRef = this.printNoPageRef(); 
        // var page = BaseRef.printPage(this.起始頁, this.結束頁); 
        // var 連接模板 = new RuleTree(signs.行文符號.逗號, new RuleTree(noPageRef), new RuleTree(page), "", ""); 
        var output = noPageRef; 
        output += signs.行文符號.句號; 
        return output; 
    }
}

class CollectionEssayRef extends EssayRef {
    constructor(作者, 作品, 集合, 年, 月, 日, 著者, 編者, 編輯種類, 出版地, 出版社, 起始頁, 結束頁) {
        super(作者, 作品, 集合); 
        this.type = 'CollectionEssayRef'; 
        this.年 = 年;
        this.月 = 月;
        this.日 = 日;
        this.著者 = 著者;
        this.編者 = 編者;
        this.編輯種類 = 編輯種類; 
        this.出版地 = 出版地;
        this.出版社 = 出版社;
        this.起始頁 = 起始頁;
        this.結束頁 = 結束頁;
    }

    printCollection() {
        // 編著
        var 編著 = ""; 
        if (!isNone(this.著者) && !isNone(this.編者)) {
            編著 = 編著 + this.著者 + "著，" + this.編者 + this.編輯種類; 
        } else if (!isNone(this.著者)) {
            編著 = 編著 + this.著者 + "著"; 
        } else if (!isNone(this.編者)) {
            編著 = 編著 + this.編者 + this.編輯種類; 
        }

        var outputFormatter = {
            集合: this.集合
        }; 
        var 輸出模板 = {
            data: signs.行文符號.冒號, 
            left: new RuleTree(編著), 
            right: new RuleTree("{集合}", {}, {}, signs.雙書名號.左, signs.雙書名號.右), 
            preOr: "載", 
            postOr: ""
        }
        // 
        var 填充 = fill(輸出模板, outputFormatter); 
        tidyUp(填充); 
        var outprint = printTree(填充); 
        return outprint; 
    }

    print年月日() {
        var outputFormatter = {
            年: this.年, 月: this.月, 日: this.日
        }
        var 輸出模板 = {
            data: "", 
            preOr: "", 
            postOr: "", 
            left: {
                data: "{年}", 
                preOr: "", 
                postOr: "年", 
                left: {}, 
                right: {}, 
            }, 
            right: {
                data: "", 
                preOr: "", 
                postOr: "", 
                left: {
                    data: "{月}", 
                    preOr: "", 
                    postOr: "月", 
                    left: {}, 
                    right: {}, 
                }, 
                right: {
                    data: "{日}", 
                    preOr: "", 
                    postOr: "日", 
                    left: {}, 
                    right: {}, 
                }, 
            }, 
        }

        return printTemplate(輸出模板, outputFormatter); 
    }

    print出版地社() {
        var outputFormatter = {
            出版地: this.出版地, 出版社: this.出版社
        }
        var 輸出模板 = {
            data: signs.行文符號.冒號, 
            preOr: "", 
            postOr: "", 
            left: new RuleTree("{出版地}"), 
            right: new RuleTree("{出版社}"), 
        }

        var output = printTemplate(輸出模板, outputFormatter); 
        return output; 
    }

    printNoPageRef() {
        var collectionPrint = this.printCollection(); 
        // console.log(collectionPrint); 
        var header = super.printWithCollection(collectionPrint); 
        /**
        論文作者：〈論文名稱〉，載□□□著：《論文集名稱》（出版地：出版社，□□年），頁□—□。
        論文作者：〈論文名稱〉，載□□□編：《論文集名稱》（出版地：出版社，□□年），頁□—□。
         */

        var 年月日 = this.print年月日();
        var 出版地社 = this.print出版地社(); 
        var 連接模板 = new RuleTree(signs.行文符號.逗號, new RuleTree(出版地社), new RuleTree(年月日), signs.圓括號.左, signs.圓括號.右); 
        var 出版地社年月日 = printTemplate(連接模板, {}); 

        var 連接模板 = new RuleTree("", new RuleTree(header), new RuleTree(出版地社年月日)); 
        var output = printTemplate(連接模板, {}); 
        return output; 
    }

    print() {
        var noPageRef = this.printNoPageRef(); 
        var page = BaseRef.printPage(this.起始頁, this.結束頁); 
        var 連接模板 = new RuleTree(signs.行文符號.逗號, new RuleTree(noPageRef), new RuleTree(page), "", ""); 
        var output = printTemplate(連接模板, {});
        output += signs.行文符號.句號; 
        return output; 
    }
}

class ThesisRef extends BaseRef {
    constructor(作者, 作品, 學校, 學段, 年) {
        super(作者, 作品); 
        this.type = 'ThesisRef'; 
        this.學校 = 學校;
        this.學段 = 學段;
        this.年 = 年;

        var 括號内 = {
            data: "，", 
            left: {
                data: "", 
                left: {
                    data: "{學校}", 
                    left: {}, 
                    right: {}, 
                    preOr: "", 
                    postOr: ""
                }, 
                right: {
                    data: "{學段}", 
                    left: {}, 
                    right: {}, 
                    preOr: "", 
                    postOr: ""
                }, 
                preOr: "", 
                postOr: "{論文文字}"
            }, 
            right: {
                data: "{年份}", 
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
        this.輸出模板 = {
            data: "", 
            left: 括號前, 
            right: 括號内, 
            preOr: "", 
            postOr: ""
        }
        // this.輸出模板 = "{作者}：〈{作品}〉{（￥}{學校}{學段}{論文文字}{￥，￥}{年份}{￥）}。"
    }

    printNoPageRef() {
        var 論文文字 = "論文"; 
        var 學校或學段不空 = isNotNone(this.學校) || isNotNone(this.學段); 
        var 年份不空 = isNotNone(this.年); 
        var 年份 = ""; 
        // if (學校或學段不空) {
        //     論文文字 = "論文"; 
        // }
        if (年份不空) {
            年份 = this.年 + "年"
        }
        var outputFormatter = {
            作者: this.作者, 
            作品: this.作品, 
            學校: this.學校, 
            學段: this.學段, 
            論文文字: 論文文字, 
            年份: 年份,  
        }; 
        var 填充 = fill(this.輸出模板, outputFormatter); 
        tidyUp(填充); 
        return printTree(填充); 
    }

    print() {
        var outprint = this.printNoPageRef() + "。"; 
        return outprint; 
        // return this.輸出模板.format(outputFormatter).sepDeal(); 
    }
}

class TodayBookRef extends BaseRef {
    constructor(作者, 作品, 年, 編者, 編輯種類, 出版地, 出版社) {
        super(作者, 作品); 
        this.type = 'TodayBookRef'; 
        this.編者 = 編者;
        this.編輯種類 = 編輯種類; 
        this.出版地 = 出版地;
        this.出版社 = 出版社;
        this.年 = 年;

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
                data: "{年份}", 
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
                data: "，", 
                left: {
                    data: "{作者}", 
                    left: {}, 
                    right: {}, 
                    preOr: "", 
                    postOr: ""
                }, 
                right: {
                    data: "{編者}", 
                    left: {}, 
                    right: {}, 
                    preOr: "", 
                    postOr: "{編輯種類}"
                }, 
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
        this.輸出模板 = {
            data: "", 
            left: 括號前, 
            right: 括號内, 
            preOr: "", 
            postOr: ""
        }
        // this.輸出模板 = "{作者}{￥，￥}{編者}：《{作品}》{（￥}{出版地}{￥：￥}{出版社}{￥，￥}{年份}{￥）}。"
    }

    printNoPageRef() {
        var 有編校者 = isNotNone(this.編者); 
        var 有作者 = isNotNone(this.作者); 
        var 年份不空 = isNotNone(this.年); 
        var 年份 = ""; 
        var 著者 = this.作者; 
        if (有編校者 && 有作者) {
            著者 += "著"; 
        }
        if (年份不空) {
            年份 = this.年 + "年"
        }
        var outputFormatter = {
            作者: 著者, 
            作品: this.作品, 
            編者: this.編者, 
            編輯種類: this.編輯種類, 
            出版地: this.出版地, 
            出版社: this.出版社, 
            年份: 年份,  
        }; 
        var 填充 = fill(this.輸出模板, outputFormatter); 
        tidyUp(填充); 
        return printTree(填充); 
    }

    print() {
        var outprint = this.printNoPageRef() + "。"; 
        return outprint; 
        // console.log(this.輸出模板.format(outputFormatter)); 
        // return this.輸出模板.format(outputFormatter).sepDeal(); 
    }
}

class OldBookRef extends BaseRef {
    constructor(作者, 作品, 編者, 編輯種類, 出版資料) {
        super(作者, 作品); 
        this.type = 'OldBookRef'; 
        this.出版資料 = 出版資料;
        this.編者 = 編者; 
        this.編輯種類 = 編輯種類; 

        var 括號内 = {
            data: "{出版資料}", 
            left: {}, 
            right: {}, 
            preOr: "（", 
            postOr: "）"
        }
        var 括號前 = {
            data: "：", 
            left: {
                    data: "，", 
                    left: {
                        data: "{作者}", 
                        left: {}, 
                        right: {}, 
                        preOr: "", 
                        postOr: ""
                    }, 
                    right: {
                        data: "{編者}", 
                        left: {}, 
                        right: {}, 
                        preOr: "", 
                        postOr: "{編輯種類}"
                    }, 
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
        this.輸出模板 = {
            data: "", 
            left: 括號前, 
            right: 括號内, 
            preOr: "", 
            postOr: ""
        }
        // this.輸出模板 = "{作者}{￥，￥}{編者}：《{作品}》{（￥}{出版地}{￥：￥}{出版社}{￥，￥}{年份}{￥）}。"
    }

    printNoPageRef() {
        var outputFormatter = {
            作者: this.作者, 
            作品: this.作品, 
            出版資料: this.出版資料, 
            編者: this.編者, 
            編輯種類: this.編輯種類
        }; 
        var 填充 = fill(this.輸出模板, outputFormatter); 
        tidyUp(填充); 
        return printTree(填充); 
    }

    print() {
        var outprint = this.printNoPageRef() + "。"; 
        return outprint; 
    }
}

// var test = new JournalEssayRef(
//     "熊月之", "鴉片戰爭啟示錄", "史林", 
//     "1990", null, null, null, "4", null, "3", "14"
// ); 

// var test = new NewspaperEssayRef(
//     "熊月之", "鴉片戰爭啟示錄", "史林", 
//     "1990", '5', '', '3', '2', '測試副刊', '1'
// ); 
// // console.log(test.print()); 
// var test = new CollectionEssayRef(
//     "許冠三", "康南海的三世進化史觀", "近代中國思想人物論：晚清思想", 
//     '1980', "", "", "", "周陽山", "台北", "時報文化出版事業有限公司", "535", "576"
// ); 

// var test = new ThesisRef(
//     "許冠三", "康南海的三世進化史觀", "香港中文大學不存在的研究院", "博士", 
//     '1980'
// ); 

// var test = new TodayBookRef(
//     "黃宗羲", "黃梨洲文集", "1959", "陳乃乾","點校", "北京", "中華書局"
// ); 
// console.log(test.print()); 
// // 中華書局

// var test = new OldBookRef(
//     "全祖望", "續甬上耆舊詩", "戊午四明文獻社據靈蕤館謝氏藏本校印本"
// ); 

// let serializer = new Serializer(new Reconstructor().classArray);
// console.log(test.print()); 
// var stest = serializer.serialize(test); 
// console.log(stest)
// var rtest = serializer.deserialize(stest)
// console.log(rtest.print()); 