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
        this.addSocketByIndex(0, new Socket(socketOptions));
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
        this.addSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
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

class ControllerNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'controlNode';
        this.type = 'controller';
        this.inputSocketOrder = options.inputSocketOrder || [];
        this.outputSocketOrder = options.outputSocketOrder || [];
    }

}

export { ControllerNode, GridExportNode, GridSupplyNode, LoadNode, SolarPVNode };
