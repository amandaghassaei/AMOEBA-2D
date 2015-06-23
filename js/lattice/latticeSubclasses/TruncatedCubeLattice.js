/**
 * Created by aghassaei on 5/26/15.
 */


define(['underscore', 'backbone', 'appState', 'globals', 'plist', 'three', 'threeModel'],
    function(_, Backbone, appState, globals, plist, THREE, three){

    var TruncatedCubeLattice = {

        _initLatticeType: function(){
            require(['squareBaseplane'], function(SquareBasePlane){
                globals.basePlane = new SquareBasePlane();
            });
            require([this.getHighlighterFile()], function(TruncatedCubeHighlighter){
                globals.highlighter = new TruncatedCubeHighlighter();
            });
        },

        getHighlighterFile: function(){
            return "truncatedCubeHighlighter";
        },

        getIndexForPosition: function(absPosition){
            return this._indexForPosition(absPosition);
        },

        getPositionForIndex: function(index){
            return this._positionForIndex(index);
        },

        xScale: function(cellSeparation){
            if (cellSeparation === undefined) cellSeparation = this.get("cellSeparation").xy;
            return Math.sqrt(2)+2*cellSeparation;
        },

        yScale: function(cellSeparation){
            return this.xScale(cellSeparation);
        },

        zScale: function(cellSeparation){
            if (cellSeparation === undefined) cellSeparation = this.get("cellSeparation").z;
            return Math.sqrt(2)+2*cellSeparation;
        },

        getCellSubclassFile: function(){
            return "truncatedCubeCell";
        },

        _undo: function(){//remove all the mixins, this will help with debugging later
            var self = this;
            _.each(_.keys(TruncatedCubeLattice), function(key){
                self[key] = null;
            });
        }
    };

    return TruncatedCubeLattice;
});