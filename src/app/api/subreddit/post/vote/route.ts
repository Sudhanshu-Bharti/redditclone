//caching data logic . fetch the data quickly

import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { PostVoteValidator } from "@/lib/validators/vote"
import type { CachedPost } from "@/types/redis"

export async function PATCH(req: Request) {
  const CACHE_AFTER_UPVOTES = 1

  try {
    const body = req.json()

    const { postId, voteType } = PostVoteValidator.parse(body)

    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    })

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!post) {
      return new Response("Post not found", { status: 404 })
    }
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        })
      }
      return new Response("OK")
    }

    await db.vote.update({
      where: {
        userId_postId: {
          postId,
          userId: session.user.id,
        },
      },
      data: {
        type: voteType,
      },
    })

    //recount a vote , caching
    const voteAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1
      if (vote.type === "DOWN") return acc - 1
      return acc
    }, 0)
    // if (voteAmt >= CACHE_AFTER_UPVOTES) {
    //   const cachePayload : CachedPost = {

    //   }
    // }
  } catch (error) {}
}
