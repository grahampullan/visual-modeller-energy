import { Model } from 'visual-modeller-core';

class EnergyModel extends Model {
    constructor(options) {
        super(options);
        this.timeVarying = options.timeVarying || false;
        this.timeSteps = options.timeSteps || 1;
        this.timeStepSize = options.timeStepSize || 1.0;
        this.timeStep = 0;
    }

    setTimeStep(timeStep) {
        this.timeStep = timeStep;
        this.nodes.forEach( n => n.timeStep = timeStep);
    }

    setTimeStepSize(timeStepSize) {
        this.timeStepSize = timeStepSize;
        this.nodes.forEach( n => n.timeStepSize = timeStepSize);
    }

    run() {
        const nodes = this.nodes;
        const links = this.links;
        const logs = this.logs;
        const timeVarying = this.timeVarying;
        const timeSteps = this.timeSteps;
        const timeStepSize = this.timeStepSize;
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

            //     allControllerNodes - set flux targets on sockets

            nodes.filter(node => node.type === 'controllerNode').forEach(controllerNode => controllerNode.setFluxTargets());

            //     allLinks - set fluxes using targets

            links.forEach(link => link.setFlux());

            //     allNodes - update state given current fluxes (e.g. battery)

            nodes.forEach(node => node.updateState());

            //    finally update logs
            //    logs is array of objects {"name", [values]}

            logs.forEach( log => log.writeToLog());
            
        }

    }
}

export { EnergyModel };



