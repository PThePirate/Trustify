import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function PanelMobileNav({ items }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" aria-label={open ? "Cerrar menú del panel" : "Abrir menú del panel"} aria-expanded={open} onClick={() => setOpen(v => !v)} className="grid size-11 place-items-center rounded-lg border border-border bg-card text-foreground">{open ? <X size={20} /> : <Menu size={20} />}</button>{open && <nav aria-label="Navegación del panel" className="fixed inset-x-0 top-16 z-50 grid max-h-[calc(100dvh-4rem)] gap-1 overflow-y-auto overscroll-contain border-b border-border bg-card p-3 shadow-xl">{items.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg p-3 text-sm ${isActive ? "bg-trust/15 font-bold text-trust" : "text-foreground"}`}><item.icon size={18} />{item.label}</NavLink>)}</nav>}</>;
}
