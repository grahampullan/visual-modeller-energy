import { Model } from 'visual-modeller-core';
import { BatteryStorageNode } from './BatteryStorageNode';
import { ControllerNode } from './ControllerNode';
import { GridExportNode } from './GridExportNode';
import { GridSupplyNode } from './GridSupplyNode';
import { LoadNode } from './LoadNode';
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
        return [BatteryStorageNode, ControllerNode, GridExportNode, GridSupplyNode, LoadNode, SolarPVNode]; 
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


        for (let i = 0; i < timeSteps; i++) {
            this.setTimeStep(i);
            // solution process:
            //     allNodes - set fixed fluxes and flux limits - e.g. constrained fluxes
            //     socket.state.fluxTarget is set

            nodes.forEach(node => node.setConstraints()); // needs to know time step
            //console.log("constraints set");

            //     allControllerNodes - set flux targets on sockets

            nodes.filter(node => node.type === 'controllerNode').forEach(controllerNode => controllerNode.setFluxTargets());
            //console.log("flux targets set");
            //console.log(links);

            //     allLinks - set fluxes using targets

            links.forEach(link => link.setFlux());
            //console.log("fluxes set");

            //     allNodes - update state given current fluxes (e.g. battery)

            nodes.forEach(node => node.updateState());
            //console.log("states updated");

            //    finally update logs
            //    logs is array of objects {"name", [values]}

            logs.forEach( log => log.writeToLog());
            //console.log("logs written");
            
        }

    }
}

export { EnergyModel };



