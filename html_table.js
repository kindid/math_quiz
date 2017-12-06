// todo;consider handling h and v headers seperately.
//  that is, they are selectable at initialisation
//  AND there are at least 2 applys
//   apply_cell, apply_header
//  more likely 3
//   apply_cell, apply_head_x, apply_head_y
// one may even want 'apply_cell_h' 'apply_cell_v'


// NOTE:
// !this is a mess!
// > rename 'x' to 0 and y to '1' except on the external interface
// >> this dramatically improves the internal code structure (just array selector)
// > has_header_x and has_header_y are now header[orientation].length()
// > there's no ability to add new cells
// > a onclick would be nice
// > functions
// >> set_cell - what the hell does this actually do? appendChild?, innerHTML?
// >> input is either function or something else (object would be silly though)
// >> possibly add a 'set_row' and 'set_column' which take an array
// >> expose 'corner' - only exists if you have both horizonal and vertical headers




function html_table(x, y, has_header_x, has_header_y) {
    this.x = x;
    this.y = y;
    this.has_header_x = has_header_x;
    this.has_header_y = has_header_y;
    // TODO: should be 'view' or 'html'
    this._table = null;
    this.header_x = null;
    this.header_y = null;
    // becomes 'origin'
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
            // this is the 'corner' or 'origin cell'
            this.header_xy = document.createElement("th");
            tr.appendChild(this.header_xy);
            //this.origin =
        }
        this.header_x = new Array(this.x);
        for (var xc = 0; xc < this.x; xc++) {
            var td = document.createElement("th");
            // header[0][xc] =
            this.header_x[xc] = td;
            tr.appendChild(td);
        }
        this._table.appendChild(tr);
    }
    //wtf.
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

// todo - plural
html_table.prototype.apply_cell = function(funk) {
    for (var yc = 0; yc < this.y; yc++) {
        for (var xc = 0; xc < this.x; xc++) {
            var view = this.cells[yc][xc];
            funk(view, xc, yc)
        }
    }
}

html_table.prototype.apply_header = function(orientation, funk) {
    // if (this.headers[orientation].length) {
    //
    // }
    if (this.has_header_x) {
        for (var xc = 0; xc < this.x; xc++) {
            funk(this.header_x[xc], xc);
        }
    }
}

html_table.prototype.set_origin_inner = function(s) {
    if (this.header_xy !== null) {
        this.header_xy.innerHTML = s;
    }
}

html_table.prototype.apply_cell_inner = function(funk) {
    for (var yc = 0; yc < this.y; yc++) {
        for (var xc = 0; xc < this.x; xc++) {
            var view = this.cells[yc][xc];
            view.innerHTML = funk(xc, yc)
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

// roll all of these together - x is 0 and y is 1...
// get over it -only the outer interface gives a fuck
// this is the same as above - just wrap the function man
html_table.prototype.apply_header_x_inner = function(funk) {
    if (this.has_header_x) {
        for (var xc = 0; xc < this.x; xc++) {
            this.header_x[xc].innerHTML = funk(xc);
        }
    }
}

html_table.prototype.apply_header_y = function(funk) {
    // if (this(has_header[1])) { loop{0..this.d[1]}
    if (this.has_header_y) {
        for (var yc = 0; yc < this.y; yc++) {
            funk(this.header_y[yc], yc);
        }
    }
}

// this is the same as above man...
html_table.prototype.apply_header_y_inner = function(funk) {
    if (this.has_header_y) {
        for (var c = 0; c < this.y; c++) {
            this.header_y[c].innerHTML = funk(c);
        }
    }
}

html_table.prototype.set_prop_cell_i = function(x, y, propid, v) {
    this.cells[y][x][propid] = v;
}


// is this just bullshit? - not really but you don't always
// need a function - if it isn't a function then just set it
// directly
// todo - this is PLURAL
html_table.prototype.set_prop_cell = function(propid, funk) {
    if (funk instanceof Function) {
        this.apply_cell(function(cell,x,y) {
            var p = funk(x,y);
            if (p !== undefined) { cell[propid] = p; }
        });
    } else {
        this.apply_cell(function(cell,x,y) {
            cell[propid] = funk;
        });
    }
}

html_table.prototype.set_prop_x = function(propid, funk) {
    if (funk instanceof Function) {
        this.apply_header_x(function(cell,x,y) {
            cell[propid] = funk(x,y);
        });
    } else {
        this.apply_header_x(function(cell,x,y) {
            cell[propid] = funk;
        });
    }
}

html_table.prototype.set_prop_y = function(propid, funk) {
    if (funk instanceof Function) {
        // apply to array - there are a couple ()
        this.apply_header_y(function(cell,i) {
            cell[propid] = funk(i);
        });
    } else {
        this.apply_header_y(function(cell) {
            cell[propid] = funk;
        });
    }
}


// todo;this is wrong (never been used!)
html_table.prototype.set_header_x_prop = function(propid, funk) {
    this.apply_cell(function(cell,x,y) {
        // this is bogus I think - if you just return the 'view'
        // in each cell you can add the properties yourself and
        // save passing a parameter... really though? makes conditionals
        // easier I think
        cell[propid] = funk(x,y);
    });
}

html_table.prototype.set_header_x_prop_i = function(x, propid, v) {
    if (this.has_header_x) {
        this.header_x[x][propid] = v;
    }
}

html_table.prototype.set_header_y_prop_i = function(y, propid, v) {
    if (this.has_header_y) {
        this.header_y[y][propid] = v;
    }
}




// TODO: these just set innerHTML - you kinda want to use 'appendChild'
// phooey - use the apply functions
html_table.prototype.set_cell_inner = function(x,y,inner) {
    this.cells[y][x].innerHTML = inner;
}

html_table.prototype.set_header_x_inner = function(x,inner) {
    this.header_x[x].innerHTML = inner;
}

html_table.prototype.set_header_y_inner = function(y,inner) {
    this.header_y[y].innerHTML = inner;
}
