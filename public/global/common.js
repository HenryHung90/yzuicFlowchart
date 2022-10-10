const showContainer = (s) => {
    //辨別任務
    console.log(s)
    //禁止滾動
    $('body').css({
        'overflow': 'hidden',
    })
    //blocking
    const block = $('<div>').prop({
        className:'container-fluid',
        id:'block'
    }).click(()=>{
        block.fadeOut(200)
        setTimeout(()=>{
            $('body').css({
                'overflow': 'auto',
            })
            block.remove()
        },200)
    }).insertBefore($('body'))

    const content = $('<div>').prop({
        className:'container',
        id:'content'
    }).prependTo(block)
   
}



export { showContainer }