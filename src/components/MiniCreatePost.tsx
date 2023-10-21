"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <li className="overflow-hidden rounded-md bg-white shadow">
        <div className="h-full px-6 py-4 flex  justify-between gap-6">
          <div className="relative">
            <UserAvatar
              user={{
                name: session?.user.name || null,
                image: session?.user.image || null,
              }}
            />
            <span className="top-0 left-4 absolute  w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
          </div>
          <Input
            readOnly
            onClick={() => router.push(pathname + "/submit")}
            placeholder="Create post"
          />
          <Button
            variant="ghost"
            onClick={() => router.push(pathname + "/submit")}
          >
            <ImageIcon className="text-zinc-600" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push(pathname + "/submit")}
          >
            <Link2 className="text-zinc-600" />
          </Button>
        </div>
      </li>
    </div>
  );
};

export default MiniCreatePost;
