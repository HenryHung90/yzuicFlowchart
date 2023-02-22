// 階段三:能夠打亂圖片並完整的印出來
// => JS Random 使用、Phaser Group 使用 
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
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
}


function preload() {
    this.load.spritesheet('puzzle', '../media/img/Aus.jpg', {
        frameHeight: puzzleInformation.scale.height,
        frameWidth: puzzleInformation.scale.width,
    })
}
function create() {
    //將 crop 設為 Phaser 的群組
    puzzleInformation.crop = this.add.group()


    for (let i = 0; i < puzzleInformation.amount; i++) {
        // 隨機從 0 ~ 8 選擇一塊生成
        let randomPick = Math.floor(Math.random() * 9)

        // 若選到已經生成過的，則跳過他
        if (puzzleInformation.motionPosition.includes(randomPick)) {
            i--
        }
        // 若無上述問題 則生成該 puzzle
        else {
            let puzzle = puzzleInformation.crop.create(
                puzzleInformation.standardPosition[i].x,
                puzzleInformation.standardPosition[i].y,
                'puzzle',
                randomPick
                //將其大小初始設置為 0
            ).setScale(0)

            // 在renderedPuzzle 中加入該 puzzle
            puzzleInformation.motionPosition.push(randomPick)
            // 製作一個簡單的小動畫使其放大
            this.tweens.add({
                targets: puzzle,
                delay: 500,
                duration: 800,
                ease: 'Power3',
                scale: puzzleInformation.cropScale,
            })
        }
    }
}

function update() {

}