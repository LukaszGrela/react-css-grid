import React from "react";
import Grid from "./Grid";
import DragDiv from "../components/DragDiv";
import ResizableDiv from "../components/ResizableDiv";

const trackSpan = (start, end) => `${start} / ${end}`;
const gridArea = (colStart, colEnd, rowStart, rowEnd) =>
  `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`;

const gridAreaCss = (colStart = 1, colEnd = 2, rowStart = 1, rowEnd = 2) => ({
  gridArea: gridArea(colStart, colEnd, rowStart, rowEnd)
});
const gridItemColumnCss = (start = 1, end = 2) => ({
  gridColumn: trackSpan(start, end)
});
const gridItemRowCss = (start = 1, end = 2) => ({
  gridRow: trackSpan(start, end)
});
const gridItemTracksCss = (
  colStart = 1,
  colEnd = 2,
  rowStart = 1,
  rowEnd = 2
) => ({
  ...gridItemColumnCss(colStart, colEnd),
  ...gridItemRowCss(rowStart, rowEnd)
});

const find = (id, list) => list.find(item => item.id === id);
const findIndex = (id, list) => list.findIndex(item => item.id === id);
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
class App extends React.Component {
  state = {
    cols: 4,
    rows: 4,
    childId: 0,
    gridChildren: [],
    shadowChildren: []
  };

  getGridSize = () => {
    if (this._gridRef) {
      const ref = this._gridRef;
      this.gridSize = {
        width: ref.getWidth(),
        height: ref.getHeight(),
        colSize: ref.getColumnSize(),
        rowSize: ref.getRowSize()
      };
    }
  };

