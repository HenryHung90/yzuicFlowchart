import React, { useState } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";

// const GOGOtest = () => {
//     // // state variables
//     // const [nodeDataArray, setNodeDataArray] = useState([
//     //     { key: 1, text: "Alpha", color: "lightblue" },
//     //     { key: 2, text: "Beta", color: "orange" },
//     //     { key: 3, text: "Gamma", color: "lightgreen" },
//     //     { key: 4, text: "Delta", color: "pink" },
//     // ]);
//     // const [linkDataArray, setLinkDataArray] = useState([
//     //     { key: -1, from: 1, to: 2 },
//     //     { key: -2, from: 1, to: 3 },
//     //     { key: -3, from: 2, to: 2 },
//     //     { key: -4, from: 3, to: 4 },
//     //     { key: -5, from: 4, to: 1 },
//     // ]);

//     // const [skipsDiagramUpdate, setSkipsDiagramUpdate] = useState(false);

//     // // maps for faster state modification
//     // const mapNodeKeyIdx = new Map();
//     // const mapLinkKeyIdx = new Map();
//     // refreshNodeIndex(nodeDataArray);
//     // refreshLinkIndex(linkDataArray);

//     // function refreshNodeIndex(nodeArr) {
//     //     mapNodeKeyIdx.clear();
//     //     nodeArr.forEach((n, idx) => {
//     //         mapNodeKeyIdx.set(n.key, idx);
//     //     });
//     // }

//     // function refreshLinkIndex(linkArr) {
//     //     mapLinkKeyIdx.clear();
//     //     linkArr.forEach((l, idx) => {
//     //         mapLinkKeyIdx.set(l.key, idx);
//     //     });
//     // }

//     // function handleModelChange(obj) {
//     //     if (obj === null) return;
//     //     const insertedNodeKeys = obj.insertedNodeKeys;
//     //     const modifiedNodeData = obj.modifiedNodeData;
//     //     const removedNodeKeys = obj.removedNodeKeys;
//     //     const insertedLinkKeys = obj.insertedLinkKeys;
//     //     const modifiedLinkData = obj.modifiedLinkData;
//     //     const removedLinkKeys = obj.removedLinkKeys;

//     //     // copy data to new array, but maintain references
//     //     let nodeArr = nodeDataArray.slice();
//     //     let linkArr = linkDataArray.slice();
//     //     // maintain maps of modified data so insertions don't need slow lookups
//     //     const modifiedNodeMap = new Map();
//     //     const modifiedLinkMap = new Map();
//     //     // only update state if we've actually made a change
//     //     let arrChanged = false;

//     //     // handle node changes
//     //     if (modifiedNodeData) {
//     //         modifiedNodeData.forEach(nd => {
//     //             modifiedNodeMap.set(nd.key, nd);
//     //             const idx = mapNodeKeyIdx.get(nd.key);
//     //             if (idx !== undefined && idx >= 0) {
//     //                 nodeArr.splice(idx, 1, nd);
//     //                 arrChanged = true;
//     //             }
//     //         });
//     //     }
//     //     if (insertedNodeKeys) {
//     //         insertedNodeKeys.forEach(key => {
//     //             const nd = modifiedNodeMap.get(key);
//     //             const idx = mapNodeKeyIdx.get(key);
//     //             if (nd && idx === undefined) {
//     //                 mapNodeKeyIdx.set(nd.key, nodeArr.length);
//     //                 nodeArr.push(nd);
//     //                 arrChanged = true;
//     //             }
//     //         });
//     //     }
//     //     if (removedNodeKeys) {
//     //         nodeArr = nodeArr.filter(nd => {
//     //             if (removedNodeKeys.includes(nd.key)) {
//     //                 arrChanged = true;
//     //                 return false;
//     //             }
//     //             return true;
//     //         });
//     //         refreshNodeIndex(nodeArr);
//     //     }
//     //     // handle link changes
//     //     if (modifiedLinkData) {
//     //         modifiedLinkData.forEach(ld => {
//     //             modifiedLinkMap.set(ld.key, ld);
//     //             const idx = mapLinkKeyIdx.get(ld.key);
//     //             if (idx !== undefined && idx >= 0) {
//     //                 linkArr.splice(idx, 1, ld);
//     //                 arrChanged = true;
//     //             }
//     //         });
//     //     }
//     //     if (insertedLinkKeys) {
//     //         insertedLinkKeys.forEach(key => {
//     //             const ld = modifiedLinkMap.get(key);
//     //             const idx = mapLinkKeyIdx.get(key);
//     //             if (ld && idx === undefined) {
//     //                 mapLinkKeyIdx.set(ld.key, linkArr.length);
//     //                 linkArr.push(ld);
//     //                 arrChanged = true;
//     //             }
//     //         });
//     //     }
//     //     if (removedLinkKeys) {
//     //         linkArr = linkArr.filter(ld => {
//     //             if (removedLinkKeys.includes(ld.key)) {
//     //                 arrChanged = true;
//     //                 return false;
//     //             }
//     //             return true;
//     //         });
//     //         refreshLinkIndex(linkArr);
//     //     }

