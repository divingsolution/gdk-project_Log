'use strict';
document.querySelectorAll('#roster tbody tr').forEach(row=>{
 const old=row.cells[3].querySelector('input');const select=document.createElement('select');
 select.setAttribute('aria-label',old.getAttribute('aria-label'));
 [['','선택'],['더블','더블'],['텐더','텐더']].forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);});
 select.value=old.value;old.replaceWith(select);
});
function updateTypeRows(){document.querySelectorAll('#roster tbody tr').forEach(row=>row.classList.toggle('tender-row',row.cells[3].querySelector('select').value==='텐더'));}
function sortByName(){
 const rows=[...document.querySelector('#roster tbody').rows];
 const collator=new Intl.Collator('ko',{numeric:true,sensitivity:'base'});
 const records=rows.map((row,index)=>({index,values:[...row.querySelectorAll('input,select')].map(input=>input.value)}));
 records.sort((a,b)=>{const an=a.values[0].trim(),bn=b.values[0].trim();return (!an)-(!bn)||collator.compare(an,bn)||a.index-b.index;});
 rows.forEach((row,index)=>{row.querySelectorAll('input,select').forEach((input,col)=>{input.value=records[index].values[col];});});
 calc();updateTypeRows();persist();
}
document.addEventListener('keydown',event=>{
 if(!['Enter','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)||event.isComposing||event.keyCode===229||event.ctrlKey||event.altKey||event.metaKey)return;
 const input=event.target;if(!['INPUT','SELECT'].includes(input.tagName)||!input.closest('.page'))return;
 if(event.key!=='Enter'&&!input.closest('#roster tbody'))return;
 event.preventDefault();
 const cell=input.closest('td'),row=cell?.parentElement,body=row?.parentElement;
 let next;
 if(body?.matches('#roster tbody')){
  const rows=[...body.rows];
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   const controls=[...row.querySelectorAll('input,select')];next=controls[controls.indexOf(input)+(event.key==='ArrowLeft'?-1:1)];
  }else{const index=rows.indexOf(row)+(event.key==='ArrowUp'||(event.key==='Enter'&&event.shiftKey)?-1:1);
   next=rows[index]?.cells[cell.cellIndex]?.querySelector('input,select');}
 }else{
  const inputs=[...document.querySelectorAll('.page input')];
  next=inputs[inputs.indexOf(input)+(event.shiftKey?-1:1)];
 }
 if(next){next.focus();if(next.tagName==='INPUT'&&next.type!=='number')next.select();}
});
const storageKey='gdk-project-v1';
const statusNode=document.getElementById('saveStatus');
const editable=()=>[...document.querySelectorAll('.page input,.page select,.page [contenteditable]')];
const blankState=editable().map(e=>['INPUT','SELECT'].includes(e.tagName)?e.value:e.innerText);
function restore(values){editable().forEach((e,i)=>{if(typeof values[i]!=='string')return;if(['INPUT','SELECT'].includes(e.tagName))e.value=values[i];else {e.innerText=values[i];}});calc();updateTypeRows();}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({version:1,values:editable().map(e=>['INPUT','SELECT'].includes(e.tagName)?e.value:e.innerText)}));statusNode.textContent='이 브라우저에 자동 저장됨 · '+new Date().toLocaleTimeString('ko-KR');}catch(e){statusNode.textContent='자동 저장 불가 · 창을 닫기 전에 PDF/JPG를 저장하세요.';}}
try{let saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&saved.version===1&&Array.isArray(saved.values)){restore(saved.values);statusNode.textContent='저장된 작업을 불러왔습니다.';}else statusNode.textContent='내용을 입력하면 이 브라우저에 자동 저장됩니다.';}catch(e){statusNode.textContent='저장된 작업을 읽지 못했습니다. 출력 후 보관하세요.';}
document.addEventListener('input',()=>{updateTypeRows();persist();});document.addEventListener('change',()=>{updateTypeRows();persist();});updateTypeRows();
document.addEventListener('paste',e=>{if(e.target.isContentEditable){e.preventDefault();let text=e.clipboardData.getData('text/plain');const selection=window.getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);persist();}});
function newProject(){if(!confirm('현재 작업을 초기화하고 새 프로젝트를 시작할까요? 필요한 PDF/JPG를 먼저 저장하세요.'))return;restore(blankState);persist();}
function cellText(cell){return cell.querySelector('input,select')?.value??cell.innerText;}
function reportCanvas(){const canvas=document.createElement('canvas');canvas.width=4960;canvas.height=3508;const ctx=canvas.getContext('2d');ctx.scale(3.1,3.1);const W=1600,H=3508/3.1;ctx.fillStyle='#ffffff';ctx.fillRect(0,0,W,H);const ink='#163b48',teal='#007f86';
function box(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function text(value,x,y,w,h,size=12,color=ink,bold=false,align='left'){value=String(value??'');ctx.fillStyle=color;ctx.textBaseline='middle';let lines=[];for(let fontSize=size;fontSize>=2;fontSize-=.5){ctx.font=`${bold?'600':'400'} ${fontSize}px "Apple SD Gothic Neo","Malgun Gothic",sans-serif`;lines=[];for(let para of value.split('\n')){let line='';for(let ch of para){if(ctx.measureText(line+ch).width>w-10&&line){lines.push(line);line=ch;}else line+=ch;}lines.push(line);}if(lines.length*fontSize*1.3<=h-4){const lh=fontSize*1.3;lines.forEach((line,i)=>{let tw=ctx.measureText(line).width;ctx.fillText(line,align==='right'?x+w-5-tw:align==='center'?x+(w-tw)/2:x+5,y+(h-lines.length*lh)/2+lh*(i+.5));});return;}}}
text('GHOST DIVING KOREA / PROJECT REPORT',32,20,1250,22,12,teal,true);text('해양정화 프로젝트 · 운영 & 정산',32,43,1300,45,29,ink,true);text(document.querySelector('.tag').innerText,1380,47,185,35,13,teal,true,'right');box(32,95,1536,3,teal);
document.querySelectorAll('.meta label').forEach((e,i)=>text(e.firstChild.textContent+'  '+e.querySelector('input').value,32+i*384,105,376,30,13));
document.querySelectorAll('.card').forEach((e,i)=>{let x=32+i*309;box(x,143,298,76,i===4?'#fff4df':'#edf7f7');text(e.querySelector('small').innerText,x+8,148,282,24,11);text(e.querySelector('strong').innerText,x+8,174,282,28,23,ink,true);if(i===4)text(document.getElementById('refund').innerText,x+8,201,282,14,10);});
text('01  참여자별 운영 및 정산',32,225,850,24,14,ink,true);text('단위: 원 · 비용 공란은 미입력',950,225,610,24,11,ink,false,'right');
const widths=[27,58,30,46,...Array(6).fill(32),...Array(4).fill(32),42,36,56,...Array(8).fill(78),100];let sum=widths.reduce((a,b)=>a+b,0);const ws=widths.map(v=>v/sum*1536),xs=[32];ws.forEach(w=>xs.push(xs.at(-1)+w));const y=252;
[[0,4,'참여자'],[4,10,'숙박 / 다이빙'],[10,17,'장비 · 이동 · 객실'],[17,25,'개인별 정산 · 원'],[25,26,'비고']].forEach(([a,b,t])=>{box(xs[a],y,xs[b]-xs[a],25,ink);text(t,xs[a],y,xs[b]-xs[a],25,11,'#ffffff',true,'center');});
const days=[...document.querySelectorAll('#roster th[contenteditable]')].map(e=>e.innerText);const headers=['번호','성명','성별','타입',...days.flatMap(d=>[d+'\n숙박',d+'\n다이빙']),'산소','렌탈','DPV','촬영','출발','블렌딩','객실','다이빙','렌탈','숙박','기타비용','단체지원','개인부담','기납부','잔액 ±','기타'];
headers.forEach((t,j)=>{box(xs[j],y+25,ws[j],35,'#eaf2f4');text(t,xs[j],y+25,ws[j],35,10,ink,true,'center');});
[...document.querySelector('#roster tbody').rows].forEach((row,i)=>{let yy=y+60+i*25;box(32,yy,1536,25,cellText(row.cells[3])==='텐더'?'#fff0cc':i%2?'#f5f9fa':'#ffffff');[...row.cells].forEach((cell,j)=>{let val=cellText(cell);if(j>=17&&j<25&&val!=='')val=Number(String(val).replaceAll(',','')).toLocaleString('ko-KR');text(val,xs[j],yy,ws[j],25,11,ink,false,j>=17&&j<25?'right':'center');});box(32,yy+24.5,1536,.5,'#dce7e9');});
const totalY=y+60+625;box(32,totalY,1536,26,'#dff0ee');text('합계 · 잔액 양수 = 추가 납부 / 음수 = 환급',32,totalY,xs[17]-32,26,11,ink,true);for(let i=0;i<8;i++)text(document.getElementById('t'+i).innerText,xs[i+17],totalY,ws[i+17],26,11,ink,true,'right');
const by=976;document.querySelectorAll('.panel').forEach((panel,i)=>{let x=32+i*517;box(x,by,502,2,teal);text(panel.querySelector('h2').innerText,x,by+5,502,22,13,ink,true);let body='';if(i===0){body=[...panel.querySelectorAll('tr')].map(tr=>[...tr.cells].map(cell=>cell.innerText).join(' / ')).join('\n');body+='\n'+panel.querySelector('p').innerText;}else body=[...panel.querySelectorAll('p')].map(p=>p.innerText).join('\n');text(body,x,by+30,502,95,11);});text('GHOST DIVING KOREA · '+new Date().toLocaleDateString('ko-KR')+' · 1 / 1',32,1105,1536,18,10,'#70858b',false,'right');return canvas;}
function makePDF(jpeg,width,height){const enc=new TextEncoder(),chunks=[],offsets=[0];let length=0;const add=data=>{let b=typeof data==='string'?enc.encode(data):data;chunks.push(b);length+=b.length;};const obj=(n,body)=>{offsets[n]=length;add(`${n} 0 obj\n${body}\nendobj\n`);};add('%PDF-1.4\n');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 1190.55 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');offsets[4]=length;add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);add(jpeg);add('\nendstream\nendobj\n');let content='q\n1190.55 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';obj(5,`<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream`);let start=length;add('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)add(String(offsets[i]).padStart(10,'0')+' 00000 n \n');add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);return new Blob(chunks,{type:'application/pdf'});}
async function downloadReport(type){const buttons=[...document.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);try{if(document.querySelector('input:invalid')){alert('비용은 0 이상의 정수로 입력하세요. 표시된 입력칸을 확인해 주세요.');return;}persist();await document.fonts.ready;const canvas=reportCanvas();const jpg=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('이미지를 만들지 못했습니다.')),'image/jpeg',.96));const blob=type==='pdf'?makePDF(new Uint8Array(await jpg.arrayBuffer()),canvas.width,canvas.height):jpg;let name=document.querySelector('.meta input').value.trim()||'고스트다이빙코리아_프로젝트';name=name.replace(/[\\/:*?"<>|]/g,'_');let a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name+'.'+type;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}catch(e){alert('파일을 저장하지 못했습니다. '+e.message);}finally{buttons.forEach(b=>b.disabled=false);}}
