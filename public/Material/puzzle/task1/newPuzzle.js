// 階段一: 將遊戲變數定義完成，並能產生一張精靈圖在場上
// => sprite 圖片使用
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
    // 用於儲存要抹去的 puzzle 編號
    invisiblePuzzle: null,
    // 用於儲存是否獲勝
    isFinish: false,
}

function preload() {
    // 使用 spritesheet 載入
    this.load.spritesheet('puzzle', '../media/img/pokemon.jpeg', {
        // 利用設定好的變數設定每個 frame 切割寬高
        frameHeight: puzzleInformation.scale.height,
        frameWidth: puzzleInformation.scale.width,
    })
}

function create() {
    //將 crop 設為 Phaser 的群組
    puzzleInformation.crop = this.add.group()
    // 新增一個 Sprite 在場地上 [x位置,y位置,使用的圖片,第幾張]
    puzzleInformation.crop.create(
                puzzleInformation.standardPosition[0].x,
                puzzleInformation.standardPosition[0].y,
                'puzzle',
                0
            )
}

function update() {

}