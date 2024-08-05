import { Model } from 'visual-modeller-core';



// extends Model

const nodes = Model.nodes;
const links = Model.links;

// solution process:
// for each time step
//     allNodes - set fixed fluxes and flux limits - e.g. constrained fluxes

nodes.forEach(node => node.setConstraints());

//     allControllerNodes - set flux targets on sockets

nodes.filter(node => node.type === 'controller').forEach(controllerNode => controllerNode.setFluxTargets());

//     allLinks - set fluxes using targets

links.forEach(link => link.setFluxes());

//     allNodes - update state given current fluxes (e.g. battery)

nodes.forEach(node => node.updateState());