/**
 * Created by aghassaei on 1/26/15.
 */


LatticeMenuView = Backbone.View.extend({

    el: "#menuContent",

    events: {
    },

    initialize: function(){

        _.bindAll(this, "render");
    },

    render: function(){
        this.$el.html(this.template());
    },

    template: _.template('\
        Cell Type: <br/>\
        Cell Connection:<br/>\
        Scale:<br/>\
        Column Separation:<br/><br/>\
        <a href="#" class=" btn btn-block btn-lg btn-default">Clear All Cells</a><br/>\
        ')

});