/**
 * Created by aghassaei on 2/25/15.
 */


AssemblerMenuView = Backbone.View.extend({

    el: "#menuContent",

    events: {
        "click .camStrategy":                            "_selectCamStrategy",
        "click .machineType":                            "_selectMachine"
    },

    initialize: function(options){

        this.assembler = options.assembler;

        _.bindAll(this, "render");
        this.listenTo(this.assembler, "change", this.render);
    },

    _selectCamStrategy: function(e){
        e.preventDefault();
        this.assembler.set("camStrategy", $(e.target).data("type"));
    },

    _selectMachine: function(e){
        e.preventDefault();
        this.assembler.set("machine", $(e.target).data("type"));
    },

    render: function(){
        if (this.model.get("currentTab") != "assembler") return;
        this.$el.html(this.template(_.extend(this.model.toJSON(), this.assembler.toJSON())));
    },

    template: _.template('\
        Machine: &nbsp;&nbsp;\
            <div class="btn-group">\
                <button data-toggle="dropdown" class="btn dropdown-toggle" type="button"><%= allMachineTypes[machine] %><span class="caret"></span></button>\
                <ul role="menu" class="dropdown-menu">\
                    <% _.each(_.keys(allMachineTypes), function(key){ %>\
                        <li><a class="machineType" data-type="<%= key %>" href="#"><%= allMachineTypes[key] %></a></li>\
                    <% }); %>\
                </ul>\
            </div><br/><br/>\
        Strategy: &nbsp;&nbsp;\
            <div class="btn-group">\
                <button data-toggle="dropdown" class="btn dropdown-toggle" type="button"><%= allAssemblyStrategies[camStrategy] %><span class="caret"></span></button>\
                <ul role="menu" class="dropdown-menu">\
                    <% _.each(_.keys(allAssemblyStrategies), function(key){ %>\
                        <li><a class="camStrategy" data-type="<%= key %>" href="#"><%= allAssemblyStrategies[key] %></a></li>\
                    <% }); %>\
                </ul>\
            </div><br/><br/>\
        ')
});