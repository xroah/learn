!function() {
    var doc = document,
        defaultOpt = "<option value=''>请选择</option>",
        selectEvt = "select.district.change";

    function DistrictSelect(appendTo) {
        this.container = appendTo;
        this.data = null;
        this.provinceEl = doc.createElement("select");
        this.cityEl = doc.createElement("select");
        this.districtEl = doc.createElement('select');
        this.currentProvice = null;
        this.currentCity = null;
        this.currentDistrict = null;
    }

    var fn = DistrictSelect.prototype;

    fn.initData = function () {
        var me = this;
        $.get("data.json").done(function(res) {
            me.data = JSON.parse(res);
            me.initProvince();
        }).fail(function() {
            throw new Error("载入数据失败!");
        });
        return this;
    }

    fn.getOpitions = function(data, useChild) {
        var key, 
            opts = "";
        data = data || {};
        if (useChild) {
            data = data.child;
        }
        for (key in data) {
            opts += "<option value='" + key + "'>" + (data[key].name || data[key]) + "</option>";
        }
        return opts;
    }

    fn.initProvince = function() {
        var data = this.data;
        $(this.provinceEl).html(defaultOpt + this.getOpitions(data, false));
        this.initCity().initDistrict();
        return this;
    };

    fn.initCity = function() {
        var current = this.currentProvice;
        $(this.cityEl).html(defaultOpt + this.getOpitions(current, true));
        return this;
    };

    fn.initDistrict = function() {
        var current = this.currentCity;
        $(this.districtEl).html(defaultOpt + this.getOpitions(current, true));
        return this;
    };

    fn.selectProvince = function() {
        var val = this.provinceEl.value;
        if (val) {
            this.currentProvice = this.data[val];
            this.initCity();
        } else {
            this.currentProvice = this.currentCity = this.currentDistrict = null;
            this.initCity().initDistrict();
        }
        return this;
    };

    fn.selectCity = function() {
        var val = this.cityEl.value;
        if (val) {
            this.currentCity = this.currentProvice.child[val];
        } else {
            this.currentCity = this.currentCity = null;
        }
        this.initDistrict();
        return this;
    };

    fn.selectDistrict = function() {
        var val = this.districtEl.value;
        this.currentDistrict = val ? this.currentCity.child[val] : null;
        return this;
    };

    fn.getSelected = function() {
        var selected = {};
        if (this.currentProvice) {
            selected.province = {
                code: this.provinceEl.value,
                text: this.currentProvice.name
            };
        }
        if (this.currentCity) {
            selected.city = {
                code: this.cityEl.value,
                text: this.currentCity.name
            };
        }
        if (this.currentDistrict) {
            selected.district = {
                code: this.districtEl.value,
                text: this.currentDistrict
            };
        }
        return selected;
    };

    fn.onChange = function(evt) {
        var target = evt.target,
            selected;
        switch (target) {
            case this.provinceEl:
                this.selectProvince();
                break;
            case this.cityEl:
                this.selectCity();
                break;
            case this.districtEl:
                this.selectDistrict();
                break;
        }
        selected = this.getSelected();
        $(this.container).trigger(selectEvt, selected);
    }

    fn.initEvent = function() {
        $(this.container).on("change", $.proxy(this.onChange, this));
        return this;
    };

    fn.init = function() {
        //防止重新初始化时保留原来的事件和元素
        $(this.container).
                            off().
                            empty().
                            append([this.provinceEl, this.cityEl, this.districtEl]);
        this.
            initData().
            initEvent();
    };

    $.fn.extend({
        districtSelect: function() {
            return this.each(function (el) { 
                new DistrictSelect(this).init();
             });
        }
    });
}();