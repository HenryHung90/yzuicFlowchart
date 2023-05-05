import { NormalizeFunc } from "./common.js"

const studentClientConnect = {
    // 登入
    login:
        (account, password) => {
            return (
                axios({
                    method: 'post',
                    url: '/login',
                    data: {
                        studentId: account,
                        studentPassword: password,
                    }
                })
            )
        },
    // 登出
    logout:
        () => {
            return (
                axios({
                    method: 'post',
                    url: '/logout'
                })
            )
        },
    // 修改密碼
    changePassword:
        (oldPassword, newPassword) => {
            return (
                axios({
                    method: 'POST',
                    url: '/student/changepassword',
                    data: {
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                    },
                    withCredentials: true
                })
            )
        },
    // 取得所有課程
    getAllCourse:
        () => {
            return (
                axios({
                    method: 'POST',
                    url: '/student/getallcourse',
                })
            )
        },
    //golist-----------------------------------------
    //讀取 golist
    readGoList:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/readgolist',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    //儲存 golist
    saveGoList:
        (goData, courseId) => {
            return (
                axios({
                    method: "post",
                    url: '/student/savegolist',
                    data: {
                        goList: goData,
                        courseId: courseId
                    }
                })
            )
        },
    //重整 goList
    restartGoList:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/restartgolist',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    //下載最新 golist
    downloadGoList:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/downloadgolist',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    //code-----------------------------------------
    //readCode
    readCode:
        (courseId, keyCode) => {
            if (NormalizeFunc.getCookie('adminId')) {
                return (
                    axios({
                        method: 'post',
                        url: '/admin/readcode',
                        data: {
                            studentId: NormalizeFunc.getFrontEndCode('studentId'),
                            courseId: NormalizeFunc.getFrontEndCode('courseId'),
                            keyCode: keyCode
                        }
                    })
                )
            }
            return (
                axios({
                    method: 'post',
                    url: '/student/readcode',
                    data: {
                        courseId: courseId,
                        keyCode: keyCode,
                    }
                })
            )
        },
    //saveCode
    saveCode:
        (setting, config, preload, create, update, custom, keyCode, courseId) => {
            if (NormalizeFunc.getCookie('adminId')) {
                return (
                    axios({
                        url: '/admin/skip',
                        method: 'post',
                    })
                )
            }
            return (
                axios({
                    url: '/student/savecode',
                    method: 'post',
                    data: {
                        setting: setting,
                        config: config,
                        preload: preload,
                        create: create,
                        update: update,
                        custom: custom,
                        keyCode: keyCode,
                        courseId: courseId
                    }
                })
            )
        },
    //刪除 code
    deleteCode:
        (courseId, keyCode) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/deletecode',
                    data: {
                        courseId: courseId,
                        keyCode: keyCode
                    }
                })
            )
        },
    //demo-----------------------------------------
    launchDemo:
        (setting, config, preload, create, update, custom) => {
            if (NormalizeFunc.getCookie('adminId')) {
                return (
                    axios({
                        url: '/launch/launchdemo',
                        method: 'post',
                        data: {
                            studentId: NormalizeFunc.getFrontEndCode("studentId"),
                            setting: setting,
                            config: config,
                            preload: preload,
                            create: create,
                            update: update,
                            custom: custom
                        }

                    })
                )
            }
            return (
                axios({
                    url: '/launch/launchdemo',
                    method: 'post',
                    data: {
                        setting: setting,
                        config: config,
                        preload: preload,
                        create: create,
                        update: update,
                        custom: custom
                    }
                })
            )
        },
    createDemo:
        () => {
            if (NormalizeFunc.getCookie('adminId')) {
                return (
                    axios({
                        url: '/launch/createdemo',
                        method: 'post',
                        data: {
                            studentId: NormalizeFunc.getFrontEndCode("studentId"),
                        }
                    })
                )
            }
            return (
                axios({
                    method: 'post',
                    url: '/launch/createdemo'
                })
            )
        },
    // 上傳檔案
    uploadFile:
        (uploadFile) => {
            return (
                axios({
                    method: 'post',
                    url: '/launch/uploadimg',
                    data: uploadFile
                })
            )
        },
    // 尋找檔案
    searchFile:
        () => {
            return (
                axios({
                    method: 'post',
                    url: '/launch/searchmedia'
                })
            )
        },
    // 刪除檔案
    deleteFile:
        (imageName) => {
            return (
                axios({
                    method: 'post',
                    url: '/launch/deletemedia',
                    data: {
                        imageName: imageName
                    }
                })
            )
        },
    //chatBox-----------------------------------------
    getMessageHistory:
        (freshCount, chatRoomId) => {
            return (
                axios({
                    method: 'POST',
                    url: '/student/getmessagehistory',
                    data: {
                        freshCount: freshCount,
                        chatRoomId: chatRoomId
                    }
                })
            )
        },
    //page--------------------------------
    // 取得教材成果展示
    getMaterial:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/getmaterial',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    // 取得 Starting 資料
    getStarting:
        (courseId, key) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/getstarting',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },
    getUnderstanding:
        (courseId, key) => {
            return (
                axios({
                    method: "post",
                    url: '/student/getunderstanding',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },
    getFormulating:
        (courseId, key) => {
            return (
                axios({
                    method: "post",
                    url: '/student/getformulating',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },
    //Bonus
    // 取得 Formulating
    getWriteFormulating:
        (courseId, key) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/getwriteformulating',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },
    // 儲存 Formulating
    saveWriteFormulating:
        (courseId, key, formulatingData) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/savewriteformulating',
                    data: {
                        courseId: courseId,
                        key: key,
                        formulatingData: formulatingData
                    }
                })
            )
        },
    //reflection--------------------------------
    // 暫存 Reflection
    tempSaveReflection:
        (courseId, key, learning, workhard, difficult, scoring) => {
            if (NormalizeFunc.getCookie("adminId")) {
                return (
                    axios({
                        method: 'post',
                        url: '/admin/skip'
                    })
                )
            }
            return (
                axios({
                    method: 'post',
                    url: '/student/tempsavereflection',
                    data: {
                        courseId: courseId,
                        key: key,
                        learning: learning,
                        workhard: workhard,
                        difficult: difficult,
                        scoring: scoring
                    }
                })
            )
        },
    // 送出 Reflection
    saveReflection:
        (courseId, key, learning, workhard, difficult, scoring) => {
            if (NormalizeFunc.getCookie("adminId")) {
                return (
                    axios({
                        method: 'post',
                        url: '/admin/skip'
                    })
                )
            }
            return (
                axios({
                    method: 'post',
                    url: '/student/savereflection',
                    data: {
                        courseId: courseId,
                        key: key,
                        learning: learning,
                        workhard: workhard,
                        difficult: difficult,
                        scoring: scoring
                    }
                })
            )
        },
    // 讀取 Reflection
    readReflection:
        (courseId, key) => {
            if (NormalizeFunc.getCookie("adminId")) {
                return (
                    axios({
                        method: 'post',
                        url: '/admin/readreflection',
                        data: {
                            studentId: NormalizeFunc.getFrontEndCode("studentId"),
                            courseId: courseId,
                            key: key
                        }
                    })
                )
            }
            return (
                axios({
                    method: 'post',
                    url: '/student/readreflection',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },

    //listener---------------------------------
    listenerUpload:
        (time, courseTitle, operation, keyName, detail, description) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/listener',
                    data: {
                        time: time,
                        courseTitle: courseTitle,
                        operation: operation,
                        keyName: keyName,
                        detail: detail,
                        description: description,
                    }
                })
            )
        }
}

