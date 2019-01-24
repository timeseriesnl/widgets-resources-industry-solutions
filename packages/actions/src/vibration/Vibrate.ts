// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import ReactNative from "react-native";

/**
 * @param {Big} duration - How long to vibrate in milliseconds. Default value is 500. Android only.
 * @param {boolean} repeat - Default value is false. Android only.
 * @returns {boolean}
 */
function Vibrate(duration?: BigJs.Big, repeat?: boolean): Promise<void> {
    // BEGIN USER CODE
    // Documentation https://facebook.github.io/react-native/docs/vibration#vibrate

    const Vibration: typeof ReactNative.Vibration = require("react-native").Vibration;

    const pattern = duration ? Number(duration.toString()) : 500;
    repeat = repeat || false;

    Vibration.vibrate(pattern, repeat);

    return Promise.resolve();

    // END USER CODE
}
