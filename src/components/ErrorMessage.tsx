import React from 'react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p>{message}</p>
    </div>
  );
}
