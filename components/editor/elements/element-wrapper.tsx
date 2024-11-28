import React from 'react';

type ELementWrapperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {};

export const ELementWrapper: React.FC<ELementWrapperProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};
