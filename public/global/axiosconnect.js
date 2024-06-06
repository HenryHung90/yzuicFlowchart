import customizeOperation from "./customizeOperation.js"

const studentClientConnect = {
    /**
     * 用於登入本網站
     * @param {string} account 登入之帳號
     * @param {string} password 登入之密碼(尚未 hashing)
     * @returns {object} access/denied 登入操作
     */
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
    /**
     * 登出本網站
     * 將清空 cookies & 登入狀態
     * @returns {none}
     */
    logout:
        () => {
            return (
                axios({
                    method: 'post',
                    url: '/logout'
                })
            )
        },
    /**
     * 學生進行更改密碼時使用
     * @param {string} oldPassword 舊密碼
     * @param {string} newPassword 新密碼
     * @returns {boolean} access/denied 更新動作
     * 若更新失敗請閱讀回傳 message
     */
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
    /**
     * 取得所有單人教材與連結
     * @returns {object}
     * #standardData: 內含所有課程之連結與名稱
     */
    getAllCourse:
        () => {
            return (
                axios({
                    method: 'GET',
                    url: '/student/getallcourse',
                })
            )
        },
    /**
     * 取得所有多人教材與連結
     * @returns {object}
     * coworkData: 內含所有共編課程之連結與名稱
     */
    getAllCoworkCourse:
        () => {
            return (
                axios({
                    method: 'GET',
                    url: '/student/getallcoworkcourse',
                })
            )
        },
    // 管理員取得所有課程
    getAllCourseByAdmin:
        () => {
            return (
                axios({
                    method: 'GET',
                    url: '/student/getallcourse_admin',
                })
            )
        },
    getPermission:
        () => {
            return (
                axios({
                    method: 'POST',
                    url: '/student/getpermission'
                })
            )
        },
    //golist-----------------------------------------
    /**
     * 取得欲進入課程之教材內容以及學生儲存狀態
     * @param {string} courseId 課程id
     * @returns {object}
     * message: 課程內容
     */
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
    /**
     * 當使用者進行儲存 goList, 即心智圖首頁之框架儲存
     * 可以使用該 API, 將 goList 儲存至資料庫當中
     * @param {object} goData goList 的整個內容 
     * @param {string} courseId 要儲存到哪一個課程當中
     * @returns access/denied 如果儲存失敗請閱讀回傳 message
     */
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
    /**
     * 使用者可以透過該 API 刷新整個 goList
     * goList 心智圖將會回到最開始的狀態
     * #該方式不會刪除 relfection 回饋內容, Coding 內容
     * 僅刷新為原始狀態
     * @param {string} courseId 要重新啟動的 courseId 
     * @returns access/denied 如果失敗請閱讀回傳 message
     */
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
    /**
     * 若教師端有進行 goList 動作
     * 使用者可透過該 API 取得最新的 goList
     * @param {string} courseId 要更新的 courseId
     * @returns access/denied 如果失敗請閱讀回傳 message
     */
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
    /**
     * 可讀取所有人的 Progress 以及各 Progress 總人數
     * 用於排行榜的使用
     * @param {string} courseId 要查找的 courseId
     * @returns {object}
     * -count: 該階段的總人數
     * -member: 該階段的人
     */
    getAllStudentProgress:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/getallstudentprogress',
                    data: {
                        courseId: courseId,
                    }
                })
            )
        },
    //cowork-----------------------------------------
    /**
     * 用於讀取共編教材的內容
     * @param {string} courseId 欲取得的 courseId
     * @param {string} groupId 使用者的 groupId
     * @returns message: 課程內容
     */
    readCowork:
        (courseId, groupId) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/readcowork',
                    data: {
                        courseId: courseId,
                        groupId: groupId
                    }
                })
            )
        },
    //code-----------------------------------------
    //readCode
    readCode:
        (courseId, keyCode) => {
            if (customizeOperation.getCookie('adminId')) {
                return (
                    axios({
                        method: 'post',
                        url: '/admin/readcode',
                        data: {
                            studentId: customizeOperation.getFrontEndCode('studentId'),
                            courseId: customizeOperation.getFrontEndCode('courseId'),
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
        (codeArea, keyCode, courseId) => {
            if (customizeOperation.getCookie('adminId')) {
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
                        codeArea: codeArea,
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
    launchFormulatingDemo: (demoId, demoCode) => {
        return (
            axios({
                method: 'post',
                url: '/launch/formulatingdemo',
                data: {
                    demoId: demoId,
                    demoCode: demoCode,
                }
            })
        )
    },
    launchDemo:
        (codeArea) => {
            if (customizeOperation.getCookie('adminId')) {
                return (
                    axios({
                        url: '/launch/launchdemo',
                        method: 'post',
                        data: {
                            studentId: customizeOperation.getFrontEndCode("studentId"),
                            codeArea: codeArea,
                        }

                    })
                )
            }
            return (
                axios({
                    url: '/launch/launchdemo',
                    method: 'post',
                    data: {
                        codeArea: codeArea
                    }
                })
            )
        },
    createDemo:
        () => {
            if (customizeOperation.getCookie('adminId')) {
                return (
                    axios({
                        url: '/launch/createdemo',
                        method: 'post',
                        data: {
                            studentId: customizeOperation.getFrontEndCode("studentId"),
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
                    method: 'get',
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
    //page--------------------------------------------
    // 取得教材成果展示
    cowork: {
        getMaterial: (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/getmaterial',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
        getAllGroupProgess: (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/getallgroupprogess',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
        //取得探索理解
        getUnderstanding: (courseId, key) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/getUnderstanding',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },
        //取得表徵制定
        getFormulating: (courseId, key) => {
            return (
                axios({
                    method: "post",
                    url: '/cowork/getformulating',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },
        //取得 CoworkConfig
        getCoworkConfig: (courseId, groupId) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/getcoworkconfig',
                    data: {
                        courseId: courseId,
                        groupId: groupId
                    }
                })
            )
        },
        // 投票註記
        coworkVote: (courseId, groupId) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/vote',
                    data: {
                        courseId: courseId,
                        groupId: groupId,
                        studentId: studentId,
                    }
                })
            )
        },
        //確認資料夾
        createDemo: () => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/createdemo',
                })
            )
        },
        //執行程式碼
        launchDemo: (coworkArea) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/launchdemo',
                    data: {
                        coworkArea: coworkArea
                    }
                })
            )
        },
        //取得共編程式
        readCode: (courseId, key) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/readcode',
                    data: {
                        courseId: courseId,
                        key: key
                    }
                })
            )
        },
        //儲存共編程式
        saveCode: (courseId, coworkContent) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/savecode',
                    data: {
                        courseId: courseId,
                        coworkContent: coworkContent
                    }
                })
            )
        },
        //儲存 Relfection
        saveReflection:
            (courseId, key, learning, difficult, scoring, teammate, teammateScore) => {
                if (customizeOperation.getCookie("adminId")) {
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
                        url: '/cowork/savereflection',
                        data: {
                            courseId: courseId,
                            key: key,
                            learning: learning,
                            difficult: difficult,
                            scoring: scoring,
                            teammate: teammate,
                            teammateScore: teammateScore
                        }
                    })
                )
            },
        //尋找共編 Media 檔案
        searchFile: () => {
            return (
                axios({
                    method: 'get',
                    url: '/cowork/searchmedia',
                })
            )
        },
        //上傳共編 Media 檔案
        uploadFile: (uploadFile) => {
            return (
                axios({
                    method: 'post',
                    url: '/cowork/uploadimg',
                    data: uploadFile
                })
            )
        },
    },
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
        (courseId, key, learning, difficult, scoring) => {
            if (customizeOperation.getCookie("adminId")) {
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
                        difficult: difficult,
                        scoring: scoring
                    }
                })
            )
        },
    // 送出 Reflection
    saveReflection:
        (courseId, key, learning, difficult, scoring) => {
            if (customizeOperation.getCookie("adminId")) {
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
                        difficult: difficult,
                        scoring: scoring
                    }
                })
            )
        },
    // 讀取 Reflection
    readReflection:
        (courseId, key) => {
            if (customizeOperation.getCookie("adminId")) {
                return (
                    axios({
                        method: 'post',
                        url: '/admin/readreflection',
                        data: {
                            studentId: customizeOperation.getFrontEndCode("studentId"),
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
    /**
     * 用於儲存用戶監聽事件，需紀錄以下所有事件
     * @param {string} page 目前所在頁面
     * @param {string} mainTag 主要點擊項目描述
     * @param {string} subTag 副點擊項目描述
     * @param {string} aidTag 輔助點擊項目描述
     * @param {string} description 點擊項目描述
     * @param {string} time 點擊時間
     * @returns 
     */
    listenerUpload:
        (page, mainTag, subTag, aidTag, description, time) => {
            return (
                axios({
                    method: 'post',
                    url: '/student/listener',
                    data: {
                        page: page,
                        mainTag: mainTag,
                        subTag: subTag,
                        aidTag: aidTag,
                        description: description,
                        time: time,
                    }
                })
            )
        },
    /**
     * 用於與 chatGPT 進行溝通
     * @param {string} sendTime 送出時間
     * @param {string} message 使用者發送的訊息
     * @param {string} courseId 所在課程ID
     * @param {string} courseName 所在課程名稱
     */
    connectChatGPT:
        (sendTime, codePrompt, message, courseId, courseName) => {
            return axios({
                method: 'post',
                url: '/chatGPT/chat',
                data: {
                    sendTime: sendTime,
                    codePrompt: codePrompt,
                    message: message,
                    courseId: courseId,
                    courseName: courseName
                }
            })
        },
    /**
     * 取得與 ChatGPT 聊天歷史紀錄
     * @param {string} courseId 課程ID
     * @param {number} freshCount 回朔次數
     * @returns 
     */
    getChatGPTHistory:
        (courseId, freshCount) => {
            return (
                axios({
                    method: 'POST',
                    url: '/chatGPT/history',
                    data: {
                        freshCount: freshCount,
                        courseId: courseId
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
                    method: 'GET',
                    url: '/admin/getallcourse',
                })
            )
        },
    // 取得所有合作課程
    getAllCoworkCourse:
        () => {
            return (
                axios({
                    method: 'GET',
                    url: '/admin/getallcoworkcourse',
                })
            )
        },
    // 取得所有學生
    getAllStudent:
        () => {
            return (
                axios({
                    method: 'get',
                    url: '/admin/getallstudent'
                })
            )
        },
    /**
     * 更新學生資料
     * tpye 如下
     * {addChatRoom} => 加入 Group
     * {removeChatRoom} => 刪除 Group
     * {switchCowork} => 合作功能開啟關閉
     * {switchPermission} => 帳號開啟/關閉
     * @param {string} type 確認欲進行的功能以及更新資料的動作 
     * @param {string} studentId 學生學號
     * @param {string} studentClass 學生屆數
     * @param {boolean} switchConfirm 是否變更其個人/合作
     * @param {string} studentChatRoomId 學生群組ID 
     * @returns 
     */
    updateStudent:
        (type, studentId, studentClass, switchConfirm = null, studentChatRoomId) => {
            // type
            // addChatRoom => 加入 Group
            // removeChatRoom => 刪除 Group
            // switchCowork => 合作功能開啟關閉
            // switchPermission => 帳號開啟/關閉
            return (
                axios({
                    method: 'post',
                    url: '/admin/updatestudent',
                    data: {
                        type: type,
                        studentId: studentId,
                        studentClass: studentClass,
                        switchConfirm: switchConfirm,
                        studentChatRoomId: studentChatRoomId
                    }
                })
            )
        },
    /**
     * 批量或單一刪除學生皆可以使用
     * @param {array} studentList 學生學號串列 
     * @returns 
     */
    deleteStudent:
        (studentList, studentClass) => {
            return (
                axios({
                    method: "post",
                    url: '/admin/deletestudent',
                    data: {
                        studentList: studentList,
                        studentClass: studentClass
                    }
                })
            )
        },
    /**
     * 由管理員強制更新學生之密碼
     * @param {string} studentClass 學生屆數
     * @param {string} studentId 學生學號
     * @param {string} newPassword 新密碼
     * @returns 
     */
    changeStudentPassword:
        (studentClass, studentId, newPassword) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/changestudentpassword',
                    data: {
                        studentClass: studentClass,
                        studentId: studentId,
                        newPassword: newPassword
                    }
                })
            )
        },
    // 上傳學生名單
    updateStudentList:
        (studentList, studentClass) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/updatestudentlist',
                    data: {
                        studentList: studentList,
                        studentClass: studentClass,
                    }
                })
            )
        },
    // 創建新的課程:
    createCourse:
        (courseName, courseClass, courseType) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/createcourse',
                    data: {
                        courseName: courseName,
                        courseClass: courseClass,
                        courseType: courseType
                    }
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
    // 新增Group
    addNewStudentGroup:
        (studentClass, studentGroup) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/addchatroom',
                    data: {
                        studentClass: studentClass,
                        studentGroup: studentGroup
                    }
                })
            )
        },
    // 更新單一 Group
    updateStudentGroup:
        (studentChatRoomId, studentGroup, studentClass) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/updatechatroom',
                    data: {
                        studentChatRoomId: studentChatRoomId,
                        studentGroup: studentGroup,
                        studentClass: studentClass
                    }
                })
            )
        },
    // 取得所有 Group
    getAllStudentGroup:
        () => {
            return (
                axios({
                    method: 'get',
                    url: '/admin/getallchatroom'
                })
            )
        },
    // 取得 Group 聊天紀錄
    getStudentGroup:
        (chatRoomId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/getchatroom',
                    data: {
                        chatRoomId: chatRoomId
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
    //cowork-----------------------------------------
    //讀取 cowork
    readCowork:
        (courseId) => {
            return (
                axios({
                    method: 'post',
                    url: '/admin/readcowork',
                    data: {
                        courseId: courseId
                    }
                })
            )
        },
    saveCowork:
        (goData, courseId) => {
            return (
                axios({
                    method: "post",
                    url: '/admin/savecowork',
                    data: {
                        goList: goData,
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