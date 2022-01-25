function cmp(a, b) {
    var i = 0; 
    while (i < a.length && i < b.length) {
        // 如果字符相同，则跳过当前字符，比较下一个
        if (a[i] == b[i]) {
            i++;
            continue;
        }
        // res 为两个字符在所给字典中的次序之差
        return cnchar.stroke(a[i]) - cnchar.stroke(b[i]); 
    }

    // 此时，表示某个字符串比较完毕，如果 o1 先完毕，则表示 o2 大，反之，o1 大
    if (i == a.length && i == b.length) {
        return 0;
    } else if (i == a.length) {
        return -1;
    } else {
        return 1;
    }
}

function deepCmp(arrA, arrB) {
    // argument should be arrays of names of string type
    var i = 0; 
    while (i < arrA.length && i < arrB.length) {
        var res = cmp(arrA[i], arrB[i]); 
        if (res == 0) {
            i++; 
            continue; 
        } else {
            return res; 
        }
    }
    // 此时，表示某个数组比较完毕，如果 arrA 先完毕，则表示 arrB 大，反之，arrA 大
    if (i == arrA.length && i == arrB.length) {
        return 0;
    } else if (i == arrA.length) {
        return -1;
    } else {
        return 1;
    }
}

// var x = deepCmp(['黃啟華等'], ['顧炎武']); 
// console.log(x); 
// console.log(cnchar.stroke('黃')); 
// console.log(cnchar.stroke('顧'))

function refLevelCmp(refA, refB) {
    var refANames = refA.作者.split("、"); 
    var refBNames = refB.作者.split("、"); 
    return deepCmp(refANames, refBNames)
}

function dictArrToSortedArr(dictArr) {
    var arr = dictArr.map(function(author) {
        return author.name; 
    }); 
    return arr.sort(cmp); 
}

function arrToDunhaoSepStr(arr) {
    if (!arr || arr.length == 0) {
        return ""; 
    } else {
        var output = arr[0]; 
        for (let i = 1; i < arr.length; ++i) {
            output += "、"; 
            output += arr[i]; 
        }
        return output; 
    }
}

function dictArrToDunhaoSepStr(dictArr) {
    return arrToDunhaoSepStr(dictArrToSortedArr(dictArr)); 
}

function renewObjectGiven(old, update) {
    if (typeof update == "object") {
        for (var key in update) {
            if (update[key] != undefined){
                old[key] = update[key]; 
            }
        }
    }
}

function diffBetweenObjects(oldObj, newObj) {
    var diff = {}
    for (var key in newObj) {
        if (oldObj[key] == undefined) {
            diff[key] = newObj[key]; 
        } else if (newObj[key] != oldObj[key]) {
            diff[key] = newObj[key]; 
        } else {continue; }
    }
    return diff; 
}


String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}



// var x = {
//     a: "a", 
//     b: "b"
// }

// renewObjectGiven(x, {a:"c"}); 

// console.log(x)