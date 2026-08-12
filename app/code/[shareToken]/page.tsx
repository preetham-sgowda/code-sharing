import { createClient } from '@/lib/supabase/server'
import { CopyButton } from '@/components/copy-button'

export const dynamic = 'force-dynamic'
export default async function SharedSnippetPage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: snippet, error: snippetError } = await supabase.from('snippets').select('*').eq('share_token', shareToken).maybeSingle()
  const { data: author } = snippet ? await supabase.from('profiles').select('username').eq('id', snippet.user_id).maybeSingle() : { data: null }
  const allowed = !snippetError && snippet && (snippet.visibility === 'public' || snippet.user_id === user?.id)
  if (!allowed) return <main className="share-page"><a href="/" className="brand"><span className="brand-mark">&lt;/&gt;</span><span>Code<span className="brand-accent">Share</span></span></a><div className="private-notice"><h1>This snippet is private or no longer available.</h1><p>The link may have expired, or the owner changed its visibility.</p><a className="primary-action" href="/">Back to CodeShare</a></div></main>
  return <main className="share-page"><header className="simple-header"><a href="/" className="brand"><span className="brand-mark">&lt;/&gt;</span><span>Code<span className="brand-accent">Share</span></span></a><div className="share-actions"><CopyButton value={snippet.code} label="Copy code" /><CopyButton value={`/code/${snippet.share_token}`} label="Copy link" /></div></header><article className="shared-snippet"><div className="shared-meta"><span className="section-kicker">{snippet.language} · {snippet.visibility}</span><span>{new Date(snippet.updated_at).toLocaleDateString()}</span></div><h1>{snippet.title}</h1>{snippet.description && <p className="shared-description">{snippet.description}</p>}<div className="shared-tags">{snippet.tags?.map((tag: string) => <span key={tag}>#{tag}</span>)}</div><pre className="shared-code"><code>{snippet.code}</code></pre><p className="author-line">Shared by @{author?.username ?? 'anonymous'}</p></article></main>
}
