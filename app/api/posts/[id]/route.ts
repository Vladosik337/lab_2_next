import { db, posts, users } from '@/db/schema/prepare'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Post schema for validation
const postUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  author_id: z.string().uuid().optional()
})

// GET /api/posts/[id] - Get a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author_id: posts.author_id,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        author: {
          id: users.id,
          name: users.name,
          username: users.username
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.author_id, users.id))
      .where(eq(posts.id, postId))
      .limit(1)

    if (post.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post[0])
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

// PATCH /api/posts/[id] - Update a post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    const body = await request.json()

    // Check if post exists
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Validate the request body
    const validatedData = postUpdateSchema.parse(body)

    // Update the post
    const updatedPost = await db
      .update(posts)
      .set({
        ...validatedData,
        updated_at: new Date()
      })
      .where(eq(posts.id, postId))
      .returning({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author_id: posts.author_id,
        updated_at: posts.updated_at
      })

    return NextResponse.json(updatedPost[0])
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 400 }
    )
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    // Check if post exists
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Soft delete the post by setting deleted_at
    await db
      .update(posts)
      .set({
        deleted_at: new Date()
      })
      .where(eq(posts.id, postId))

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
