import * as React from "react";
const RemoteControllerIcon = require("../assets/img/remote-controller-icon.png");
const PowerBiIcon = require("../assets/img/power-bi.png");

const DeviceTypesSelect = ({ onCtrlChose, onDsplChose }): JSX.Element => (
    <div className="typeContainer">
        <div>Choose type of this device</div>
        <div className="typeButtonContainer">
            <button onClick={onCtrlChose} className="typeButton">Controller <img alt="controller" src={RemoteControllerIcon}/></button>
            <button className="typeButton" onClick={onDsplChose}>Display <img alt="display" className="second" src={PowerBiIcon}/></button>
        </div>
    </div>
);

export default DeviceTypesSelect;
