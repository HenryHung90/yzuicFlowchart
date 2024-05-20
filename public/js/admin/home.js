import { adminClientConnect } from '../../global/axiosconnect.js'
import customizeOperation from '../../global/customizeOperation.js'
customizeOperation.loadingPage(true)

//----click function----//
$('#logout').click(e => logout())
$('#changePassword').click(e => changePassword())
$('#studentCenter').click(e => { window.location.port = 5003 })
$('.goListTitle_Selection').click(e => changeSelection(e.currentTarget))


const logout = () => {
    customizeOperation.loadingPage(true)
    axios({
        method: 'post',
        url: '/logout'
    }).then(response => {
        window.location.href = '/'
    })
}

const changePassword = () => {
    const changePasswordDiv = $('<div>').prop({
        className: 'container-fluid changePasswordDiv'
    }).prependTo($('body'))

    $(document).keydown((e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            confirmCP()
        }
    })


    const CPDesktop = $('<div>').prop({
        className: 'container-fluid CPDesktop'
    }).appendTo(changePasswordDiv)

    const CPContainer = $('<div>').prop({
        className: 'container-sm CPContainer'
    }).appendTo(CPDesktop)

    $('<div>').prop({
        className: 'CP_Title',
        innerHTML: '<h3><b>修改密碼</b></h3>'
    }).appendTo(CPContainer)

    //----Change Password Content----//
    const CP_PasswordContent = $('<div>').prop({
        className: 'container justify-content-center CP_PasswordContent',
    }).appendTo(CPContainer)

    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="password" class="form-control" id="old_password" placeholder="舊密碼">
                    <label for="old_password">舊密碼</label>`
    }).appendTo(CP_PasswordContent)
    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="password" class="form-control" id="new_password_1" placeholder="新密碼">
                    <label for="new_password_1">新密碼</label>`
    }).appendTo(CP_PasswordContent)
    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="password" class="form-control" id="new_password_2" placeholder="再次輸入">
                    <label for="new_password_2">再次輸入</label>`
    }).appendTo(CP_PasswordContent)

    //----Change Password Button----//
    const CP_Button = $('<div>').prop({
        className: 'row CP_Button'
    }).appendTo(CP_PasswordContent)
    $('<button>').prop({
        className: 'col-4 btn btn-info',
        innerHTML: '確認'
    }).click(e => {
        confirmCP()
    }).appendTo(CP_Button)
    $('<button>').prop({
        className: 'col-4 offset-md-4 btn btn-outline-info',
        innerHTML: '取消'
    }).click(e => {
        cancelCP()
    }).appendTo(CP_Button)

    //----Block----//
    $('<div>').prop({
        className: 'container-fluid block',
    }).click(e => {
        cancelCP()
    }).appendTo(changePasswordDiv)

    const confirmCP = () => {
        const NP_1 = $('#new_password_1').val()
        const NP_2 = $('#new_password_2').val()
        const OP = $('#old_password').val()

        if (NP_1.length === 0 || NP_2.length === 0 || OP.length === 0) {
            window.alert('不得有欄位為空!')
            return
        }
        if (NP_1 !== NP_2) {
            window.alert("兩次密碼輸入不一致!")
            $('#new_password_1').val('')
            $('#new_password_2').val('')
            $('#old_password').val('')
            return
        }
        if (NP_1 === OP) {
            window.alert("新舊密碼不得相同!")
            $('#new_password_1').val('')
            $('#new_password_2').val('')
            $('#old_password').val('')
            return
        }
        customizeOperation.loadingPage(true)
        axios({
            method: 'POST',
            url: '/student/changepassword',
            data: {
                oldPassword: OP,
                newPassword: NP_2,
            },
            withCredentials: true
        }).then(async response => {
            if (customizeOperation.serverResponseErrorDetect(response)) {
                window.alert(response.data.message)
                customizeOperation.loadingPage(false)
                if (response.data.status === 200) {
                    cancelCP()
                }
            }
        })
    }
    const cancelCP = () => {
        $(document).off('keydown')
        changePasswordDiv.fadeOut(500)
        setTimeout(e => {
            changePasswordDiv.remove()
        }, 300)
    }


}

const changeSelection = (target) => {
    // 變換文字選擇狀態
    $('.goListTitle_Selection').removeClass('title_selected')
    $(`#${target.id}`).addClass('title_selected')

    $('.goListCourse').empty()
    window.location.href = `#${target.id}`
    homRenderInit()
}

