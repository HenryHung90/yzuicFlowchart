import { showContainer, loadingPage } from "../global/common.js";


//init Diagram varible
let myDiagram

loadingPage(true)

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
        "undoManager.isEnabled": true  // enable undo & redo
      });

  // when the document is modified, add a "*" to the title and enable the "Save" button
  myDiagram.addDiagramListener("Modified", e => {
    let idx = document.title.indexOf("*");
    if (myDiagram.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.slice(0, idx);
    }
    
  });


  //event function
  myDiagram.addDiagramListener("ObjectDoubleClicked", e => {
    const part = e.subject.part;
    if (!(part instanceof go.Link)) showContainer(part.ob);
  });
  myDiagram.addDiagramListener('SelectionDeleting', function (e) {
    // the DiagramEvent.subject is the collection of Parts about to be deleted
    e.subject.each(async function (part) {
      // console.log(part.ob)
      deleteNode(part)
    });
  });

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

  // define the Node templates for regular nodes
  let standardSetting = $(go.Node, "Table", nodeStyle(), { deletable: false },
    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
    $(go.Panel, "Auto",
      $(go.Shape, "RoundedRectangle",
        { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
        new go.Binding("figure", "figure")
      ),
      $(go.TextBlock, textStyle(),
        {
          margin: 15,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: false,
          textAlign: 'center',
        },
        //??????text ???????????????????????????node ??????????????????text
        //??????TextBlock.text ?????????Node.data.name?????????Model??????????????????Node.data.name???????????????TextBlock.text
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

  myDiagram.nodeTemplateMap.add("Conditional",
    $(go.Node, "Table", nodeStyle(),
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
          { desiredSize: new go.Size(70, 70), fill: "#282c34", stroke: "#09d3ac", strokeWidth: 3.5 }),
        $(go.TextBlock, "Start", textStyle(),
          new go.Binding("text"))
      ),
      // three named ports, one on each side except the top, all output only:
      makePort("L", go.Spot.Left, go.Spot.Left, true, false),
      makePort("R", go.Spot.Right, go.Spot.Right, true, false),
      makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
    ));

  myDiagram.nodeTemplateMap.add("End",
    $(go.Node, "Table", nodeStyle(),
      $(go.Panel, "Spot",
        $(go.Shape, "Circle",
          { desiredSize: new go.Size(60, 60), fill: "#282c34", stroke: "#DC3C00", strokeWidth: 3.5 }),
        $(go.TextBlock, "End", textStyle(),
          new go.Binding("text"))
      ),
      // three named ports, one on each side except the bottom, all input only:
      makePort("T", go.Spot.Top, go.Spot.Top, false, true),
      makePort("L", go.Spot.Left, go.Spot.Left, false, true),
      makePort("R", go.Spot.Right, go.Spot.Right, false, true)
    ));

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
        curve: go.Link.JumpOver,
        corner: 5, toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        // mouse-overs subtly highlight links:
        //??????????????????????????????????????????
        mouseEnter: (e, link) => link.findObject("HIGHLIGHT").stroke = "rgba(255,255,255,0.8)",
        mouseLeave: (e, link) => link.findObject("HIGHLIGHT").stroke = "transparent",
        selectionAdorned: false
      },
      new go.Binding("points").makeTwoWay(),

      //HighLight ??????
      $(go.Shape,  // the highlight shape, normally transparent
        { isPanelMain: true, strokeWidth: 6, stroke: "transparent", name: "HIGHLIGHT" }),

      //??????Style
      $(go.Shape,  // the link path shape
        { isPanelMain: true, stroke: "rgb(255,100,100)", strokeWidth: 4 },
        //sel => ???????????????
        new go.Binding("stroke", "isSelected", sel => sel ? "blue" : "gray").ofObject()),


      //??????????????????
      $(go.Shape,  // the arrowhead scale=>??????
        { toArrow: "standard", scale: 2, strokeWidth: 0, fill: "gray" }),

      //??????????????? Panel ?????????
      //??????????????? visible ??????????????? name=>??????LANBEL ???showLinkLabel() function ???
      //?????????????????? ???onditional ????????? ?????? LABEL??????
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
        //????????????
        allowZoom: false,

        nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
        model: new go.GraphLinksModel([  // specify the contents of the Palette
          { category: "Understanding", text: "???????????????" },
          { category: "Formulating", text: "???????????????" },
          { category: "Programming", text: "???????????????" },
          { category: "Reflection", text: "???????????????" },
          { category: "Conditional", text: "?????????" },
          { category: "Comment", text: "??????" },
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
  // // Show the diagram's model in JSON format that the user may edit
  // const printButton = document.getElementById("PrintButton")
  // // print the diagram by opening a new window holding SVG images of the diagram contents for each page
  // printButton.addEventListener("click", (e) => {
  //   printDiagram()
  // })

  load();  // load an initial diagram from some JSON text
}
//nav & click function
const navInit = () => {
  //nav
  $('#print').click((e) => {
    print()
  })
  $('#save').click((e) => {
    save()
  })
  $('#restart').click((e) => {
    restart()
  })
  $('#logout').click((e) => {
    logout()
  })
  //Save Btn
  $(document).keydown((e) => {
    if (e.ctrlKey && e.keyCode == 83) {
      e.preventDefault()
      save()
    }
    if (e.metaKey && e.keyCode == 83) {
      e.preventDefault()
      save()
    }
  })

  loadingPage(false)
}

///save & load  & print & logout function
//----------------------------------------------------------------------------------------
//save
const save = async () => {
  loadingPage(true)
  //Json Parse
  const goData = JSON.parse(myDiagram.model.toJson());
  //?????? * ??????
  let idx = document.title.indexOf("*");
  document.title = document.title.slice(0, idx);
  //???????????????
  await axios({
    method: "post",
    url: '/student/savegolist',
    data: {
      goList: goData
    }
  }).then(response => {
    if (response.data.status == 500) {
      window.alert(response.data.message)
      return
    }
    loadingPage(false)
  })

  myDiagram.isModified = false;
}
//load
const load = async () => {
  let goListData = {}

  await axios({
    method: 'post',
    url: '/student/readgolist'
  }).then(response => {
    if (response.data.status == 500) {
      window.alert(response.data.message)
      return
    }
    goListData = JSON.stringify(response.data.message)
  })

  // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
  myDiagram.model = go.Model.fromJson(goListData)
}
//print
const print = () => {
  let svgWindow = window.open();
  if (!svgWindow) return;  // failure to open a new Window
  let printSize = new go.Size(700, 960);
  let bnds = myDiagram.documentBounds;
  let x = bnds.x;
  let y = bnds.y;
  while (y < bnds.bottom) {
    while (x < bnds.right) {
      let svg = myDiagram.makeSvg({ scale: 1.0, position: new go.Point(x, y), size: printSize });
      svgWindow.document.body.appendChild(svg);
      x += printSize.width;
    }
    x = bnds.x;
    y += printSize.height;
  }
  setTimeout(() => svgWindow.print(), 1);
}
//restart code & golist
const restart = async () => {
  if (window.confirm('?????????????????????????????????????????????')) {
    loadingPage(true)

    //?????? goList
    await axios({
      method: 'post',
      url: '/student/restartgolist'
    }).then(response => {
      if (response.data.status != 200) {
        window.alert(response.data.message)
        loadingPage(false)
        return
      }
    })

    //?????? code
    await axios({
      method:'post',
      url:'/student/restartcode'
    }).then(response=>{
      if(response.data.status != 200){
        window.alert(response.data.message)
        loadingPage(false)
        return
      }
    })

    load()
    loadingPage(false)
  }
}
//logout
const logout = () => {
  if (window.confirm("???????????????????????????????????????????????????!")) {
    loadingPage(true)
    axios({
      method: 'post',
      url: '/logout'
    }).then(response => {
      window.location.href = '/'
    })
  }
}
//----------------------------------------------------------------------------------------
//special for deleting node function
const deleteNode = (part) => {
  const animateDeletion = (part) => {
    if (!(part instanceof go.Node)) return; // only animate Nodes
    let animation = new go.Animation();
    let deletePart = part.copy();
    animation.add(deletePart, "scale", deletePart.scale, 0.01);
    animation.add(deletePart, "angle", deletePart.angle, 360);
    animation.addTemporaryPart(deletePart, myDiagram);
    animation.start();
  }

  switch (part.ob.category) {
    case 'Start':
      window.alert('????????????????????????????????????')
      return
    case 'Programming':
      if (window.confirm('?????????????????? ??????????????????\n???????????????????????????????????????')) {
        axios({
          method: 'post',
          url: '/student/deletecode',
          data: {
            keyCode: part.ob.key,
          }
        }).then(response => {
          if (response.data.status != 200) {
            window.alert(response.data.message)
            return
          }
          myDiagram.remove(part)
          animateDeletion(part)
          save()
        })
      }
      return
    case 'Comment':
      if (window.confirm('??????????????????????????????\n???????????????????????????????????????')) {
        myDiagram.remove(part)
        animateDeletion(part)
        save()
      }
      break
    default:
      myDiagram.remove(part)
      animateDeletion(part)
  }
}

window.addEventListener('DOMContentLoaded', goListInit);
window.addEventListener('DOMContentLoaded', navInit);
