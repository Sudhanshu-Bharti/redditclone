import { FC } from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarProps } from "@radix-ui/react-avatar";
import Image from "next/image";
import icons from "./icons";
interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            height="32"
            width="32"
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
