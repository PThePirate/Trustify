import { GraduationCap, CalendarDays, MessageCircle, Sparkles, Rocket, BookOpen, Store, Mail } from "lucide-react";
export default function PlansDecoration() {
  return <div className="plans-decoration" aria-hidden="true">
    <span className="plans-glow plans-glow-one" /><span className="plans-glow plans-glow-two" />
    <div className="plans-ribbon plans-ribbon-one" /><div className="plans-ribbon plans-ribbon-two" />
    <svg className="plans-campus-drawing" viewBox="0 0 220 240"><circle cx="110" cy="125" r="88" className="campus-drawing-orbit" /><path d="M30 205H195M52 205V105L110 64L168 105V205M42 105H178M72 119V177M96 119V177M124 119V177M148 119V177M47 190H173" /><path d="M74 46L110 29L146 46L110 64Z M87 53V68Q110 84 133 68V53 M146 46V75" /><circle cx="185" cy="77" r="8" /><path d="M24 141H40M32 133V149" /></svg>
    <svg className="plans-letter-drawing" viewBox="0 0 220 240"><circle cx="110" cy="125" r="85" className="campus-drawing-orbit" /><path d="M40 93L110 45L180 93V182H40Z" /><path d="M65 115V68H155V115M80 88H140M80 102H128M40 93L110 141L180 93M40 182L92 131M180 182L128 131" /><circle cx="165" cy="51" r="18" /><path d="M156 51L162 57L174 44" /></svg>
    <svg className="plans-trails" viewBox="0 0 1400 1000" preserveAspectRatio="none"><path d="M-50 250 C300 -80 250 900 720 580 S1100 200 1450 800" /><path className="plans-trail-signal" d="M-50 250 C300 -80 250 900 720 580 S1100 200 1450 800" /><path d="M-50 900 C350 450 900 1100 1450 150" /></svg>
    {[GraduationCap,CalendarDays,MessageCircle,Sparkles,Rocket,BookOpen,Store,Mail].map((Icon,index)=><span className={`plans-object plans-object-${index}`} key={index}><Icon /></span>)}
    {Array.from({length:24},(_,index)=><i key={index} style={{left:`${(index * 31 + 4) % 96}%`,top:`${(index * 19 + 5) % 94}%`,animationDelay:`-${index*.6}s`}} />)}
  </div>;
}
