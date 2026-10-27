#!/usr/bin/env node
import { Worker } from 'node:worker_threads';\nimport { cpus } from 'node:os';\nimport { performance } from 'node:perf_hooks';\nimport { resolve } from 'node:path';\nfunction parseArg(arg){if(arg.startsWith('--workers='))return['workers',Number(arg.split('=')[1])];if(arg.startsWith('--iterations='))return['iterations',Number(arg.split('=')[1])];return[null,null];}\nlet workers=cpus().length;
let iterations=100000;
for(const a of process.argv.slice(2)){const [k,v]=parseArg(a);if(k==='workers'&&Number.isInteger(v)&&v>0)workers=v;if(k==='iterations'&&Number.isInteger(v)&&v>0)iterations=v;}\nconst itPerWorker=Math.ceil(iterations/workers);
const start=performance.now();
function runWorker(){return new Promise((resolveWorker,reject)=>{const worker=new Worker(`const{parentPort,workerData}=require('worker_threads');let c=0;for(let i=0;i<workerData.iterations;i++){c+=i;}parentPort.postMessage(c);`,{eval:true,workerData:{iterations:itPerWorker}});worker.on('message',()=>{resolveWorker();});worker.on('error',reject);});}
await Promise.all(Array.from({length:workers},runWorker));
const end=performance.now();
const totalTimeMs=(end-start).toFixed(2);
const opsPerSec=Number((iterations/(end-start)*1000).toFixed(2));
const result={workers,iterations,totalTimeMs,opsPerSec};
process.stdout.write(JSON.stringify(result));
process.exit(0);
