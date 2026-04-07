import { formatFullName } from "@/lib/utils";

type LikedByProps = {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  label: string;
};

export function LikedBy({ users, label }: LikedByProps) {
  return (
    <details className="_app_liked_by">
      <summary>
        {users.length
          ? `${users.length} ${users.length === 1 ? `${label} like` : `${label} likes`}`
          : `No ${label} likes yet`}
      </summary>
      {users.length ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{formatFullName(user.firstName, user.lastName)}</strong>
              <span>{user.email}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </details>
  );
}
