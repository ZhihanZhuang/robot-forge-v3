const fs=require('node:fs'),path=require('node:path');
const root=__dirname;let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync(path.join(root,'style.css'),'utf8')+'</style>');
for(const file of ['vendor/three.min.js','core.js','app.js','upgrades.js','combat-v3.js'])html=html.replace(`<script src="${file}"></script>`,()=>'<script>'+fs.readFileSync(path.join(root,file),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
const output=path.join(root,'..','Robot-Forge-V3.html');fs.writeFileSync(output,html);console.log('Standalone build:',output);
