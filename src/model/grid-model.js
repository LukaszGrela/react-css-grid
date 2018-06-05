class GridModel {
  _list = [];
  constructor(cols = 1, rows = 1) {
    this._length = cols * rows;
    this._width = cols;
    this._height = rows;
  }
  get length() {
    return this._length;
  }

  getCell(x, y) {
    return _list[y * (this._width - 1) + x];
  }
  addCell(x, y, data) {
    if(x >= this._width) throw new RangeError("x is out of range");
    if(y >= this._height) throw new RangeError("y is out of range");

    _list[y * (this._width -1) + x] = data;
  }
}
export default GridModel;
