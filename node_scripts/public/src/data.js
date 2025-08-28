export class DataFrame {
  data;

  constructor(dataString) {
    this.fromCSVString(dataString);
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

  removeRowsAtIndex(i, number=1) {
    return this.data.splice(i, number);
  }

  removeColumnsAtIndex(i, number=1) {
    let removedColumns = [];
    this.data = this.data.map(row => {
        let removed = row.splice(i, number);
        removedColumns.push(removed);
        return row;
    });

    removedColumns.reverse();

    return removedColumns; 
  }

  removeColumnsByName(columns) {
    let indices = columns.map(columnName => {
        return this.data[0].indexOf(columnName);
    });

    for(let i=0; i < indices.length; i++) {
        if(indices[i] > 0) {
            this.removeColumnsAtIndex(indices[i]);
        }
    }
  }

  removeNullEmptyRows() {
    this.data = this.data.filter(row => {
        if(row == undefined || row==null || row?.length ==0) return false;
        
        for(let i=0; i<row.length; i++) {
            if(row[i] == null || row[i]==undefined || row[i]=='' || row[i] == NaN) {
                return false;
            }
        }
        
        return true;
    });
  }

  printHead(maxCount = 5) {
    for (let i = 0; i < maxCount+1; i++) {
      console.log(this.data[i]);
    }
  }

  printTail(maxCount = 5) {
    console.log(this.data[0]);
    for (let i = maxCount; i > 0; i--) {
      console.log(this.data[this.data.length - i]);
    }
  }
}
