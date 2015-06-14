/**
 * Created by aghassaei on 6/1/15.
 */



define(['underscore', 'three', 'threeModel', 'lattice', 'appState', 'cell'],
    function(_, THREE, three, lattice, appState, DMACell){

    function DMASuperCell(json, superCell){//supercells might have supercells

        this.cells = true;//flag for now

        DMACell.call(this, json, superCell);

        var material = this.getMaterial();
        var range = material.dimensions || appState.get("superCellRange");
        this.cells = this._makeChildCells(range, material);

        DMACell.prototype.setMode.call(this, null, function(){
            three.conditionalRender();
        });//don't pass a call down to children again
    }
    DMASuperCell.prototype = Object.create(DMACell.prototype);

    DMASuperCell.prototype._makeChildCells = function(range, material){
        var cells = [];
        for (var x=0;x<range.x;x++){
            cells.push([]);
            for (var y=0;y<range.y;y++){
                cells[x].push([]);
                for (var z=0;z<range.z;z++){
                    //child cells add themselves to object3D

                    var cellMaterial = this.material;
                    cells[x][y].push(null);

                    if (material.sparseCells){
                        if (material.sparseCells[x][y][z]){
                            if (material.sparseCells[x][y][z].material) {
                                cellMaterial = material.sparseCells[x][y][z].material;
                                this._makeSubCellForIndex({index: new THREE.Vector3(x,y,z), material:cellMaterial}, function(cell){
                                    var index = cell.getIndex();
                                    cells[index.x][index.y][index.z] = cell;
                                });
                            } else console.warn("no material for composite cell definition subcell");
                        }//else no cell in this spot
                    } else {//if not from composite definition, add subcell at all possible indices in supercell range
                        this._makeSubCellForIndex({index: new THREE.Vector3(x,y,z), material:cellMaterial}, function(cell){
                            cells[x][y][z] = cell;
                        });
                    }
                }
            }
        }
        return cells;
    };

    DMASuperCell.prototype._makeSubCellForIndex = function(json, callback){
        var subclassFile = lattice.getCellSubclassFile();
        if (json.material && json.material.substr(0,5) == "super") subclassFile = "compositeCell";
        var self = this;
        require([subclassFile], function(CellSubclass){
            var cell = new CellSubclass(json, self);
            if (callback) callback(cell);
        });
    };

    DMASuperCell.prototype._getMeshName = function(){
        return "supercell";
    };

    DMASuperCell.prototype.setMode = function(mode, callback){
        var self = this;
        DMACell.prototype.setMode.call(this, mode, function(){
            var numChildren = self.object3D.children.length-2;
            self._loopCells(function(cell){
                if (cell) cell.setMode(mode, function(){
                    if (--numChildren <= 0) {
                        if (callback) {
                            callback();
                            return;
                        }
                        three.conditionalRender();
                    }
                });
            });
        });

    };





    DMASuperCell.prototype.getLength = function(){
        if (this.cells && this.cells.length) return this.cells.length-1;
        return appState.get("superCellRange").x-1;//zero indexed
    };

    DMASuperCell.prototype._loopCells = function(callback){
        console.log(this.cells);
        var cells = this.cells;
        if (!cells || cells === undefined) return;
        for (var x=0;x<cells.length;x++){
            for (var y=0;y<cells[0].length;y++){
                for (var z=0;z<cells[0][0].length;z++){
                    callback(cells[x][y][z], x, y, z, this);
                }
            }
        }
    };

    DMASuperCell.prototype._iterCells = function(callback){
        var cells = this.cells;
        _.each(cells, function(cellLayer){
            _.each(cellLayer, function(cellColumn){
                _.each(cellColumn, function(cell){
                    callback(cell, cellColumn, cellLayer);
                });
            });
        });
    };

    DMASuperCell.prototype.destroy = function(){
        this._iterCells(function(cell){
            if (cell) {
                cell.destroy();
                cell = null;
            }
        });
        DMACell.prototype.destroy.call(this);
        this.cells = null;
    };

    DMASuperCell.prototype.destroyParts = function(){
        this._loopCells(function(cell){
            if (cell) cell.destroyParts();
        });
    };

    return DMASuperCell;
});