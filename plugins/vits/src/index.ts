import { Context, Random, Schema, segment } from 'koishi'

const BASE_URL = 'https://mm.cqu.cc/share/zhifubaodaozhang/mp3/{0}.mp3'

export interface Config {}
const fs = require('fs') 
const {promisify} = require("util")

export const name = 'alipay-voice'
export const Config: Schema<Config> = Schema.object({})

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}

export function apply(ctx: Context) {
  ctx.command('say <t>')
    .action(async (_, t) => {

      console.log(t)

      let z = await fs.promises.writeFile('../VITS_TXT_to_Audio/model/input.txt', t, {encoding: "utf-8"});

      let flag = 0;

      async function gen() {
        const spawn = require('child_process').spawn;
        const pythonProcess = spawn('python', ['D:/Dev/Github/VITS_TXT_to_Audio/txt_to_audio.py'], {encoding: "unicode" });
        //const pythonProcess = spawn('python', ['D:/Dev/Github/VITS_TXT_to_Audio/go.py'], {encoding: "utf-8"});
  
        await pythonProcess.stdout.pipe(process.stdout);
        await pythonProcess.on('exit', function (code) {
          console.log('python ok!', code);    
          flag = 10000000;            
        });  
      }
      
      await gen();

      await delay(4);
      return segment.audio('file:///D:/Dev/Github/VITS_TXT_to_Audio/output/00001.wav');  
     
    })
}