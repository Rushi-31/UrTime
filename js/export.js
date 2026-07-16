import { formatTime, secondsToHours, notify } from './utils.js';
const rows=data=>[['Type','Task / Remark','Date','Start','End','Duration'],...data.map(x=>[x.type,x.title,x.date,formatTime(x.startTime),formatTime(x.endTime),secondsToHours(x.durationSeconds)])];
const download=(content,name,type)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(a.href);};
export function exportCsv(data){const csv=rows(data).map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');download(csv,'studylog-history.csv','text/csv;charset=utf-8');notify('CSV export downloaded.');}
export function exportExcel(data){const html=`<table>${rows(data).map((r,i)=>`<tr>${r.map(c=>`<${i?'td':'th'}>${String(c).replaceAll('&','&amp;').replaceAll('<','&lt;')}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</table>`;download(html,'studylog-history.xls','application/vnd.ms-excel');notify('Excel export downloaded.');}
export function exportPdf(){window.print();}
