import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAuditLogs } from '../api'

export function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const query = useQuery({ queryKey: ['audit-logs', search], queryFn: () => getAuditLogs({ search: search || undefined }) })
  return <><Header /><Main><div className='mb-6'><h1 className='text-2xl font-bold'>Audit logs</h1><p className='text-muted-foreground'>Append-only history of workflow and approval activity.</p></div><Card><CardHeader className='flex-row items-center justify-between'><CardTitle>Activity history</CardTitle><Input className='w-64' placeholder='Search logs' value={search} onChange={(event) => setSearch(event.target.value)} /></CardHeader><CardContent>{query.isLoading ? <p>Loading audit logs...</p> : query.isError ? <p className='text-destructive'>Audit logs could not be loaded.</p> : <Table><TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>User / role</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Status change</TableHead><TableHead>Source</TableHead></TableRow></TableHeader><TableBody>{(query.data ?? []).map((log) => <TableRow key={log.id}><TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell><TableCell>{log.userName}<p className='text-xs text-muted-foreground'>{log.role}</p></TableCell><TableCell>{log.action}<p className='text-xs text-muted-foreground'>{log.description}</p></TableCell><TableCell>{log.entity}<p className='text-xs text-muted-foreground'>{log.entityId}</p></TableCell><TableCell>{log.previousStatus || '—'} → {log.newStatus || '—'}</TableCell><TableCell>{log.source}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card></Main></>
}

