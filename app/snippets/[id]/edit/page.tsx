import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SnippetForm } from '@/components/snippet-form'

export const dynamic = 'force-dynamic'
export default async function EditSnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <main className="app-page"><p className="form-message">Please sign in to edit snippets.</p></main>
  const { data: snippet } = await supabase.from('snippets').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!snippet) notFound()
  return <main className="app-page"><header className="simple-header"><a href="/" className="brand"><span className="brand-mark">&lt;/&gt;</span><span>Code<span className="brand-accent">Share</span></span></a><a href="/dashboard" className="secondary-action">Dashboard</a></header><SnippetForm mode="edit" snippet={snippet} /></main>
}
