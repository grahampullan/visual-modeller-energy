class Socket {
    constructor(options) {
        this.name = options.name || 'socket';
        this.state = options.state || {};
        this.position = options.position || 'left';  
    }
}

class Log {
    constructor(options) {
        this.name = options.name || 'log';
        this.target = options.target || null;
        this.states = [];
    }

    writeToLog() {
        this.states.push({...this.target.state});
    }

    clear() {
        this.states = [];
    }
}

class Model {
    constructor(options) {
        options = options || {};
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
        const s1 = link.socket1;
        s1.link = link;
        s1.otherSocket = link.socket2;
        const s2 = link.socket2;
        s2.link = link;
        s2.otherSocket = link.socket1;
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

    clearLogs() {
        this.logs.forEach(l => l.clear());
    }

    getLinkBySocket(socket) {
        return this.links.find(l => l.socket1 === socket || l.socket2 === socket);
    }

    getNodeBySocket(socket) {
        return this.nodes.find(n => n.sockets.includes(socket));
    }

    getNodeByName(name) {
        return this.nodes.find(n => n.name === name);
    }

    getLinkByName(name) {
        return this.links.find(l => l.name === name);
    }

    getNodeClassByClassName(className) {
        if (!this.availableNodeClasses) {
            return null;
        }
        const availableNodeClassNames = this.availableNodeClasses.map(c => {
            const instance = new c();
            return instance.className;
        });
        const index = availableNodeClassNames.indexOf(className);
        if (index === -1) {
            return null;
        } else {
            return this.availableNodeClasses[index];
        }   
    }

    getLinkClassByClassName(className) {
        if (!this.availableLinkClasses) {
            return null;
        }
        if (this.availableLinkClasses.length === 1) {
            return this.availableLinkClasses[0];
        }
        const availableLinkClassNames = this.availableLinkClasses.map(c => {
            const instance = new c();
            return instance.className;
        });
        const index = availableLinkClassNames.indexOf(className);
        if (index === -1) {
            return null;
        } else {
            return this.availableLinkClasses[index];
        }   
    }

    get allSockets() {
        return this.nodes.map(n => n.sockets).flat();
    }

    getSocketByName(socketName) {
        console.log(this.allSockets.map(s => s.name));
        console.log(socketName);
        return this.allSockets.find(s => s.name == socketName);
    }

    toJson() {
        const modelForJson = {};
        modelForJson.config = this.config;
        modelForJson.nodes = this.nodes.map(n => {
            const nJson = {};
            nJson.name = n.name;
            nJson.className = n.className;
            nJson.state = n.state;
            nJson.sockets = n.sockets.map(s => {
                const sJson = {};
                sJson.name = s.name;
                sJson.position = s.position;
                sJson.state = s.state;
                return sJson;
            });
            return nJson;
        });
        modelForJson.links = this.links.map(l => {
            const lJson = {};
            lJson.name = l.name;
            lJson.socket1Name = l.socket1.name;
            lJson.socket2Name = l.socket2.name;
            return lJson;
        });
        modelForJson.logs = this.logs.map(l => {
            const lJson = {};
            lJson.name = l.name;
            lJson.targetName = l.target.name;
            return lJson;
        });
        return JSON.stringify(modelForJson);
    }

    saveToFile() {
        const modelJson = this.toJson();
        const blob = new Blob([modelJson], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'model.json';
        a.click();
    }

    fromJsonObject(jsonModel) {
        console.log(jsonModel);
        this.config = jsonModel.config;
        jsonModel.nodes.forEach(n => {
            const NodeClass = this.getNodeClassByClassName(n.className);
            const node = new NodeClass(n);
            node.sockets = n.sockets.map(s => new Socket(s));
            console.log(node);
            this.addNode(node);
        });
        console.log("nodes added");
        jsonModel.links.forEach(l => {
            console.log(l);
            const socket1 = this.getSocketByName(l.socket1Name);
            const socket2 = this.getSocketByName(l.socket2Name);
            console.log(socket1, socket2);
            let LinkClass;
            if (!l.className) {
                LinkClass = this.getLinkClassByClassName();
            } else {
                LinkClass = this.getLinkClassByClassName(l.className);
            }
            console.log(LinkClass);
            console.log(this.availableLinkClasses);
            this.addLink(new LinkClass({name:l.name, socket1, socket2}));
            console.log("link added");
        });
        console.log("links added");
        jsonModel.logs.forEach(l => {
            console.log(l);
            const targetNode = this.getNodeByName(l.targetName);
            const targetLink = this.getLinkByName(l.targetName);
            console.log(targetNode, targetLink);
            const target = targetNode || targetLink;
            console.log(target);
            this.addLog(new Log({name:l.name, target}));
        });
        console.log("logs added");



    }

    async loadFromUrl(url) {
        const response = await fetch(url);
        const json = await response.json();
        this.fromJsonObject(json);
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
        let newSocketId = `socket-${this.maxSocketId}`;
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
    
    getSocketByName(name) {
        return this.sockets.find(s => s.name === name);
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

class Link {
    constructor(options) {
        options = options || {};
        this.name = options.name || "link";
        this.socket1 = options.socket1 || null;
        this.socket2 = options.socket2 || null;
        this.state = options.state || {};
    }

    getOtherSocket(socket) {
        if (socket === this.socket1) {
            return this.socket2;
        } else if (socket === this.socket2) {
            return this.socket1;
        } else {
            return null;
        }
    }
}

class EnergyNode extends Node {
    constructor(options) {
        options = options || {};
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
        options = options || {};
        super(options);
        this.className = 'gridExportNode';
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Grid Export';
        socketOptions.position = options.position || 'left';
        socketOptions.state = options.socketState || {max: Infinity, value:null, valueType: "variable"};
        this.setSocketByIndex(0, new Socket(socketOptions));
    }
}

class GridSupplyNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.className = 'gridSupplyNode';
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Grid Supply';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.socketState || {max: Infinity, value:null, valueType: "variable"};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }
}

class LoadNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.className = 'loadNode';
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Load';
        socketOptions.position = options.position || 'left'; // input on left side
        socketOptions.state = options.socketState || {max: null, value:null, valueType: "constraint", timeVarying: false, timeSeries: null};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }

    setConstraints() {
        const state = this.getSocketByIndex(0).state;
        if (state.valueType !== "constraint") {
            return;
        }
        if (state.timeVarying) {
            state.value = state.timeSeries[this.timeStep];
        } 
    }

}

class SolarPVNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.className = 'solarPVNode';
        this.type = 'endNode';
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

class ControllerNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.class = 'controllerNode';
        this.type = 'controllerNode';
    }

