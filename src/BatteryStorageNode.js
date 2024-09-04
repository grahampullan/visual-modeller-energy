import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class BatteryStorageNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        options.state = options.state || {};
        options.state.maxCharge = options.state.maxCharge || 3000;
        options.state.maxDischarge = options.state.maxDischarge || 3000;
        const defaultInputSocket = new Socket({name: 'Input', position: 'left', state: {max: options.state.maxCharge, value:null, valueType: "variable"}});
        const defaultOutputSocket = new Socket({name: 'Output', position: 'right', state: {max:  options.state.maxDischarge, value:null, valueType: "variable"}});
        const defaultSockets = [defaultInputSocket, defaultOutputSocket];
        options.sockets = options.sockets || defaultSockets;
        options.state.capacity = options.state.capacity || 5;
        options.className = 'batteryStorageNode';
        super(options);
        this.state.charge = 0;
        this.type = 'storageNode';
        this.displayConfig.colorIndex = 6;
    }

    updateState() {
        const JinkWh = 1000*60*60;
        const inputSockets = this.leftSockets;
        const outputSockets = this.rightSockets;
        const inputLinks = inputSockets.map( s => s.link );
        const outputLinks = outputSockets.map( s => s.link );
        const inputFluxes = inputLinks.map( l => l.state.value);
        const outputFluxes = outputLinks.map( l => l.state.value);
        const totalInputFlux = inputFluxes.reduce( (a,b) => a+b, 0);
        const totalOutputFlux = outputFluxes.reduce( (a,b) => a+b, 0);
        const netFluxIn = totalInputFlux - totalOutputFlux; // in W
        const remainingCapacity = this.state.capacity - this.state.charge; // in kWh
        const chargeChange = Math.min(netFluxIn*this.timeStepSize/JinkWh, remainingCapacity);
        this.state.charge += chargeChange;
        let maxDischarge = Math.min(this.state.maxDischarge, this.state.charge*JinkWh);
        maxDischarge = Math.max(maxDischarge, 0);
        const maxCharge = Math.min(this.state.maxCharge, (this.state.capacity - this.state.charge)*JinkWh);
        this.getSocketByIndex(0).state.max = maxCharge;
        this.getSocketByIndex(1).state.max = maxDischarge;
    }

}

export { BatteryStorageNode };