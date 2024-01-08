// 階段二:利用預設 array 生成隨機 4*4 的卡牌(兩兩成對的8副牌)
// => Phaser Shuffle 使用、程式邏輯 

let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 750,
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

// 定義遊戲變數
const cardInformation = {
    // 用於儲存遊戲內的 card
    cards: null,
    // 用於儲存卡牌的 Id
    cardList: null,
    // 用於儲存點擊的第一張 card
    firstCard: null,
    // 用於儲存點擊的第二張 card
    secondCard: null,
    // 用於記錄點擊次數
    moves: 0,
    // 用於記錄是否完成（兩兩一對只要完成 row * col / 2 次配對，代表已完成）
    match: 0,
    winMatch: 0,
}

const boardInformation = {
    // 設定棋盤行數
    row: 4,
    // 設定棋盤列數
    col: 4,
    // 設定卡牌開始生成的 X 位置
    startX: 100,
    // 設定卡牌開始生成的 Y 位置
    startY: 100,
    // 設定每張卡牌的 X 間隔
    offsetX: 130,
    //設定每張卡牌的 Y 間隔
    offsetY: 170,
    // 用於是否鎖定棋盤（在選中卡片後會暫時鎖住棋盤避免重複點擊）
    lockBoard: false,
}

function preload() {
    // 預載圖片
    // 0 ~ 12 為黑桃 A ~ K
    // 13 ~ 25 為愛心 A ~ K
    // 26 ~ 38 為菱形 A ~ K
    // 39 ~ 51 為梅花 A ~ K
    // 52 藍藍怪怪卡
    // 53、54 為 Joker
    // 55 白卡
    // 56 卡背
    this.load.spritesheet('Cards', '../media/img/PockerCard.png', {
        frameWidth: 389.5,
        frameHeight: 569.6
    })
}
function create() {
    // 將 cards 設為 phaser 的 group
    cardInformation.cards = this.add.group()

    // 將 cardList 內塞入兩兩一組的卡牌並且打亂
    // Phaser.Utils.Array.Shuffle() 該 function 能夠將傳入之陣列打亂並輸出為一個新的陣列
    cardInformation.cardList = Phaser.Utils.Array.Shuffle([
        2, 2, 4, 4,
        10, 10, 15, 15,
        30, 30, 36, 36,
        46, 46, 50, 50
    ])
    // 建立翻牌 依照設定的順序建立 row * col 的牌組陣列
    for (let row = 0; row < boardInformation.row; row++) {
        for (let col = 0; col < boardInformation.col; col++) {
            // 建立卡牌生成在指定位置
            cardInformation.cards.create(
                boardInformation.startX + col * boardInformation.offsetX,
                boardInformation.startY + row * boardInformation.offsetY,
                "Cards",
                cardInformation.cardList[row * 4 + col]
            ).setScale(0.3, 0.3)
        }
    }
}

// 更新遊戲狀態
function update() {

}