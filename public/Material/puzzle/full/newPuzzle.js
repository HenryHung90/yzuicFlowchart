// 階段一:使用 spritesheet 載入圖片並且能夠印出來
// => sprite 圖片使用 
// 階段二:能夠讓程式隨機打印其中一張 sprite
// => JS Random 使用 
// 階段三:能夠打亂圖片並完整的印出來
// => JS Random 使用、Phaser Group 使用 
// 階段四:隨機挑選一張圖片消失並且點擊四周圖片使其移動到空位
// => JS Random 使用、Phaser Interactive、程式邏輯
// 階段五:程式能夠判斷是否完成遊戲
// => 程式規劃、程式邏輯
let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: '#4488aa',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: "container",
});

//定義遊戲變數
const puzzleInformation = {
    // puzzle 的數量
    amount: 9,
    // 每一個 puzzle 的大小
    scale: {
        width: 300,
        height: 300,
    },
    // 用於儲存在遊戲中的 puzzle
    crop: null,
    // 用於儲存每片 puzzle 的大小
    cropScale: 0.8,
    // 用於儲存 九個 puzzle 的位置
    standardPosition: [
        { x: 150, y: 150 }, { x: 400, y: 150 }, { x: 650, y: 150 },
        { x: 150, y: 400 }, { x: 400, y: 400 }, { x: 650, y: 400 },
        { x: 150, y: 650 }, { x: 400, y: 650 }, { x: 650, y: 650 }
    ],
    // 用於儲存 九個 puzzle 的動態位置
    motionPosition: [],
    // 用於儲存要抹去的 puzzle 編號
    invisiblePuzzle: null,
    // 用於儲存是否獲勝
    isFinish: false,
}


function preload() {
    this.load.spritesheet('puzzle', '../media/img/Aus.jpg', {
        frameHeight: puzzleInformation.scale.height,
        frameWidth: puzzleInformation.scale.width,
    })
}
function create() {
    //隨機選擇一塊 puzzle 並記住他，在生成時不會生成他
    puzzleInformation.invisiblePuzzle = Math.floor(Math.random() * 9)
    //將 crop 設為 Phaser 的群組
    puzzleInformation.crop = this.add.group()


    for (let i = 0; i < puzzleInformation.amount; i++) {
        // 隨機從 0 ~ 8 選擇一塊生成
        let randomPick = Math.floor(Math.random() * 9)

        // 若選到已經生成過的，則跳過他
        if (puzzleInformation.motionPosition.includes(randomPick)) {
            i--
        }

        // 若選到的是要去掉的那塊，則跳過他
        else if (randomPick == puzzleInformation.invisiblePuzzle) {
            // 創建隱藏的 puzzle ，並將其設置看不到
            puzzleInformation.crop.create(
                puzzleInformation.standardPosition[i].x,
                puzzleInformation.standardPosition[i].y,
                'puzzle',
                randomPick
            ).setVisible(false).setScale(puzzleInformation.cropScale)
            // 在renderedPuzzle 中加入該 puzzle
            puzzleInformation.motionPosition.push(randomPick)
        }

        // 若無上述問題 則生成該 puzzle
        else {
            let puzzle = puzzleInformation.crop.create(
                puzzleInformation.standardPosition[i].x,
                puzzleInformation.standardPosition[i].y,
                'puzzle',
                randomPick
            )
                //將其大小初始設置為 0
                .setScale(0)

            // 製作一個簡單的小動畫使其放大
            this.tweens.add({
                targets: puzzle,
                delay: 500,
                duration: 800,
                ease: 'Power3',
                scale: puzzleInformation.cropScale,
            })

            // 在renderedPuzzle 中加入該 puzzle
            puzzleInformation.motionPosition.push(randomPick)
            // 使 puzzle 能夠互動
            puzzle.setInteractive()
            // 設定 Puzzle 在 pointerup 的監聽事件
            puzzle.on('pointerup', (e) => {
                if (!puzzleInformation.isFinish) {
                    puzzleClicking(puzzle, randomPick)
                }
            })
        }
    }
}

