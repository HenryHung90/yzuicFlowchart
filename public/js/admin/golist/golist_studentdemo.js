import { GoListFunc, NormalizeFunc } from "../../../global/common.js";
import { adminClientConnect } from "../../../global/axiosconnect.js";

//init Diagram varible
let myDiagram


NormalizeFunc.loadingPage(true)

const goListInit = () => {
    // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
    // For details, see https://gojs.net/latest/intro/buildingObjects.html
    const $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            {
                // "initialContentAlignment": go.Spot.Center, 
                "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                "LinkRelinked": showLinkLabel,
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                "undoManager.isEnabled": true  // enable undo & redo
            });

    //event function
    myDiagram.addDiagramListener("ObjectDoubleClicked", e => {
        const part = e.subject.part;
        if (!(part instanceof go.Link)) GoListFunc.adminContainer(part.ob);
    });
    myDiagram.addDiagramListener('SelectionDeleting', function (e) {
        // the DiagramEvent.subject is the collection of Parts about to be deleted
        alert("禁止刪除")
    });


    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
    function makePort(name, align, spot, output, input) {
        let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape,
            {
                fill: "transparent",  // changed to a color in the mouseEnter event handler
                strokeWidth: 0,  // no stroke
                width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
                height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
                alignment: align,  // align the port on the main Shape
                stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                portId: name,  // declare this object to be a "port"
                fromSpot: spot,  // declare where links may connect at this port
                fromLinkable: output,  // declare whether the user may draw links from here
                toSpot: spot,  // declare where links may connect at this port
                toLinkable: input,  // declare whether the user may draw links to here
                cursor: "pointer",  // show a different cursor to indicate potential link point
                mouseEnter: (e, port) => {  // the PORT argument will be this Shape
                    if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                },
                mouseLeave: (e, port) => port.fill = "transparent"
            });
    }

    function textStyle() {
        return {
            font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
            stroke: "#F8F8F8"
        }
    }
    // helper definitions for node templates
    function nodeStyle() {
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center
            }
        ];
    }

    // define the Node templates for regular nodes
    const standardSetting =
        $(go.Node, "Table", nodeStyle(), { deletable: false },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle",
                    { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")
                ),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 15,
                        maxSize: new go.Size(160, 160),
                        wrap: go.TextBlock.WrapFit,
                        editable: false,
                        textAlign: 'center',
                    },
                    //攜結text 呼叫時會使用建立之node 名稱作為內部text
                    //綁定TextBlock.text 屬性爲Node.data.name的值，Model對象可以通過Node.data.name獲取和設置TextBlock.text
                    new go.Binding("text").makeTwoWay()
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
            )
        )

    const completedSetting =
        $(go.Node, "Table", nodeStyle(), { deletable: false },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle",
                    { fill: "#FFC78E", stroke: "#FFD306", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")
                ),
                $(go.TextBlock,
                    {
                        font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
                        stroke: 'black'
                    },
                    {
                        margin: 10,
                        maxSize: new go.Size(160, 160),
                        wrap: go.TextBlock.WrapFit,
                        editable: false,
                        textAlign: 'center',
                    },
                    //攜結text 呼叫時會使用建立之node 名稱作為內部text
                    //綁定TextBlock.text 屬性爲Node.data.name的值，Model對象可以通過Node.data.name獲取和設置TextBlock.text
                    new go.Binding("text").makeTwoWay()
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
            )
        )
    const bonusSetting =
        $(go.Node, "Table", nodeStyle(), { deletable: false },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle",
                    { fill: "#282c34", stroke: "#FF0000", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")
                ),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 10,
                        maxSize: new go.Size(160, 160),
                        wrap: go.TextBlock.WrapFit,
                        editable: false,
                        textAlign: 'center',
                    },
                    //攜結text 呼叫時會使用建立之node 名稱作為內部text
                    //綁定TextBlock.text 屬性爲Node.data.name的值，Model對象可以通過Node.data.name獲取和設置TextBlock.text
                    new go.Binding("text").makeTwoWay()
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
            )
        )

    myDiagram.nodeTemplateMap.add("Understanding", standardSetting)
    myDiagram.nodeTemplateMap.add("Formulating", standardSetting)
    myDiagram.nodeTemplateMap.add("Programming", standardSetting)
    myDiagram.nodeTemplateMap.add("Reflection", standardSetting)

    myDiagram.nodeTemplateMap.add("Completed-Understanding", completedSetting)
    myDiagram.nodeTemplateMap.add("Completed-Formulating", completedSetting)
    myDiagram.nodeTemplateMap.add("Completed-Programming", completedSetting)
    myDiagram.nodeTemplateMap.add("Completed-Reflection", completedSetting)

    myDiagram.nodeTemplateMap.add("Bonus-Understanding", bonusSetting)
    myDiagram.nodeTemplateMap.add("Bonus-Formulating", bonusSetting)
    myDiagram.nodeTemplateMap.add("Bonus-Programming", bonusSetting)
    myDiagram.nodeTemplateMap.add("Bonus-Reflection", bonusSetting)

    myDiagram.nodeTemplateMap.add("Conditional",
        $(go.Node, "Table", nodeStyle(), { deletable: false },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "Diamond",
                    { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));

    myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Table", nodeStyle(), { deletable: false },
            $(go.Panel, "Spot",
                $(go.Shape, "Circle",
                    { desiredSize: new go.Size(100, 100), fill: "#282c34", stroke: "#09d3ac", strokeWidth: 3.5 }),
                $(go.TextBlock, "Start",
                    {
                        font: "bold 15pt Lato, Helvetica, Arial, sans-serif",
                        stroke: "#F8F8F8"
                    },
                    {
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // three named ports, one on each side except the top, all output only:
            makePort("T", go.Spot.Top, go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, go.Spot.Right, true, false),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));

    go.Shape.defineFigureGenerator("ExternalOrganization", function (shape, w, h) {
        var geo = new go.Geometry();
        var param1 = shape ? shape.parameter1 : NaN;
        if (isNaN(param1) || param1 < .2) param1 = .2; // Minimum
        var fig = new go.PathFigure(0, 0, true);
        geo.add(fig);

        // Body
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        var fig2 = new go.PathFigure(param1 * w, 0, false);
        geo.add(fig2);
        // Top left triangle
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0, param1 * h));
        // Top right triangle
        fig2.add(new go.PathSegment(go.PathSegment.Move, w, param1 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, 0));
        // Bottom left triangle
        fig2.add(new go.PathSegment(go.PathSegment.Move, 0, (1 - param1) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h));
        // Bottom right triangle
        fig2.add(new go.PathSegment(go.PathSegment.Move, (1 - param1) * w, h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, (1 - param1) * h));
        //??? geo.spot1 = new go.Spot(param1 / 2, param1 / 2);
        //??? geo.spot2 = new go.Spot(1 - param1 / 2, 1 - param1 / 2);
        return geo;
    });

    myDiagram.nodeTemplateMap.add("Target",
        $(go.Node, "Table", nodeStyle(), { deletable: false },
            $(go.Panel, "Spot",
                $(go.Shape, "ExternalOrganization", { desiredSize: new go.Size(150, 150), fill: "#282c34", stroke: "#ffd3ac", strokeWidth: 4.5 }),
                $(go.TextBlock, "Target", textStyle(), new go.Binding("text"))
            ),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ))

    // taken from ../extensions/Figures.js:
    go.Shape.defineFigureGenerator("File", (shape, w, h) => {
        let geo = new go.Geometry();
        let fig = new go.PathFigure(0, 0, true); // starting point
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Line, .75 * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        let fig2 = new go.PathFigure(.75 * w, 0, false);
        geo.add(fig2);
        // The Fold
        fig2.add(new go.PathSegment(go.PathSegment.Line, .75 * w, .25 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
        geo.spot1 = new go.Spot(0, .25);
        geo.spot2 = go.Spot.BottomRight;
        return geo;
    });


    myDiagram.nodeTemplateMap.add("Comment",
        $(go.Node, "Auto", nodeStyle(),
            $(go.Shape, "File",
                { fill: "#282c34", stroke: "#DEE0A3", strokeWidth: 3 }),
            $(go.TextBlock, textStyle(),
                {
                    margin: 15,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: true
                },
                new go.Binding("text").makeTwoWay())
            // no ports, because no links are allowed to connect with a comment
        ));


    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
            {
                routing: go.Link.AvoidsNodes,
                corner: 10,
                curve: go.Link.JumpGap,
                toShortLength: 10,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true,
                resegmentable: true,
                // mouse-overs subtly highlight links:
                //滑鼠滑至連接線上會產生之動畫
                mouseEnter: (e, link) => link.findObject("HIGHLIGHT").stroke = "rgba(255,255,255,0.8)",
                mouseLeave: (e, link) => link.findObject("HIGHLIGHT").stroke = "transparent",
                selectionAdorned: false
            },
            new go.Binding("points").makeTwoWay(),

            //HighLight 線條
            $(go.Shape,  // the highlight shape, normally transparent
                { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),

            //線條Style
            $(go.Shape,  // the link path shape
                { isPanelMain: true, stroke: "rgb(255,100,100)", strokeWidth: 3 },
                //sel => 是否被選中
                new go.Binding("stroke", "isSelected", sel => sel ? "orange" : "gray").ofObject()),


            //箭頭指標樣式
            $(go.Shape,  // the arrowhead scale=>大小
                { toArrow: "standard", scale: 2, strokeWidth: 0, fill: 'gray' }),

            //自定義一個 Panel 在線上
            //自定義樣式 visible 預設看不到 name=>設定LANBEL 在showLinkLabel() function 中
            //若發現名稱為 Ｃonditional 的分類 則讓 LABEL顯現
            $(go.Panel, "Auto",  // the link label, normally not visible
                { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                new go.Binding("visible", "visible").makeTwoWay(),

                $(go.Shape, "RoundedRectangle",  // the label shape
                    { fill: "#F8F8F8", strokeWidth: 0 }),
                $(go.TextBlock, "Yes",  // the label
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#333333",
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            )
        );

    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
        let label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;


    // initialize the Palette that is on the left side of the page
    let myPalette =
        $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
            {
                // Instead of the default animation, use a custom fade-down
                "animationManager.initialAnimationStyle": go.AnimationManager.None,
                "InitialAnimationStarting": animateFadeDown, // Instead, animate with this function
                //禁止縮放
                allowZoom: false,

                nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                model: new go.GraphLinksModel([  // specify the contents of the Palette
                    { category: "Target", text: "成品展示" },
                    { category: "Start", text: "Task" },
                    { category: "Understanding", text: "探索理解" },
                    { category: "Formulating", text: "表徵制定" },
                    { category: "Programming", text: "計畫執行" },
                    { category: "Reflection", text: "監控反思" },
                    { category: "Completed-Understanding", text: "探索理解" },
                    { category: "Completed-Formulating", text: "表徵制定" },
                    { category: "Completed-Programming", text: "計畫執行" },
                    { category: "Completed-Reflection", text: "監控反思" },
                    { category: "Bonus-Understanding", text: "探索理解" },
                    { category: "Bonus-Formulating", text: "表徵制定" },
                    { category: "Bonus-Programming", text: "計畫執行" },
                    { category: "Bonus-Reflection", text: "監控反思" },
                    // { category: "Conditional", text: "自定義" },
                    { category: "Comment", text: "筆記" },
                ])
            });

    // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
    function animateFadeDown(e) {
        let diagram = e.diagram;
        let animation = new go.Animation();
        animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
        animation.easing = go.Animation.EaseOutExpo;
        animation.duration = 900;
        // Fade "down", in other words, fade in from above
        animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
        animation.add(diagram, 'opacity', 0, 1);
        animation.start();
    }

    load();  // load an initial diagram from some JSON text
}
//nav & click function
const navInit = () => {
    //初始化 boostrap Tooltip
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    $('#logout').click((e) => {
        navButton.logout()
    })

    NormalizeFunc.loadingPage(false)
}

///save & load  & print & logout function
//----------------------------------------------------------------------------------------
const navButton = {
    //logout
    logout: () => {
        window.location.href = `/home/${NormalizeFunc.getCookie('adminId')}`
    }
}
//load
const load = async () => {
    await adminClientConnect.readStandard(NormalizeFunc.getFrontEndCode('courseId'),NormalizeFunc.getFrontEndCode('studentId')).then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            myDiagram.model = go.Model.fromJson(JSON.stringify(response.data.message))
        }
    })
    // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}
//----------------------------------------------------------------------------------------

window.addEventListener('DOMContentLoaded', goListInit);
window.addEventListener('DOMContentLoaded', navInit);