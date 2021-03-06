/**
 * Created by aghassaei on 1/16/15.
 */


define(['underscore', 'backbone', 'appState', 'globals', 'plist', 'materialsPlist', 'three', 'threeModel', 'latticeBase', 'console'],
    function(_, Backbone, appState, globals, plist, materialsPlist, THREE, three, LatticeBase, myConsole){

    var Lattice = LatticeBase.extend({

        defaults: _.extend(_.clone(LatticeBase.prototype.defaults), {

            units: "mm",
            scale: 1.0,

            cellType: "cube",
            connectionType: "face",
            applicationType: "default",

            aspectRatio: null
        }),


        __initialize: function(){

            this.listenTo(this, "change:cellType", function(){
                this._cellTypeChanged();
            });
            this.listenTo(this, "change:connectionType", function(){
                this._connectionTypeChanged();
            });
            this.listenTo(this, "change:applicationType", function(){
                this._applicationTypeChanged();
            });
            this.listenTo(this, "change:aspectRatio", function(){
                var aspectRatio = this.getAspectRatio();
                //myConsole.write("lattice.setAspectRatio(" + aspectRatio.x + ", " + aspectRatio.y + ", " + aspectRatio.z +")");
                this.reloadCells();
            });

            this.listenTo(appState, "change:currentNav", this._navChanged);
            this.listenTo(this, "change:cellsMin change:cellsMax", function(){
                this.updateThreeViewTarget();
            });

            this._applicationTypeChanged();

            var self = this;
            require(["cubeCell"], function(CubeCell){//todo fix this
                self.cellSubclass = CubeCell;
            });
        },





        //getters

        getUnits: function(){
            return this.get("units");
        },

        getScale: function(){
            return this.get("scale");
        },

        getAspectRatio: function(){
            return this.get("aspectRatio").clone();
        },

        getPitch: function(){
            return this.get("aspectRatio").clone().multiplyScalar(plist.allUnitTypes[this.get("units")].multiplier);//return in m
        },

        getCellType: function(){
            return this.get("cellType");
        },

        getConnectionType: function(){
            return this.get("connectionType");
        },

        getApplicationType: function(){
            return this.get("applicationType");
        },

        getPartType: function(){
            return this.get("partType");
        },

        //lattice type

        _getLatticePlistData: function(){
            return plist.allLattices[this.get("cellType")].connection[this.get("connectionType")].type[this.get("applicationType")];
        },



        //setters


        setProperty: function(property, value, silent){
            var changed = this.get(property) != value;
            if (silent !== true) silent = false;
            this.set(property, value, {silent:silent});
            return changed;
        },

        _getSetterName: function(property){
            return "set" + property.charAt(0).toUpperCase() + property.slice(1);
        },

        setAspectRatio: function(aspectRatio, silent){
            return;
            if (!aspectRatio.x || !aspectRatio.y || !aspectRatio.z || aspectRatio.x<0 || aspectRatio.y<0 || aspectRatio.z<0) {//no 0, undefined, null, or neg #'s
                myConsole.warn("invalid aspect ratio params, lattice.setAspectRatio operation cancelled");
                return;
            }
            return this.setProperty("aspectRatio", new THREE.Vector3(aspectRatio.x, aspectRatio.y, aspectRatio.z), silent);
        },

        setCellType: function(cellType, silent){
            if (plist.allLattices[cellType] === undefined){
                myConsole.warn("no cell type " + cellType + ", lattice.setCellType operation cancelled");
                return;
            }
            return this.setProperty("cellType", cellType, silent);
        },

        setConnectionType: function(connectionType, silent){
            var cellType = this.get("cellType");
            var plistCellData = plist.allLattices[cellType];
            if (plistCellData.connection[connectionType] === undefined){
                myConsole.warn("no connection type " + connectionType + " for cell type " + cellType +
                    ", lattice.setConnectionType operation cancelled");
                return;
            }
            return this.setProperty("connectionType", connectionType, silent);
        },

        setApplicationType: function(applicationType, silent){
            var cellType = this.get("cellType");
            var plistCellData = plist.allLattices[cellType];
            var connectionType = this.get("connectionType");
            var plistConnectionData = plistCellData.connection[connectionType];
            if (plistConnectionData.type[applicationType] === undefined){
                myConsole.warn("no application type " + applicationType + " for cell type " + cellType + " and connection type " + connectionType +
                ", lattice.setApplicationType operation cancelled");
                return;
            }
            return this.setProperty("applicationType", applicationType, silent);
        },

        setPartType: function(partType, silent){
            var cellType = this.get("cellType");
            var plistCellData = plist.allLattices[cellType];
            var connectionType = this.get("connectionType");
            var plistConnectionData = plistCellData.connection[connectionType];
            var applicationType = this.get("applicationType");
            var plistAppData = plistConnectionData.type[applicationType];
            if (plistAppData.parts[partType] === undefined){
                myConsole.warn("no part type " + partType + " for cell type " + plistCellData.name + " and connection type " + plistConnectionData.name + " and application type " + plistAppData.name +
                ", lattice.setPartType operation cancelled");
                return;
            }
            myConsole.write("lattice.setPartType('" + partType + "')");
            return this.setProperty("partType", partType, silent);
        },

        setMetaData: function(data){
            if (!data) {
                myConsole.warn("no data received, lattice.setMetaData operation cancelled");
                return;
            }
            var changed = false;
            var self = this;
            _.each(data, function(val, key){
                if (self[self._getSetterName(key)]) {
                    changed |= self[self._getSetterName(key)](val, true);
                }
                else myConsole.warn("no setter found for key " + key);
            });
            if (changed){
                //todo trigger event
            }
        },

        reloadCells: function(){

            if ((this.get("connectionType") == "gik" || this.previous("connectionType") == "gik") &&
                this.get("applicationType") != this.previous("applicationType")) this.clearCells();

            this._setDefaultCellMode();//cell mode

            var cellsMin = this.get("cellsMin");
            var cellsMax = this.get("cellsMax");
            var numCells = this.get("numCells");

            this._clearCells();
            if (this._undo) this._undo();//undo subclass methods
            if (globals.basePlane) globals.basePlane.destroy();
            if (globals.get("highlighter")) globals.get("highlighter").destroy();

            if (cellsMax && cellsMin) this._expandCellsMatrix(cellsMax, cellsMin);

              var self = this;
            require([this._getSubclassForLatticeType()], function(subclassObject){
                _.extend(self, subclassObject);
                self._initLatticeType();//init for lattice subclass
                if (numCells > 0) {
                    self._setCells(self.cells, cellsMin);
                }
            });
        },

        setCells: function(cells, offset){
            if (cells === undefined || cells == null) {
                console.warn("no cells given to setSparseCells");
                return;
            }
            myConsole.clear();
            var cellsString = JSON.stringify(cells);
            myConsole.write("lattice.setCells(" + cellsString + ", " + JSON.stringify(offset) + ")");

            this._setCells(JSON.parse(cellsString), offset);
        },

        _getSubclassForLatticeType: function(){
            var cellType = this.get("cellType");
            var connectionType = this.get("connectionType");
            var subclass = plist.allLattices[cellType].connection[connectionType].subclass;
            if (subclass === undefined){
                console.warn("unrecognized cell type " + cellType);
                return null;
            }
            return subclass;
        },

        _setDefaultCellMode: function(){//if no part associated with this lattice type set to cell mode
            appState.set("cellMode", "cell");
        },







        //latticeType

        _printCurrentLatticeType: function(){
            myConsole.write("lattice.setCellType('" + this.getCellType() + "')");
            myConsole.write("lattice.setConnectionType('" + this.getConnectionType() + "')");
            myConsole.write("lattice.setApplicationType('" + this.getApplicationType() + "')");
            myConsole.write("lattice.setPartType('" + this.getPartType() + "')");
        },

        _cellTypeChanged: function(){
            var cellType = this.getCellType();
            if (plist.allLattices[cellType].connection[this.getConnectionType()] === undefined){
                var connectionType = _.keys(plist.allLattices[cellType].connection)[0];
                this.set("connectionType", connectionType, {silent:true});
            }
            this._connectionTypeChanged();
        },

        _connectionTypeChanged: function(){
            var connectionType = this.getConnectionType();
            if (connectionType === undefined) connectionType = this.getConnectionType();
            var cellType = this.get("cellType");
            var appType = _.keys(plist.allLattices[cellType].connection[connectionType].type)[0];
            this.set("applicationType", appType, {silent:true});
            this._applicationTypeChanged();
        },

        _applicationTypeChanged: function(){
            var latticeData = this._getLatticePlistData();
            this.set("aspectRatio", latticeData.aspectRatio.clone(), {silent:true});

            var newPartType = null;
            if (latticeData.parts) newPartType = _.keys(latticeData.parts)[0];
            this.set("partType", newPartType, {silent:true});

            var newMaterialClass = (_.keys(materialsPlist.allMaterialClasses[appState.get("hierLevel")]))[0];
            appState.set("materialClass", newMaterialClass);

            if (latticeData.options){
                if (latticeData.options.gikLength) appState.set("gikLength", latticeData.options.gikLength);
            }

            this.reloadCells();
            this._printCurrentLatticeType();
        },

        xScale: function(){
            return this.get("aspectRatio").x;
        },

        yScale: function(){
            return this.get("aspectRatio").y;
        },

        zScale: function(){
            return this.get("aspectRatio").z;
        },







        //events

        __clearCells: function(silent){
            if (globals.basePlane) globals.basePlane.set("zIndex", 0, {silent:silent});
        },

        updateThreeViewTarget: function(target){
            if (target) {
                globals.threeView.setOrbitControlsFor(target);
                return;
            }
            if (!appState.get("focusOnLattice")) return;
            var center = this.calcCenterIndex();
            if (globals.threeView && this.getPositionForIndex) globals.threeView.setOrbitControlsFor(this.getPositionForIndex(center));
        },

        calcCenterIndex: function(){
            var cellsMin = this.get("cellsMin");
            var cellsMax = this.get("cellsMax");
            if (cellsMax === null || cellsMin === null) return new THREE.Vector3(0,0,0);
            return cellsMax.clone().sub(cellsMin).divideScalar(2).add(cellsMin);
        },

        _navChanged: function(){
            this.refreshCellsMaterial();
        },








        //3d ui

        addHighlightableCell: function(cell){
            if (this.highlightableCells) this.highlightableCells.push(cell);
            three.addCell(cell);
        },

        removeHighlightableCell: function(cell){
            if (this.highlightableCells) {
                var index = this.highlightableCells.indexOf(cell);
                if (index >= 0) this.highlightableCells.splice(index, 1);
            }
            three.removeCell(cell);
        },

        getHighlightableCells: function(){
            if (this.highlightableCells) return this.highlightableCells;
            return three.getCells();
        }
    });


    var lattice = new Lattice();
    appState.setLattice(lattice);
    return lattice;

});