// 生成 Course 部分
const renderGoList = async () => {
    customizeOperation.loadingPage(true)
    const courseContainer = $('.goListCourse')

    //一般課程區-------------------------------------------------------
    $('<h2>').prop({
        className: "goListCourse_contentTitle",
        innerHTML: "一般課程"
    }).appendTo(courseContainer)

    await adminClientConnect.getAllCourse().then(response => {
        if (customizeOperation.serverResponseErrorDetect(response)) {
            if (response.data.standardData === null || response.data.standardData === undefined) return
            renderCourse(response.data.standardData, 'course')
        }
        customizeOperation.loadingPage(false)
    })

    //共編課程區-------------------------------------------------------
    $('<h2>').prop({
        className: "goListCourse_contentTitle",
        innerHTML: "共編課程"
    }).appendTo(courseContainer)

    await adminClientConnect.getAllCoworkCourse().then(response => {
        if (customizeOperation.serverResponseErrorDetect(response)) {
            if (response.data.coworkData === null || response.data.coworkData === undefined) return
            renderCourse(response.data.coworkData, 'cowork')
        }
    })

    //生成課程區域
    function renderCourse(courseList, type) {
        courseList.forEach((value, index) => {
            const goListContainer = $('<div>').prop({
                className: 'goListCourse_contentContainer'
            }).click(e => {
                type == 'cowork' ? enterCowork(value._id) : enterClass(value._id)
            }).appendTo(courseContainer)

            //Image Box
            $('<div>').prop({
                className: 'goListCourse_contentImageBox',
                innerHTML: '<img src="../media/img/amumamum.PNG" alt="home" style="width:170px;height: 180px">'
            }).appendTo(goListContainer)

            //Title Detail
            $('<div>').prop({
                className: 'goListCourse_contentTitle',
                innerHTML: type == 'cowork' ? value.coworkTitle : value.goListTitle
            }).appendTo(goListContainer)
        })

        // 新增課程按鈕---------------------
        const AddButton = $('<div>').prop({
            className: 'goListCourse_contentContainer ' + (type == 'cowork' ? 'goListCourse_addCoworkCourse' : 'goListCourse_addNormalCourse')
        }).click(e => { type == 'cowork' ? addCoworkClass() : addNormalClass() }).appendTo(courseContainer)
        //Image Box
        $('<div>').prop({
            className: 'goListCourse_contentImageBox',
            // innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="60%" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>'
            innerHTML: '<img src="../media/img/add.svg" alt="home" style="width:170px;height: 180px">'
        }).appendTo(AddButton)
        //Title Detail
        $('<div>').prop({
            className: 'goListCourse_contentTitle',
            innerHTML: '新增課程'
        }).appendTo(AddButton)
        //---------------------------------

        const enterClass = (id) => {
            window.location.href = `/admin/${id}`
        }

        const enterCowork = (id) => {
            window.location.href = `/admin/co/${id}`
        }

        // 增加單人課程
        function addNormalClass() {
            const courseName = window.prompt("請輸入您的課程名稱", "")
            const courseClass = window.prompt("請輸入適用屆數", "")

            if (courseName !== null) {
                adminClientConnect.createCourse(courseName, courseClass, 'standard').then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        alert(`創建成功!名稱為${response.data.message.goListTitle}`)
                        const goListContainer = $('<div>').prop({
                            className: 'goListCourse_contentContainer'
                        }).click(e => {
                            enterClass(response.data.message._id)
                        }).insertBefore($('.goListCourse_addNormalCourse'))

                        //Image Box
                        $('<div>').prop({
                            className: 'goListCourse_contentImageBox',
                            innerHTML: '<img src="../media/img/amumamum.PNG" alt="home" style="width:100%;height: 60%">'
                        }).appendTo(goListContainer)

                        //Title Detail
                        $('<div>').prop({
                            className: 'goListCourse_contentTitle',
                            innerHTML: response.data.message.goListTitle
                        }).appendTo(goListContainer)
                    }
                })
            }
        }

        // 增加合作課程
        function addCoworkClass() {
            const courseName = window.prompt("請輸入您的課程名稱", "")
            const courseClass = window.prompt("請輸入適用屆數", "")

            if (courseName !== null) {
                adminClientConnect.createCourse(courseName, courseClass, 'cowork').then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        alert(`創建成功!名稱為${response.data.message.goListTitle}`)
                        const goListContainer = $('<div>').prop({
                            className: 'goListCourse_contentContainer'
                        }).click(e => {
                            enterClass(response.data.message._id)
                        }).insertBefore($('.goListCourse_addCoworkCourse'))

                        //Image Box
                        $('<div>').prop({
                            className: 'goListCourse_contentImageBox',
                            innerHTML: '<img src="../media/img/amumamum.PNG" alt="home" style="width:100%;height: 60%">'
                        }).appendTo(goListContainer)

                        //Title Detail
                        $('<div>').prop({
                            className: 'goListCourse_contentTitle',
                            innerHTML: response.data.message.goListTitle
                        }).appendTo(goListContainer)
                    }
                })
            }
        }
    }
}

