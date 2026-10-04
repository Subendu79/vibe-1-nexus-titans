'use client';
import {useState,type FormEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowUpRight,ArrowRight,Eye,EyeOff,LoaderCircle,ShieldCheck,Users,GraduationCap,BriefcaseBusiness} from 'lucide-react';
import {Brand,TotoArt} from './brand';
export function AuthScreen({mode,demo}:{mode:'login'|'signup';demo:boolean}){
 const router=useRouter();const signup=mode==='signup';
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [name,setName]=useState('');
 const [role,setRole]=useState<'student'|'employee'>('student');
 const [show,setShow]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 async function submit(event:FormEvent){event.preventDefault();setBusy(true);setError('');
  try{const response=await fetch('/api/auth/'+mode,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,name,role})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||'Please try again.');router.push('/dashboard');router.refresh();
  }catch(e){setError(e instanceof Error?e.message:'Please try again.');setBusy(false);}
 }
 return <main className="auth-layout"><section className="auth-story"><Brand/><div className="auth-story-body"><span className="eyebrow">THREE STOPS. ONE CAMPUS.</span><h1>Your everyday<br/>ride, <span>sorted.</span></h1><p>From college to the station to the office.<br/>A simpler way to get there, together.</p><div className="auth-art"><TotoArt/></div><div className="campus-stops"><span>College</span><i/><span>Railway Station</span><i/><span>Office</span></div><div className="auth-features"><span><ShieldCheck size={14}/>One reserved ride</span><span><Users size={14}/>Together or solo</span><span><ArrowUpRight size={14}/>Every trip recorded</span></div></div><footer>Made for Lawazia. Built by Nexus Titans.<ArrowUpRight size={16}/></footer></section>
 <section className="auth-form-area"><div className="auth-mobile-brand"><Brand/></div><div className="auth-form-wrap"><div className="auth-heading-icon"><ArrowUpRight size={25}/></div><span className="eyebrow">{signup?'JOIN THE CAMPUS':'WELCOME BACK'}</span><h2>{signup?'A seat for you.':'Let’s get you moving.'}</h2><p className="muted">{signup?'Create your account to request a campus ride.':'Sign in to book a ride or manage your trips.'}</p>
 <form onSubmit={submit} className="auth-form">
 {signup&&<><label className="field-label">Your name<input autoComplete="name" required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></label><div><span className="field-label">I’m a</span><div className="role-picker"><button type="button" aria-pressed={role==='student'} className={role==='student'?'selected':''} onClick={()=>setRole('student')}><GraduationCap size={18}/>Student</button><button type="button" aria-pressed={role==='employee'} className={role==='employee'?'selected':''} onClick={()=>setRole('employee')}><BriefcaseBusiness size={18}/>Employee</button></div></div></>}
 <label className="field-label">Email address<input type="email" autoComplete="email" required maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@lawazia.org"/></label>
 <label className="field-label">Password<div className="password-input"><input type={show?'text':'password'} autoComplete={signup?'new-password':'current-password'} required minLength={signup?10:1} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} placeholder={signup?'At least 10 characters':'Enter your password'}/><button type="button" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
 {error&&<div className="form-error" role="alert">{error}</div>}
 <button className="button primary full-width" disabled={busy}>{busy?<LoaderCircle size={18} className="spin"/>:null}{signup?'Create account':'Sign in'}<ArrowRight size={18}/></button></form>
 <p className="auth-switch">{signup?'Already have an account?':'New to Lawazia?'} <Link href={signup?'/login':'/signup'}>{signup?'Sign in':'Create an account'}</Link></p>
 {!signup&&demo&&<div className="demo-accounts"><span className="eyebrow">TRY A LOCAL DEMO ACCOUNT</span><div>{['student','employee','rider'].map(account=><button key={account} type="button" onClick={()=>{setEmail(account+'@lawazia.demo');setPassword('CampusRide!2026');setError('');}}>{account==='student'?<GraduationCap size={15}/>:account==='employee'?<Users size={15}/>:<ArrowUpRight size={15}/>}<span>{account}</span></button>)}</div><small>Local MongoDB · sample accounts only</small></div>}
 <div className="auth-trust"><ShieldCheck size={15}/>Your rides stay linked to your account.</div></div></section></main>;
}
