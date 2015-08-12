/**
 * Created by aghassaei on 5/28/15.
 */

define(['underscore', 'appState', 'lattice', 'three', 'threeModel', 'cam', 'component'], function(_, appState, lattice, THREE, three, cam, Component){
    
    var assemblerMaterial = new THREE.MeshLambertMaterial({color:0xaaaaaa, shading: THREE.FlatShading, transparent:true, opacity:0.5});
    
    function Assembler(){

        this.components = {};
        this.stock = this._buildStock();
        this._positionStockRelativeToEndEffector(this.stock);

        this.object3D = new THREE.Object3D();
        three.sceneAdd(this.object3D);
        this._buildAssemblerComponents();
        this._configureAssemblerMovementDependencies();
        three.render();

        this.setVisibility(cam.isVisible());
    }
    
    Assembler.prototype._buildStock = function(callback){
        lattice.makeCellForLatticeType({}, callback);
    };
    
    Assembler.prototype._positionStockRelativeToEndEffector = function(stock){
    };
    
    Assembler.prototype._buildAssemblerComponents = function(){
        var allSTLs = this._getSTLs();
        var self = this;
        _.each(allSTLs, function(geometry, name){
            var component = new Component(geometry, assemblerMaterial, name);
            self.components[component.getID()] = component;
        });
    };

    Assembler.prototype.getComponentByName = function(name){
        return _.find(_.values(this.components), function(component){
            return component.name == name;
        });
    };

    Assembler.prototype.getComponentById = function(id){
        return this.components[id];
    };
    
    Assembler.prototype._configureAssemblerMovementDependencies = function(){
        //override in subclasses
    };
    
    Assembler.prototype.setVisibility = function(visible){
        this.object3D.visible = visible;
        this._setTranslucent();
        three.render();
    };
    
    Assembler.prototype._setTranslucent = function(){
        assemblerMaterial.transparent = (appState.get("currentTab") == "cam" || appState.get("currentTab") == "assemblerSetup");
    };

    Assembler.prototype.moveMachine = function(){//origin selection
        var origin = cam.get("originPosition");
        this.object3D.position.set(origin.x, origin.y, origin.z);
        three.render();
    };
    
    
    
    
    
    Assembler.prototype.postProcess = function(data, exporter){//override in subclasses
    
        var rapidHeight = cam.get("rapidHeight");
        var safeHeight = cam.get("safeHeight");
        var wcs = cam.get("originPosition");
    
        var stockPosition = cam.get("stockPosition");
        var stockNum = 0;//position of stock in stock array
        var multStockPositions = cam.get("multipleStockPositions");
        var stockSeparation = cam.get("stockSeparation");
        var stockArraySize = cam.get("stockArraySize");
        var self = this;
    
        lattice.rasterCells(cam._getOrder(cam.get("camStrategy")), function(cell){
            if (!cell) return;
            if (this.stockAttachedToEndEffector){
                data += self._postGetStock(exporter);
            } else {
                var thisStockPosition = _.clone(stockPosition);
                if (multStockPositions) {
                    thisStockPosition.x += stockNum % stockArraySize.y * stockSeparation;
                    thisStockPosition.y -= Math.floor(stockNum / stockArraySize.y) * stockSeparation;
                    stockNum += 1;
                    if (stockNum >= stockArraySize.x * stockArraySize.y) stockNum = 0;
                }
                data += self._postMoveXY(exporter, stockPosition.x-wcs.x, stockPosition.y-wcs.y);
                data += self._postPickUpStock(exporter, thisStockPosition, rapidHeight, wcs, safeHeight);
            }
            var cellPosition = cell.getPosition();
            data += self._postMoveXY(exporter, cellPosition.x-wcs.x, cellPosition.y-wcs.y);
            data += self._postReleaseStock(cellPosition, cell, exporter, rapidHeight, wcs, safeHeight);
            data += "\n";
        });
        return data;
    };
    
    Assembler.prototype._postMoveXY = function(exporter, x, y){
        return exporter.rapidXY(x, y);
    };
    
    Assembler.prototype._postPickUpStock = function(exporter, stockPosition, rapidHeight, wcs, safeHeight){
        var data = "";
        data += exporter.rapidZ(stockPosition.z-wcs.z+safeHeight);
        data += exporter.moveZ(stockPosition.z-wcs.z);
        data += this._postGetStock(exporter);
        data += exporter.moveZ(stockPosition.z-wcs.z+safeHeight);
        data += exporter.rapidZ(rapidHeight);
        return data;
    };
    
    Assembler.prototype._postGetStock = function(exporter){
        return exporter.addComment("get stock");
    };
    
    Assembler.prototype._postReleaseStock = function(cellPosition, cell, exporter, rapidHeight, wcs, safeHeight){
        var data = "";
        data += exporter.rapidZ(cellPosition.z-wcs.z+safeHeight);
        data += exporter.moveZ(cellPosition.z-wcs.z);
        data += exporter.addComment(JSON.stringify(cell.indices));
        data += exporter.moveZ(cellPosition.z-wcs.z+safeHeight);
        data += exporter.rapidZ(rapidHeight);
        return data;
    };
    
    
    
    
    //animation methods
    
    Assembler.prototype.updateCellMode = function(){//message from cam
        this.stock.setMode();
    };
    
    Assembler.prototype.pickUpStock = function(){
        this.stock.show();
    };
    
    Assembler.prototype.releaseStock = function(index){
        lattice.showCellAtIndex(JSON.parse(index));
        this.stock.hide();
    };
    
    Assembler.prototype.pause = function(){
    };
    
    Assembler.prototype.moveTo = function(x, y, z, speed, wcs, callback){
        x = this._makeAbsPosition(x, wcs.x);
        y = this._makeAbsPosition(y, wcs.y);
        z = this._makeAbsPosition(z, wcs.z);
        this._moveTo(x, y, z, speed, wcs, callback);
    };
    
    Assembler.prototype._moveTo = function(x, y, z, speed, wcs, callback){
        var totalThreads = 3;
        function sketchyCallback(){
            totalThreads -= 1;
            if (totalThreads > 0) return;
            callback();
        }
        var startingPos = {x:this.xAxis.getPosition(), y:this.yAxis.getPosition(), z:this.zAxis.getPosition()};
        speed = this._normalizeSpeed(startingPos, x, y, this._reorganizeSpeed(speed));
        this.xAxis.moveTo(this._makeAxisVector(x, "x"), speed.x, sketchyCallback);
        this.yAxis.moveTo(this._makeAxisVector(y, "y"), speed.y, sketchyCallback);
        this.zAxis.moveTo(this._makeAxisVector(z, "z"), speed.z, sketchyCallback);
    };
    
    Assembler.prototype._makeAbsPosition = function(target, wcs){
        if (target == "" || target == null || target === undefined) return null;
        return parseFloat(target)+wcs;
    };
    
    Assembler.prototype._reorganizeSpeed = function(speed){
        var newSpeed = {};
        newSpeed.x = speed.xy;
        newSpeed.y = speed.xy;
        newSpeed.z = speed.z;
        return newSpeed;
    };
    
    Assembler.prototype._normalizeSpeed = function(startingPos, x, y, speed){//xy moves need speed normalization
        var normSpeed = {};
        if (x == "" || y == "") return speed;
        var deltaX = x-startingPos.x;
        var deltaY = y-startingPos.y;
        var totalDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        if (totalDistance == 0) return speed;
        normSpeed.x = Math.abs(deltaX/totalDistance*speed.x);
        normSpeed.y = Math.abs(deltaY/totalDistance*speed.y);
        normSpeed.z = speed.z;
        return normSpeed;
    };
    
    Assembler.prototype._makeAxisVector = function(position, axis){
        switch (axis){
            case "x":
                return {x:position, y:0, z:0};
            case "y":
                return {x:0, y:position, z:0};
            case "z":
                return {x:0, y:0, z:position};
            default:
                console.warn(axis + " axis not recognized");
                return null;
        }
    };
    
    
    
    
    //helper
    
    Assembler.prototype.destroy = function(){
        var self = this;
        _.each(this.components, function(component, index){
            component.destroy();
            self[index] = null;
        });
        this.components = null;
        three.sceneRemove(this.object3D);
        this.stock = null;
        this.zAxis = null;
        this.xAxis = null;
        this.yAxis = null;
        this.frame = null;
        this.substrate = null;
        this.object3D = null;
    };

    Assembler.prototype.toJSON = function(){
        var componentsJSON = {};
        _.each(this.components, function(component, id){
            componentsJSON[id] = component.toJSON();
        });
        return {
            components: componentsJSON,
            translation: this.object3D.position,
            scale: this.object3D.scale.x,
            rotation: this.object3D.rotation
        }
    };



    return Assembler;
});