// 生成 Student 名單部分
const renderStudentList = async () => {
    customizeOperation.loadingPage(true)

    const courseContainer = $('.goListCourse')
    courseContainer.css({ 'display': 'inline-block' })
    // Button 專區------------------------------------------------------------------

    //下載所有事件紀錄----------------------------------------------------------------
    $('<h3>').prop({
        className: 'studentList_operationButtonContainer_title',
        innerHTML: '下載區'
    }).appendTo(courseContainer)

    const operationButtonContainer = $('<div>').prop({
        className: 'studentList_operationButtonContainer container-lg row'
    }).appendTo(courseContainer)

    $('<button>').prop({
        className: 'btn btn-info studentList_operationButtonContainer_btn col-3',
        innerHTML: "下載所有事件紀錄"
    }).click(downloadAllListening).appendTo(operationButtonContainer)
    //-----------------------------------------------------------------------------

    //下載單一課程所有反思----------------------------------------------------------------
    const reflectionGroup = $('<div>').prop({ className: 'input-group col-4' }).css('width', '300px').appendTo(operationButtonContainer)
    const relfectionCourse = $('<select>').prop({ className: 'form-select', id: 'reflectionCourse' }).appendTo(reflectionGroup)

    // 取得所有課程 (用於下載區)
    adminClientConnect.getAllCourse().then(response => {
        if (customizeOperation.serverResponseErrorDetect(response)) {
            if (response.data.standardData === undefined || response.data.standardData === null) {
                return
            }

            response.data.standardData.forEach((courseData, index) => {
                const courseOption = $('<option>').prop({
                    value: courseData._id,
                    innerHTML: courseData.goListTitle
                }).appendTo(relfectionCourse)

                if (index === 0) {
                    courseOption.attr('selected', true)
                }
            })
        }
    })

    $('<button>').prop({
        className: 'btn btn-info studentList_operationButtonContainer_btn',
        innerHTML: "下載反思"
    }).click(downloadAllReflection).appendTo(reflectionGroup)
    $('<hr>').appendTo(courseContainer)
    // 選擇屆數-----------------------------------------------------------------------
    $('<h3>').prop({
        className: 'studentList_operationButtonContainer_title',
        innerHTML: '學生屆數&上傳學生名單'
    }).appendTo(courseContainer)

    const studentClassContainer = $('<div>').prop({
        className: 'studentList_operationButtonContainer container-lg row'
    }).appendTo(courseContainer)
    const classGroup = $('<div>').prop({ className: 'input-group col-4' }).css('width', '250px').appendTo(studentClassContainer)
    //change function 在下方
    const classSelector = $('<select>').prop({ className: 'form-select', id: 'classSelector' }).appendTo(classGroup)
    $('<button>').prop({
        className: 'btn btn-light studentList_operationButtonContainer_btn',
        innerHTML: "屆數選擇"
    }).attr('disabled', 'disabled').appendTo(classGroup)

    // 批量上傳學生
    $('<button>').prop({
        className: 'btn btn-info studentList_operationButtonContainer_btn',
        innerHTML: "下載空白檔案"
    }).click(downloadEmptyStudentList).css('width', '150px').appendTo(studentClassContainer)
    // 上傳學生名單
    $('<div>').prop({
        className: 'input-group',
        innerHTML: '<input type="file" class="form-control" id="studentListFile">'
    }).change(uploadStudentList).css('width', '300px').appendTo(studentClassContainer)
    $('<hr>').appendTo(courseContainer)
    //----------------------------------------------------------------

    // Table 操作功能
    const studentControlContainer = $('<div>').prop({
        className: 'studentList_operationButtonContainer container-lg row'
    }).appendTo(courseContainer)

    //開啟/關閉合作功能
    $('<button>').prop({
        className: 'btn btn-primary studentList_operationButtonContainer_btn',
        innerHTML: "開啟/關閉合作"
    }).click(switchCoworkSetting).css('width', '150px').appendTo(studentControlContainer)
    //批量刪除學生
    $('<button>').prop({
        className: 'btn btn-primary studentList_operationButtonContainer_btn',
        innerHTML: '批量刪除學生'
    }).click(deleteStudent).css('width', '150px').appendTo(studentControlContainer)
    //--------------------------------------------------------------------------------

    // Table 標頭---------------------------------------------------------------------
    const studentList_Container = $('<div>').prop({
        className: 'studentList_studentContainer container-lg'
    }).appendTo(courseContainer)
    const studentList_Table = $('<table>').prop({
        className: 'table studentList_studentTable table-striped table-responsive caption-top'
    }).appendTo(studentList_Container)
    $('<caption>').prop({
        innerHTML: "學生名單"
    }).appendTo(studentList_Table)
    const studentList_Table_thead = $('<thead>').prop({ className: "table-light" }).appendTo(studentList_Table)
    const studentList_Table_tr = $('<tr>').appendTo(studentList_Table_thead)
    const headList = ['編號', '學號', '姓名', '個人/合作', '設定']
    headList.forEach((value, index) => {
        if (index == 0) {
            $('<th>').prop({
                scope: "col",
                innerHTML: '<input class="form-check-input" type="checkbox">' + value
            }).change(swichSelectAllStudent).appendTo(studentList_Table_tr)
            return
        }
        $('<th>').prop({
            scope: "col",
            innerHTML: value
        }).appendTo(studentList_Table_tr)
    })
    const studentList_tbody = $('<tbody>').appendTo(studentList_Table)
    //-----------------------------------------------------------------------------
    // 學生名單-----------------------------------------------------------------------------
    const studentList = {}
    adminClientConnect.getAllStudent().then(response => {
        if (customizeOperation.serverResponseErrorDetect(response)) {
            if (response.data.studentData === null || response.data.studentData === undefined) return

            // 學生屆數分類
            response.data.studentData.forEach((student, index) => {
                if (studentList[student.studentClass] === undefined) {
                    studentList[student.studentClass] = [student]
                } else {
                    studentList[student.studentClass].push(student)
                }
            })
        }
        // 將屆數載入選擇器中
        Object.keys(studentList).forEach((value, index) => {
            const courseOption = $('<option>').prop({
                value: value,
                innerHTML: value
            }).appendTo(classSelector)

            if (index === Object.keys(studentList).length - 1) {
                courseOption.attr('selected', true)
            }
        })
        classSelector.on('change', (e) => {
            renderStudentList(studentList[e.target.value])
        })
        // 產生名單
        renderStudentList(studentList[classSelector.val()])
        customizeOperation.loadingPage(false)
    })
    //----------------------------------------------------

    // 下載所有事件紀錄
    function downloadAllListening() {
        customizeOperation.loadingPage(true)
        adminClientConnect.getAllStudentListener().then(response => {
            if (customizeOperation.serverResponseErrorDetect(response)) {
                console.log(response.data.message.sheetData, response.data.message.sheetName)
                customizeOperation.downloadDataToExcel("listenerData", response.data.message.sheetData, response.data.message.sheetName)
            }
            customizeOperation.loadingPage(false)
        })
    }

    // 下載所有回饋
    function downloadAllReflection() {
        const courseId = $('#reflectionCourse').val()
        const courseName = $('#reflectionCourse').find("option:selected").text()

        customizeOperation.loadingPage(true)
        adminClientConnect.getAllStudentReflection(courseId).then(response => {
            if (customizeOperation.serverResponseErrorDetect(response)) {
                customizeOperation.downloadDataToExcel(courseName, response.data.message.sheetData, response.data.message.sheetName)
            }
            customizeOperation.loadingPage(false)
        })
    }

    // 下載空白學生名單
    function downloadEmptyStudentList() {
        const classNumber = prompt("請輸入級數(產生該屆空白名單) ex:110")

        if (classNumber === "" || classNumber === null) {
            alert("Cancel")
            return
        }
        customizeOperation.downloadDataToExcel(`空白學生名單_${Number(classNumber)}`, [[{ "級數": "", "學號": "", "姓名": "", "密碼": "" }]], ["108"])
    }

    // 批量上傳學生名單
    function uploadStudentList(e) {
        if (e.target.files[0].name.split('_')[0] != '空白學生名單') {
            window.alert("檔案錯誤")
            return
        }
        customizeOperation.loadingPage(true)
        const [file] = e.target.files
        const reader = new FileReader()

        reader.onload = async (evt) => {
            const bstr = evt.target.result
            const wb = XLSX.read(bstr, { type: "binary" })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 })
            //取得上傳屆數
            const session = $('#studentListFile').val().split("_")[1]

            let SPdata = data.split("\n")

            let studentListUpdate = []

            // 整理讀取之資料
            for (let i = 1; i < SPdata.length - 1; i++) {
                const DataSplit = SPdata[i].split(",")
                studentListUpdate.push({
                    studentClass: DataSplit[0],
                    studentId: DataSplit[1],
                    studentName: DataSplit[2],
                    studentPassword: DataSplit[3]
                })
            }

            await adminClientConnect.updateStudentList(studentListUpdate, session).then(response => {
                if (customizeOperation.serverResponseErrorDetect(response)) {

                    customizeOperation.loadingPage(false)
                }
            })
        }
        reader.readAsBinaryString(file)
    }

    // 全選/取消選取學生
    function swichSelectAllStudent(e) {
        $('.studentAccess_checkbox').each((index, element) => {
            element.checked = e.target.checked
        })
    }

    // 切換合作
    function switchCoworkSetting() {
        // 取得所有已勾選人員
        let studentList = []
        let confirmList = []
        $('.studentAccess_checkbox').each((index, element) => {
            const studentId = element.id.split("_")[1]
            if (element.checked) {
                studentList.push(studentId)
                confirmList.push($(`#studentList_studentAccess_${studentId}`).html() == "合作" ? true : false)
            }
        })
        if (studentList.length == 0) return alert("尚未選擇學生")

        if (confirm(studentList.map((studentId, index) => {
            if (confirmList[index]) {
                return `${studentId}:合作 -> 個人\n`
            } else {
                return `${studentId}:個人 -> 合作\n`
            }
        }) + '請確認以上操作')) {
            customizeOperation.loadingPage(true)
            adminClientConnect.updateStudent('switchCowork', studentList, classSelector.val(), confirmList).then(response => {
                if (customizeOperation.serverResponseErrorDetect(response)) window.location.reload()
            })
        } else alert('cancel')

    }

    // 批量刪除學生
    function deleteStudent() {
        // 取得所有已勾選人員
        let studentList = new Array(...$('.studentAccess_checkbox').filter((index, element) => element.checked).map((index, element) => element.id.split("_")[1].toString()))
        if (studentList.length == 0) return alert("尚未選擇學生")

        if (confirm("確認刪除以下學生?\n" + studentList.map(value => value))) {
            customizeOperation.loadingPage(true)
            adminClientConnect.deleteStudent(studentList, $('#classSelector').val()).then(response => {
                if (customizeOperation.serverResponseErrorDetect(response)) {
                    alert(response.data.message)
                    window.location.reload()
                }
            })
        } else alert("cancel")
    }

    // 產生學生名單
    function renderStudentList(studentList) {
        studentList_tbody.empty()
        studentList.forEach((student, index) => {
            const studentTr = $('<tr>').appendTo(studentList_tbody)
            // Number
            $('<td>').prop({
                className: 'studentList_studentNum',
                innerHTML: `<input class="form-check-input studentAccess_checkbox" id="studentAccess_${student.studentId}" type="checkbox">`
            }).appendTo(studentTr)

            // studentId
            $('<td>').prop({
                className: 'studentList_studentId',
                innerHTML: student.studentId
            }).appendTo(studentTr)

            // studentName
            $('<td>').prop({
                className: 'studentList_studentName',
                innerHTML: student.studentName
            }).appendTo(studentTr)

            // studentAccess
            $('<td>').prop({
                className: student.studentAccess ? 'studentList_studentAccess studentAccess_cowork' : 'studentList_studentAccess studentAccess_personal',
                innerHTML: student.studentAccess ? '合作' : '個人',
                id: `studentList_studentAccess_${student.studentId}`
            }).appendTo(studentTr)
            //----------------------------------------------------
            // student controller
            const studentControllerContainer = $('<td>').prop({
                className: 'studentList_studentController'
            }).appendTo(studentTr)

            $('<button>').prop({
                className: 'btn btn-outline-primary',
                id: `studentController_${index}`,
                innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><style>svg{fill:#000000}</style><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" /></svg>',
            }).attr({
                'data-bs-toggle': 'dropdown',
                'aria-expanded': 'false',
            }).appendTo(studentControllerContainer)

            const studentControllerUL = $('<ul>').prop({
                className: "dropdown-menu dropdown-menu-dark dropdown-menu-end",
            }).attr({
                'aria-lebelledby': `studentController_${index}`
            }).appendTo(studentControllerContainer)

            // dropdown Title
            $('<li>').prop({
                innerHTML: '<h6 class="dropdown-header">學生設定</h6>'
            }).appendTo(studentControllerUL)

            const dropDownList = [
                { name: "修改密碼", clickFunc: () => controllerFunc.changePassword() },
                { name: "刪除學生", clickFunc: () => controllerFunc.deleteStudent() },
                { name: "個人/合作", clickFunc: () => controllerFunc.switchCowork() },
                { name: "下載事件紀錄", clickFunc: () => controllerFunc.getListenerData(student.studentClass, student.studentId) },
                { name: "觀看心智圖", clickFunc: () => controllerFunc.watchingList(student.studentClass, student.studentId) },
                { name: "下載所有反思", clickFunc: () => controllerFunc.downloadReflection(student.studentClass, student.studentId) }
            ]

            dropDownList.forEach(value => {
                $('<li>').prop({
                    className: 'dropdown-item',
                    innerHTML: value.name
                }).click(value.clickFunc).appendTo(studentControllerUL)
            })
        })
    }

    //
    const controllerFunc = {
        // 改密碼
        changePassword:
            () => {

            },
        // 刪學生
        deleteStudent:
            () => {

            },
        // 修改個人/合作
        switchCowork:
            () => {

            },
        // 下載單一學生監聽紀錄
        getListenerData:
            (studentClass, studentId) => {
                customizeOperation.loadingPage(true)
                adminClientConnect.getSingleStudentListener(studentClass, studentId).then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        customizeOperation.downloadDataToExcel(`${studentId}_listenerData`, response.data.message.sheetData, response.data.message.sheetName)
                        customizeOperation.loadingPage(false)
                    }
                })
            },
        // 監看 Golist
        watchingList:
            (studentClass, studentId) => {
                customizeOperation.loadingPage(true)
                adminClientConnect.getStudentCourse(studentClass, studentId).then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        const courseContainer = $("<div>").prop({
                            className: 'studentList_courseContainer'
                        }).click(e => {
                            e.stopPropagation()
                            courseContainer.fadeOut(200)
                            setTimeout(e => {
                                courseContainer.remove()
                            }, 200)
                        }).prependTo("body")

                        const courseDiv = $('<div>').prop({
                            className: 'studentList_courseDiv'
                        }).click(e => {
                            e.stopPropagation()
                        }).appendTo(courseContainer)
                        if (response.data.status === 501) {
                            courseDiv.html("目前未有使用過的課程")
                            customizeOperation.loadingPage(false)
                            return
                        }
                        const studentContent = response.data.message.studentCourse
                        const courseContent = response.data.message.courseData
                        const courseId = Object.keys(studentContent)

                        courseId.forEach((value, index) => {
                            console.log(courseContent[index].goListTitle)
                            const goListContainer = $('<div>').prop({
                                className: 'goListCourse_contentContainer'
                            }).click(e => {
                                enterClass(value)
                            }).appendTo(courseDiv)

                            //Image Box
                            $('<div>').prop({
                                className: 'goListCourse_contentImageBox',
                                innerHTML: '<img src="../media/img/amumamum.PNG" alt="home" style="width:100%;height: 60%">'
                            }).appendTo(goListContainer)

                            //Title Detail
                            $('<div>').prop({
                                className: 'goListCourse_contentTitle',
                                innerHTML: courseContent[index].goListTitle
                            }).appendTo(goListContainer)

                            const enterClass = (id) => {
                                window.location.href = `/${studentId}/${id}`
                            }
                        })
                        customizeOperation.loadingPage(false)
                    }
                })
            },
        // 下載單一學生反思
        downloadReflection:
            (studentClass, studentId) => {
                customizeOperation.loadingPage(true)
                adminClientConnect.getSingleStudentReflection(studentClass, studentId).then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        customizeOperation.downloadDataToExcel(`${studentId}_reflectionData`, response.data.message.sheetData, response.data.message.sheetName)
                        customizeOperation.loadingPage(false)
                    }
                })
            }
    }
}

