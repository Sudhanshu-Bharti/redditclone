"use client"
import { ExtendedPost } from "@/types/db"
import { FC, useRef } from "react"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import axios from "axios"
import { useSession } from "next-auth/react"
import Post from "./Post"

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string //optional
}

//infinite scroll + data feed
//adding a ref to the last post visible
const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  //importing from mantine
  const lastPostRef = useRef<HTMLElement>(null)
  //ref - assigning the post , entry- if we r currently intersecting the post or not
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    //query key
    ["infinite-query"],

    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "")

      const { data } = await axios.get(query)
      return data as ExtendedPost[]
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    },
  )
  //if page is not defined or null then we r  render the initialPosts
  const posts = data?.pages.flatMap((page) => page) ?? initialPosts

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce(
          (acc: number, vote: { type: string }) => {
            if (vote.type === "UP") return acc + 1
            if (vote.type === "DOWN") return acc - 1
            return acc
          },
          0,
        )

        //checking if the user have already voted or not
        const currentVote = post.votes.find(
          //  @ts-ignore
          (vote) => vote.userId === session?.user.id,
        )

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                commentAmt={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          )
        } else {
          return (
            <Post
              commentAmt={post.comments.length}
              post={post}
              subredditName={post.subreddit.name}
              key={post.id}
            />
          )
        }
      })}
    </ul>
  )
}

export default PostFeed
