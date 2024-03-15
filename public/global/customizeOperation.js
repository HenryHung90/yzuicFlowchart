const customizeOperation = {
    //loading Page
    loadingPage: state => {
        if (state) {
            $(".loadingContainer").css('top', $(document).scrollTop())
            $(".loadingContainer").fadeIn(200)
        } else {
            $(".loadingContainer").fadeOut(200)
        }
    },
    //與 server 聯繫進行偵錯
    serverResponseErrorDetect: response => {
        // status sign meaning
        // status 200 => success
        // status 500 => server error
        // status 501 => empty
        // status 404 => error
        // status 401 => account error
        switch (response.data.status) {
            case 200:
                return true
            case 500:
                window.alert(response.data.message)
                return false
            case 501:
                if (response.data.message) window.alert(response.data.message)
                return true
            case 404:
                window.alert(response.data.message || "Error 請重新整理網頁")
                return false
            case 401:
                window.alert(response.data.message)
                customizeOperation.loadingPage(false)
                return false
        }
    },
    //取得 cookie值
    getCookie: name => {
        let value = "; " + document.cookie
        let parts = value.split("; " + name + "=")
        if (parts.length == 2) return parts.pop().split(";").shift()
    },
    //取得 當前時間
    getNowTime: type => {
        const date = new Date()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()

        if (hour.toString().length === 1) {
            hour = "0" + hour
        }
        if (minute.toString().length === 1) {
            minute = "0" + minute
        }
        if (second.toString().length === 1) {
            second = "0" + second
        }

        switch (type) {
            case "SimpleTime":
                return hour + ":" + minute
            case "SecondTime":
                return hour + ":" + minute + ":" + second
            case "FullTime":
                return `${date.getFullYear()}/${date.getMonth() + 1
                    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
    },
    //取得 Front-end Code
    getFrontEndCode: id => {
        return $.trim($(`#${id}`).text())
    },
    //calculate maximumSizeInMegaByte
    maximumSizeInMegaByte: Byte => {
        //MB -> KB -> Byte
        return Byte * 1024 * 1024
    },
    //return Download xlsx
    downloadDataToExcel: async (workbookTitle, worksheetData, worksheetName) => {
        // console.log(workbookTitle, worksheetData, worksheetName)
        const workbook = XLSX.utils.book_new();
        worksheetData.map((dataValue, dataIndex) => {
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataValue), worksheetName[dataIndex]);
            //Binary string
            // XLSX.write(workbook, { book_type: "xlsx", type: "binary" });
            if (dataIndex == worksheetData.length - 1) {
                const Month = new Date().getMonth();
                const Today = new Date().getDate();
                XLSX.writeFile(workbook, `${workbookTitle}_${Month}\/${Today}.xls`);
            }
        })
    },
    // toast controller
    activeToast: (title = "通知", subtitle = "--", context = "測試") => {
        $('#cowork_toast_title').text(title)
        $('#cowork_toast_subtitle').text(subtitle)
        $('#cowork_toast_context').text(context)
        $('#cowork_toast').animate({
            opacity: 1
        }, 1000, function () {
            setTimeout(() => {
                $(this).animate({
                    opacity: 0
                })
            }, 2000)
        })
    },
    // taskNumber 轉 taskName
    taskNumberToTaskName: (mission, task) => {
        let optTaskName = ""
        // Assert that mission is "02"
        if (mission !== 0) optTaskName += "任務" + mission.split("-")[0]
        if (mission === "02") optTaskName = ""


        if (optTaskName !== undefined) optTaskName += "/" + task

        return optTaskName
    }
}

export default customizeOperation