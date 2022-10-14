//Start
//Comment
//Understanding
//Formulating
//Programming
//Reflection

//using in common.js => to show messageBox

//StartBox return function
const StartBox = () => {

}
//CommentBox return function
const CommentBox = () => {

}
//UnderstandingBox return function
const UnderstandingBox = () => {

}
//FormulatingBox return function
const FormulatingBox = () => {

}
//Programming return function
const ProgrammingBox = () => {
    //Content Row 分行器
    const contentRowDiv = $('<div>').prop({
        className: 'row justify-content-left contentColDiv',
    }).css({
        'width': '121%',
    })

    //Coding Div----------------------------------------------------
    const content_CodingDiv = $('<div>').prop({
        className: 'col-9 content_codingdiv'
    }).appendTo(contentRowDiv)
    //Preload
    const content_CodingPreloadContainer = $('<div>').prop({
        className: 'container-sm content_coding_preloadContainer',
    }).appendTo(content_CodingDiv)
    const preloadTextarea = $('<textarea>').prop({
        className: 'form-control',
        id: 'preload'
    }).appendTo(content_CodingPreloadContainer)

    //create
    const content_CodingCreateContainer = $('<div>').prop({
        className: 'container-sm content_coding_createContainer',
    }).appendTo(content_CodingDiv)
    //update
    const content_CodingUpdateContainer = $('<div>').prop({
        className: 'container-sm content_coding_updateContainer',
    }).appendTo(content_CodingDiv)
    //--------------------------------------------------------------
    //Display Div
    const content_DisplayDiv = $('<div>').prop({
        className: 'col-3 content_displaydiv',
        innerHTML: 'display Monitor'
    })

    return contentRowDiv
}
//Reflection return function
const ReflectionBox = () => {

}

export { StartBox, CommentBox, UnderstandingBox, FormulatingBox, ProgrammingBox, ReflectionBox }