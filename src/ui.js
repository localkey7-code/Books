const sites={
  temple:{point:[0,13,-20],number:'01 / THE MAIN SANCTUARY',title:'One rock. An entire world.',copy:'The tiered vimana and pillared mandapa rise from an elephant-bearing plinth. Profiles and proportions here are interpretive, not measured originals.'},
  nandi:{point:[0,8,21],number:'02 / THE NANDI PAVILION',title:'An axis of devotion.',copy:'Nandi faces the sanctuary from an upper pavilion. A surviving axial rock bridge joins it to the temple porch; collapsed lateral gallery bridges are not reconstructed.'},
  court:{point:[-11,3,7],number:'03 / THE ELEPHANT COURT',title:'Held by the mountain.',copy:'Elephants and lions animate the temple’s base. These instanced, stylized animals suggest the frieze’s rhythm, not its exact sculptural forms.'},
  gallery:{point:[-20,7,-18],number:'04 / THE CLIFF GALLERIES',title:'Rooms within the rock.',copy:'Recessed columned galleries frame the court. Abstract relief registers suggest sculptural richness; they do not reproduce the documented epic and Shaiva reliefs.'}
};
export function createUI(engine,nav){
  const $=s=>document.querySelector(s),orbit=$('#orbit-button'),explore=$('#explore-button'),quality=$('#quality');
  const notes=$('#notes-dialog'),guide=$('#guide-dialog');let toastTimer,slowSamples=0,manualQuality=false;
  function toast(text){$('#status-toast').textContent=text;$('#status-toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#status-toast').classList.remove('visible'),2800);}
  function sync(){const isOrbit=nav.mode==='orbit';orbit.classList.toggle('selected',isOrbit);explore.classList.toggle('selected',!isOrbit);orbit.setAttribute('aria-pressed',String(isOrbit));explore.setAttribute('aria-pressed',String(!isOrbit));$('#interaction-hint').textContent=isOrbit?'DRAG TO ORBIT · SCROLL TO ZOOM':'WASD TO MOVE · DRAG TO LOOK';}
  orbit.addEventListener('click',()=>nav.setMode('orbit'));explore.addEventListener('click',()=>{nav.setMode('explore');toast('Move with the thumbstick · drag the scene to look');});
  $('#overview-button').addEventListener('click',()=>{nav.overview();toast('Returned to the whole precinct');});
  document.addEventListener('navigationchange',sync);
  quality.addEventListener('change',()=>{manualQuality=true;engine.setQuality(quality.value);toast(`${quality.options[quality.selectedIndex].text} profile selected`);});
  function openNotes(){update();notes.showModal();}
  $('#about-button').addEventListener('click',openNotes);$('#read-notes').addEventListener('click',openNotes);
  $('#guide-button').addEventListener('click',()=>guide.showModal());$('#guide-done').addEventListener('click',()=>guide.close());
  document.querySelectorAll('.dialog-close').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  for(const dialog of [notes,guide])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  function select(key,focus=true){const s=sites[key];$('#story-number').textContent=s.number;$('#story-title').textContent=s.title;$('#story-copy').textContent=s.copy;$('#story-card').hidden=false;document.querySelectorAll('[data-site]').forEach(b=>b.classList.toggle('active',b.dataset.site===key));if(focus)nav.focus(s.point);if(innerWidth<701)toast(s.title);}
  document.querySelectorAll('[data-site]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.site)));
  $('#story-button').addEventListener('click',()=>{select('temple');if(innerWidth<701)openNotes();});$('#close-story').addEventListener('click',()=>{$('#story-card').hidden=true;});
  function update(){const stats=engine.stats;const distance=nav.mode==='orbit'?engine.camera.position.distanceTo(nav.target):20;const width=10*innerHeight/(2*Math.tan(engine.camera.fov*Math.PI/360)*distance);document.querySelector('.scale i').style.width=`${width}px`;$('#metric-triangles').textContent=stats.triangles.toLocaleString();$('#metric-calls').textContent=stats.drawCalls;$('#metric-materials').textContent=stats.materials;
    if(!manualQuality&&document.visibilityState==='visible'&&stats.frames>120&&stats.fps>0&&stats.fps<25){slowSamples++;if(slowSamples===4&&stats.quality!=='low'){engine.setQuality('low');quality.value='low';toast('Low profile enabled for smoother exploration');}}else slowSamples=0;
  }
  const interval=setInterval(update,1000);sync();return {update,dispose(){clearInterval(interval);document.removeEventListener('navigationchange',sync);}};
}
