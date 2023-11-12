import { NormalizeFunc } from '../../global/common.js'
import { adminClientConnect } from '../../global/axiosconnect.js'
NormalizeFunc.loadingPage(true)

//----click function----//
$('#logout').click(e => logout())
$('#changePassword').click(e => changePassword())
$('.goListTitle_Selection').click(e => changeSelection(e.currentTarget))


const logout = () => {
    NormalizeFunc.loadingPage(true)
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
        NormalizeFunc.loadingPage(true)
        axios({
            method: 'POST',
            url: '/student/changepassword',
            data: {
                oldPassword: OP,
                newPassword: NP_2,
            },
            withCredentials: true
        }).then(async response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                window.alert(response.data.message)
                NormalizeFunc.loadingPage(false)
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
    NormalizeFunc.loadingPage(true)
    const courseContainer = $('.goListCourse')

    //一般課程區-------------------------------------------------------
    $('<h2>').prop({
        className: "goListCourse_contentTitle",
        innerHTML: "一般課程"
    }).appendTo(courseContainer)

    await adminClientConnect.getAllCourse().then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            if (response.data.standardData === null || response.data.standardData === undefined) return
            renderCourse(response.data.standardData, 'course')
        }
        NormalizeFunc.loadingPage(false)
    })

    //共編課程區-------------------------------------------------------
    $('<h2>').prop({
        className: "goListCourse_contentTitle",
        innerHTML: "共編課程"
    }).appendTo(courseContainer)

    await adminClientConnect.getAllCoworkCourse().then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            if (response.data.coworkData === null || response.data.coworkData === undefined) return
            renderCourse(response.data.coworkData, 'cowork')
        }
    })

    function renderCourse(courseList, type) {
        courseList.forEach((value, index) => {
            const goListContainer = $('<div>').prop({
                className: 'goListCourse_contentContainer'
            }).click(e => {
                type == 'cowork' ? null : enterClass(value._id)
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

        const AddButton = $('<div>').prop({
            className: 'goListCourse_contentContainer'
        }).click(e => {
            type == 'cowork' ? null : addClass()
        }).appendTo(courseContainer)
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

        const enterClass = (id) => {
            window.location.href = `/admin/${id}`
        }

        const addClass = () => {
            const courseName = window.prompt("請輸入您的課程名稱", "")
            const courseClass = window.prompt("請輸入適用屆數", "")

            if (courseName !== null) {
                adminClientConnect.createCourse(courseName, courseClass).then(response => {
                    if (NormalizeFunc.serverResponseErrorDetect(response)) {
                        const goListContainer = $('<div>').prop({
                            className: 'goListCourse_contentContainer'
                        }).click(e => {
                            enterClass(response.data.message._id)
                        }).insertBefore($('.goListCourse_addCourse'))

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

        const enterCourse = (id) => {
            window.location.href = ''
        }
    }
}

// 生成 Student 名單部分
const renderStudentList = async () => {
    NormalizeFunc.loadingPage(true)

    const courseContainer = $('.goListCourse')
    courseContainer.css({ 'display': 'inline-block' })
    //下載所有事件紀錄----------------------------------------------------------------
    const operationButtonContainer = $('<div>').prop({
        className: 'studentList_operationButtonContainer container-lg row'
    }).appendTo(courseContainer)

    $('<button>').prop({
        className: 'btn btn-info studentList_operationButtonContainer_btn col-4',
        innerHTML: "下載所有事件紀錄"
    }).click(downloadAllListening).appendTo(operationButtonContainer)
    //-----------------------------------------------------------------------------
    //下載單一課程所有反思----------------------------------------------------------------
    const reflectionGroup = $('<div>').prop({ className: 'input-group col-4' }).css('width', '250px').appendTo(operationButtonContainer)
    const relfectionCourse = $('<select>').prop({ className: 'form-select', id: 'reflectionCourse' }).appendTo(reflectionGroup)

    //取得所有課程 (用於下載區)
    adminClientConnect.getAllCourse().then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
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
    //選擇屆數-----------------------------------------------------------------------
    const studentClassContainer = $('<div>').prop({
        className: 'studentList_studentClassContainer container-lg row'
    }).appendTo(courseContainer)
    const classGroup = $('<div>').prop({ className: 'input-group col-4' }).css('width', '250px').appendTo(studentClassContainer)
    const classSelector = $('<select>').prop({ className: 'form-select', id: 'classSelector' }).appendTo(classGroup)
    $('<button>').prop({
        className: 'btn btn-info studentList_operationButtonContainer_btn',
        innerHTML: "屆數選擇"
    })
        .attr('disabled', 'disabled')
        .appendTo(classGroup)
    //Table 標頭---------------------------------------------------------------------
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
    const headList = ['編號', '學號', '姓名', '設定']
    headList.forEach(value => {
        $('<th>').prop({
            scope: "col",
            innerHTML: value
        }).appendTo(studentList_Table_tr)
    })
    const studentList_tbody = $('<tbody>').appendTo(studentList_Table)
    //-----------------------------------------------------------------------------
    //學生名單-----------------------------------------------------------------------------
    const studentList = {}
    adminClientConnect.getAllStudent().then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
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

            if (index === 0) {
                courseOption.attr('selected', true)
            }
        })
        classSelector.on('change', (e) => {
            renderStudentList(studentList[e.target.value])
        })
        // 產生名單
        renderStudentList(studentList[classSelector.val()])
        NormalizeFunc.loadingPage(false)
    })
    //----------------------------------------------------
    // 下載所有事件紀錄
    function downloadAllListening() {
        NormalizeFunc.loadingPage(true)
        adminClientConnect.getAllStudentListener().then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                NormalizeFunc.downloadDatatoExcel("listenerData", response.data.message.sheetData, response.data.message.sheetName)
            }
            NormalizeFunc.loadingPage(false)
        })
    }

    //下載所有回饋
    function downloadAllReflection() {
        const courseId = $('#reflectionCourse').val()
        const courseName = $('#reflectionCourse').find("option:selected").text()

        NormalizeFunc.loadingPage(true)
        adminClientConnect.getAllStudentReflection(courseId).then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                NormalizeFunc.downloadDatatoExcel(courseName, response.data.message.sheetData, response.data.message.sheetName)
            }
            NormalizeFunc.loadingPage(false)
        })
    }

    //產生學生名單
    function renderStudentList(studentList) {
        studentList_tbody.empty()
        studentList.forEach((student, index) => {
            const studentTr = $('<tr>').appendTo(studentList_tbody)
            // 檢查屆數
            // Number
            $('<td>').prop({
                className: 'studentList_studentNum',
                innerHTML: index
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
                { name: "下載事件紀錄", clickFunc: () => controllerFunc.getListenerData(student.studentClass, student.studentId) },
                { name: "觀看心智圖", clickFunc: () => controllerFunc.watchingList(student.studentClass, student.studentId) },
                { name: "下載所有反思", clickFunc: () => controller.downloadReflection(student.studentClass, student.studentId) }
            ]

            dropDownList.forEach(value => {
                $('<li>').prop({
                    className: 'dropdown-item',
                    innerHTML: value.name
                }).click(value.clickFunc).appendTo(studentControllerUL)
            })
        })
    }


    const controllerFunc = {
        // 改密碼
        changePassword:
            () => {

            },
        // 刪學生
        deleteStudent:
            () => {

            },
        // 下載單一學生監聽紀錄
        getListenerData:
            (studentClass, studentId) => {
                NormalizeFunc.loadingPage(true)
                adminClientConnect.getSingleStudentListener(studentClass, studentId).then(response => {
                    if (NormalizeFunc.serverResponseErrorDetect(response)) {
                        NormalizeFunc.downloadDatatoExcel(`${studentId}_listenerData`, response.data.message.sheetData, response.data.message.sheetName)
                        NormalizeFunc.loadingPage(false)
                    }
                })
            },
        // 監看 Golist
        watchingList:
            (studentClass, studentId) => {
                NormalizeFunc.loadingPage(true)
                adminClientConnect.getStudentCourse(studentClass, studentId).then(response => {
                    if (NormalizeFunc.serverResponseErrorDetect(response)) {
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
                            NormalizeFunc.loadingPage(false)
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
                        NormalizeFunc.loadingPage(false)
                    }
                })
            },
        // 下載單一學生反思
        downloadReflection:
            (studentClass, studentId) => {
                NormalizeFunc.loadingPage(true)
                adminClientConnect.getSingleStudentReflection(studentClass, studentId).then(response => {
                    if (NormalizeFunc.serverResponseErrorDetect(response)) {
                        console.log(response.data.message)
                        NormalizeFunc.downloadDatatoExcel(`${studentId}_reflectionData`, response.data.message.sheetData, response.data.message.sheetName)
                        NormalizeFunc.loadingPage(false)
                    }
                })
            }
    }
}