// 生成 Group 編輯部分
const renderGroup = async () => {
    customizeOperation.loadingPage(true)

    const courseContainer = $('.goListCourse')
    // Operation Button--------------------------------------------------------------
    const operationButtonContainer = $('<div>').prop({
        className: 'groupList_operationButtonContainer container-lg row'
    }).appendTo(courseContainer)

    $('<button>').prop({
        className: 'btn btn-success groupList_operationButtonContainer_btn col-2',
        innerHTML: "新增群組"
    }).attr({
        'data-bs-toggle': 'modal',
        'data-bs-target': '#adminContainer_modal'
    }).click(addNewGroup).appendTo(operationButtonContainer)
    // 屆數選擇---------------------------------------------------------------------
    const groupClassContainer = $('<div>').prop({
        className: 'studentList_operationButtonContainer container-lg row'
    }).appendTo(courseContainer)
    const classGroup = $('<div>').prop({ className: 'input-group col-4' }).css('width', '250px').appendTo(groupClassContainer)
    //change function 在下方
    const classSelector = $('<select>').prop({ className: 'form-select', id: 'classSelector' }).appendTo(classGroup)
    $('<button>').prop({
        className: 'btn btn-light studentList_operationButtonContainer_btn',
        innerHTML: "屆數選擇"
    }).attr('disabled', 'disabled').appendTo(classGroup)
    //Table 標頭---------------------------------------------------------------------
    const GroupList_Container = $('<div>').prop({
        className: 'groupList_GroupContainer container-lg'
    }).appendTo(courseContainer)
    const GroupList_Table = $('<table>').prop({
        className: 'table groupList_GroupTable table-responsive caption-top'
    }).appendTo(GroupList_Container)
    $('<caption>').prop({
        innerHTML: "學生名單"
    }).appendTo(GroupList_Table)
    const GroupList_Table_thead = $('<thead>').prop({ className: "table-light" }).appendTo(GroupList_Table)
    const GroupList_Table_tr = $('<tr>').appendTo(GroupList_Table_thead)
    const headList = ['組別', 'CID', '組員', '設定']
    headList.forEach(value => {
        $('<th>').prop({
            scope: "col",
            innerHTML: value
        }).appendTo(GroupList_Table_tr)
    })
    const GroupList_tbody = $('<tbody>').appendTo(GroupList_Table)


    //學生名單(比對名稱用)
    const studentList = await adminClientConnect.getAllStudent().then(response => { if (customizeOperation.serverResponseErrorDetect(response)) return response.data.studentData })
    const studentName = new Map()
    const studentChatRoomId = new Map()
    studentList.forEach(student => {
        studentName.set(student.studentId, student.studentName)
        if (student.studentChatRoomId == undefined || student.studentChatRoomId == "") {
            studentChatRoomId.set(student.studentId, 0)
        } else {
            studentChatRoomId.set(student.studentId, student.studentChatRoomId)
        }
    })
    //生成 Group 名單---------------------------------------------------------------
    const groupList = {}
    adminClientConnect.getAllStudentGroup().then((response) => {
        if (customizeOperation.serverResponseErrorDetect(response)) {
            response.data.message.chatRoom.forEach((group, index) => {
                if (groupList[group.class] === undefined) {
                    groupList[group.class] = [group]
                } else {
                    groupList[group.class].push(group)
                }
            })
            // 將屆數載入選擇器中
            Object.keys(groupList).forEach((value, index) => {
                const courseOption = $('<option>').prop({
                    value: value,
                    innerHTML: value
                }).appendTo(classSelector)

                if (index === Object.keys(groupList).length - 1) {
                    courseOption.attr('selected', true)
                }
            })
            classSelector.on('change', (e) => {
                renderStudentGroup(groupList[e.target.value])
            })
            // 產生群組名單
            renderStudentGroup(groupList[classSelector.val()])
            customizeOperation.loadingPage(false)
        }
    })

    //新增群組
    function addNewGroup() {
        // 設定 Title 名稱
        $('#adminContainer_modal_title').html("新增群組")
        const modalContent = $('#adminContainer_modal_content')
        // 清空原物件
        modalContent.empty()

        // 設定 Modal 送出設定
        $('#adminContainer_modal_submit').click(sendGroupList)

        const classSelectContainer = $('<div>').prop({
            className: 'input-group mb3 groupList_addGroup_classSelector'
        }).appendTo(modalContent)
        $('<button>').prop({
            className: 'btn btn-success',
            innerHTML: '確認輸入'
        }).click(renderStudentTable).appendTo(classSelectContainer)
        $('<input>').prop({
            className: 'form-control',
            id: 'classSelectorInput',
            type: 'text',
            value: classSelector.val()
        }).attr('placeholder', '請輸入屆數').appendTo(classSelectContainer)

        const addGroupTable = $('<table>').prop({
            className: 'table groupList_addGroup_table table-responsive caption-top'
        }).appendTo(modalContent)

        // header 設定
        const addGroupTable_Table_thead = $('<thead>').prop({ className: "table-light" }).appendTo(addGroupTable)
        const addGroupTable_Table_tr = $('<tr>').appendTo(addGroupTable_Table_thead)
        const headList = ['組員']
        headList.forEach(value => {
            $('<th>').prop({
                scope: "col",
                innerHTML: value
            }).appendTo(addGroupTable_Table_tr)
        })
        const GroupList_tbody = $('<tbody>').appendTo(addGroupTable)


        // 選擇屆數後生成該屆數之學生名單
        function renderStudentTable() {
            GroupList_tbody.empty()
            // 製作所有學生的 Selector
            const studentSelector = $('<select>').prop({ className: 'form-select addGroup_studentSelector' })
            $('<option>').prop({
                value: '',
                innerHTML: '請選擇學生',
            }).appendTo(studentSelector)

            studentList.forEach(student => {
                if (student.studentClass == $('#classSelectorInput').val()) {
                    $('<option>').prop({
                        value: student.studentId,
                        innerHTML: student.studentName + " " + student.studentId,
                    }).appendTo(studentSelector)
                }
            })
            // 創建 6 名組員選擇器
            for (let i = 0; i < 6; i++) {
                const GroupTr = $('<tr>').appendTo(GroupList_tbody)
                const selector = $('<td>').appendTo(GroupTr)
                studentSelector.clone().prop({
                    id: `addGroup_studentSelector_${i}`
                }).appendTo(selector)
            }
        }

        // 送出 Group 名單
        function sendGroupList() {
            let studentList = []
            let isComplete = true
            customizeOperation.loadingPage(true)
            $('.addGroup_studentSelector').each((index, element) => {
                if (element.value !== "") {
                    if (studentChatRoomId.has(element.value) && studentChatRoomId.get(element.value) !== 0) {
                        alert(`${element.value} 學生已經有群組`)
                        isComplete = false
                    }
                    if (studentList.some(studentId => studentId == element.value)) {
                        alert(`${element.value} 學生重複選擇`)
                        isComplete = false
                    }
                    studentList.push(element.value)
                }
            })
            if (!isComplete) {
                customizeOperation.loadingPage(false)
                return
            }
            if (studentList.length == 0) {
                alert("尚未選擇學生")
                customizeOperation.loadingPage(false)
                return
            }
            if (confirm('確定送出?')) {
                adminClientConnect.addNewStudentGroup($('#classSelectorInput').val(), studentList).then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        alert(response.data.message)
                        window.location.reload()
                    }
                })
            } else {
                customizeOperation.loadingPage(false)
            }
        }
    }

    //產生群組名單
    function renderStudentGroup(groupList) {
        GroupList_tbody.empty()
        groupList.forEach((group, index) => {
            const GroupTr = $('<tr>').appendTo(GroupList_tbody)
            // 組別
            $('<th>').prop({
                className: 'groupList_groupNum',
                scope: 'row',
                innerHTML: index + 1
            })
                .attr('rowspan', group.studentGroup.length)
                .attr('valign', 'middle')
                .appendTo(GroupTr)

            // CID
            $('<td>').prop({
                className: 'groupList_groupCid',
                innerHTML: group.chatRoomId
            })
                .attr('rowspan', group.studentGroup.length)
                .attr('valign', 'middle')
                .appendTo(GroupTr)

            // 建立第一個學生 Td 以確保之後的學生 list 能夠順利塞在同一排
            $('<td>').prop({
                className: 'groupList_studentId',
                innerHTML: group.studentGroup[0] + ' ' + studentName.get(group.studentGroup[0])
            }).appendTo(GroupTr)

            // group controller
            const groupControllerContainer = $('<td>').prop({
                className: 'grouptList_groupController'
            })
                .attr('rowspan', group.studentGroup.length)
                .attr('valign', 'middle')
                .appendTo(GroupTr)
            $('<button>').prop({
                className: 'btn btn-outline-primary',
                id: `groupController_${index}`,
                innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><style>svg{fill:#000000}</style><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" /></svg>',
            }).attr({
                'data-bs-toggle': 'dropdown',
                'aria-expanded': 'false',
            }).appendTo(groupControllerContainer)

            const groupControllerUL = $('<ul>').prop({
                className: "dropdown-menu dropdown-menu-dark dropdown-menu-end",
            }).attr({
                'aria-lebelledby': `groupController_${index}`
            }).appendTo(groupControllerContainer)

            // dropdown Title
            $('<li>').prop({
                innerHTML: '<h6 class="dropdown-header">群組設定</h6>'
            }).appendTo(groupControllerUL)

            const dropDownList = [
                { name: "修改成員", clickFunc: () => controllerFunc.changeGroupMate(group.chatRoomId, studentName) },
                { name: "下載聊天紀錄", clickFunc: () => controllerFunc.downloadMessageHistory(group.chatRoomId) },
            ]

            dropDownList.forEach(value => {
                $('<li>').prop({
                    className: 'dropdown-item',
                    innerHTML: value.name
                }).click(value.clickFunc).appendTo(groupControllerUL)
            })

            //建立之後的學生名單
            group.studentGroup.forEach((studentId, index) => {
                if (index > 0) {
                    const nextTr = $('<tr>').appendTo(GroupList_tbody)
                    $('<td>').prop({
                        className: 'groupList_studentId',
                        innerHTML: studentId + ' ' + studentName.get(studentId)
                    }).appendTo(nextTr)
                }
            })
        })
    }

    const controllerFunc = {
        //修改組別成員
        changeGroupMate: async (chatRoomId, studentName) => {
            const studentId = prompt("請輸入學號(輸入現有學號代表刪除, 輸入新學號代表加入)")

            customizeOperation.loadingPage(true)
            if (studentId === "" || studentId === null) {
                alert("Cancel")
                customizeOperation.loadingPage(false)
                return
            }
            if (!studentName.get(studentId)) {
                alert("查無此學號")
                customizeOperation.loadingPage(false)
                return
            }

            const groupInfoData = await adminClientConnect.getStudentGroup(chatRoomId).then(response => { return response.data.message })
            // 加入新學生
            if (groupInfoData.studentGroup.indexOf(studentId) === -1) {
                groupInfoData.studentGroup.push(studentId)
                await adminClientConnect.updateStudent('addChatRoom', studentId, groupInfoData.class, null, chatRoomId).then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        alert(response.data.message)
                    }
                })
            }
            else {
                //刪除原群組的學生
                groupInfoData.studentGroup.splice(groupInfoData.studentGroup.indexOf(studentId), 1)
                await adminClientConnect.updateStudent('removeChatRoom', studentId, groupInfoData.class).then(response => {
                    if (customizeOperation.serverResponseErrorDetect(response)) {
                        alert(response.data.message)
                    }
                })
            }
            groupInfoData.studentGroup.sort((a, b) => { return a - b })

            adminClientConnect.updateStudentGroup(chatRoomId, groupInfoData.studentGroup, groupInfoData.class).then(response => {
                if (customizeOperation.serverResponseErrorDetect(response)) {
                    alert(response.data.message)
                    window.location.reload()
                }
            })
            customizeOperation.loadingPage(false)
        },
        //下載訊息紀錄
        downloadMessageHistory: (chatRoomId) => {
            customizeOperation.loadingPage(true)
            adminClientConnect.getStudentGroup(chatRoomId).then(response => {
                if (customizeOperation.serverResponseErrorDetect(response)) {
                    customizeOperation.downloadDataToExcel(chatRoomId, [response.data.message.messageHistory], ["History"])
                    customizeOperation.loadingPage(false)
                }
            })
        }
    }
}

// 選擇生成哪一個部分
const homRenderInit = () => {
    if (window.location.hash == '#Student') {
        window.location.href = '#Student'
        $('.goListTitle_Selection').removeClass('title_selected')
        renderStudentList()
    } else if (window.location.hash == '#Group') {
        window.location.href = '#Group'
        $('.goListTitle_Selection').removeClass('title_selected')
        renderGroup()
    } else {
        window.location.href = '#Course'
        $('.goListTitle_Selection').removeClass('title_selected')
        renderGoList()
    }
    $(window.location.hash).addClass('title_selected')
}

window.addEventListener('DOMContentLoaded', homRenderInit)