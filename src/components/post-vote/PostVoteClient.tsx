"use client"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { usePrevious } from "@mantine/hooks"
import { VoteType } from "@prisma/client"
import { FC, useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { cn } from "../../../@lib/shadcn"
import { useMutation } from "@tanstack/react-query"
import { PostVoteRequest } from "@/lib/validators/vote"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

interface PostVoteClientProps {
  postId: string
  initialVotesAmt: number
  initialVote?: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)

  //what if it fails to update the vote , then we will fetch the prev vote
  const prevVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  //fetching the upvote/downvote
  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      }
      //updating
      await axios.patch("/api/subreddit/post/vote", payload)
    },
    onError: (err, VoteType) => {
      if (VoteType === "UP") setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      //reset current vote
      setCurrentVote(prevVote)
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Vote not recognized",
        variant: "destructive",
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)
        if (type === "UP") setVotesAmt((prev) => prev - 1)
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1)
      } else {
        setCurrentVote(type)
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>
      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient
