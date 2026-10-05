import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '../components/status-badge'
import { createFollowUp, getFollowUps, updateFollowUp } from '../api'
import type { FollowUpStatus, Priority } from '../types'

export function FollowUpsPage() {
  const [status, setStatus] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [workflowId, setWorkflowId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['follow-ups', status], queryFn: () => getFollowUps({ status: (status || undefined) as FollowUpStatus | undefined }) })
  async function complete(id: string) {
    try {
      await updateFollowUp(id, 'Completed')
      toast.success('Follow-up completed')
      await client.invalidateQueries({ queryKey: ['follow-ups'] })
    } catch {
      toast.error('Unable to update follow-up.')
    }
  }
  async function submitFollowUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !description.trim() || !workflowId || !dueDate) return
    try {
      await createFollowUp({ title: title.trim(), description: description.trim(), workflowId, dueDate, assetName: 'Related asset', assignedUserName: 'Current user', priority: 'Medium' as Priority })
      toast.success('Follow-up created')
      setTitle('')
      setDescription('')
      setWorkflowId('')
      setDueDate('')
      setShowCreate(false)
      await client.invalidateQueries({ queryKey: ['follow-ups'] })
    } catch {
      toast.error('Unable to create follow-up.')
    }
  }
  return <><Header /><Main><div className='mb-6 flex flex-wrap items-center justify-between gap-3'><div><h1 className='text-2xl font-bold'>Follow-ups</h1><p className='text-muted-foreground'>Keep completed workflows connected to their next action.</p></div><div className='flex gap-2'><Button onClick={() => setShowCreate((value) => !value)}>Create follow-up</Button><select className='h-9 rounded-md border bg-background px-3 text-sm' value={status} onChange={(event) => setStatus(event.target.value)}><option value=''>All statuses</option><option>Pending</option><option>In Progress</option><option>Completed</option><option>Overdue</option><option>Cancelled</option></select></div></div>{showCreate && <Card className='mb-6'><CardHeader><CardTitle>New follow-up</CardTitle></CardHeader><CardContent><form className='grid gap-3 sm:grid-cols-2' onSubmit={submitFollowUp}><Input required placeholder='Title' value={title} onChange={(event) => setTitle(event.target.value)} /><Input required placeholder='Workflow ID' value={workflowId} onChange={(event) => setWorkflowId(event.target.value)} /><Input required placeholder='Description' value={description} onChange={(event) => setDescription(event.target.value)} /><Input required type='date' value={dueDate} onChange={(event) => setDueDate(event.target.value)} /><Button type='submit'>Save follow-up</Button></form></CardContent></Card>}<Card><CardHeader><CardTitle>Assigned follow-ups</CardTitle></CardHeader><CardContent>{query.isLoading ? <p>Loading follow-ups...</p> : query.isError ? <p className='text-destructive'>Follow-ups could not be loaded.</p> : <div className='space-y-3'>{(query.data ?? []).map((item) => <div key={item.id} className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between'><div><div className='flex flex-wrap items-center gap-2'><p className='font-medium'>{item.title}</p><StatusBadge status={item.status} /></div><p className='text-sm text-muted-foreground'>{item.description}</p><p className='mt-1 text-xs text-muted-foreground'>Asset: {item.assetName} · Due {new Date(item.dueDate).toLocaleDateString()} · Assigned to {item.assignedUserName}</p></div>{item.status !== 'Completed' && item.status !== 'Cancelled' && <Button onClick={() => complete(item.id)}>Mark complete</Button>}</div>)}</div>}</CardContent></Card></Main></>
}