  componentDidMount = () => {
    window.addEventListener("resize", this.getGridSize);
    this.getGridSize();
  };
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.getGridSize);
  };

  addGridChild = () => {
    this.setState(prevState => {
      const gridChildren = prevState.gridChildren;
      const id = prevState.childId + 1;
      const x = Math.round(Math.random() * (prevState.cols - 1)) + 1;
      const y = Math.round(Math.random() * (prevState.rows - 1)) + 1;
      return {
        childId: id,
        gridChildren: [
          ...gridChildren,
          {
            id,
            x,
            y,
            cols: 1,
            rows: 1
          }
        ]
      };
    });
  };

  clearGrid = () => {
    this.setState(_ => ({ gridChildren: [], shadowChildren: [] }));
  };

  addRow = () => {
    this.setState(
      prevState => ({
        rows: prevState.rows + 1
      }),
      () => {
        this.getGridSize();
      }
    );
  };

  addCol = () => {
    this.setState(
      prevState => ({
        cols: prevState.cols + 1
      }),
      () => {
        this.getGridSize();
      }
    );
  };

  removeRow = () => {
    if (this.state.rows === 1) return;
    this.setState(
      prevState => ({
        rows: prevState.rows - 1
      }),
      () => {
        this.getGridSize();
      }
    );
  };

  removeCol = () => {
    if (this.state.cols === 1) return;
    this.setState(
      prevState => ({
        cols: prevState.cols - 1
      }),
      () => {
        this.getGridSize();
      }
    );
  };

  renderDraggedChild = () => {
    return this.state.shadowChildren.map(gridChild => {
      const { id, x = 1, y = 1, cols = 1, rows = 1 } = gridChild;
      const childCss = gridItemTracksCss(x, x + cols, y, y + rows);
      return (
        <div
          key={id}
          id={id}
          className="Grid_child Grid_shadow_child"
          style={{ ...childCss }}
        >
          {`Shadow #${id}`}
        </div>
      );
    });
  };

  handlePanStart = id => {
    console.log("handlePanStart", id);
    const original = find(id, this.state.gridChildren);
    const x = original.x;
    const y = original.y;
    const cols = original.cols;
    const rows = original.rows;
    this.setState(_ => ({
      shadowChildren: [
        {
          id,
          x,
          y,
          cols,
          rows
        }
      ]
    }));
  };
  handlePanning = (id, cx, cy, ox, oy) => {
    // console.log("handlePanning", id, cx, cy, ox, oy);
    const { width = 0, colSize = 0, height = 0, rowSize = 0 } = this.gridSize;

    // top left corner
    const x = clamp(Math.floor((cx - ox) / colSize) + 1, 1, this.state.cols);
    const y = clamp(Math.floor((cy - oy) / rowSize) + 1, 1, this.state.rows);

    // this needs to be changed to reposition whole cell by it's top left corner with offset around the center

    this.setState(prevState => {
      const shadow = prevState.shadowChildren;
      if (shadow.length > 0) {
        shadow[0] = {
          ...shadow[0],
          x,
          y
        };
      }
      return {
        shadowChildren: shadow
      };
    });
  };
  handlePanStop = (id, cx, cy, ox, oy) => {
    console.log("handlePanStop", id, cx, cy, ox, oy);
    const { width = 0, colSize = 0, height = 0, rowSize = 0 } = this.gridSize;

    // top left corner (c - o)
    const x = clamp(Math.floor((cx - ox) / colSize) + 1, 1, this.state.cols);
    const y = clamp(Math.floor((cy - oy) / rowSize) + 1, 1, this.state.rows);

    this.setState(prevState => {
      const index = findIndex(id, prevState.gridChildren);
      const original = prevState.gridChildren[index];
      const gridChildren = [...prevState.gridChildren];
      gridChildren[index] = { ...original, x, y };
      return {
        shadowChildren: [],
        gridChildren
      };
    });
  };



  handleResize = (id, handle, cx = 0, cy = 0) => {
    const { width = 0, colSize = 0, height = 0, rowSize = 0 } = this.gridSize;
    const halfColSize = colSize / 2;
    const halfRowSize = rowSize / 2;
    let _x,
      _y,
      _cols = 0,
      _rows = 0,
      colsOffset = 0,
      rowsOffset = 0;
    this.setState(prevState => {
      const original = find(id, prevState.gridChildren);
      const { x, y, cols, rows } = original;
      switch (handle) {
        case "right":
          _x = clamp(
            Math.floor((cx + colSize) / colSize) + 1,
            1,
            prevState.cols + 1
          );

          colsOffset = (_x - x)-1;
          _cols = clamp(original.cols + colsOffset, 1, (prevState.cols - cols)+1);
          console.log(colsOffset, original.cols + colsOffset, _cols)
          return {
            shadowChildren: [{ ...original, cols: _cols}]
          };
      }
    });
  };
  handleResizeStop = (id, handle, cx = 0, cy = 0) => {
    const { width = 0, colSize = 0, height = 0, rowSize = 0 } = this.gridSize;
    const halfColSize = colSize / 2;
    const halfRowSize = rowSize / 2;
    let _x,
      _y,
      _cols = 0,
      _rows = 0,
      colsOffset = 0,
      rowsOffset = 0;
    this.setState(prevState => {
      const index = findIndex(id, prevState.gridChildren);
      const original = prevState.gridChildren[index];
      const { x, y, cols, rows } = original;
      const gridChildren = [...prevState.gridChildren];
      switch (handle) {
        case "right":
          _x = clamp(
            Math.floor((cx + colSize) / colSize) + 1,
            1,
            prevState.cols + 1
          );

          colsOffset = (_x - x)-1;
          _cols = clamp(original.cols + colsOffset, 1, (prevState.cols - cols)+1);
          gridChildren[index] = {
            ...original,
            cols: _cols
          };
          break;
      }
      return {
        gridChildren,
        shadowChildren: []
      };
    });
  };

  renderChildren = () => {
    return this.state.gridChildren.map(gridChild => {
      const { id, x = 1, y = 1, cols = 1, rows = 1 } = gridChild;
      const childCss = gridItemTracksCss(x, x + cols, y, y + rows);
      console.log(childCss);
      return (
        <ResizableDiv
          key={id}
          id={id}
          className="Grid_child"
          style={{ ...childCss }}
          onPanStart={this.handlePanStart}
          onPan={this.handlePanning}
          onPanStop={this.handlePanStop}
          onResize={this.handleResize}
          onResizeStop={this.handleResizeStop}
        />
      );
    });
  };

  storeGridRef = el => (this._gridRef = el);
  render = () => {
    const { cols, rows, gridChildren } = this.state;
    return (
      <div className="App">
        <div className="Controls">
          <button className="Controls_button-add" onClick={this.addGridChild}>
            Add Child
          </button>
          <button
            className="Controls_button-clear"
            onClick={this.clearGrid}
            disabled={gridChildren.length === 0}
          >
            Clear board
          </button>
          <button className="Controls_button-addRow" onClick={this.addRow}>
            Add Row
          </button>
          <button
            className="Controls_button-removeRow"
            onClick={this.removeRow}
            disabled={rows === 1}
          >
            Remove Row
          </button>
          <button className="Controls_button-addCol" onClick={this.addCol}>
            Add Column
          </button>
          <button
            className="Controls_button-removeCol"
            onClick={this.removeCol}
            disabled={cols === 1}
          >
            Remove Column
          </button>
        </div>
        <Grid ref={this.storeGridRef} cols={cols} rows={rows}>
          {this.renderChildren()}
        </Grid>
        <Grid cols={cols} rows={rows} className={"Grid_shadow"}>
          {this.renderDraggedChild()}
        </Grid>
      </div>
    );
  };
}

export default App;
