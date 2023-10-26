import { z } from "zod"

export const PostVoteValidator = z.object({
  //post being votes for and wether it is a upvote or downvote
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
})

export type PostVoteRequest = z.infer<typeof PostVoteValidator>

export const CommentVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
})

export type CommentVoteValidator = z.infer<typeof CommentVoteValidator>
