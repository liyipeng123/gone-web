// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { type NextRequest, NextResponse } from 'next/server'
import { createPost, getDraftPostByCid, getPostMids, updatePostByCid } from '@/models/posts'

export async function POST (
  request: NextRequest,
  context: { params: { cid: string } }
) {
  const cid = parseInt(context.params.cid)
  const draftPost = await getDraftPostByCid(cid)

  const newDraft = await request.json()

  let res = null

  if (draftPost) {
    res = await updatePostByCid(draftPost.cid, { ...newDraft, slug: newDraft.slug?.startsWith('@') ? newDraft.slug : `@${newDraft.slug}`, draft: undefined, modified: Math.floor(Date.now() / 1000), relationships: undefined, cid: undefined, tags: undefined, category: undefined })
  } else {
    const mids = await getPostMids(cid)
    console.log(mids)
    res = await createPost({ ...newDraft, cid: undefined, slug: `@${newDraft.slug}`, parent: cid, type: 'post_draft', modified: Math.floor(Date.now() / 1000), draft: undefined, category: undefined, tags: undefined, relationships: { createMany: { data: mids.map(mid => ({ mid })) } } })
  }

  return NextResponse.json(res)
}
