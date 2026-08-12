'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
export function CopyButton({ value, label }: { value: string; label: string }) { const [copied, setCopied] = useState(false); return <button className="secondary-action" onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : label}</button> }