    setFluxTargets(){
        const inputSocketOrder = this.state.inputSocketOrder;
        const outputSocketOrder = this.state.outputSocketOrder;
        const controllerInputSockets = inputSocketOrder.map(socketName => this.getSocketByName(socketName));
        const controllerOutputSockets = outputSocketOrder.map(socketName => this.getSocketByName(socketName));
        const inputConnectedSockets = controllerInputSockets.map( s => s.otherSocket);
        const outputConnectedSockets = controllerOutputSockets.map( s => s.otherSocket);
       
        let totalInput = inputConnectedSockets.filter( s => s.state.valueType == "constraint").reduce((acc, s) => acc + s.state.value, 0);
        let totalOutput = outputConnectedSockets.filter( s => s.state.valueType == "constraint").reduce((acc, s) => acc + s.state.value, 0);
        
        if (totalInput >= totalOutput){ // more supply than demand
            outputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                    totalInput -= s.state.value;
                }
            });
            outputConnectedSockets.forEach( s => {
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    const targetValue = Math.min(totalInput, s.state.max);
                    controllerSocket.state.value = targetValue;
                    controllerSocket.state.valueType = "target";
                    totalInput -= targetValue;
                }
            });
            inputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                }
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = 0.;
                    controllerSocket.state.valueType = "target";
                }
            });
        } else { // more demand than supply
            inputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                    totalOutput -= s.state.value;
                }
            });
            inputConnectedSockets.forEach( s => {
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    const targetValue = Math.min(totalOutput, s.state.max);
                    controllerSocket.state.value = targetValue;
                    controllerSocket.state.valueType = "target";
                    totalOutput -= targetValue;
                }
            });
            outputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                }
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = 0.;
                    controllerSocket.state.valueType = "target";
                }
            });
        }
    }

}

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
        super(options);
        this.state.charge = 0;
        this.className = 'batteryStorageNode';
        this.type = 'storageNode';
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

class EnergyLink extends Link {
    constructor(options) {
        super(options);
    }

    setFlux() {
        const socket1 = this.socket1;
        const state1 = socket1.state;
        const socket2 = this.socket2;
        const state2 = socket2.state;

        //console.log(socket1, socket2);

        if (state1.valueType == state2.valueType) {
            console.log("warning - both sockets for this link have the same valueType", this);
        }

        if (state2.valueType == "variable" && (state1.valueType == "constraint" || state1.valueType == "target")) {
            if (state1.value <= state2.max) {
                this.state.value = state1.value;
            } else {
                console.log("problem - variable value exceeds constraint max", this);
            }
        }

        if (state1.valueType == "variable" && (state2.valueType == "constraint" || state2.valueType == "target")) {
            if (state2.value <= state1.max) {
                this.state.value = state2.value;
            } else {
                console.log("problem - variable value exceeds constraint max", this);
            }
        }

    }

}

class EnergyModel extends Model {
    constructor(options) {
        options = options || {};
        super(options);
        const configOptions = options.config || {};
        const config = {};
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

export { BatteryStorageNode, ControllerNode, GridExportNode, GridSupplyNode, EnergyLink as Link, LoadNode, Log, EnergyModel as Model, Socket, SolarPVNode };
