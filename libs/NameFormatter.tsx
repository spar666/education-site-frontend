import { Tooltip } from 'antd';

interface IProps {
  firstName: string;
  lastName: string;
}

export function capitalizeInitials(str?: string) {
  if (!str) return '';
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

function NameFormatter({ firstName, lastName }: IProps) {
  return (
    <Tooltip
      title={capitalizeInitials(firstName) + ' ' + capitalizeInitials(lastName)}
    >
      {capitalizeInitials(firstName) +
        ' ' +
        capitalizeInitials(lastName?.[0]) +
        '.'}
    </Tooltip>
  );
}

export default NameFormatter;
