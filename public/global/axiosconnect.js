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
    logout:
        () => {
            return (
                axios({
                    method: 'post',
                    url: '/logout'
                })
            )
        },
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
        (setting, config, preload, create, update, custom, keyCode) => {
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
                        keyCode: keyCode
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
    //golist-----------------------------------------
    // 讀取 Standard
    readStandard:
        (courseId) => {
            axios({
                method: 'post',
                url: '/admin/readstandard',
                data: {
                    courseId: courseId
                }
            })
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