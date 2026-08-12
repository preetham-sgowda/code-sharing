'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowUpRight, Check, ChevronDown, Code2, Copy, Globe2, Menu, Plus, Search, Sparkles, Terminal, X } from 'lucide-react'

type Snippet = { id: string; title: string; description: string | null; code: string; language: string; tags: string[]; visibility: string; share_token: string; created_at: string }

const seedSnippets: Snippet[] = [
  { id: '1', title: 'Debounce hook', description: 'A tiny React hook for delaying expensive work.', code: "import { useEffect, useState } from 'react'\n\nexport function useDebounce<T>(value: T, delay = 300) {\n  const [debounced, setDebounced] = useState(value)\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay)\n    return () => clearTimeout(timer)\n  }, [value, delay])\n\n  return debounced\n}", language: 'TypeScript', tags: ['react', 'hooks'], visibility: 'public', share_token: 'demo1', created_at: new Date().toISOString() },
  { id: '2', title: 'CSS grain overlay', description: 'Subtle texture without adding an image asset.', code: '.surface::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  opacity: .035;\n  background-image: url("data:image/svg+xml,...");\n  mix-blend-mode: multiply;\n}', language: 'CSS', tags: ['css', 'texture'], visibility: 'public', share_token: 'demo2', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', title: 'Safe fetch wrapper', description: 'Keep request errors typed and predictable.', code: 'export async function safeFetch<T>(url: string): Promise<T> {\n  const response = await fetch(url)\n  if (!response.ok) throw new Error(`Request failed: ${response.status}`)\n  return response.json() as Promise<T>\n}', language: 'TypeScript', tags: ['fetch', 'api'], visibility: 'public', share_token: 'demo3', created_at: new Date(Date.now() - 172800000).toISOString() },
]

function Logo() { return <div className="brand"><span className="brand-mark"><Code2 size={18} /></span><span>Code<span className="brand-accent">Share</span></span></div> }

export default function Page() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)
  const [snippets, setSnippets] = useState<Snippet[]>(seedSnippets)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [query, setQuery] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setSupabase(createClient()) }, [])
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.from('snippets').select('*').eq('visibility', 'public').order('created_at', { ascending: false }).limit(12).then(({ data }) => { if (data?.length) setSnippets(data as Snippet[]) })
  }, [supabase])

  const visible = snippets.filter((snippet) => `${snippet.title} ${snippet.description} ${snippet.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  async function submitAuth(event: React.FormEvent) {
    event.preventDefault(); setAuthMessage('')
    if (authMode === 'sign-up' && !username.trim()) { setAuthMessage('Choose a username to continue.'); return }
    if (!supabase) return
    const result = authMode === 'sign-in' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`, data: { username } } })
    if (result.error) setAuthMessage('That email or password could not be verified.')
    else { setUser(result.data.user); setAuthMessage(authMode === 'sign-up' ? 'Check your inbox to confirm your account.' : 'Welcome back.'); if (authMode === 'sign-in') setTimeout(() => setAuthOpen(false), 700) }
  }
  async function copySnippet(snippet: Snippet) { await navigator.clipboard.writeText(snippet.code); setCopied(snippet.id); setTimeout(() => setCopied(null), 1600) }

  return <main className="site-shell">
    <header className="topbar"><Logo /><nav className="nav-links"><a href="#explore">Explore</a><a href="#how">How it works</a><a href="#about">About</a></nav><div className="header-actions"><a className="github-link" href="https://github.com" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>{user ? <><a className="sign-in" href="/dashboard">Workspace <ArrowUpRight size={15} /></a><button className="avatar" onClick={() => supabase?.auth.signOut().then(() => setUser(null))}>{user.email?.slice(0, 1).toUpperCase()}</button></> : <button className="sign-in" onClick={() => { setAuthMode('sign-in'); setAuthOpen(true) }}>Sign in <ArrowUpRight size={15} /></button>}<button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu size={20} /></button></div></header>
    {menuOpen && <div className="mobile-nav"><a href="#explore">Explore</a><a href="#how">How it works</a><a href="#about">About</a></div>}
    <section className="hero"><div className="eyebrow"><span className="pulse-dot" /> THE OPEN NOTEBOOK FOR CODE</div><h1>Share what you<br /><em>figure out.</em></h1><p className="hero-copy">A quiet place for useful code. Save your snippets, discover what others are building, and keep the good stuff close.</p><div className="hero-actions"><button className="primary-action" onClick={() => { if (user) document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); else { setAuthMode('sign-up'); setAuthOpen(true) } }}><Plus size={17} /> Start sharing</button><a className="secondary-action" href="#explore">Browse snippets <ArrowUpRight size={16} /></a></div><div className="hero-note"><span className="note-line" /> No noise. No feed. Just good code.</div></section>
    <section id="explore" className="explore-section"><div className="section-heading"><div><span className="section-kicker">FROM THE COMMUNITY</span><h2>Worth keeping.</h2></div><div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search snippets..." /><kbd>⌘ K</kbd></div></div><div className="filter-row"><button className="filter-active">All snippets</button><button>JavaScript</button><button>TypeScript</button><button>CSS</button><button className="sort-button">Most recent <ChevronDown size={15} /></button></div><div className="snippet-grid">{visible.map((snippet) => <article className="snippet-card" key={snippet.id}><div className="snippet-card-top"><span className="language"><span className="language-dot" /> {snippet.language}</span><span className="visibility"><Globe2 size={13} /> public</span></div><h3>{snippet.title}</h3><p>{snippet.description}</p><div className="code-preview"><div className="code-dots"><i /><i /><i /></div><pre><code>{snippet.code}</code></pre></div><div className="snippet-footer"><div className="tag-list">{snippet.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><button className="copy-button" onClick={() => copySnippet(snippet)}>{copied === snippet.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}</button></div></article>)}</div>{visible.length === 0 && <div className="empty-state">No snippets match “{query}”.</div>}</section>
    <section id="how" className="workspace-banner"><div><span className="section-kicker">YOUR WORKSPACE</span><h2>A small corner<br />for your best work.</h2><p>Keep private notes private. Publish the pieces that might help someone else. Every snippet gets a clean, shareable link.</p></div><div className="workspace-card" id="workspace"><div className="workspace-card-head"><Terminal size={18} /><span>your-workspace</span><span className="workspace-status"><span className="pulse-dot" /> synced</span></div><div className="workspace-row"><span className="folder">⌄</span><span>snippets</span><span className="count">{user ? '0 saved' : 'Sign in to save'}</span></div><button onClick={() => { if (!user) { setAuthMode('sign-in'); setAuthOpen(true) } }} className="workspace-cta">{user ? 'Open workspace' : 'Sign in to continue'} <ArrowUpRight size={15} /></button></div></section>
    <footer id="about"><Logo /><p>CodeShare is a simple home for the code worth remembering.</p><span>Built for the curious.</span></footer>
    {authOpen && <div className="modal-backdrop" onClick={() => setAuthOpen(false)}><div className="auth-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Close"><X size={18} /></button><div className="modal-icon"><Sparkles size={20} /></div><h2>{authMode === 'sign-in' ? 'Welcome back.' : 'Make a little room.'}</h2><p>{authMode === 'sign-in' ? 'Sign in to access your private workspace.' : 'Create an account to save and share snippets.'}</p><form onSubmit={submitAuth}><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>{authMode === 'sign-up' && <label>Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} minLength={3} maxLength={30} required /></label>}<label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></label><button className="primary-action full" type="submit">{authMode === 'sign-in' ? 'Sign in' : 'Create account'} <ArrowUpRight size={15} /></button></form>{authMessage && <div className="auth-message">{authMessage}</div>}<button className="mode-switch" onClick={() => { setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in'); setAuthMessage(''); setUsername('') }}>{authMode === 'sign-in' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></div></div>}
  </main>
}