// 生成 Group 編輯部分
const renderGroup = async () => {
    NormalizeFunc.loadingPage(true)

    const courseContainer = $('.goListCourse')
    // Operation Button--------------------------------------------------------------
    const operationButtonContainer = $('<div>').prop({
        className: 'groupList_operationButtonContainer container-lg row'
    }).appendTo(courseContainer)

    $('<button>').prop({
        className: 'btn btn-success groupList_operationButtonContainer_btn col-2',
        innerHTML: "新增群組"
    }).click(addNewGroup).appendTo(operationButtonContainer)
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
    const studentList = await adminClientConnect.getAllStudent().then(response => { if (NormalizeFunc.serverResponseErrorDetect(response)) return response.data.studentData })
    console.log(studentList)
    const studentName = new Map()
    const studentChatRoomId = new Map()
    studentList.forEach(student => {
        studentName.set(student.studentId, student.studentName)
        studentChatRoomId.set(student.studentId, student.studentChatRoomId)
    })
    //生成 Group 名單---------------------------------------------------------------
    adminClientConnect.getAllStudentGroup().then((response) => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            console.log(response.data.message)
            response.data.message.chatRoom.forEach((value, index) => {
                const GroupTr = $('<tr>').appendTo(GroupList_tbody)
                // 組別
                $('<th>').prop({
                    className: 'groupList_groupNum',
                    scope: 'row',
                    innerHTML: index
                })
                    .attr('rowspan', value.studentGroup.length)
                    .attr('valign', 'middle')
                    .appendTo(GroupTr)

                // CID
                $('<td>').prop({
                    className: 'groupList_groupCid',
                    innerHTML: value.chatRoomId
                })
                    .attr('rowspan', value.studentGroup.length)
                    .attr('valign', 'middle')
                    .appendTo(GroupTr)

                // 建立第一個學生 Td 以確保之後的學生 list 能夠順利塞在同一排
                $('<td>').prop({
                    className: 'groupList_studentId',
                    innerHTML: value.studentGroup[0] + ' ' + studentName.get(value.studentGroup[0])
                }).appendTo(GroupTr)

                // group controller
                const groupControllerContainer = $('<td>').prop({
                    className: 'grouptList_groupController'
                })
                    .attr('rowspan', value.studentGroup.length)
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
                    { name: "修改成員", clickFunc: () => controllerFunc.changeGroupMate(value.chatRoomId, studentName) },
                    { name: "下載聊天紀錄", clickFunc: () => controllerFunc.downloadMessageHistory(value.chatRoomId) },
                ]

                dropDownList.forEach(value => {
                    $('<li>').prop({
                        className: 'dropdown-item',
                        innerHTML: value.name
                    }).click(value.clickFunc).appendTo(groupControllerUL)
                })

                //建立之後的學生名單
                value.studentGroup.forEach((studentId, index) => {
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
    })

    function addNewGroup() {
        const studentClass = prompt("請輸入學年度(ex:108)")
        const studentId = prompt("請輸入學號(以','分割學生學號)")

        NormalizeFunc.loadingPage(true)
        if (studentClass === "" || studentClass === null || studentId === "" || studentId === null) {
            alert("Cancel")
            NormalizeFunc.loadingPage(false)
            return
        }

        // 切割字串
        let studentGroup = []
        let temp = ""
        for (const index in studentId) {
            if (studentId[index] == ',') {
                studentGroup.push(temp)
                temp = ""
            } else if (index == studentId.length - 1) {
                temp += studentId[index]
                studentGroup.push(temp)
            } else {
                temp += studentId[index]
            }
        }

        let isAllExist = true
        //檢閱該 Ary 中之學生 Id 是否存在
        studentGroup.forEach(studentId => {
            // 如果學生名單沒有此人
            if (!studentName.get(studentId)) {
                alert("查無此學號:" + studentId)
                isAllExist = false
            }
            // 如果學生已經有群組
            if (studentChatRoomId.get(studentId)) {
                alert("此學生已有群組:" + studentId)
                isAllExist = false
            }
        })

        //檢閱通過才新增 Group
        if (isAllExist) {
            adminClientConnect.addNewStudentGroup(studentClass, studentGroup).then(response => {
                if (NormalizeFunc.serverResponseErrorDetect(response)) {
                    alert(response.data.message)
                    window.location.reload()
                }
            })
        }
        NormalizeFunc.loadingPage(false)
    }

    const controllerFunc = {
        //修改組別成員
        changeGroupMate: async (chatRoomId, studentName) => {
            const studentId = prompt("請輸入學號(輸入現有學號代表刪除, 輸入新學號代表加入)")

            NormalizeFunc.loadingPage(true)
            if (studentId === "" || studentId === null) {
                alert("Cancel")
                NormalizeFunc.loadingPage(false)
                return
            }
            if (!studentName.get(studentId)) {
                alert("查無此學號")
                NormalizeFunc.loadingPage(false)
                return
            }

            const groupInfoData = await adminClientConnect.getStudentGroup(chatRoomId).then(response => { return response.data.message })
            // 加入新學生
            if (groupInfoData.studentGroup.indexOf(studentId) === -1) groupInfoData.studentGroup.push(studentId)
            else {
                //刪除原群組的學生
                groupInfoData.studentGroup.splice(groupInfoData.studentGroup.indexOf(studentId), 1)
                await adminClientConnect.updateStudent('removeChatRoom', studentId, groupInfoData.class).then(response => {
                    if (NormalizeFunc.serverResponseErrorDetect(response)) {
                        alert(response.data.message)
                    }
                })
            }
            groupInfoData.studentGroup.sort((a, b) => { return a - b })

            adminClientConnect.updateStudentGroup(chatRoomId, groupInfoData.studentGroup, groupInfoData.class).then(response => {
                if (NormalizeFunc.serverResponseErrorDetect(response)) {
                    alert(response.data.message)
                    window.location.reload()
                }
            })
            NormalizeFunc.loadingPage(false)
        },
        //下載訊息紀錄
        downloadMessageHistory: (chatRoomId) => {
            NormalizeFunc.loadingPage(true)
            adminClientConnect.getStudentGroup(chatRoomId).then(response => {
                if (NormalizeFunc.serverResponseErrorDetect(response)) {
                    NormalizeFunc.downloadDatatoExcel(chatRoomId, [response.data.message.messageHistory], ["History"])
                    NormalizeFunc.loadingPage(false)
                }
            })
        }
    }

    NormalizeFunc.loadingPage(false)
}

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