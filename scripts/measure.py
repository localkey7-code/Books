"""Reproducible final byte inventory, role file manifests, and storage snapshot.
No project files removed. node_modules and .git included in total storage.
"""
import json, os, re, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
os.chdir(ROOT)
roles = {
 'SA-01': ['audit/WORKSPACE_AUDIT.md'],
 'SA-02': ['docs/REFERENCE_BRIEF.md'],
 'SA-03': ['PROJECT_PLAN.md','docs/INTEGRATION_CONTRACTS.md'],
 'SA-04': ['docs/PLAN_GAUNTLET.md'],
 'SA-05': ['src/engine.js','src/registries.js','src/materials.js','src/main.js','index.html','style.css','package.json','package-lock.json','.gitignore','vendor/three.module.js','vendor/OrbitControls.js','vendor/THREE-LICENSE.txt'],
 'SA-06': ['src/terrain.js','src/main.js'],
 'SA-07': ['src/architecture.js','src/temple.js','src/main.js'],
 'SA-08': ['src/precinct.js','src/main.js'],
 'SA-09': ['src/sculpture.js','src/main.js'],
 'SA-10': ['src/materials.js','src/engine.js'],
 'SA-11': ['src/navigation.js','src/ui.js','src/main.js','index.html','style.css','src/terrain.js','src/temple.js','src/materials.js','src/engine.js'],
 'Final auditor': ['README.md','audit/FINAL_GAUNTLET.md','docs/ROLE_HANDOFFS.md','scripts/check.mjs','scripts/measure.py','tests/registries.test.mjs','tests/browser.cjs','audit/BROWSER_RESULTS.json','audit/BROWSER_RUN.txt','audit/UNIT_RUN.txt','audit/STATIC_RUN.txt','audit/FILE_INVENTORY.txt','audit/STORAGE_REPORT.json'],
}
for p in ['audit/FILE_INVENTORY.txt','audit/STORAGE_REPORT.json']:
 Path(p).touch(exist_ok=True)
def replace_footer(file,text):
 p=Path(file);body=p.read_text().split('\n<!-- MEASURED_BYTES -->')[0]
 p.write_text(body+'\n<!-- MEASURED_BYTES -->\n'+text)
def treebytes(path):
 return int(subprocess.check_output(['du','-sb',str(path)],text=True).split()[0])
for iteration in range(8):
 old = {str(p):p.stat().st_size for p in Path('.').rglob('*') if p.is_file() and '.git' not in p.parts and 'node_modules' not in p.parts}
 for role,paths in list(roles.items())[:4]:
  file=paths[0];text='\n### Measured file-byte handoff (final version)\n'
  text+='\n'.join(f'- `{p}`: **{Path(p).stat().st_size:,} bytes**' for p in paths)+'\n'
  replace_footer(file,text)
 text='\n## Measured final file-byte manifests by role\nFinal versions are listed, not historic milestone sizes. Owner transfers and integration edits are explicit above.\n'
 for role,paths in roles.items():
  text+=f'\n### {role}\n'+''.join(f'- `{p}` — {Path(p).stat().st_size:,} bytes\n' for p in paths)
 replace_footer('docs/ROLE_HANDOFFS.md',text)
 files=sorted(p for p in Path('.').rglob('*') if p.is_file() and '.git' not in p.parts and 'node_modules' not in p.parts)
 Path('audit/FILE_INVENTORY.txt').write_text('Final file sizes (bytes); excludes .git and node_modules internals.\n'+''.join(f'{p.stat().st_size:>10}  {p.as_posix()}\n' for p in files))
 total=treebytes('.');deps=treebytes('node_modules');git=treebytes('.git')
 runtime=sum(p.stat().st_size for p in [Path('index.html'),Path('style.css'),*Path('src').glob('*.js'),*Path('vendor').glob('*')])
 report={'measured_date':'2026-11-02','method':'du -sb repository including directory metadata, .git, node_modules and QA artifacts; fixed-point self-accounting',
 'project_bytes_including_deps_git_evidence':total,'project_MiB':round(total/1048576,4),'installed_dependencies_bytes':deps,'git_bytes':git,'project_without_dependencies_or_git_bytes':total-deps-git,'vendor_bytes':treebytes('vendor'),'qa_screenshots_bytes':treebytes('audit/screenshots'),'deployable_runtime_file_bytes':runtime,'build_output_bytes':0,'ceiling_bytes':134217728,'headroom_to_128_MiB_bytes':134217728-total,'target_bytes':104857600,'headroom_to_100_MiB_bytes':104857600-total,'temporary_external_QA_tooling':'/tmp/kailasa-qa measured 82772654 bytes plus extracted Chromium/libs outside repository; not delivered or runtime required','baseline_including_git_bytes':41273}
 Path('audit/STORAGE_REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
 new={str(p):p.stat().st_size for p in files}
 if old==new: break
print(json.dumps(report,indent=2));print('fixed point iterations:',iteration+1)
