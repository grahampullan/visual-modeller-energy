import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class SolarPVNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'solarPVNode';
        const socketOptions = {};
        socketOptions.name = options.name || 'Solar PV';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.state || {max: null, value:null, constraint: true, timeVarying: false, timeSeries: null};
        this.addSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }

    setConstraints(data) {
        const timeStep = data.timeStep;
        const state = this.getSocketByIndex(0).state;
        if (!state.constraint) {
            return;
        }
        if (state.timeVarying) {
            state.value = state.timeSeries[timeStep];
        } 
    }
    
}

export { SolarPVNode };