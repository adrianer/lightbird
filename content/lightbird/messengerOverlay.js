/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Components.utils.import("resource://gre/modules/Services.jsm");

const lightbirdPrefObserver = {
    observe: function(subject, topic, data) {
        if (topic != "nsPref:changed" || data != "disableLightningUI"){
            return;
        }
        let cssService = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
        let b = Services.prefs.getBoolPref("extensions.lightbird."+data);

        let uri = Services.io.newURI("chrome://lightbird/content/antiLightning.css", null, null);
        let b2 = cssService.sheetRegistered(uri, cssService.USER_SHEET);
        if (b == b2){
            return;
        }
        if (b){
            cssService.loadAndRegisterSheet(uri, cssService.USER_SHEET);
        }else{
            cssService.unregisterSheet(uri, cssService.USER_SHEET);
        }
    },
};

function lightbirdOnLoad() {
    let prefs = Services.prefs.getBranch("extensions.lightbird.");
    prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    prefs.addObserver("", lightbirdPrefObserver, false);
    lightbirdPrefObserver.observe("", "nsPref:changed", "disableLightningUI");

    addEventListener("unload", lightbirdOnUnload, false);
}

function lightbirdOnUnload() {
    let prefs = Services.prefs.getBranch("extensions.lightbird.");
    prefs.removeObserver("", lightbirdPrefObserver);
}

addEventListener("load", lightbirdOnLoad, false);
