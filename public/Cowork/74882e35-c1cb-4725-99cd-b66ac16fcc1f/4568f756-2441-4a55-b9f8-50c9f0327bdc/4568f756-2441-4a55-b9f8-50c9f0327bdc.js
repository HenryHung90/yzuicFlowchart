try{console.log("Game Launcher...")
//Id:74882e35-c1cb-4725-99cd-b66ac16fcc1f
//這裡是共編區域，請與你的夥伴一同編寫該處程式。
//以下為初始設定
//※請注意:請勿更動 parent 設定，避免造成程式無法順利執行
const config = {
	type: Phaser.AUTO,
	width: 1200,
	height: 800,
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
};

const game = new Phaser.Game(config);
//請於以下開始您的程式

function preload(){

}
123
function create(){

}

function update(){

}
            }catch(err){
                if (err instanceof TypeError) {
                    console.error("TypeError",err.stack)
                  } else if (err instanceof RangeError) {
                    console.error("RangeError",err.stack)
                  } else if (err instanceof EvalError) {
                    console.error("EvalError",err.stack)
                  } else if (err instanceof SyntaxError) {
                    console.error("SyntaxError",err.stack)
                  }else{
                    console.error("Else",err.stack)
                  }
            }
            