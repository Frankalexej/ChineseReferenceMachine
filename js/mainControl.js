/** 
 * 初始化變量
 * 
 * 
*/
// $(document).ready(function(){
//     // 初始設置，隱藏設置菜單
//     $("#settingShown").hide();
//     $(".after").hide();

//     // 點擊“設置”，展開菜單
//     $("#settingPlus").click(function(){
//       $("#settingHidden").hide();
//       $("#settingShown").show();
//     });

//     // 點擊“完成”，縮回菜單
//     $("#settingMinus").click(function(){
//         $("#settingShown").hide();
//         $("#settingHidden").show();
//     });

//     // 添加引用
//     $("#addNew").click(function(){
//         $(".before").hide();
//         $(".after").show();
//     });

//     // 提交引用
//     $("#submit").click(function(){
//         $(".after").hide();
//         $(".before").show();
//         // ...
//     });

//     $('#categoryChooseMenu').on('change', function() {
//         // alert( this.value );
//     });
// });


$(document).ready(function(){
    // let serializer = new Serializer(new Reconstructor().classArray);
    
    // localStorage.setItem('refs', JSON.stringify([serializer.serialize(test)]));

    var vm = new Vue({
        el: '#app',
        data: {
            refs: [], 
            categories: 徵引書目類型, 
            // categories: {
            //     "論文": {value: 1, name: "論文", sub: {
            //         "期刊": {value: 1, name: "期刊"}, 
            //         "報章": {value: 2, name: "報章"}, 
            //         "論文集": {value: 3, name: "論文集"}, 
            //     }}, 
            //     "高級學位論文": {value: 2, name: "高級學位論文", sub: []}, 
            //     "今版書籍": {value: 5, name: "今版書籍", sub: []}, 
            //     "古版書籍": {value: 6, name: "古版書籍", sub: []}, 
            // }, 
            controlSignal: {
                showAppendingForm: false, 
                append: true, 
                edit: false
            }, 
            appendInfo: {
                ref: 0, 
                category: '選擇', 
                subcategory: '期刊', 
                formInfo: {
                    authors: [{ name: '' }], 
                    作品: '', 
                    集合: '', 
                    著者s: [{ name: '' }], 
                    編者s: [{ name: '' }], 
                    卷: '', 期: '', 縂期: '', 
                    張: '', 版: '', 副刊: '', 
                    年: '', 月: '', 日: '', 
                    起始頁: '', 結束頁: '', 
                    出版地: '', 出版社: '', 
                    學校: '', 學段: '', 
                    編輯種類: "", 出版資料: ""
                }, 
                formDisplay: {
                    等信息: 字符映射.選擇是否添加_等_字処顯示的信息, 
                    學段表: 學段表, 
                    編校選字表: 編校選字表, 
                }, 
                formFill: {
                    等: 字符映射.等, 
                }
            }, 
            addFootnoteInfo: {
                show: false, 
                showBook: false, 
                ref: 0, 
                fn: 0, 
                formInfo: {
                    起始頁: "", 
                    結束頁: "", 
                    文章名稱: "", 
                    卷: ""
                }
            }
        }, 
        mounted(){
            let serializer = new Serializer(new Reconstructor().classArray);
            var serializedRefs = JSON.parse(localStorage.getItem('refs'));
            if (serializedRefs) {
                serializedRefs.forEach(sRef => {
                    // console.log(sRef); 
                    var dsRef = serializer.deserialize(sRef); 
                    this.refs.push(dsRef); 
                });
            }
            console.log(this.refs);
            // console.log(FootNote.print(this.refs[3].注釋[0])); 
        },
        computed: {
            categoriesArray: function () {
                var values = Object.values(this.categories);
                values.forEach(category => {
                    category.sub = Object.values(category.sub); 
                });
                return values; 
            }, 
            choiceControl: function () {
                if (this.appendInfo.category == this.categories['論文'].value){
                    // 是論文
                    if (this.appendInfo.subcategory == this.categories['論文'].sub["期刊"].value) {
                        return {
                            collectionName: "期刊名稱"
                        }
                    } else {
                        
                    }
                }
            }
        }, 
        methods: { 
            uploadChangeToStorage: function () {
                let serializer = new Serializer(new Reconstructor().classArray);
                var sRefs = [];
                if (this.refs) {
                    this.refs.forEach(ref => {
                        var sRef = serializer.serialize(ref); 
                        sRefs.push(sRef); 
                    });
                } 
                var serializedRefs = JSON.stringify(sRefs);
                localStorage.setItem('refs', serializedRefs); 
            }, 
            download: function () {
                // var fso = new ActiveXObject("Scripting.FileSystemObject");

                // var s = fso.CreateTextFile("MyFolder\\Model.json", true);

                // s.WriteLine(json);
                // s.Close(); 
            }, 
            categoryChange: function () {
                
            }, 
            subcategoryChange: function (subcategory) {

            }, 
            deleteRef: function (e) {
                // 刪除引用
                var idx = parseInt(e.currentTarget.getAttribute('ref-idx')); 
                this.refs.splice(idx, 1); 
                this.uploadChangeToStorage(); 
            }, 
            appendRef: function () {
                this.controlSignal.showAppendingForm = true; 
                this.addFootnoteInfo.show = false; 
            }, 

            editRef: function (e) {
                var idx = parseInt(e.currentTarget.getAttribute('ref-idx')); 
                this.appendInfo.ref = idx; 
                var Ref = this.refs[idx]; 
                if (!Ref) {
                    return; 
                }
                var cat = 徵引書目類型反查[Ref.type]; 
                if (!cat) {
                    return; 
                }
                var update = {
                    category: cat.category, 
                    subcategory: cat.subcategory
                }
                renewObjectGiven(this.appendInfo, update); 
                Ref.disassociateAuthors(); 
                Ref.disassociate編者著者(); 
                renewObjectGiven(this.appendInfo.formInfo, Ref);
                this.copyFormInfo = JSON.parse(JSON.stringify(this.appendInfo.formInfo));
                this.addFootnoteInfo.show = false; 
                this.controlSignal.edit = true; 
                this.controlSignal.showAppendingForm = true; 
            }, 

            addFootnote: function (e) {
                var idx = parseInt(e.currentTarget.getAttribute('ref-idx')); 
                var Ref = this.refs[idx]; 
                if (Ref) {
                    var cat = 徵引書目類型反查[Ref.type]; 
                    if (cat.category == "今版書籍" || cat.category == "古版書籍") {
                        this.addFootnoteInfo.showBook = true; 
                    }
                }
                this.addFootnoteInfo.show = true; 
                this.controlSignal.showAppendingForm = false; 
                this.addFootnoteInfo.ref = idx; 
            }, 

            deleteFootnote: function (e) {
                var idx = parseInt(e.currentTarget.getAttribute('ref-idx')); 
                var idxFn = parseInt(e.currentTarget.getAttribute('fn-idx')); 
                var Ref = this.refs[idx]; 
                if (Ref) {
                    Ref.注釋.splice(idxFn, 1);
                }
                this.uploadChangeToStorage(); 
            }, 

            editFootnote: function (e) {
                var idx = parseInt(e.currentTarget.getAttribute('ref-idx')); 
                var idxFn = parseInt(e.currentTarget.getAttribute('fn-idx')); 
                this.addFootnoteInfo.ref = idx; 
                this.addFootnoteInfo.fn = idxFn; 

                var Ref = this.refs[idx]; 
                if (Ref) {
                    var fnObj = Ref.注釋[idxFn];
                    if (!fnObj) {
                        return; 
                    }
                } else {return; }

                this.addFootnoteInfo.formInfo = {
                    起始頁: fnObj.起始頁, 
                    結束頁: fnObj.結束頁, 
                    文章名稱: fnObj.文章名稱, 
                    卷: fnObj.卷
                }

                this.addFootnoteInfo.show = true; 
                this.controlSignal.showAppendingForm = false; 
                this.controlSignal.edit = true; 
            }, 

            addAuthor: function () {
                this.appendInfo.formInfo.authors.push({ name: '' });
            }, 
            addColAuthor: function () {
                this.appendInfo.formInfo.著者s.push({ name: '' });
            }, 
            addEditor: function () {
                this.appendInfo.formInfo.編者s.push({ name: '' });
            }, 
            

            deleteAuthor: function (e) {
                var idx = parseInt(e.currentTarget.getAttribute('auther-idx')); 
                if (this.appendInfo.formInfo.authors.length == 1) {
                    // 若只剩下一個元素則不允許刪除
                    return; 
                }
                this.appendInfo.formInfo.authors.splice(idx, 1); 
            }, 
            deleteColAuthor: function (e) {
                var idx = parseInt(e.currentTarget.getAttribute('auther-idx')); 
                if (this.appendInfo.formInfo.著者s.length == 1) {
                    // 若只剩下一個元素則不允許刪除
                    return; 
                }
                this.appendInfo.formInfo.著者s.splice(idx, 1); 
            }, 
            deleteEditor: function (e) {
                var idx = parseInt(e.currentTarget.getAttribute('auther-idx')); 
                if (this.appendInfo.formInfo.編者s.length == 1) {
                    // 若只剩下一個元素則不允許刪除
                    return; 
                }
                this.appendInfo.formInfo.編者s.splice(idx, 1); 
            }, 
            validCheck: function (category, subcategory) {
                if (isNone(this.appendInfo.formInfo.authors[0].name)) {
                    alert("請至少填寫一位作者！"); 
                }
                if (isNone(this.appendInfo.formInfo.作品)) {
                    alert("請填寫論文名稱！"); 
                }
                if (isNotNone(subcategory) && isNone(this.appendInfo.formInfo.集合)) {
                    alert(`請填寫${this.categories[category].sub[subcategory].name}名稱！`); 
                }
            }, 
            submit: function () {
                if (this.controlSignal.edit) {
                    var Ref = this.refs[this.appendInfo.ref]; 
                    var diff = diffBetweenObjects(this.copyFormInfo, this.appendInfo.formInfo); 
                    if (diff.authors != undefined) {
                        diff.作者 = dictArrToDunhaoSepStr(diff.authors); 
                        delete diff.authors; 
                    }
                    if (diff.著者s != undefined) {
                        diff.著者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.著者s); 
                        delete diff.著者s; 
                    }
                    if (diff.編者s != undefined) {
                        diff.編者s = dictArrToDunhaoSepStr(this.appendInfo.formInfo.編者s); 
                        delete diff.編者s; 
                    }
                    renewObjectGiven(Ref, diff); 
                    this.uploadChangeToStorage(); 
                    location.reload();
                } else {
                    if (this.appendInfo.category == '論文') {
                        if (this.appendInfo.subcategory == '期刊') {
                            this.validCheck('論文', '期刊'); 
                            var 作者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.authors); 
                            var toAppend = new JournalEssayRef(
                                作者, this.appendInfo.formInfo.作品, this.appendInfo.formInfo.集合, 
                                this.appendInfo.formInfo.年, this.appendInfo.formInfo.月, this.appendInfo.formInfo.日, 
                                this.appendInfo.formInfo.卷, this.appendInfo.formInfo.期, this.appendInfo.formInfo.縂期, 
                                this.appendInfo.formInfo.起始頁, this.appendInfo.formInfo.結束頁
                            ); 
                            this.refs.push(toAppend); 
                            this.uploadChangeToStorage(); 
                            location.reload();
                        } else if (this.appendInfo.subcategory == '報章') {
                            this.validCheck('論文', '報章'); 
                            var 作者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.authors); 
                            var toAppend = new NewspaperEssayRef(
                                作者, this.appendInfo.formInfo.作品, this.appendInfo.formInfo.集合, 
                                this.appendInfo.formInfo.年, this.appendInfo.formInfo.月, this.appendInfo.formInfo.日, 
                                this.appendInfo.formInfo.張, this.appendInfo.formInfo.版, this.appendInfo.formInfo.副刊, 
                                this.appendInfo.formInfo.期
                            ); 
                            this.refs.push(toAppend); 
                            this.uploadChangeToStorage(); 
                            location.reload();
                        } else if (this.appendInfo.subcategory == '論文集') {
                            this.validCheck('論文', '論文集'); 
                            var 作者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.authors); 
                            var 著者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.著者s); 
                            var 編者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.編者s); 
                            var toAppend = new CollectionEssayRef(
                                作者, this.appendInfo.formInfo.作品, this.appendInfo.formInfo.集合, 
                                this.appendInfo.formInfo.年, this.appendInfo.formInfo.月, this.appendInfo.formInfo.日, 
                                著者, 編者, this.appendInfo.formInfo.編輯種類, 
                                this.appendInfo.formInfo.出版地, this.appendInfo.formInfo.出版社, this.appendInfo.formInfo.起始頁, 
                                this.appendInfo.formInfo.結束頁
                            ); 
                            this.refs.push(toAppend); 
                            this.uploadChangeToStorage(); 
                            location.reload();
                        }
                    } else if (this.appendInfo.category == '高級學位論文') {
                        this.validCheck('高級學位論文', ''); 
                        var 作者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.authors); 
                        var toAppend = new ThesisRef(
                            作者, this.appendInfo.formInfo.作品, 
                            this.appendInfo.formInfo.學校, this.appendInfo.formInfo.學段,  
                            this.appendInfo.formInfo.年
                        ); 
                        this.refs.push(toAppend); 
                        this.uploadChangeToStorage(); 
                        location.reload();
                    } else if (this.appendInfo.category == '今版書籍') {
                        this.validCheck('今版書籍', ''); 
                        var 作者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.authors); 
                        var 編者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.編者s); 
                        var toAppend = new TodayBookRef(
                            作者, this.appendInfo.formInfo.作品, this.appendInfo.formInfo.年, 
                            編者, this.appendInfo.formInfo.編輯種類, 
                            this.appendInfo.formInfo.出版地, this.appendInfo.formInfo.出版社
                        ); 
                        this.refs.push(toAppend); 
                        this.uploadChangeToStorage(); 
                        location.reload();
                    } else if (this.appendInfo.category == '古版書籍') {
                        this.validCheck('古版書籍', ''); 
                        var 作者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.authors); 
                        var 編者 = dictArrToDunhaoSepStr(this.appendInfo.formInfo.編者s); 
                        var toAppend = new OldBookRef(
                            作者, this.appendInfo.formInfo.作品, 
                            編者, this.appendInfo.formInfo.編輯種類, this.appendInfo.formInfo.出版資料
                        ); 
                        this.refs.push(toAppend); 
                        this.uploadChangeToStorage(); 
                        location.reload();
                    }
                }
            }, 
            submitFootnote: function () {
                var footnote = new FootNote(
                    this.addFootnoteInfo.formInfo.起始頁, 
                    this.addFootnoteInfo.formInfo.結束頁, 
                    this.addFootnoteInfo.formInfo.文章名稱, 
                    this.addFootnoteInfo.formInfo.卷, 
                )
                // console.log(this.addFootnoteInfo.formInfo); 
                if (this.controlSignal.edit) {
                    this.refs[this.addFootnoteInfo.ref].注釋[this.addFootnoteInfo.fn] = footnote; 
                    this.uploadChangeToStorage(); 
                    location.reload();
                } else {
                    this.refs[this.addFootnoteInfo.ref].注釋.push(footnote); 
                    this.uploadChangeToStorage(); 
                    location.reload();
                }
            }, 
            refresh: function () {
                location.reload(); 
            }, 
            saveOutputToFile: function () {
                var orderableRefs = [...this.refs]; 
                var orderedRefs = orderableRefs.sort(refLevelCmp); 
                // console.log(orderedRefs); 
                var output = "徵引書目\n"; 
                orderedRefs.forEach(Ref => {
                    output += Ref.print(); 
                    output += "\n"
                });

                output += "\n注釋（按徵引書目及注釋輸入順序排列）\n"; 
                orderedRefs.forEach(Ref => {
                    Ref.注釋.forEach(Fn => {
                        // console.log(Ref.printNoPageRef()); 
                        // console.log(FootNote.print(Fn)); 
                        // console.log(Ref.printOneFootnote(Ref.printNoPageRef(), FootNote.print(Fn))); 
                        output += Ref.printOneFootnote(Ref.printNoPageRef(), FootNote.print(Fn)); 
                        output += "\n" 
                    });
                });
                // var output = ""; 
                var blob = new Blob([output],
                { type: "text/plain;charset=utf-8" });
                saveAs(blob, "output.txt");
            }, 
            saveSourceToFile: function () {
                let serializer = new Serializer(new Reconstructor().classArray);
                var sRefs = [];
                if (this.refs) {
                    this.refs.forEach(ref => {
                        var sRef = serializer.serialize(ref); 
                        sRefs.push(sRef); 
                    });
                } 
                var serializedRefs = JSON.stringify(sRefs);
                var blob = new Blob([serializedRefs],
                { type: "text/plain;charset=utf-8" });
                saveAs(blob, "source.ctmch");
            }, 
            loadSourceFile: function (e) {
                const fileList = e.target.files;
                var file = fileList[0]; 
                const reader = new FileReader();
                reader.addEventListener('load', (event) => {
                    // console.log(event.target.result); 
                    localStorage.setItem('refs', event.target.result); 
                    location.reload(); 
                });
                reader.readAsText(file);
            }, 
        }
    })
}); 