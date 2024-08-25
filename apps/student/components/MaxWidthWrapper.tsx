import { cn } from '../../../libs/utils';
import { ReactNode } from 'react';

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <div className={cn('w-full ', className)}>{children}</div>;
};

export default MaxWidthWrapper;