//     //     if (arrChanged) {
//     //         setNodeDataArray(nodeArr);
//     //         setLinkDataArray(linkArr);
//     //         setSkipsDiagramUpdate(true);
//     //     }
//     // }

//     // function initDiagram() {
//     //     const $ = go.GraphObject.make;
//     //     const diagram = $(go.Diagram, {
//     //         "undoManager.isEnabled": true, // enable undo & redo
//     //         model: $(go.GraphLinksModel, { linkKeyProperty: "key" }),
//     //     });

//     //     // define a simple Node template
//     //     diagram.nodeTemplate = $(
//     //         go.Node,
//     //         "Auto", // the Shape will go around the TextBlock
//     //         $(
//     //             go.Shape,
//     //             "RoundedRectangle",
//     //             { strokeWidth: 2, fill: "white" },
//     //             // Shape.fill is bound to Node.data.color
//     //             new go.Binding("fill", "color")
//     //         ),
//     //         $(
//     //             go.TextBlock,
//     //             { margin: 50, editable: true }, // some room around the text
//     //             // TextBlock.text is bound to Node.data.key
//     //             new go.Binding("text").makeTwoWay()
//     //         )
//     //     );

//     //     return diagram;
//     // }

//     // return (
//     //     <ReactDiagram
//     //         divClassName="diagram-component"
//     //         initDiagram={initDiagram}
//     //         nodeDataArray={nodeDataArray}
//     //         linkDataArray={linkDataArray}
//     //         skipsDiagramUpdate={skipsDiagramUpdate}
//     //         onModelChange={handleModelChange}
//     //         style={{width:'900px',height:'600px' ,border:'1px solid black'}}
//     //     />
//     // );
// };
 function showLinkLabel(e) {
     var label = e.subject.findObject("LABEL");
     if (label !== null)
         label.visible = e.subject.fromNode.data.category === "Conditional";
 }
