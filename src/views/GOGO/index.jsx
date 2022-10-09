import React, { useState } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";

const GOGO = () =>{

    const initDiagram = () =>{
        let $ = go.GraphObject.make
        let myDiagram = $(go.Diagram)

    }


    let nodeDataArray = [
        {key:"Alpha"},
        {key:"Beta"}
    ]

    let linkDataArray = [
        [{to:"Beta",from:"Alpha"}]
    ]

    return (
        <div>
            <ReactDiagram
                initDiagram={initDiagram}
                nodeDataArray={nodeDataArray}
                linkDataArray={linkDataArray}
                style={{width:'900px',height:'900px',margin:'0 auto'}}
            />
        </div>
    )
}

export default GOGO