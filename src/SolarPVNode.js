import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class SolarPVNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.class = 'endNode';
        this.type = 'solarPVNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Solar PV';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.socketState || {max: null, value:null, valueType: "constraint", timeVarying: false, timeSeries: null};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }

    setConstraints() {
        const state = this.getSocketByIndex(0).state;
        if (!state.valueType === "constraint") {
            return;
        }
        if (state.timeVarying) {
            state.value = state.timeSeries[this.timeStep];
        } 
    }

}

export { SolarPVNode };