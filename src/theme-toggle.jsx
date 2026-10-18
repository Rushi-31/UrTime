import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import'./dark-theme.css';

function ThemeToggle(){const[dark,setDark]=useState(()=>localStorage.getItem('urtime-theme')==='dark');useEffect(()=>{document.body.classList.toggle('dark-lovely',dark);localStorage.setItem('urtime-theme',dark?'dark':'light')},[dark]);return <button type="button" className="theme-toggle" aria-pressed={dark} onClick={()=>setDark(value=>!value)}><span>{dark?'☀':'☾'}</span>{dark?'Light theme':'Dark theme'}</button>}
let root,host;
function attach(){const sidebar=document.querySelector('.app aside');if(!sidebar){if(host){root.unmount();host.remove();root=null;host=null}return}if(host)return;host=document.createElement('div');host.className='theme-toggle-host';const logout=sidebar.querySelector('.logout');sidebar.insertBefore(host,logout||null);root=createRoot(host);root.render(<ThemeToggle/>)}
new MutationObserver(attach).observe(document.body,{childList:true,subtree:true});
attach();
