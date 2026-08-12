'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'

const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'HTML', 'CSS', 'SQL', 'JSON', 'XML']

type SnippetFormProps = { snippet?: { id: string; title: string; code: string; language: string; description: string | null; tags: string[]; visibility: string; share_token: string }; mode: 'create' | 'edit' }

export function SnippetForm({ snippet, mode }: SnippetFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(snippet?.title ?? '')
  const [code, setCode] = useState(snippet?.code ?? '')
  const [language, setLanguage] = useState(snippet?.language ?? 'JavaScript')
  const [description, setDescription] = useState(snippet?.description ?? '')
  const [tags, setTags] = useState(snippet?.tags?.join(', ') ?? '')
  const [visibility, setVisibility] = useState(snippet?.visibility ?? 'private')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage('')
    if (!title.trim() || !code.trim()) { setMessage('Title and code are required.'); return }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMessage('Please sign in to save snippets.'); setSaving(false); return }
    const payload = {
      title: title.trim(),
      code: code.trim(),
      language: language.toLowerCase(),
      description: description.trim() || null,
      tags: Array.from(new Set(tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))),
      visibility: visibility === 'public' ? 'public' : 'private',
    }
    const result = mode === 'create'
      ? await supabase.from('snippets').insert({ ...payload, user_id: user.id, share_token: nanoid(8) }).select('id').single()
      : await supabase.from('snippets').update(payload).eq('id', snippet?.id).select('id').single()
    if (result.error) {
      setMessage(result.error.code === '42501' ? 'Your session expired. Please sign in again.' : result.error.code === '23514' ? 'Check the title, code, and visibility values.' : result.error.message || 'Unable to save this snippet.')
    }
    else router.push(mode === 'create' ? '/dashboard' : `/code/${snippet?.share_token}`)
    setSaving(false)
  }

  return <form className="snippet-editor" onSubmit={submit}>
    <div className="editor-heading"><div><span className="section-kicker">{mode === 'create' ? 'NEW NOTE' : 'EDIT NOTE'}</span><h1>{mode === 'create' ? 'Save something useful.' : 'Keep it sharp.'}</h1></div><button className="secondary-action" type="button" onClick={() => router.back()}>Cancel</button></div>
    <div className="editor-grid">
      <div className="editor-main"><label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A useful little pattern" maxLength={120} /></label><label>Code<textarea className="code-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..." spellCheck={false} /></label></div>
      <aside className="editor-side"><label>Language<select value={language} onChange={(e) => setLanguage(e.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select></label><label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What makes this worth keeping?" rows={4} /></label><label>Tags<input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, hooks, api" /></label><fieldset><legend>Visibility</legend><label className="radio-row"><input type="radio" checked={visibility === 'private'} onChange={() => setVisibility('private')} /> Private</label><label className="radio-row"><input type="radio" checked={visibility === 'public'} onChange={() => setVisibility('public')} /> Public</label></fieldset></aside>
    </div>
    {message && <p className="form-message">{message}</p>}<button className="primary-action" disabled={saving} type="submit">{saving ? 'Saving...' : mode === 'create' ? 'Create snippet' : 'Save changes'}</button>
  </form>
}

export { languages }