function initDiagram() {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram = $(go.Diagram, {
        //是否能夠回復上一部
        "undoManager.isEnabled": true, // must be set to allow for model change listening
        // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality

        //雙擊可新增節點
        "clickCreatingTool.archetypeNodeData": {
            text: "new node",
            color: "lightblue",
        },
        LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
        LinkRelinked: showLinkLabel,

        model: new go.GraphLinksModel({
            linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }),
    });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    diagram.addDiagramListener("Modified", e => {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !diagram.isModified;
        var idx = document.title.indexOf("*");
        if (diagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.slice(0, idx);
        }
    });
    // helper definitions for node templates

    function nodeStyle() {
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
                go.Point.stringify
            ),
            {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center,
            },
        ];
    }

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
    function makePort(name, align, spot, output, input) {
        var horizontal =
            align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape, {
            fill: "transparent", // changed to a color in the mouseEnter event handler
            strokeWidth: 0, // no stroke
            width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
            height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
            alignment: align, // align the port on the main Shape
            stretch: horizontal
                ? go.GraphObject.Horizontal
                : go.GraphObject.Vertical,
            portId: name, // declare this object to be a "port"
            fromSpot: spot, // declare where links may connect at this port
            fromLinkable: output, // declare whether the user may draw links from here
            toSpot: spot, // declare where links may connect at this port
            toLinkable: input, // declare whether the user may draw links to here
            cursor: "pointer", // show a different cursor to indicate potential link point
            mouseEnter: (e, port) => {
                // the PORT argument will be this Shape
                if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
            },
            mouseLeave: (e, port) => (port.fill = "transparent"),
        });
    }

    // define a simple Node template
    diagram.nodeTemplate = $(
        go.Node,
        "Auto", // the Shape will go around the TextBlock
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Spot.Center
        ),
        $(
            go.Shape,
            "RoundedRectangle",
            { name: "SHAPE", fill: "white", strokeWidth: 3 },
            // Shape.fill is bound to Node.data.color
            new go.Binding("fill", "color")
        ),
        $(
            go.TextBlock,
            { margin: 15, editable: false }, // some room around the text
            new go.Binding("text").makeTwoWay()
        )
    );

    return diagram;
}
const GOGO = () => {
    return (
        <div>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName="diagram-component"
                nodeDataArray={[
                    {
                        category: "Comment",
                        loc: "360 -10",
                        text: "Kookie Brittle",
                        key: -13,
                    },
                    { key: -1, category: "Start", loc: "175 0", text: "Start" },
                    { key: 0, loc: "-5 75", text: "Preheat oven to 375 F" },
                    {
                        key: 1,
                        loc: "175 100",
                        text: "In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt",
                    },
                    {
                        key: 2,
                        loc: "175 200",
                        text: "Gradually beat in 1 cup sugar and 2 cups sifted flour",
                    },
                    {
                        key: 3,
                        loc: "175 290",
                        text: "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels",
                    },
                    {
                        key: 4,
                        loc: "175 380",
                        text: "Press evenly into ungreased 15x10x1 pan",
                    },
                    {
                        key: 5,
                        loc: "355 85",
                        text: "Finely chop 1/2 cup of your choice of nuts",
                    },
                    { key: 6, loc: "175 450", text: "Sprinkle nuts on top" },
                    {
                        key: 7,
                        loc: "175 515",
                        text: "Bake for 25 minutes and let cool",
                    },
                    {
                        key: 8,
                        loc: "175 585",
                        text: "Cut into rectangular grid",
                    },
                    {
                        key: -2,
                        category: "End",
                        loc: "175 660",
                        text: "Enjoy!",
                    },
                ]}
                linkDataArray={[
                    { from: 1, to: 2, fromPort: "B", toPort: "T" },
                    { from: 2, to: 3, fromPort: "B", toPort: "T" },
                    { from: 3, to: 4, fromPort: "B", toPort: "T" },
                    { from: 4, to: 6, fromPort: "B", toPort: "T" },
                    { from: 6, to: 7, fromPort: "B", toPort: "T" },
                    { from: 7, to: 8, fromPort: "B", toPort: "T" },
                    { from: 8, to: -2, fromPort: "B", toPort: "T" },
                    { from: -1, to: 0, fromPort: "B", toPort: "T" },
                    { from: -1, to: 1, fromPort: "B", toPort: "T" },
                    { from: -1, to: 5, fromPort: "B", toPort: "T" },
                    { from: 5, to: 4, fromPort: "B", toPort: "T" },
                    { from: 0, to: 4, fromPort: "B", toPort: "T" },
                ]}
                style={{
                    width: "900px",
                    height: "900px",
                    border: "1px solid black",
                    margin: "0 auto",
                }}
            />
        </div>
    );
};

export default GOGO;
