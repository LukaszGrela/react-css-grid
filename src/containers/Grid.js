import React from 'react';
import PropTypes from 'prop-types';

class Grid extends React.Component {
  getColRowsTemplate = () => {
    const { cols, rows } = this.props;
    return {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
    };
  };

  getCols = () => this.props.cols;
  getRows = () => this.props.rows;
  getWidth = () => {
    if (this._el) {
      return this._el.offsetWidth;
    }
    return 0;
  };
  getHeight = () => {
    if (this._el) {
      return this._el.offsetHeight;
    }
    return 0;
  };
  getColumnSize = () => {
    if (this._el) {
      return this._el.offsetWidth / this.props.cols;
    }
    return 0;
  };
  getRowSize = () => {
    if (this._el) {
      return this._el.offsetHeight / this.props.rows;
    }
    return 0;
  };

  storeRef = el => (this._el = el);
  render = () => {
    const { children, className } = this.props;
    return (
      <div
        ref={this.storeRef}
        className={'Grid' + (className ? ' ' + className : '')}
        style={{
          ...this.getColRowsTemplate(),
        }}>
        {children}
      </div>
    );
  };
}

Grid.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
  className: PropTypes.string,
};
Grid.defaultProps = {
  rows: 1,
  cols: 1,
  className: undefined,
};

export default Grid;
