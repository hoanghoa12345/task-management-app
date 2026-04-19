import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AuditLog } from "@/db/types";
import { generateLogMessage } from "@/lib/log-message";

interface IActivityItemProps {
  data: AuditLog;
}
const ActivityItem = ({ data }: IActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.userImage!} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">
            {data.userName}
          </span>
          <span className="ml-1">{generateLogMessage(data)}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(data.createdAt!).toISOString().replace("T", " ").slice(0, 16)}
        </p>
      </div>
    </li>
  );
};

export default ActivityItem;