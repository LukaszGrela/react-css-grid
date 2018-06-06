import React from "react";
import PropTypes from "prop-types";
import Hammer from "hammerjs";
import DragDiv from "./DragDiv";

class ResizableDiv extends React.Component {
  onPanStart = id => {
    this.props.onPanStart(this.props.id);
  };
  onPan = (id, cx, cy, dx, dy) => {
    this.props.onPan(this.props.id, cx, cy, dx, dy);
  };
  onPanStop = (id, cx, cy, dx, dy) => {
    this.props.onPanStop(this.props.id, cx, cy, dx, dy);
  };
  onResize = (handle, cx, cy, dx, dy) => {
    this.props.onResize(this.props.id, handle, cx, cy);
  };
  onResizeStop = (handle, cx, cy, dx, dy) => {
    this.props.onResizeStop(this.props.id, handle, cx, cy);
  };
  render = () => {
    const { style, className, id } = this.props;
    return (
      <div style={style} className={`${className}`}>
        <DragDiv
          id={'pan'}
          direction={Hammer.DIRECTION_ALL}
          className={"ResizableDiv_handle ResizableDiv_handle--pan"}
          onPan={this.onPan}
          onPanStart={this.onPanStart}
          onPanStop={this.onPanStop}
        />
        <DragDiv
          id={'tl'}
          direction={Hammer.DIRECTION_ALL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          className={"ResizableDiv_handle ResizableDiv_handle--tl"}
        />
        <DragDiv
          id={'tr'}
          direction={Hammer.DIRECTION_ALL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          className={"ResizableDiv_handle ResizableDiv_handle--tr"}
        />
        <DragDiv
          id={'bl'}
          direction={Hammer.DIRECTION_ALL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          className={"ResizableDiv_handle ResizableDiv_handle--bl"}
        />
        <DragDiv
          id={'br'}
          direction={Hammer.DIRECTION_ALL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          className={"ResizableDiv_handle ResizableDiv_handle--br"}
        />

        <DragDiv
          id={'top'}
          direction={Hammer.DIRECTION_VERTICAL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          className={"ResizableDiv_handle ResizableDiv_handle--top"}
        />
        <DragDiv
          id={'bottom'}
          direction={Hammer.DIRECTION_VERTICAL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          className={"ResizableDiv_handle ResizableDiv_handle--bottom"}
        />

        <DragDiv
          id={'right'}
          direction={Hammer.DIRECTION_HORIZONTAL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          onPan={this.onResize}
          className={"ResizableDiv_handle ResizableDiv_handle--right"}
        />
        <DragDiv
          id={'left'}
          direction={Hammer.DIRECTION_HORIZONTAL}
          onPanStart={this.onPanStart}
          onPanStop={this.onResizeStop}
          className={"ResizableDiv_handle ResizableDiv_handle--left"}
        />
      </div>
    );
  };
}
ResizableDiv.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.number,

  onPanStart: PropTypes.func,
  onPan: PropTypes.func,
  onResize: PropTypes.func,
  onResizeStop: PropTypes.func,
  onPanStop: PropTypes.func
};
const noop = () => {};
DragDiv.defaultProps = {
  onPanStart: noop,
  onPan: noop,
  onResize: noop,
  onResizeStop: noop,
  onPanStop: noop
};
export default ResizableDiv;
