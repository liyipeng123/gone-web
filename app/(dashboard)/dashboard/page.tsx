import { getCurrentUser } from '@/lib/session'
import { EmptyPlaceholder } from '@/components/dashboard/empty-placeholder'
import { DashboardHeader } from '@/components/dashboard/header'
import { PostCreateButton } from '@/components/dashboard/post-create-button'
import { PostItem } from '@/components/dashboard/post-item'
import { DashboardShell } from '@/components/dashboard/shell'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getDraftPostByCid } from '@/models/posts'
import { type Key } from 'react'

export const metadata = {
  title: 'Dashboard'
}

export default async function DashboardPage () {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const posts: any = await prisma.posts.findMany({
    where: {
      uid: parseInt(user.id),
      type: 'post',
      status: {
        not: 'deleted'
      }
    },
    select: {
      cid: true,
      title: true,
      created: true,
      status: true
    },
    orderBy: {
      modified: 'desc'
    }
  })

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const draft = await getDraftPostByCid(post.cid)
    if (draft) {
      post.draft = draft
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton/>
      </DashboardHeader>
      <div>
        {((posts?.length) !== 0)
          ? (
            <div className="divide-y divide-border rounded-md border">
              {posts.map((post: { cid: Key | null | undefined }) => (
                <PostItem key={post.cid} post={post}/>
              ))}
            </div>
            )
          : (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="post"/>
              <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                You don&apos;t have any posts yet. Start creating content.
              </EmptyPlaceholder.Description>
              <PostCreateButton variant="outline"/>
            </EmptyPlaceholder>
            )}
      </div>
    </DashboardShell>
  )
}
