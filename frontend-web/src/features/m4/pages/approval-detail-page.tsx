import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getApproval, getWorkflowTimeline } from '../api'
import { ApprovalActions } from '../components/approval-actions'
import { StatusBadge } from '../components/status-badge'
import { WorkflowTimeline } from '../components/workflow-timeline'

export function ApprovalDetailPage() {
  const { approvalId } = useParams({ from: '/_authenticated/approvals/$approvalId' })
  const client = useQueryClient()
  const approval = useQuery({ queryKey: ['approval', approvalId], queryFn: () => getApproval(approvalId) })
  const timeline = useQuery({ queryKey: ['workflow', approvalId], queryFn: () => getWorkflowTimeline(approvalId) })
  if (approval.isLoading) return <><Header /><Main><p>Loading approval...</p></Main></>
  if (approval.isError || !approval.data) return <><Header /><Main><p className='text-destructive'>Approval could not be loaded.</p></Main></>
  const item = approval.data
  return <><Header /><Main><div className='mb-6'><p className='text-sm text-muted-foreground'>Approval detail</p><h1 className='text-2xl font-bold'>{item.title}</h1><div className='mt-2 flex flex-wrap gap-2'><StatusBadge status={item.status} /><span className='text-sm text-muted-foreground'>Priority: {item.priority}</span></div></div><div className='grid gap-6 lg:grid-cols-[1.3fr_1fr]'><div className='space-y-6'><Card><CardHeader><CardTitle>Proposal</CardTitle></CardHeader><CardContent className='space-y-4'><div><p className='text-sm text-muted-foreground'>Asset</p><p>{item.assetName} ({item.assetId})</p></div><div><p className='text-sm text-muted-foreground'>Requester</p><p>{item.requesterName}{item.requesterEmail ? ` · ${item.requesterEmail}` : ''}</p></div><div><p className='text-sm text-muted-foreground'>Details</p><p className='whitespace-pre-wrap'>{item.proposalDetails || 'No proposal details provided.'}</p></div></CardContent></Card><Card><CardHeader><CardTitle>AI recommendation</CardTitle></CardHeader><CardContent><p>{item.aiRecommendation || 'No AI recommendation is available for this proposal.'}</p>{item.aiConfidence !== undefined && <p className='mt-2 text-sm text-muted-foreground'>Confidence: {Math.round(item.aiConfidence * 100)}%</p>}{item.evidence?.length ? <ul className='mt-3 list-disc ps-5 text-sm'>{item.evidence.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul> : null}</CardContent></Card><Card><CardHeader><CardTitle>Comments and actions</CardTitle></CardHeader><CardContent className='space-y-4'>{item.comments.map((comment) => <div key={comment.id} className='border-b pb-3 last:border-0'><p className='text-sm'>{comment.text}</p><p className='text-xs text-muted-foreground'>{comment.authorName} · {new Date(comment.createdAt).toLocaleString()}{comment.action ? ` · ${comment.action}` : ''}</p></div>)}<ApprovalActions approvalId={item.id} onComplete={() => { void client.invalidateQueries({ queryKey: ['approval', approvalId] }); void client.invalidateQueries({ queryKey: ['workflow', approvalId] }) }} /></CardContent></Card></div><div>{timeline.isLoading ? <Card><CardContent className='p-6'>Loading workflow...</CardContent></Card> : timeline.data ? <WorkflowTimeline events={timeline.data.events} /> : <p className='text-destructive'>Workflow timeline could not be loaded.</p>}</div></div></Main></>
}

