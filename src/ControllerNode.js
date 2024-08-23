import { EnergyNode } from "./EnergyNode";

class ControllerNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.class = 'controllerNode';
        this.type = 'controllerNode';
        this.inputSocketOrder = options.inputSocketOrder || []; // array of socket names
        this.outputSocketOrder = options.outputSocketOrder || [];
    }

    setFluxTargets(){
        const controllerInputSockets = this.inputSocketOrder.map(socketName => this.getSocketByName(socketName));
        const controllerOutputSockets = this.outputSocketOrder.map(socketName => this.getSocketByName(socketName));
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



export { ControllerNode };