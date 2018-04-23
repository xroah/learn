!function () { 
    function ImatitionSelect(appendTo,data) {
        this.container = appendTo;
        this.selected = null;
        this.value = "";
        this.data = data;
        
    }
    
    var fn = ImatitionSelect.prototype,
        doc = document;
    
    fn.show = function() {
    
    }

    fn.initOptions = function() {

    };
    
    fn.init = function() {
        var con = $(doc.createElement("div")),
            select = $(doc.createElement("div")),
            options = $(doc.createElement("ul"));
        con.addClass("imitation-select-container");
        select.addClass("imitation-select");
        options.addClass("imitation-options hide out");
        this.select = select;
        this.options = options;
        con.append(select).append(options);
        $(this.container).append(con);
    }
    $.fn.extend({
        iSelect: function (data) {
            this.each(function() {
                new ImatitionSelect(this, data).init();
            }); 
            return this;
         }
    });
 }();