import { UserMenu } from "@/components/app-sidebar/user-menu";
import type { SessionUser } from "@/modules/auth/models/SignInDto";

type NavUserProps = {
  user?: SessionUser | null;
};

export function NavUser({ user }: NavUserProps) {
  return <UserMenu user={user} />;
}
