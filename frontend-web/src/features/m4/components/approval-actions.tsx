import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { actOnApproval } from '../api'

export function ApprovalActions({
  approvalId,
  onComplete,
}: {
  approvalId: string
  onComplete: () => void
}) {
  const [action, setAction] = useState<'approve' | 'reject' | 'request-revision' | null>(null)
  const [comment, setComment] = useState('')
  const [isPending, setIsPending] = useState(false)
  const requiresComment = action === 'reject' || action === 'request-revision'

  async function submit() {
    if (!action || (requiresComment && !comment.trim())) return
    setIsPending(true)
    try {
      await actOnApproval(approvalId, action, comment.trim() || undefined)
      toast.success(action === 'approve' ? 'Approval recorded' : 'Workflow action recorded')
      setAction(null)
      setComment('')
      onComplete()
    } catch {
      toast.error('Unable to update this approval. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap gap-2'>
        <Button disabled={isPending} onClick={() => setAction('approve')}>Approve</Button>
        <Button disabled={isPending} variant='destructive' onClick={() => setAction('reject')}>Reject</Button>
        <Button disabled={isPending} variant='outline' onClick={() => setAction('request-revision')}>Request revision</Button>
      </div>
      {action && (
        <div className='space-y-2 rounded-lg border bg-muted/30 p-3'>
          <p className='text-sm font-medium'>
            {action === 'approve' ? 'Optional comment' : 'Reason (required)'}
          </p>
          <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder='Add context for the workflow history' />
          <div className='flex gap-2'>
            <Button disabled={isPending || (requiresComment && !comment.trim())} onClick={submit}>
              {isPending ? 'Saving...' : 'Confirm'}
            </Button>
            <Button variant='ghost' disabled={isPending} onClick={() => setAction(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}

