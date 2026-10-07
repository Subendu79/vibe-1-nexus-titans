import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Brand} from '@/components/brand';
import {AboutPanel} from '@/components/dashboard';
export const metadata={title:'About Lawazia — The people behind the rides'};
export default function AboutPage(){return <main className="public-about"><header><Brand/><nav aria-label="Account access"><Link href="/login">Sign in</Link><Link className="button primary" href="/signup">Join the campus<ArrowUpRight size={16}/></Link></nav></header><div className="public-about-body"><span className="story-pill"><span/>NEXUS TITANS / LAWAZIA</span><AboutPanel/></div><footer>Lawazia campus mobility. Made and maintained by Subendu Kundu and Hemant Kumar Rawani.</footer></main>;}
