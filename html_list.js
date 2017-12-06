// remember, lists are hierarchical.
//  AND the contents are fairly free. we will use this feature soon
function html_table(x, y, has_header_x, has_header_y) {
    this.x = x;
    this.y = y;
    this.has_header_x = has_header_x;
    this.has_header_y = has_header_y;
    this._table = null;
    this.header_x = null;
    this.header_y = null;
    this.header_xy = null;
    this.cells = null;
    this.generate_tables();
}

html_table.prototype.generate_tables = function() {
    this._table = document.createElement("table");
    // do you want a header row at the top?
    if (this.has_header_x) {
        var tr = document.createElement("tr");
        if (this.has_header_y) {
            // special element here if you have both
            // x and y headers there's a little thing left up here
            this.header_xy = document.createElement("th");
            tr.appendChild(this.header_xy);
        }
        this.header_x = new Array(this.x);
        for (var xc = 0; xc < this.x; xc++) {
            var td = document.createElement("th");
            this.header_x[xc] = td;
            tr.appendChild(td);
        }
        this._table.appendChild(tr);
    }
    if (this.has_header_y) {
        this.header_y = new Array(this.y);
    }
    this.cells = new Array(this.y);
    for (var yc = 0; yc < this.y; yc++) {
        var tr = document.createElement("tr");
        if (this.has_header_y) {
            var th = document.createElement("th");
            this.header_y[yc] = th;
            tr.appendChild(th);
        }
        this.cells[yc] = new Array(this.x);
        for (var xc = 0; xc < this.x; xc++) {
            var td = document.createElement("td");
            this.cells[yc][xc] = td;
            tr.appendChild(td);
        }
        this._table.appendChild(tr);
    }
}

// could do better "html_view" or similar
html_table.prototype.html = function() {
    return this._table;
}

html_table.prototype.apply_cell = function(funk) {
    for (var yc = 0; yc < this.y; yc++) {
        for (var xc = 0; xc < this.x; xc++) {
            var view = this.cells[yc][xc];
            funk(view, xc, yc)
        }
    }
}

// ouch. doesn't work for calendar
html_table.prototype.apply_header_x = function(funk) {
    if (this.has_header_x) {
        for (var xc = 0; xc < this.x; xc++) {
            funk(this.header_x[xc], xc);
        }
    }
}

html_table.prototype.apply_header_y = function(funk) {
    if (this.has_header_y) {
        for (var yc = 0; yc < this.y; yc++) {
            funk(this.header_y[yc], yc);
        }
    }
}

// is this just bullshit?
html_table.prototype.set_prop_cell = function(propid, funk) {
    this.apply_cell(function(cell,x,y) {
        cell[propid] = funk(x,y);
    });
}


html_table.prototype.set_header_x_prop = function(propid, funk) {
    this.apply_cell(function(cell,x,y) {
        cell[propid] = funk(x,y);
    });
}


