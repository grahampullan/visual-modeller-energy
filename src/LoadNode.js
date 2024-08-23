import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class LoadNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.className = 'loadNode';
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Load';
        socketOptions.position = options.position || 'left'; // input on left side
        socketOptions.state = options.socketState || {max: null, value:null, valueType: "constraint", timeVarying: false, timeSeries: null};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }

    setConstraints() {
        const state = this.getSocketByIndex(0).state;
        if (state.valueType !== "constraint") {
            return;
        }
        if (state.timeVarying) {
            state.value = state.timeSeries[this.timeStep];
        } 
    }

}

export { LoadNode };