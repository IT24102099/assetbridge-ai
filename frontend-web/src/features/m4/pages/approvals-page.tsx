import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ClipboardCheck, Clock3, RotateCcw, ShieldX, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getApprovals } from '../api'
import { StatusBadge } from '../components/status-badge'
import { approvalStatuses, type ApprovalStatus } from '../types'

export function ApprovalsPage() {
  const [status, setStatus] = useState<ApprovalStatus | ''>('')
  const [search, setSearch] = useState('')
  const query = useQuery({ queryKey: ['approvals', status, search], queryFn: () => getApprovals({ status: status || undefined, search: search || undefined }) })
  const approvals = useMemo(() => query.data ?? [], [query.data])
  const counts = useMemo(() => ({
    pending: approvals.filter((item) => ['Pending', 'Under Review'].includes(item.status)).length,
    approved: approvals.filter((item) => item.status === 'Approved').length,
    rejected: approvals.filter((item) => item.status === 'Rejected').length,
    revisions: approvals.filter((item) => item.status === 'Revision Requested').length,
  }), [approvals])

  return (
    <>
      <Header />
      <Main>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
          <div><h1 className='text-2xl font-bold tracking-tight'>Approvals</h1><p className='text-muted-foreground'>Review asset proposals and keep decisions traceable.</p></div>
          <Button variant='outline' onClick={() => query.refetch()}>Refresh</Button>
        </div>
        <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card><CardContent className='flex items-center justify-between p-4'><div><p className='text-sm text-muted-foreground'>Pending approvals</p><p className='text-2xl font-bold'>{counts.pending}</p></div><Clock3 className='text-muted-foreground' /></CardContent></Card>
          <Card><CardContent className='flex items-center justify-between p-4'><div><p className='text-sm text-muted-foreground'>Approved</p><p className='text-2xl font-bold'>{counts.approved}</p></div><ClipboardCheck className='text-muted-foreground' /></CardContent></Card>
          <Card><CardContent className='flex items-center justify-between p-4'><div><p className='text-sm text-muted-foreground'>Rejected</p><p className='text-2xl font-bold'>{counts.rejected}</p></div><ShieldX className='text-muted-foreground' /></CardContent></Card>
          <Card><CardContent className='flex items-center justify-between p-4'><div><p className='text-sm text-muted-foreground'>Revision requests</p><p className='text-2xl font-bold'>{counts.revisions}</p></div><RotateCcw className='text-muted-foreground' /></CardContent></Card>
        </div>
        <Card>
          <CardHeader className='gap-4 sm:flex-row sm:items-center sm:justify-between'><CardTitle>Approval queue</CardTitle><div className='flex flex-wrap gap-2'><div className='relative'><Search className='absolute top-2.5 left-2 size-4 text-muted-foreground' /><Input className='w-56 ps-8' placeholder='Search proposals' value={search} onChange={(event) => setSearch(event.target.value)} /></div><select className='h-9 rounded-md border bg-background px-3 text-sm' value={status} onChange={(event) => setStatus(event.target.value as ApprovalStatus | '')}><option value=''>All statuses</option>{approvalStatuses.map((item) => <option key={item}>{item}</option>)}</select></div></CardHeader>
          <CardContent>{query.isLoading ? <p className='py-8 text-center text-muted-foreground'>Loading approvals...</p> : query.isError ? <p className='py-8 text-center text-destructive'>Approvals could not be loaded.</p> : <Table><TableHeader><TableRow><TableHead>Proposal</TableHead><TableHead>Asset</TableHead><TableHead>Requester</TableHead><TableHead>Status</TableHead><TableHead>Priority</TableHead><TableHead>Created</TableHead></TableRow></TableHeader><TableBody>{approvals.map((approval) => <TableRow key={approval.id}><TableCell><Link className='font-medium hover:underline' to='/approvals/$approvalId' params={{ approvalId: approval.id }}>{approval.title}</Link><p className='text-xs text-muted-foreground'>{approval.currentStage}</p></TableCell><TableCell>{approval.assetName}</TableCell><TableCell>{approval.requesterName}</TableCell><TableCell><StatusBadge status={approval.status} /></TableCell><TableCell>{approval.priority}</TableCell><TableCell>{new Date(approval.createdAt).toLocaleDateString()}</TableCell></TableRow>)}</TableBody></Table>}</CardContent>
        </Card>
      </Main>
    </>
  )
}
