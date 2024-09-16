import { Model } from 'visual-modeller-core';
import { BatteryStorageNode } from './BatteryStorageNode';
import { ControllerNode } from './ControllerNode';
import { GridExportNode } from './GridExportNode';
import { GridSupplyNode } from './GridSupplyNode';
import { LoadNode } from './LoadNode';
import { WaterDemandNode } from './WaterDemandNode';
import { WaterSupplyNode } from './WaterSupplyNode';
import { ElectricWaterHeaterNode } from './ElectricWaterHeaterNode';
import { SolarPVNode } from './SolarPVNode';
import { EnergyLink } from './EnergyLink';

class EnergyModel extends Model {
    constructor(options) {
        options = options || {};
        super(options);
        const configOptions = options.config || {};
        const config = {}
        config.timeVarying = configOptions.timeVarying || false;
        config.timeSteps = configOptions.timeSteps || 1;
        config.timeStepSize = configOptions.timeStepSize || 1.0;
        this.config = config;
        this.timeStep = 0;
    }

    get availableNodeClasses() {
        return [BatteryStorageNode, ControllerNode, GridExportNode, GridSupplyNode, LoadNode, SolarPVNode, WaterDemandNode, WaterSupplyNode, ElectricWaterHeaterNode]; 
    }

    get availableLinkClasses() {
        return [EnergyLink];
    }

    setTimeStep(timeStep) {
        this.timeStep = timeStep;
        this.nodes.forEach( n => n.timeStep = timeStep);
    }

    setTimeStepSize(timeStepSize) {
        this.config.timeStepSize = timeStepSize;
        this.nodes.forEach( n => n.timeStepSize = timeStepSize);
    }

    run() {
        const nodes = this.nodes;
        const links = this.links;
        const logs = this.logs;
        const timeVarying = this.config.timeVarying;
        const timeSteps = this.config.timeSteps;
        const timeStepSize = this.config.timeStepSize;
        this.setTimeStepSize(timeStepSize);
        if (!timeVarying) {
            this.timeSteps = 1;
        }

        nodes.forEach(node => node.initState());

        for (let i = 0; i < timeSteps; i++) {
            this.setTimeStep(i);
            
            nodes.forEach(node => node.setConstraints()); 
            
            nodes.filter(node => node.type === 'controllerNode').forEach(controllerNode => controllerNode.setFluxTargets());
            
            links.forEach(link => link.setFlux());
            
            nodes.forEach(node => node.updateState());
            
            logs.forEach( log => log.writeToLog());
            
        }

    }
}

export { EnergyModel };



