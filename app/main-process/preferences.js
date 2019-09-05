const electron = require('electron')
    , fs       = require('fs')
    , ini      = require('ini')
    , path     = require('path');


const app = electron.app;

// TODO: Export this in a default.ini
const defaults = {
    'view': {
        'theme': 'light',
    },
    'story': {
        'tags-visible': true
    }
};

function Prefs() {
    this.filename = 'inkyconfig'
    this.path = app.getPath('userData');
    this.fullpath = path.join(this.path, this.filename);
    this.data = defaults;

    function Wrapped() {}
    Wrapped.prototype.Get = (function() {
        const f = function(arr, keys) {
            return keys.length > 1 ? f(arr[keys.pop()], keys) : arr[keys.pop()];
        };

        return function(key) {
            return f(this.data, key.split('/').reverse());
        };
    })().bind(this);
    Wrapped.prototype.Set = (function() {
        const f = function(value, arr, keys) {
            if (keys.length > 1) {
                f(value, arr[keys.pop()], keys);
            } else {
                arr[keys.pop()] = value;
            }
        };

        return function(key, value) {
            f(value, this.data, key.split('/').reverse());
            this.SaveToDisk();
        };
    })().bind(this);
    this.wrapped = new Wrapped();

    if (!fs.existsSync(this.fullpath)) {
        this.SaveToDisk();
    }
    this.LoadFromDisk();
    // TODO: Add new default vars if needed
}

Prefs.prototype.SaveToDisk = function() {
    if (this.Validate()) {
        fs.writeFileSync(this.fullpath, ini.stringify(this.data));
    }
};

Prefs.prototype.LoadFromDisk = function() {
    var oldData = this.data;
    this.data = ini.parse(fs.readFileSync(this.fullpath, 'utf-8'));
    if (!this.Validate()) {
        this.data = oldData;
    }
};

Prefs.prototype.Validate = function() {
    if (!['light', 'dark'].indexOf(this.data.theme) < 0) {
        return false;
    }
    return true;
};

exports.Preferences = (new Prefs()).wrapped;