//點擊 puzzle 的事件
function puzzleClicking(puzzle, clickId) {
    // 儲存點擊的 puzzle 目前的位置
    const puzzlePosition = puzzleInformation.motionPosition.indexOf(clickId)
    // 儲存點擊的 puzzle 與被去除的那塊 puzzle 之間的距離（在 array 上相差的距離）
    const moveIndex = puzzleInformation.motionPosition.indexOf(puzzleInformation.invisiblePuzzle) - puzzlePosition

    // 先確認該位置上下左右是否能動
    if (isAllowMove(moveIndex, puzzlePosition)) {
        // 接著獲取要移動的方向 (direction) 以及相差距離 (point)
        // direction 只是一個更直覺的方向，避免你看到 -3 -1 1 3 還要在腦袋中轉換一下
        const { direction, point } = moveDirection(moveIndex)
        console.log('方向:' + direction, '位置:' + point)

        // 讓被點擊的 puzzle 與 被去除的那塊 puzzle 位置交換
        movePuzzle(puzzle, clickId, puzzlePosition, moveIndex)
    }

    if (detectFinish([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        puzzleInformation.isFinish = true
        window.alert("完成")

        console.log(puzzleInformation.invisiblePuzzle)

        puzzleInformation.crop.getChildren()[puzzleInformation.invisiblePuzzle]
            .setPosition(puzzleInformation.standardPosition[puzzleInformation.invisiblePuzzle].x, puzzleInformation.standardPosition[puzzleInformation.invisiblePuzzle].y)
            .setVisible(true)
            .setDepth(10)
    }
}

// 是否能夠移動
function isAllowMove(moveIndex, puzzlePosition) {
    //-3 向上
    //-1 向左
    //1  向右
    //3  向下


    // In Progress
    //[0,1,2,3,4,5,6,7,8]

    // In Human
    //0 1 2
    //3 4 5
    //6 7 8

    //對於程式來說，0~8 是連續的一個 array
    //但對我們來說 2 與 3、5 與 6 他們是不相連的
    //因此要排除 2 5 去找右邊的空位，以及 3 6 去找左邊的控衛

    //2 5 不能看右邊
    if (puzzlePosition == 2 || puzzlePosition == 5) {
        return (
            // 上
            moveIndex == -3 ||
            // 下
            moveIndex == 3 ||
            // 左
            moveIndex == -1
        )
    }
    //3 6 不能看左邊
    if (puzzlePosition == 3 || puzzlePosition == 6) {
        return (
            // 上
            moveIndex == -3 ||
            // 下
            moveIndex == 3 ||
            // 右
            moveIndex == 1
        )
    }
    return (
        // 上
        moveIndex == -3 ||
        // 下
        moveIndex == 3 ||
        // 左
        moveIndex == -1 ||
        // 右
        moveIndex == 1
    )
}

// 移動的方向
function moveDirection(moveIndex) {
    //-3 向上
    //-1 向左
    //1  向右
    //3  向下
    switch (moveIndex) {
        case -3:
            return { direction: '上', point: moveIndex }
        case -1:
            return { direction: '左', point: moveIndex }
        case 1:
            return { direction: '右', point: moveIndex }
        case 3:
            return { direction: '下', point: moveIndex }
    }
}

// 交換 puzzle 與 被去除的那塊 puzzle 位置
function movePuzzle(puzzle, clickId, puzzlePosition, moveIndex) {
    // 交換位置（記錄在motionPosition）
    puzzleInformation.motionPosition[puzzlePosition] = puzzleInformation.invisiblePuzzle
    puzzleInformation.motionPosition[puzzlePosition + moveIndex] = clickId

    // 遊戲實體也要交換位置
    puzzle.setPosition(
        puzzleInformation.standardPosition[puzzlePosition + moveIndex].x,
        puzzleInformation.standardPosition[puzzlePosition + moveIndex].y
    )

    if (puzzleInformation.motionPosition.every((val, i, arr) => !i || val >= arr[i - 1])) {
        const invisiblePosition = puzzleInformation.motionPosition.indexOf(puzzleInformation.invisiblePuzzle)

        puzzleInformation.crop.create(
            puzzleInformation.standardPosition[invisiblePosition].x,
            puzzleInformation.standardPosition[invisiblePosition].y,
            'puzzle',
            puzzleInformation.invisiblePuzzle
        ).setScale(0.8)

        alert('過關!')
    }
}

// 是否獲勝
function detectFinish(motionPosition) {
    // 從第一個跑到最後一個比對陣列是否為升冪排列
    // 若為升冪則能確定已經完成排列
    for (let puzzle = 0; puzzle < puzzleInformation.amount; puzzle++) {
        if (motionPosition[puzzle + 1] - motionPosition[puzzle] !== 1) {
            // 只要有位置不正確 就代表尚未獲勝
            return false
        }
    }
    return true
}


function update() {

}