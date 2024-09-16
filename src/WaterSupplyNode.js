import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class WaterSupplyNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        options.className = 'waterSupplyNode';
        super(options);
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Water Supply';
        socketOptions.position = options.position || 'top'; // output on right side
        socketOptions.state = options.socketState || {max: Infinity, value:null, valueType: "variable"};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
        this.displayConfig.colorIndex = 9;
    }
}

export { WaterSupplyNode };