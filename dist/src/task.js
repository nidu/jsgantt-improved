"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
// Function to open/close and hide/show children of specified task
exports.folder = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pID) {
            if (vList[i].getOpen() == 1) {
                vList[i].setOpen(0);
                exports.hide(pID, ganttObj);
                if (utils_1.isIE())
                    vList[i].getGroupSpan().innerText = '+';
                else
                    vList[i].getGroupSpan().textContent = '+';
            }
            else {
                vList[i].setOpen(1);
                exports.show(pID, 1, ganttObj);
                if (utils_1.isIE())
                    vList[i].getGroupSpan().innerText = '-';
                else
                    vList[i].getGroupSpan().textContent = '-';
            }
        }
    }
    var bd;
    if (this.vDebug) {
        bd = new Date();
        console.log('after drawDependency', bd);
    }
    ganttObj.DrawDependencies(this.vDebug);
    if (this.vDebug) {
        var ad = new Date();
        console.log('after drawDependency', ad, (ad.getTime() - bd.getTime()));
    }
};
exports.hide = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            vID = vList[i].getID();
            // it's unlikely but if the task list has been updated since
            // the chart was drawn some of the rows may not exist
            if (vList[i].getListChildRow())
                vList[i].getListChildRow().style.display = 'none';
            if (vList[i].getChildRow())
                vList[i].getChildRow().style.display = 'none';
            vList[i].setVisible(0);
            if (vList[i].getGroup())
                exports.hide(vID, ganttObj);
        }
    }
};
// Function to show children of specified task
exports.show = function (pID, pTop, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    var vState = '';
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            if (vList[i].getParItem().getGroupSpan()) {
                if (utils_1.isIE())
                    vState = vList[i].getParItem().getGroupSpan().innerText;
                else
                    vState = vList[i].getParItem().getGroupSpan().textContent;
            }
            i = vList.length;
        }
    }
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            var vChgState = false;
            vID = vList[i].getID();
            if (pTop == 1 && vState == '+')
                vChgState = true;
            else if (vState == '-')
                vChgState = true;
            else if (vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)
                vList[i].setVisible(1);
            if (vChgState) {
                if (vList[i].getListChildRow())
                    vList[i].getListChildRow().style.display = '';
                if (vList[i].getChildRow())
                    vList[i].getChildRow().style.display = '';
                vList[i].setVisible(1);
            }
            if (vList[i].getGroup())
                exports.show(vID, 0, ganttObj);
        }
    }
};
// function to open window to display task link
exports.taskLink = function (pRef, pWidth, pHeight) {
    var vWidth, vHeight;
    if (pWidth)
        vWidth = pWidth;
    else
        vWidth = 400;
    if (pHeight)
        vHeight = pHeight;
    else
        vHeight = 400;
    window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
};
exports.sortTasks = function (pList, pID, pIdx) {
    if (pList.length < 2) {
        return pIdx;
    }
    var sortIdx = pIdx;
    var sortArr = new Array();
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID)
            sortArr.push(pList[i]);
    }
    if (sortArr.length > 0) {
        sortArr.sort(function (a, b) {
            var i = a.getStart().getTime() - b.getStart().getTime();
            if (i == 0)
                i = a.getEnd().getTime() - b.getEnd().getTime();
            if (i == 0)
                return a.getID() - b.getID();
            else
                return i;
        });
    }
    for (var j = 0; j < sortArr.length; j++) {
        for (var i = 0; i < pList.length; i++) {
            if (pList[i].getID() == sortArr[j].getID()) {
                pList[i].setSortIdx(sortIdx++);
                sortIdx = exports.sortTasks(pList, pList[i].getID(), sortIdx);
            }
        }
    }
    return sortIdx;
};
exports.TaskItemObject = function (object) {
    var pDataObject = __assign({}, object);
    utils_1.internalProperties.forEach(function (property) {
        delete pDataObject[property];
    });
    return new exports.TaskItem(object.pID, object.pName, object.pStart, object.pEnd, object.pClass, object.pLink, object.pMile, object.pRes, object.pComp, object.pGroup, object.pParent, object.pOpen, object.pDepend, object.pCaption, object.pNotes, object.pGantt, object.pCost, object.pPlanStart, object.pPlanEnd, object.pDuration, object);
};
exports.TaskItem = function (pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt, pCost, pPlanStart, pPlanEnd, pDuration, pDataObject) {
    if (pCost === void 0) { pCost = null; }
    if (pPlanStart === void 0) { pPlanStart = null; }
    if (pPlanEnd === void 0) { pPlanEnd = null; }
    if (pDuration === void 0) { pDuration = null; }
    if (pDataObject === void 0) { pDataObject = null; }
    var vGantt = pGantt ? pGantt : this;
    var _id = document.createTextNode(pID).data;
    var vID = utils_1.hashKey(document.createTextNode(pID).data);
    var vName = document.createTextNode(pName).data;
    var vStart = null;
    var vEnd = null;
    var vPlanStart = null;
    var vPlanEnd = null;
    var vGroupMinStart = null;
    var vGroupMinEnd = null;
    var vClass = document.createTextNode(pClass).data;
    var vLink = document.createTextNode(pLink).data;
    var vMile = parseInt(document.createTextNode(pMile).data);
    var vRes = document.createTextNode(pRes).data;
    var vComp = parseFloat(document.createTextNode(pComp).data);
    var vCost = parseInt(document.createTextNode(pCost).data);
    var vGroup = parseInt(document.createTextNode(pGroup).data);
    var vDataObject = pDataObject;
    var vCompVal;
    var parent = document.createTextNode(pParent).data;
    if (parent && parent !== '0') {
        parent = utils_1.hashKey(parent).toString();
    }
    var vParent = parent;
    var vOpen = (vGroup == 2) ? 1 : parseInt(document.createTextNode(pOpen).data);
    var vDepend = new Array();
    var vDependType = new Array();
    var vCaption = document.createTextNode(pCaption).data;
    var vDuration = pDuration || '';
    var vLevel = 0;
    var vNumKid = 0;
    var vWeight = 0;
    var vVisible = 1;
    var vSortIdx = 0;
    var vToDelete = false;
    var x1, y1, x2, y2;
    var vNotes;
    var vParItem = null;
    var vCellDiv = null;
    var vBarDiv = null;
    var vTaskDiv = null;
    var vListChildRow = null;
    var vChildRow = null;
    var vGroupSpan = null;
    vNotes = document.createElement('span');
    vNotes.className = 'gTaskNotes';
    if (pNotes != null) {
        vNotes.innerHTML = pNotes;
        utils_1.stripUnwanted(vNotes);
    }
    if (pStart != null && pStart != '') {
        vStart = (pStart instanceof Date) ? pStart : utils_1.parseDateStr(document.createTextNode(pStart).data, vGantt.getDateInputFormat());
        vGroupMinStart = vStart;
    }
    if (pEnd != null && pEnd != '') {
        vEnd = (pEnd instanceof Date) ? pEnd : utils_1.parseDateStr(document.createTextNode(pEnd).data, vGantt.getDateInputFormat());
        vGroupMinEnd = vEnd;
    }
    if (pPlanStart != null && pPlanStart != '') {
        vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : utils_1.parseDateStr(document.createTextNode(pPlanStart).data, vGantt.getDateInputFormat());
        vGroupMinStart = vPlanStart;
    }
    if (pPlanEnd != null && pPlanEnd != '') {
        vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : utils_1.parseDateStr(document.createTextNode(pPlanEnd).data, vGantt.getDateInputFormat());
        vGroupMinEnd = vPlanEnd;
    }
    if (pDepend != null) {
        var vDependStr = pDepend + '';
        var vDepList = vDependStr.split(',');
        var n = vDepList.length;
        for (var k = 0; k < n; k++) {
            if (vDepList[k].toUpperCase().indexOf('SS') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('SS'));
                vDependType[k] = 'SS';
            }
            else if (vDepList[k].toUpperCase().indexOf('FF') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('FF'));
                vDependType[k] = 'FF';
            }
            else if (vDepList[k].toUpperCase().indexOf('SF') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('SF'));
                vDependType[k] = 'SF';
            }
            else if (vDepList[k].toUpperCase().indexOf('FS') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('FS'));
                vDependType[k] = 'FS';
            }
            else {
                vDepend[k] = vDepList[k];
                vDependType[k] = 'FS';
            }
            if (vDepend[k]) {
                vDepend[k] = utils_1.hashKey(vDepend[k]).toString();
            }
        }
    }
    this.getID = function () { return vID; };
    this.getOriginalID = function () { return _id; };
    this.getGantt = function () { return vGantt; };
    this.getName = function () { return vName; };
    this.getStart = function () {
        if (vStart)
            return vStart;
        else if (vPlanStart)
            return vPlanStart;
        else
            return new Date();
    };
    this.getEnd = function () {
        if (vEnd)
            return vEnd;
        else if (vPlanEnd)
            return vPlanEnd;
        else if (vStart && vDuration) {
            var date = new Date(vStart);
            var vUnits = vDuration.split(' ');
            var value = parseInt(vUnits[0]);
            switch (vUnits[1]) {
                case 'hour':
                    date.setMinutes(date.getMinutes() + (value * 60));
                    break;
                case 'day':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24));
                    break;
                case 'week':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24 * 7));
                    break;
                case 'month':
                    date.setMonth(date.getMonth() + (value));
                    break;
                case 'quarter':
                    date.setMonth(date.getMonth() + (value * 3));
                    break;
            }
            return date;
        }
        else
            return new Date();
    };
    this.getPlanStart = function () { return vPlanStart ? vPlanStart : vStart; };
    this.getPlanEnd = function () { return vPlanEnd ? vPlanEnd : vEnd; };
    this.getCost = function () { return vCost; };
    this.getGroupMinStart = function () { return vGroupMinStart; };
    this.getGroupMinEnd = function () { return vGroupMinEnd; };
    this.getClass = function () { return vClass; };
    this.getLink = function () { return vLink; };
    this.getMile = function () { return vMile; };
    this.getDepend = function () {
        if (vDepend)
            return vDepend;
        else
            return null;
    };
    this.getDataObject = function () { return vDataObject; };
    this.getDepType = function () { if (vDependType)
        return vDependType;
    else
        return null; };
    this.getCaption = function () { if (vCaption)
        return vCaption;
    else
        return ''; };
    this.getResource = function () { if (vRes)
        return vRes;
    else
        return '\u00A0'; };
    this.getCompVal = function () { if (vComp)
        return vComp;
    else if (vCompVal)
        return vCompVal;
    else
        return 0; };
    this.getCompStr = function () { if (vComp)
        return vComp + '%';
    else if (vCompVal)
        return vCompVal + '%';
    else
        return ''; };
    this.getNotes = function () { return vNotes; };
    this.getSortIdx = function () { return vSortIdx; };
    this.getToDelete = function () { return vToDelete; };
    this.getDuration = function (pFormat, pLang) {
        if (vMile) {
            vDuration = '-';
        }
        else if (!vEnd && vDuration) {
            return vDuration;
        }
        else {
            var vUnits = null;
            switch (pFormat) {
                case 'week':
                    vUnits = 'day';
                    break;
                case 'month':
                    vUnits = 'week';
                    break;
                case 'quarter':
                    vUnits = 'month';
                    break;
                default:
                    vUnits = pFormat;
                    break;
            }
            // let vTaskEnd = new Date(this.getEnd().getTime());
            // if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
            //   vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
            // }
            // let tmpPer = (getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;
            var hours = (this.getEnd().getTime() - this.getStart().getTime()) / 1000 / 60 / 60;
            var tmpPer = void 0;
            switch (vUnits) {
                case 'hour':
                    tmpPer = Math.round(hours);
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['hrs'] : pLang['hr']);
                    break;
                case 'day':
                    tmpPer = Math.round(hours / 24);
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['dys'] : pLang['dy']);
                    break;
                case 'week':
                    tmpPer = Math.round(hours / 24 / 7);
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['wks'] : pLang['wk']);
                    break;
                case 'month':
                    tmpPer = Math.round(hours / 24 / 7 / 30);
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['mths'] : pLang['mth']);
                    break;
                case 'quarter':
                    tmpPer = Math.round(hours / 24 / 7 / 30 / 3);
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['qtrs'] : pLang['qtr']);
                    break;
            }
        }
        return vDuration;
    };
    this.getParent = function () { return vParent; };
    this.getGroup = function () { return vGroup; };
    this.getOpen = function () { return vOpen; };
    this.getLevel = function () { return vLevel; };
    this.getNumKids = function () { return vNumKid; };
    this.getWeight = function () { return vWeight; };
    this.getStartX = function () { return x1; };
    this.getStartY = function () { return y1; };
    this.getEndX = function () { return x2; };
    this.getEndY = function () { return y2; };
    this.getVisible = function () { return vVisible; };
    this.getParItem = function () { return vParItem; };
    this.getCellDiv = function () { return vCellDiv; };
    this.getBarDiv = function () { return vBarDiv; };
    this.getTaskDiv = function () { return vTaskDiv; };
    this.getChildRow = function () { return vChildRow; };
    this.getListChildRow = function () { return vListChildRow; };
    this.getGroupSpan = function () { return vGroupSpan; };
    this.setName = function (pName) { vName = pName; };
    this.setNotes = function (pNotes) { vNotes = pNotes; };
    this.setClass = function (pClass) { vClass = pClass; };
    this.setCost = function (pCost) { vCost = pCost; };
    this.setResource = function (pRes) { vRes = pRes; };
    this.setDuration = function (pDuration) { vDuration = pDuration; };
    this.setDataObject = function (pDataObject) { vDataObject = pDataObject; };
    this.setStart = function (pStart) {
        if (pStart instanceof Date) {
            vStart = pStart;
        }
        else {
            var temp = new Date(pStart);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vStart = temp;
            }
        }
    };
    this.setEnd = function (pEnd) {
        if (pEnd instanceof Date) {
            vEnd = pEnd;
        }
        else {
            var temp = new Date(pEnd);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vEnd = temp;
            }
        }
    };
    this.setPlanStart = function (pPlanStart) {
        if (pPlanStart instanceof Date)
            vPlanStart = pPlanStart;
        else
            vPlanStart = new Date(pPlanStart);
    };
    this.setPlanEnd = function (pPlanEnd) {
        if (pPlanEnd instanceof Date)
            vPlanEnd = pPlanEnd;
        else
            vPlanEnd = new Date(pPlanEnd);
    };
    this.setGroupMinStart = function (pStart) { if (pStart instanceof Date)
        vGroupMinStart = pStart; };
    this.setGroupMinEnd = function (pEnd) { if (pEnd instanceof Date)
        vGroupMinEnd = pEnd; };
    this.setLevel = function (pLevel) { vLevel = parseInt(document.createTextNode(pLevel).data); };
    this.setNumKid = function (pNumKid) { vNumKid = parseInt(document.createTextNode(pNumKid).data); };
    this.setWeight = function (pWeight) { vWeight = parseInt(document.createTextNode(pWeight).data); };
    this.setCompVal = function (pCompVal) { vCompVal = parseFloat(document.createTextNode(pCompVal).data); };
    this.setComp = function (pComp) {
        vComp = parseInt(document.createTextNode(pComp).data);
    };
    this.setStartX = function (pX) { x1 = parseInt(document.createTextNode(pX).data); };
    this.setStartY = function (pY) { y1 = parseInt(document.createTextNode(pY).data); };
    this.setEndX = function (pX) { x2 = parseInt(document.createTextNode(pX).data); };
    this.setEndY = function (pY) { y2 = parseInt(document.createTextNode(pY).data); };
    this.setOpen = function (pOpen) { vOpen = parseInt(document.createTextNode(pOpen).data); };
    this.setVisible = function (pVisible) { vVisible = parseInt(document.createTextNode(pVisible).data); };
    this.setSortIdx = function (pSortIdx) { vSortIdx = parseInt(document.createTextNode(pSortIdx).data); };
    this.setToDelete = function (pToDelete) { if (pToDelete)
        vToDelete = true;
    else
        vToDelete = false; };
    this.setParItem = function (pParItem) { if (pParItem)
        vParItem = pParItem; };
    this.setCellDiv = function (pCellDiv) { if (typeof HTMLDivElement !== 'function' || pCellDiv instanceof HTMLDivElement)
        vCellDiv = pCellDiv; }; //"typeof HTMLDivElement !== 'function'" to play nice with ie6 and 7
    this.setGroup = function (pGroup) {
        if (pGroup === true || pGroup === 'true') {
            vGroup = 1;
        }
        else if (pGroup === false || pGroup === 'false') {
            vGroup = 0;
        }
        else {
            vGroup = parseInt(document.createTextNode(pGroup).data);
        }
    };
    this.setBarDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vBarDiv = pDiv; };
    this.setTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vTaskDiv = pDiv; };
    this.setChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vChildRow = pRow; };
    this.setListChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vListChildRow = pRow; };
    this.setGroupSpan = function (pSpan) { if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement)
        vGroupSpan = pSpan; };
    this.getAllData = function () {
        return {
            pID: vID,
            pName: vName,
            pStart: vStart,
            pEnd: vEnd,
            pPlanStart: vPlanStart,
            pPlanEnd: vPlanEnd,
            pGroupMinStart: vGroupMinStart,
            pGroupMinEnd: vGroupMinEnd,
            pClass: vClass,
            pLink: vLink,
            pMile: vMile,
            pRes: vRes,
            pComp: vComp,
            pCost: vCost,
            pGroup: vGroup,
            pDataObjec: vDataObject
        };
    };
};
exports.createTaskInfo = function (pTask, template) {
    var _this = this;
    if (template === void 0) { template = null; }
    var vTmpDiv;
    var vTaskInfoBox = document.createDocumentFragment();
    var vTaskInfo = this.newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');
    if (template) {
        var allData_1 = pTask.getAllData();
        utils_1.internalProperties.forEach(function (key) {
            var lang;
            if (utils_1.internalPropertiesLang[key]) {
                lang = _this.vLangs[_this.vLang][utils_1.internalPropertiesLang[key]];
            }
            if (!lang) {
                lang = key;
            }
            var val = allData_1[key];
            template = template.replace("{{" + key + "}}", val);
            if (lang) {
                template = template.replace("{{Lang:" + key + "}}", lang);
            }
            else {
                template = template.replace("{{Lang:" + key + "}}", key);
            }
        });
        this.newNode(vTaskInfo, 'span', null, 'gTtTemplate', template);
    }
    else {
        this.newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
        if (this.vShowTaskInfoStartDate == 1) {
            vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
            this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['startdate'] + ': ');
            this.newNode(vTmpDiv, 'span', null, 'gTaskText', utils_1.formatDateStr(pTask.getStart(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
        }
        if (this.vShowTaskInfoEndDate == 1) {
            vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
            this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['enddate'] + ': ');
            this.newNode(vTmpDiv, 'span', null, 'gTaskText', utils_1.formatDateStr(pTask.getEnd(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
        }
        if (this.vShowTaskInfoDur == 1 && !pTask.getMile()) {
            vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTId');
            this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['duration'] + ': ');
            this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(this.vFormat, this.vLangs[this.vLang]));
        }
        if (this.vShowTaskInfoComp == 1) {
            vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIc');
            this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['completion'] + ': ');
            this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
        }
        if (this.vShowTaskInfoRes == 1) {
            vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIr');
            this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['resource'] + ': ');
            this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
        }
        if (this.vShowTaskInfoLink == 1 && pTask.getLink() != '') {
            vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
            var vTmpNode = this.newNode(vTmpDiv, 'span', null, 'gTaskLabel');
            vTmpNode = this.newNode(vTmpNode, 'a', null, 'gTaskText', this.vLangs[this.vLang]['moreinfo']);
            vTmpNode.setAttribute('href', pTask.getLink());
        }
        if (this.vShowTaskInfoNotes == 1) {
            vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIn');
            this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['notes'] + ': ');
            if (pTask.getNotes())
                vTmpDiv.appendChild(pTask.getNotes());
        }
    }
    return vTaskInfoBox;
};
exports.AddTaskItem = function (value) {
    var vExists = false;
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == value.getID()) {
            i = this.vTaskList.length;
            vExists = true;
        }
    }
    if (!vExists) {
        this.vTaskList.push(value);
        this.vProcessNeeded = true;
    }
};
exports.AddTaskItemObject = function (object) {
    if (!object.pGantt) {
        object.pGantt = this;
    }
    return this.AddTaskItem(exports.TaskItemObject(object));
};
exports.RemoveTaskItem = function (pID) {
    // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == pID)
            this.vTaskList[i].setToDelete(true);
        else if (this.vTaskList[i].getParent() == pID)
            this.RemoveTaskItem(this.vTaskList[i].getID());
    }
    this.vProcessNeeded = true;
};
exports.ClearTasks = function () {
    var _this = this;
    this.vTaskList.map(function (task) { return _this.RemoveTaskItem(task.getID()); });
    this.vProcessNeeded = true;
};
// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
exports.processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    var vMinDate = new Date();
    var vMaxDate = new Date();
    var vVisible = pOpen;
    var vCurItem = null;
    var vCompSum = 0;
    var vMinSet = 0;
    var vMaxSet = 0;
    var vNumKid = 0;
    var vWeight = 0;
    var vLevel = pLevel;
    var vList = pList;
    var vComb = false;
    var i = 0;
    for (i = 0; i < pList.length; i++) {
        if (pList[i].getToDelete()) {
            pList.splice(i, 1);
            i--;
        }
        if (i >= 0 && pList[i].getID() == pID)
            vCurItem = pList[i];
    }
    for (i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID) {
            vVisible = pOpen;
            pList[i].setParItem(vCurItem);
            pList[i].setVisible(vVisible);
            if (vVisible == 1 && pList[i].getOpen() == 0)
                vVisible = 0;
            if (pList[i].getMile() && pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) { //remove milestones owned by combined groups
                pList.splice(i, 1);
                i--;
                continue;
            }
            pList[i].setLevel(vLevel);
            if (pList[i].getGroup()) {
                if (pList[i].getParItem() && pList[i].getParItem().getGroup() == 2)
                    pList[i].setGroup(2);
                exports.processRows(vList, pList[i].getID(), i, vLevel + 1, vVisible, 0);
            }
            if (vMinSet == 0 || pList[i].getStart() < vMinDate) {
                vMinDate = pList[i].getStart();
                vMinSet = 1;
            }
            if (vMaxSet == 0 || pList[i].getEnd() > vMaxDate) {
                vMaxDate = pList[i].getEnd();
                vMaxSet = 1;
            }
            vNumKid++;
            vWeight += pList[i].getEnd() - pList[i].getStart() + 1;
            vCompSum += pList[i].getCompVal() * (pList[i].getEnd() - pList[i].getStart() + 1);
            pList[i].setSortIdx(i * pList.length);
        }
    }
    if (pRow >= 0) {
        if (pList[pRow].getGroupMinStart() != null && pList[pRow].getGroupMinStart() < vMinDate) {
            vMinDate = pList[pRow].getGroupMinStart();
        }
        if (pList[pRow].getGroupMinEnd() != null && pList[pRow].getGroupMinEnd() > vMaxDate) {
            vMaxDate = pList[pRow].getGroupMinEnd();
        }
        pList[pRow].setStart(vMinDate);
        pList[pRow].setEnd(vMaxDate);
        pList[pRow].setNumKid(vNumKid);
        pList[pRow].setWeight(vWeight);
        pList[pRow].setCompVal(Math.ceil(vCompSum / vWeight));
    }
    if (pID == 0 && pUseSort == 1) {
        var bd = void 0;
        if (vDebug) {
            bd = new Date();
            console.log('before afterTasks', bd);
        }
        exports.sortTasks(pList, 0, 0);
        if (vDebug) {
            var ad = new Date();
            console.log('after afterTasks', ad, (ad.getTime() - bd.getTime()));
        }
        pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
    if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
     {
        for (i = 0; i < pList.length; i++) {
            if (pList[i].getGroup() == 2) {
                vComb = true;
                var bd = void 0;
                if (vDebug) {
                    bd = new Date();
                    console.log('before sortTasks', bd);
                }
                exports.sortTasks(pList, pList[i].getID(), pList[i].getSortIdx() + 1);
                if (vDebug) {
                    var ad = new Date();
                    console.log('after sortTasks', ad, (ad.getTime() - bd.getTime()));
                }
            }
        }
        if (vComb == true)
            pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
};
//# sourceMappingURL=task.js.map