const adminClientConnect = {
    // 登入
    login:
        (account, password) => {
            return (
                axios({
                    method: 'post',
                    url: '/login',
                    data: {
                        adminId: account,
                        adminPassword: password,
                    }
                })
            )
        },
    // 取得所有課程
    getAllCourse:
        () => {
            return (
                axios({
                    method: 'POST',
                    url: '/admin/getallcourse',
                })
            )
        },
    // 取得所有學生
    getAllStudent:
        () => {
            return (
                axios({
                    method: 'POST',
                    url: '/admin/getallstudent'
                })
            )
        },
    // 透過 Course 取得學生
    getAllStudentByCourseId:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/getallstudentbylimit',
                    data: {
                        limit: 'course',
                        courseId: courseId
                    }
                })
            )
        },
    // 下載所有學生監聽資料
    getAllStudentListener:
        () => {
            return (
                axios({
                    method: 'POST',
                    url: '/admin/getallstudentlistener'
                })
            )
        },
    // 下載單一學生監聽資料
    getSingleStudentListener:
        (studentClass, studentId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/getsinglestudentlistener',
                    data: {
                        studentClass: studentClass,
                        studentId: studentId,
                    }
                })
            )
        },
    // 下載所有學生回饋(單一遊戲)
    getAllStudentReflection:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/getallstudentreflection',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    // 讀取單一學生 Reflection
    getSingleStudentReflection:
        (studentClass, studentId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/getsinglestudentreflection',
                    data: {
                        studentClass: studentClass,
                        studentId: studentId
                    }
                })
            )
        },
    // 取得學生課程
    getStudentCourse:
        (studentClass, studentId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/getstudentcourse',
                    data: {
                        studentId: studentId,
                        studentClass: studentClass
                    }
                })
            )
        },
    // 讀取學生課程預覽
    readStudentCourse:
        (courseId, studentId) => {
            return (
                axios({
                    method: 'POST',
                    url: '/admin/readstudentcourse',
                    data: {
                        courseId: courseId,
                        studentId: studentId,
                    }
                })
            )
        },
    //golist-----------------------------------------
    // 讀取 Standard
    readStandard:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/readstandard',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    // 儲存 Standard
    saveStandard:
        (goData, courseId) => {
            return (
                axios({
                    method: "post",
                    url: '/admin/savestandard',
                    data: {
                        goList: goData,
                        courseId: courseId
                    }
                })
            )
        },
    //重整 Standard
    restartStandard:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/restartstandard',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    //Code-----------------------------------------
    deleteCode:
        (keyCode, courseId) => {
            axios({
                method: 'post',
                url: '/admin/deletecode',
                data: {
                    keyCode: keyCode,
                    courseId: courseId
                }
            })
        }
}

export { studentClientConnect, adminClientConnect }