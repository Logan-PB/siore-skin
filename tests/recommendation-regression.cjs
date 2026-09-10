const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const cp = require('node:child_process');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const base = cp.execFileSync('git', ['show', 'HEAD:script.js'], {encoding:'utf8'});
const data = fs.readFileSync('data/products.json','utf8');
assert.equal(fs.readFileSync('script.js','utf8').replace(/\r\n/g,'\n'), base, 'Production recommendation code must remain unchanged');
assert.equal(data.replace(/\r\n/g,'\n'), cp.execFileSync('git',['show','HEAD:data/products.json'],{encoding:'utf8'}), 'Production catalog must remain unchanged');
function context(extra) {
 const ctx=vm.createContext({document:{addEventListener(){}},console});
 vm.runInContext(base,ctx);
 vm.runInContext('products='+data,ctx);
 if(extra) for(const f of ['product-copy.js','consultation.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
 return ctx;
}
const before=context(false), after=context(true);
const concerns=vm.runInContext('Object.keys(UI.concerns)',before);
const types=vm.runInContext('Object.keys(UI.skinTypes)',before);
const ages=['none','20대','30대','40대','50대','60대','70대 이상'];
let count=0;
for(let mask=1;mask<512;mask++)for(let i=0;i<15;i++){
 const state={selectedConcerns:concerns.filter((_,j)=>mask&(1<<j)),selectedSkinTypes:[types[i%5],types[(i+1)%5]],selectedAge:ages[i%7],selectedGender:['none','female','male'][i%3],selectedTexture:['light','balanced','rich'][Math.floor(i/5)],selectedSensitivity:['low','medium','high'][i%3]};
 const setup=Object.entries(state).map(([k,v])=>k+'='+JSON.stringify(v)).join(';');
 const result='JSON.stringify({rank:getRecommendations().map(p=>[p.key,p.score]),sets:Object.fromEntries(Object.entries(buildSets(getRecommendations())).map(([k,v])=>[k,v.map(p=>p.key)]))})';
 vm.runInContext(setup,before);vm.runInContext(setup+';priorityConcern=selectedConcerns.at(-1);habits.products.add("크림");habits.reactions.add("따가움")',after);
 assert.equal(vm.runInContext(result,after),vm.runInContext(result,before));count++;
}
const missing=vm.runInContext(`Object.entries(products).flatMap(([key,p])=>['en','zh','ja'].flatMap(lang=>[...(!USAGE[key]?.[lang]?[key+':usage:'+lang]:[]),...(p.clinical||[]).slice(0,3).flatMap((ko,i)=>p.i18n?.[lang]?.clinical?.[i]||CLINICAL[ko]?.[lang]?[]:[key+':clinical:'+i+':'+lang])]))`,after);
assert.equal(missing.length,0,JSON.stringify(missing));
console.log(count+' profiles preserve scores, ranking and all result sets. All product usage and displayed clinical statements have 3 translations.');
