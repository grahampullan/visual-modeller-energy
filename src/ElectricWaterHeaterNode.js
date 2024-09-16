import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class ElectricWaterHeaterNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        options.state = options.state || {};
        options.state.maxHeaterPower = options.state.maxHeaterPower || 3000;
        options.state.maxWaterTemp = options.state.maxWaterTemp || 60;
        options.state.initialWaterTemp = options.state.initialWaterTemp || 20;
        options.state.capacity = options.state.capacity || 2000;
        const defaultWaterInputSocket = new Socket({name: 'Heater Water In', position: 'bottom', state: {max: Infinity, value:0, valueType: "target"}});
        const defaultWaterOutputSocket = new Socket({name: 'Heater Water Out', position: 'top', state: {max:  Infinity, value:null, valueType: "variable"}});
        const defaultElectricInputSocket = new Socket({name: 'Heater Power In', position: 'left', state: {max: options.state.maxHeaterPower, value:null, valueType: "variable"}});
        const defaultSockets = [defaultWaterInputSocket, defaultWaterOutputSocket, defaultElectricInputSocket];
        options.sockets = options.sockets || defaultSockets;
        options.className = 'electricWaterHeaterNode';
        super(options);
        this.state.waterTemp = options.state.initialWaterTemp;
        this.type = 'storageNode';
        this.displayConfig.colorIndex = 8;
    }

    initState() {
        this.state.waterTemp = this.state.initialWaterTemp;
    }

    updateState() {
        const waterInSocket = this.getSocketByIndex(0); // hard coded socket index
        const waterOutSocket = this.getSocketByIndex(1); // hard coded socket index
        const powerInSocket = this.getSocketByIndex(2); // hard coded socket index
        const waterInLink = waterInSocket.link;
        const waterOutLink = waterOutSocket.link;
        const powerInLink = powerInSocket.link;
        //const waterIn = waterInLink.state.value; // in litres per second
        const waterOut = waterOutLink.state.value;
        const powerIn = powerInLink.state.value; // in W
        const waterInTemp = 10; // hard coded water temp
        const massInOneLitre = 1; // mass in kg of water in 1 litre
        const waterSpecificHeat = 4.186 * 1000; // in J/kgK

        waterInSocket.state.value = waterOutLink.state.value; // flow rates are made equal
        waterInSocket.state.valueType = "target"
        const waterIn = waterOut;

        const delWaterTemp = this.timeStepSize * (powerIn/waterSpecificHeat + waterIn*massInOneLitre*waterInTemp - waterOut*massInOneLitre*this.state.waterTemp) / (this.state.capacity * massInOneLitre);
        this.state.waterTemp += delWaterTemp;
        this.state.waterTemp = Math.min(this.state.waterTemp, this.state.maxWaterTemp);

        const maxPowerIn = Math.min(this.state.maxHeaterPower, (this.state.maxWaterTemp - this.state.waterTemp)*waterSpecificHeat*this.state.capacity*massInOneLitre/this.timeStepSize);
        powerInSocket.state.max = maxPowerIn;


    }

}



export { ElectricWaterHeaterNode };