import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class LoadNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        options.className = 'loadNode';
        options.state = options.state || {};
        options.state.socketMultiplier = options.state.socketMultiplier || 1;
        super(options);
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Load';
        socketOptions.position = options.position || 'left'; // input on left side
        socketOptions.state = options.socketState || {max: null, value:null, valueType: "constraint", timeVarying: false, timeSeries: null};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
        this.displayConfig.colorIndex = 0;
    }

    setConstraints() {
        const state = this.getSocketByIndex(0).state;
        if (state.valueType !== "constraint") {
            return;
        }
        if (state.timeVarying) {
            state.value = state.timeSeries[this.timeStep] * this.state.socketMultiplier;
        } 
    }

}

export { LoadNode };