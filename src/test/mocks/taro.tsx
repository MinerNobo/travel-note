import React from "react";

export const View: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
}) => <div className={className}>{children}</div>;

export const Text: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span>{children}</span>
);

// Mock other Taro components and APIs as needed
export const useLoad = (callback: () => void) => {
  React.useEffect(() => {
    callback();
  }, [callback]);
};
