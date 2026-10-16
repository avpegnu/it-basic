#!/usr/bin/env node
/* Content, generated artifacts, cross references and local-link checks. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'NotesInterview'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(dir,'data.js'),'utf8'),ctx);
const topics=ctx.window.NI_DATA.topics;const ids=new Set(topics.map(t=>t.id));
let notes=0,questions=0,diagrams=0;const questionSet=new Set();
const sources=new Set();
for(const t of topics){
 assert.deepEqual(JSON.parse(JSON.stringify({...t,order:undefined})),JSON.parse(fs.readFileSync(path.join(dir,'content',t.id+'.json'),'utf8')),`Stale generated data for ${t.id}`);
 assert.ok(t.notes.length>=3&&t.questions.length>=10,`Topic incomplete ${t.id}`);
 for(const id of t.prerequisites)assert.ok(ids.has(id),`Unknown prerequisite ${id}`);
 for(const n of t.notes){notes++;assert.match(n.id,/^[a-z0-9-]+$/);assert.ok(n.body.length&&n.body.every(x=>x.length>40));assert.ok(n.exercise,`Missing learning exercise ${t.id}/${n.id}`);if(n.download)assert.ok(fs.existsSync(path.join(dir,n.download.url)),`Missing download ${n.download.url}`);if(n.diagram){diagrams++;const d=n.diagram;assert.ok(d.caption&&d.title);if(d.type==='graph'){for(const [a,b] of d.edges)assert.ok(d.nodes[a]&&d.nodes[b]&&a!==b);}else if(d.type==='sequence'){for(const [a,b] of d.steps)assert.ok(d.actors[a]&&d.actors[b]&&a!==b);}else assert.ok(['flow','boxes'].includes(d.type));}}
 for(const q of t.questions){questions++;assert.ok(q.answer&&q.explanation&&q.followUp);assert.ok(t.notes.some(n=>n.id===q.note),`Missing note ${t.id}/${q.id}`);assert.ok(['Cơ bản','Vận dụng','Đào sâu'].includes(q.level));const normalized=q.question.normalize('NFC').toLowerCase().trim();assert.ok(!questionSet.has(normalized),`Duplicate question ${q.question}`);questionSet.add(normalized);}
 for(const s of t.sources){assert.match(s.url,/^https:\/\//);sources.add(s.url);}
}
const staticHtml=fs.readFileSync(path.join(dir,'read.html'),'utf8');
assert.equal((staticHtml.match(/class="static-topic"/g)||[]).length,topics.length);
assert.equal((staticHtml.match(/class="note-card"/g)||[]).length,notes);
assert.equal((staticHtml.match(/class="question-card"/g)||[]).length,questions);
const anchors=[...staticHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(anchors).size,anchors.length,'Duplicate HTML ID');
for(const m of staticHtml.matchAll(/href="#([^"]+)"/g))assert.ok(anchors.includes(m[1]),`Broken static anchor ${m[1]}`);
for(const file of ['app.js','render.js'])new vm.Script(fs.readFileSync(path.join(dir,file),'utf8'),{filename:file});
assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('href="NotesInterview/index.html"'));
assert.ok(fs.readFileSync(path.join(root,'.gitignore'),'utf8').includes('/FDown.vn_instagram_*/'));
console.log(`PASS: ${topics.length} topics, ${notes} Notes, ${questions} unique questions, ${diagrams} diagrams, ${sources.size} reference URLs. Generated/static editions and anchors match.`);
