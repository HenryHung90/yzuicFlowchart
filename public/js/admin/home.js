import { NormalizeFunc } from '../../global/common.js'
import { adminClientConnect } from '../../global/axiosconnect.js'

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
    if (target.id === 'titleCourse') {
        renderGoList()
    } else {
        renderStudentList()
    }
}

// 生成 Course 部分
const renderGoList = () => {
    NormalizeFunc.loadingPage(true)
    adminClientConnect.getAllCourse().then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            if (response.data.standardData === null || response.data.standardData === undefined) return
            response.data.standardData.forEach((value, index) => {
                const goListContainer = $('<div>').prop({
                    className: 'goListCourse_contentContainer'
                }).click(e => {
                    enterClass(value._id)
                }).appendTo($('.goListCourse'))

                //Image Box
                $('<div>').prop({
                    className: 'goListCourse_contentImageBox',
                    innerHTML: '<img src="../media/img/amumamum.PNG" alt="home" style="width:100%;height: 60%">'
                }).appendTo(goListContainer)

                //Title Detail
                $('<div>').prop({
                    className: 'goListCourse_contentTitle',
                    innerHTML: value.goListTitle
                }).appendTo(goListContainer)

                const enterClass = (id) => {
                    window.location.href = `/admin/${id}`
                }
            })

        }
        NormalizeFunc.loadingPage(false)
    })
}

const renderStudentList = () => {
    NormalizeFunc.loadingPage(true)

    const courseContainer = $('.goListCourse')

    const operationButtonContainer = $('<div>').prop({
        className: 'studentList_operationButtonContainer container-lg'
    }).appendTo(courseContainer)

    $('<button>').prop({
        className: 'btn btn-success',
        innerHTML: "下載所有事件紀錄"
    }).click(e => { downloadAllListening() }).appendTo(operationButtonContainer)



    adminClientConnect.getAllStudent().then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            if (response.data.studentData === null || response.data.studentData === undefined) return

            let index = 0;
            for (const { studentClass, studentId, studentName } of response.data.studentData) {
                const studentContainer = $('<div>').prop({
                    className: 'studentList_studentContainer container-lg row'
                }).appendTo(courseContainer)

                // Number
                $('<div>').prop({
                    className: 'col-1 studentList_studentNum',
                    innerHTML: index
                }).appendTo(studentContainer)

                // studentId
                $('<div>').prop({
                    className: 'col-2 studentList_studentId',
                    innerHTML: studentId
                }).appendTo(studentContainer)

                // studentName
                $('<div>').prop({
                    className: 'col-2 studentList_studentName',
                    innerHTML: studentName
                }).appendTo(studentContainer)

                //----------------------------------------------------
                // student controller
                const studentController = $('<div>').prop({
                    className: 'col-5 studentList_studentController'
                }).appendTo(studentContainer)

                //change password
                $('<button>').prop({
                    className: 'btn btn-outline-primary',
                    innerHTML: '改密碼'
                }).click(e => {
                    controllerFunc.changePassword()
                }).appendTo(studentController)

                //delete student
                $('<button>').prop({
                    className: 'btn btn-outline-primary',
                    innerHTML: '刪學生'
                }).click(e => {
                    controllerFunc.deleteStudent()
                }).appendTo(studentController)

                //litsen data
                $('<button>').prop({
                    className: 'btn btn-outline-primary',
                    innerHTML: '事件紀錄'
                }).click(e => {
                    controllerFunc.getListenerData()
                }).appendTo(studentController)

                //watch student golist data
                $('<button>').prop({
                    className: 'btn btn-outline-primary',
                    innerHTML: 'GoList'
                }).click(e => {
                    controllerFunc.watchingList(studentClass, studentId)
                }).appendTo(studentController)

                //----------------------------------------------------
                index++;
            }

            NormalizeFunc.loadingPage(false)
        }

    })


    // 下載所有事件紀錄
    const downloadAllListening = () => {
        NormalizeFunc.loadingPage(true)
        adminClientConnect.getAllStudentListener().then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                console.log(response.data)
                downloadDatatoExcel("listenerData", response.data.message.sheetData, response.data.message.sheetName)
            }
            NormalizeFunc.loadingPage(false)
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
        // 監聽紀錄
        getListenerData:
            () => {

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
                                window.location.href = `/admin/${studentId}/${id}`
                            }
                        })
                        NormalizeFunc.loadingPage(false)
                    }
                })
            }
    }

    //return Download xlsx
    const downloadDatatoExcel = async (workbookTitle, worksheetData, worksheetName) => {
        const workbook = XLSX.utils.book_new();
        worksheetData.map((dataValue, dataIndex) => {
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataValue), worksheetName[dataIndex]);
            //Binary string
            // XLSX.write(workbook, { book_type: "xlsx", type: "binary" });
            if (dataIndex == worksheetData.length - 1) {
                const Month = new Date().getMonth();
                const Today = new Date().getDate();
                XLSX.writeFile(workbook, `Student_${workbookTitle}_${Month}\/${Today}.xls`);
            }
        })
    }
}

window.addEventListener('DOMContentLoaded', renderGoList)