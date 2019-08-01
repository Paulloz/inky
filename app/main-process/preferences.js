const electron = require('electron');
const app = electron.app;
const fs = require('fs');
const path = require('path');

const defaults = {
};

function Prefs() {
    var that = this;

    this.filename = 'inky-config.json'
    this.path = app.getPath('userData');
    this.fullpath = path.join(this.path, this.filename);
    this.data = defaults;

    function Inner() {}
    Inner.prototype.Get = function(key) {
        return that.data[key];
    };
    Inner.prototype.Set = function(key, value) {
        that.data[key] = value;
        that.SaveToDisk();
    };
    this.inner = new Inner();

    if (!fs.existsSync(this.fullpath)) {
        this.SaveToDisk();
    }
    this.LoadFromDisk();
}

Prefs.prototype.SaveToDisk = function() {
    if (this.Validate()) {
        fs.writeFileSync(this.fullpath, JSON.stringify(this.data));
    }
};

Prefs.prototype.LoadFromDisk = function() {
    var oldData = this.data;
    this.data = JSON.parse(fs.readFileSync(this.fullpath, 'utf-8'));
    if (!this.Validate()) {
        this.data = oldData;
    }
};

Prefs.prototype.Validate = function() {
    // TODO Implements
    return true;
};

function Preferences() {
    var prefs = null

    return function() {
        if (prefs == null) {
            prefs = new Prefs();
        }
        return prefs.inner;
    };
}

exports.Preferences = Preferences();