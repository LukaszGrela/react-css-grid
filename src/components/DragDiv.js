import React from "react";
import Hammer from "hammerjs";
import PropTypes from "prop-types";

class DragDiv extends React.Component {
  state = {
    panState: ""
  };
  
  componentDidMount = () => {
    this.hammer = new Hammer(this._ref);
    this.hammer.get("pan").set({ direction: this.props.direction });
    this.hammer.on("panstart", this.handlePan);
    this.hammer.on("panmove", this.handlePan);
    this.hammer.on("panend pancancel", this.handlePan);
  };
  componentWillUnmount = () => {
    if (this.hammer) {
      this.hammer.off("panstart", this.handlePan);
      this.hammer.off("panmove", this.handlePan);
      this.hammer.off("panend pancancel", this.handlePan);
    }
    this._ref = undefined;
    this.hammer = undefined;
  };

  handlePan = ev => {
    const type = ev.type;
    this.setState(
      _ => ({ panState: type === "panend" ? "" : type }),
      () => {
        const { onPan, onPanStart, onPanStop, id } = this.props;
        const {
          center: { x: cx, y: cy },
          target: { offsetLeft: ox, offsetTop: oy }
        } = ev;
        switch (type) {
          case "panstart":
            onPanStart(id);
            break;
          case "panmove":
            onPan(id, cx, cy, ox, oy);
            break;
          case "panend":
          case "pancancel":
            onPanStop(id, cx, cy, ox, oy);
            break;
        }
      }
    );
  };

  storeRef = el => (this._ref = el);
  render = () => {
    const { className, id } = this.props;
    const { panState } = this.state;
    return <div ref={this.storeRef} className={`${className} ${panState}`} />;
  };
}
const noop = () => {};
DragDiv.defaultProps = {
  direction: 30,
  onPanStart: noop,
  onPan: noop,
  onPanStop: noop
};
DragDiv.propTypes = {
  style: PropTypes.object,
  direction: PropTypes.number,
  onPanStart: PropTypes.func,
  onPan: PropTypes.func,
  onPanStop: PropTypes.func
};
export default DragDiv;
