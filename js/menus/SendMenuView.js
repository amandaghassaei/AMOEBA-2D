/**
 * Created by aghassaei on 3/11/15.
 */

define(['jquery', 'underscore', 'menuParent', 'serialComm', 'commPlist', 'text!sendMenuTemplate', 'cam', 'camPlist'],
    function($, _, MenuParent, serialComm, commPlist, template, cam, camPlist){

    return MenuParent.extend({


        events: {
            "click #streamCommands":                                "_startStream",
            "click #pauseStream":                                   "_pauseStream",
            "click #stopMachine":                                   "_stopMachine",
            "click #previousLineButton":                            "_decrementLineNum",
            "click #nextLineButton":                                "_incrementLineNum"
        },


        __initialize: function(){
            this.isStreaming = false;
        },

        _startStream: function(e){
            e.preventDefault();
            this.isStreaming = true;
            this.render();
        },

        _pauseStream: function(e){
            e.preventDefault();
            this.isStreaming = false;
            this.render();
        },

        _stopMachine: function(e){
            e.preventDefault();
            this.isStreaming = false;
            serialComm.send("!");
            this.render();
        },

        _decrementLineNum: function(e){
            e.preventDefault();
            console.log("prev");
        },

        _incrementLineNum: function(e){
            e.preventDefault();
            console.log("next");
        },

        _makeTemplateJSON: function(){
            return _.extend(serialComm.toJSON(), commPlist, cam.toJSON(), camPlist, {streaming: this.isStreaming});
        },

        _render: function(){
            if (serialComm.get("lastMessageReceived") === null) $("#incomingSerialMessage").hide();
        },

        template: _.template(template)

    });
});