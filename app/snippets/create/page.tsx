import { SnippetForm } from '@/components/snippet-form'

export default function CreateSnippetPage() {
  return <main className="app-page"><header className="simple-header"><a href="/" className="brand"><span className="brand-mark">&lt;/&gt;</span><span>Code<span className="brand-accent">Share</span></span></a><a href="/dashboard" className="secondary-action">Dashboard</a></header><SnippetForm mode="create" /></main>
}
