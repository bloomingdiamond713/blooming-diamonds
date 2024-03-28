import { formatDistanceToNow, parseISO } from "date-fns";

const TimeAgo = ({ timeStamp }) => {
  const date = parseISO(timeStamp);
  const timeAgo = formatDistanceToNow(date);
  return `${timeAgo} ago`;
};

export default TimeAgo;
