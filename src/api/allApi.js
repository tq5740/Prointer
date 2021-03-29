export default {
    url1() { return "https://cloud.wisiyilink.com/api/" },
    url2() { return "http://oa.cnyeil.com/seeyon/thirdpartyController.do"},

    refreshDeviceInfo() { return "device/refresh_device_info"}, // 刷新设备最新信息
    printerList() { return "external_api/printer_list"}, // 获取设备打印机列表
    printerParams() { return "print/printer_params" }, // 获取打印机参数
    job() { return "print/job"}, // 提交/查询/其他打印任务
    filePages() { return "print/file_pages" },  // 获取文档打印页数


    download(){ return "printManage/download" },
    fileUpload(){ return "printManage/fileUpload" },
    getFileList4Page(){ return "printManage/getFileList4Page" }, 
    queryAllPrintInfo(){ return "printManage/queryAllPrintInfo" }, 
    queryPrintInfo(){ return "printManage/queryPrintInfo" }, 
    saveDetails(){ return "printManage/saveDetails" }, 
    updateStatus(){ return "printManage/updateStatus" }, 
    deleteFiles() { return "printManage/deleteFiles" },
    getPrinter() { return "printManage/getPrinter" },
    queryPageCount(){ return "printManage/queryPageCount" },
    queryPrintBySort(){ return "printManage/queryPrintBySort" }, 
    selectAll(){ return "printManage/selectAll" }, 
    saveTempImg(){ return "printManage/saveTempImg" }, 
    delTempImg(){ return "printManage/delTempImg" }, 

    getUserInfoByTicket(){ return "sso/getUserInfoByTicket" },
    login(){ return "sso/login" },
};