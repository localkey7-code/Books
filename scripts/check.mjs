import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
const root=process.cwd();let failures=0;function assert(ok,label){console.log(`${ok?'PASS':'FAIL'} ${label}`);if(!ok)failures++;}
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?e.name==='.git'||e.name==='node_modules'?[]:walk(path.join(p,e.name)):[path.join(p,e.name)]);
const files=walk(root);const modules=files.filter(p=>p.endsWith('.js')||p.endsWith('.mjs'));
for(const file of modules){try{execFileSync(process.execPath,['--check',file]);}catch{assert(false,`syntax ${file}`);}}
assert(modules.length>=12,'all app modules syntax checked');
const runtime=files.filter(p=>p.includes('/src/')||/index.html|style.css/.test(p));
assert(runtime.every(p=>!/(https?:\/\/|https?:['"]|fetch\s*\(|XMLHttpRequest|@import\s|url\(['"]?https?)/.test(fs.readFileSync(p,'utf8'))),'no remote URLs, network APIs, font imports in app runtime');
for(const p of modules.filter(p=>p.includes('/src/')||p.includes('/vendor/'))){const text=fs.readFileSync(p,'utf8');for(const match of text.matchAll(/from\s*['"]([^'"]+)['"]/g)){assert(match[1].startsWith('.')&&fs.existsSync(path.resolve(path.dirname(p),match[1])),`local import ${path.basename(p)} → ${match[1]}`);}}
for(const file of ['audit/WORKSPACE_AUDIT.md','docs/REFERENCE_BRIEF.md','PROJECT_PLAN.md','docs/INTEGRATION_CONTRACTS.md','docs/PLAN_GAUNTLET.md','README.md'])assert(fs.existsSync(file),`deliverable ${file}`);
const sizes=execFileSync('du',['-sb','.'],{encoding:'utf8'});const bytes=Number(sizes.split(/\s/)[0]);assert(bytes<128*1024**2,`storage ${bytes} bytes <128 MiB including node_modules/.git`);assert(bytes<100*1024**2,'target <100 MiB');
assert(fs.readFileSync('package-lock.json','utf8').includes('0.170.0'),'pinned engine lockfile');
console.log('Static check failures:',failures);if(failures)process.exit(1);
