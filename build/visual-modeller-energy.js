class Model {
    constructor(options) {
        this.nodes = options.nodes || [];
        this.links = options.links || [];
        this.logs = options.logs || [];
        this.maxNodeId = 0;
        this.maxLinkId = 0;
        this.maxLogId = 0;
    }

    getNodeId() {
        let newNodeId = `node-${this.maxNodeId}`;
        this.maxNodeId++;
        return newNodeId;
    }

    getLinkId() {
        let newLinkId = `link-${this.maxLinkId}`;
        this.maxLinkId++;
        return newLinkId;
    }

    getLogId() {
        let newLogId = `log-${this.maxLogId}`;
        this.maxLogId++;
        return newLogId;
    }

    addNode(node) {
        node.id = this.getNodeId();
        this.nodes.push(node);
    }

    addLink(link) {
        link.id = this.getLinkId();
        this.links.push(link);
    }

    addLog(log) {
        log.id = this.getLogId();
        this.logs.push(log);
    }

    removeNode(node) {
        this.nodes = this.nodes.filter(n => n !== node);
    }

    removeLink(link) {
        this.links = this.links.filter(l => l !== link);
    }

    removeLog(log) {
        this.logs = this.logs.filter(l => l !== log);
    }

    removeNodeById(id) {
        this.nodes = this.nodes.filter(n => n.id !== id);
    }

    removeLinkById(id) {
        this.links = this.links.filter(l => l.id !== id);
    }

    removeLogById(id) {
        this.logs = this.logs.filter(l => l.id !== id);
    }
}

class Node {
    constructor(options) {
        this.name = options.name || 'node';
        this.sockets = [];
        this.state = options.state || {};
        this.maxSocketId = 0;
        if (options.sockets) {
            options.sockets.forEach(socket => {
                this.addSocket(socket);
            });
        }
    }

    getSocketId() {
        let newSocketId = this.maxSocketId;
        this.maxSocketId++;
        return newSocketId;
    }

    get leftSockets() {
        return this.sockets.filter(s => s.position === 'left');
    }

    get rightSockets() {
        return this.sockets.filter(s => s.position === 'right');
    }

    get topSockets() {
        return this.sockets.filter(s => s.position === 'top');
    }

    get bottomSockets() {
        return this.sockets.filter(s => s.position === 'bottom');
    }
    
    addSocket(socket) {
        socket.id = this.getSocketId();
        this.sockets.push(socket);
    }

    setSocketByIndex(index, socket) {
        socket.id = this.getSocketId();
        this.sockets[index] = socket;
    }

    getSocketByIndex(index) {
        return this.sockets[index];
    }   

    removeSocket(socket) {
        this.sockets = this.sockets.filter(s => s !== socket);
    }

    removeSocketById(id) {
        this.sockets = this.sockets.filter(s => s.id !== id);
    }

    removeSocketByIndex(index) {
        this.sockets = this.sockets.filter((s, i) => i !== index);
    }

}

class Socket {
    constructor(options) {
        this.name = options.name || 'socket';
        this.state = options.state || {};
        this.linkId = options.linkId || '';
        this.position = options.position || 'left';  
    }
}

class Link {
    constructor(options) {
        this.socket1 = options.socket1 || null;
        this.socket2 = options.socket2 || null;
        this.state = options.state || {};
    }
}

class Log {
    constructor(options) {
        this.name = options.name || 'log';
        this.target = options.target || null;
        this.states = [];
    }

    writeToLog() {
        this.states.push(this.target.state);
    }
}

class EnergyNode extends Node {
    constructor(options) {
        super(options);
    }

    setConstraints(){
        return;
    }
    
    updateState(){
        return;
    }
}

class GridExportNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'gridExport';
        const socketOptions = {};
        socketOptions.name = options.name || 'Grid Export';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'left';
        socketOptions.state = options.state || {max: Infinity, value:null, constraint: false};
        this.setSocketByIndex(0, new Socket(socketOptions));
    }
}

class GridSupplyNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'gridSupply';
        const socketOptions = {};
        socketOptions.name = options.name || 'Grid Supply';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.state || {max: Infinity, value:null, constraint: false};
        console.log(this);
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }
}

class LoadNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'loadNode';
        const socketOptions = {};
        socketOptions.name = options.name || 'Load';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'left'; // input on left side
        socketOptions.state = options.state || {max: null, value:null, constraint: true, timeVarying: false, timeSeries: null};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
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
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
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

class ControllerNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'controlNode';
        this.type = 'controller';
        this.inputSocketOrder = options.inputSocketOrder || [];
        this.outputSocketOrder = options.outputSocketOrder || [];
    }

}

class EnergyModel extends Model {
    constructor(options) {
        super(options);
        this.timeVarying = options.timeVarying || false;
        this.timeSteps = options.timeSteps || 1;
        this.timeStep = 0;
    }

    run() {
        const nodes = this.nodes;
        const links = this.links;
        const logs = this.logs;
        const timeVarying = this.timeVarying;
        const timeSteps = this.timeSteps;
        if (!timeVarying) {
            this.timeSteps = 1;
        }

        for (let i = 0; i < timeSteps; i++) {
            this.timeStep = i;
            // solution process:
            //     allNodes - set fixed fluxes and flux limits - e.g. constrained fluxes
            //     socket.state.fluxTarget is set

            nodes.forEach(node => node.setConstraints({timeStep:i})); // needs to know time step

            //     allControllerNodes - set flux targets on sockets

            nodes.filter(node => node.type === 'controller').forEach(controllerNode => controllerNode.setFluxTargets());

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

class EnergyLink extends Link {
    constructor(options) {
        super(options);
    }

    setFlux() {
        const socket1 = this.socket1;
        const state1 = socket1.state;
        const socket2 = this.socket2;
        const state2 = socket2.state;

        //console.log(state1);
        //console.log(state2);

        if (state1.constraint) {
            if (state2.constraint) {
                console.log('problem - both sockets have constraints', this);
            } else {
                if (state1.value <= state2.max) {
                    this.state.value = state1.value;
                }
            }
        }

        if (state2.constraint) {
            if (state1.constraint) {
                console.log('problem - both sockets have constraints', this);
            } else {
                if (state2.value <= state1.max) {
                    this.state.value = state2.value;
                }
            }
        }

    }

}

export { ControllerNode, GridExportNode, GridSupplyNode, EnergyLink as Link, LoadNode, Log, EnergyModel as Model, SolarPVNode };
