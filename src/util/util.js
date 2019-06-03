import _assign from 'lodash/assign';

/**
 * @param 使用js让数字的千分位用,分隔
 */
export function shiftThousands(val, precision) {
    if (typeof val !== "number") {
        return val;
    }
    let _val;
    /* 判断传入的小数点保留位数，没有则不截取 */
    if (arguments.length === 1) {
        _val = val.toString();
    } else {
        _val = val.toFixed(precision);
    }
    /* 判断传入的数值是否是整数，如果是，直接走原生千分位方法，不是，则通过正则处理为千分位 */
    if (_val.indexOf('.') === -1) {
        return val.toLocaleString();
    } else {
        return _val.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
}

/**
 * @param list 转 tree
 */
export function listToTree(list) {
    if (list.length === 0) return [];
    const _list = [];
    list.map(item => _list.push(_assign({}, item)));
    let arr = [];
    //首先状态顶层节点
    _list.map(item => {
        if (!item.pid) {
            arr.push(item);
        }
    });
    let toDo = [];
    arr.map(item => {
        toDo.push(item);
    });
    while (toDo.length) {
        let node = toDo.shift();
        for (let i = 0; i < _list.length; i++) {
            let row = _list[i];
            if (node.id === row.pid) {
                if (node.children) {
                    node.children.push(row);
                } else {
                    node.children = [row];
                }
                toDo.push(row);
            }
        }
    }

    function sortNumber(a, b) {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }

    arr.sort(sortNumber);

    return arr;
}

/* 获取地址栏参数 */
export function getRequest() {
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        const strs = str.split("&");
        for(let i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
