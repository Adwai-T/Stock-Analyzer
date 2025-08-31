export class DataFrame {
  data;

  constructor(data) {
    if(typeof data == 'string')
      this.fromCSVString(data);
    else this.data = data;
  }

  static createTrainTestSet(data, trainPercent=0.75) {
    return {
      trainingDf: new DataFrame(data.splice(0, Math.floor(data.length * trainPercent))),
      testDf : new DataFrame(data)
    }
  }

  fromCSVString(dataString) {
    let dataRow = dataString.split("\n");

    this.data = dataRow.map((row) => {
      let rowArray = row.split(",");
      rowArray = rowArray.map((ele) => {
        return typeof ele == "string" ? ele.trim() : ele;
      });
      return rowArray;
    });
  }

  removeRowAtIndex(i, number = 1) {
    return this.data.splice(i, number);
  }

  removeColumnAtIndex(i, number = 1) {
    let removedColumn = [];
    this.data = this.data.map((row) => {
      let removed = row.splice(i, number);
      removedColumn.push(removed);
      return row;
    });
    return removedColumn;
  }

  removeColumnsByName(columns) {
    let indices = columns.map((columnName) => {
      return this.data[0].indexOf(columnName);
    });

    for (let i = 0; i < indices.length; i++) {
      if (indices[i] > 0) {
        this.removeColumnAtIndex(indices[i]);
      }
    }
  }

  removeNullEmptyRows() {
    let removedRows = [];
    this.data = this.data.filter((row) => {
      if (row == undefined || row == null || row?.length == 0) return false;

      for (let i = 0; i < row.length; i++) {
        if (
          row[i] == null ||
          row[i] == undefined ||
          row[i] == "" ||
          row[i] == NaN
        ) {
          removedRows.push(row);
          return false;
        }
      }

      return true;
    });
    return removedRows;
  }

  castColumnsAtIndexToNumber(indices) {
    this.data = this.data.map((row) => {
      indices.forEach(i => {
          row[i] = Number(row[i]);
      });
      return row;
    });
  }

  printHead(maxCount = 5) {
    for (let i = 0; i < maxCount + 1; i++) {
      console.log(this.data[i]);
    }
  }

  printTail(maxCount = 5) {
    console.log(this.data[0]);
    for (let i = maxCount; i > 0; i--) {
      console.log(this.data[this.data.length - i]);
    }
  }

  static calcShape(arr) {
    if (!Array.isArray(this.data)) {
      return [];
    }

    let shape = [];
    let current = this.data;

    while (Array.isArray(current)) {
      shape.push(current.length);
      current = current[0];
    }

    return shape;
  }

  static flatten(arr) {
    return arr.reduce((flat, item) => {
      return flat.concat(Array.isArray(item) ? this.flatten(item) : item);
    }, []);
  }
}
