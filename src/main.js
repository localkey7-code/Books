import {createEngine} from './engine.js';
import {registerMaterials} from './materials.js';
import {buildTerrain} from './terrain.js';
import {buildTemple} from './temple.js';
import {buildPrecinct} from './precinct.js';
import {buildSculpture} from './sculpture.js';
import {createNavigation} from './navigation.js';
import {createUI} from './ui.js';
const canvas=document.querySelector('#scene'),boot=document.querySelector('#boot');
try{
  const engine=createEngine(canvas);registerMaterials(engine);
  buildTerrain(engine);buildTemple(engine);buildPrecinct(engine);buildSculpture(engine);
  const nav=createNavigation(engine,canvas),ui=createUI(engine,nav);
  engine.setUpdate(nav.update);engine.start();
  window.__KAILASA__={engine,nav,ready:true};boot.hidden=true;
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();boot.hidden=false;boot.textContent='Graphics paused. Restoring your view…';});
  canvas.addEventListener('webglcontextrestored',()=>{boot.hidden=true;nav.overview();});
}catch(error){boot.textContent='This exploration requires WebGL. Enable hardware acceleration and reload.';console.error(error);}
