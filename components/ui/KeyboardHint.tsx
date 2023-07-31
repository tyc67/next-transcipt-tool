import React from 'react';

export default React.memo(function KeyboardHint({ children }: React.PropsWithChildren) {
  return (
    <kbd className="bg-white border-b-4 min-w-[1.5rem] p-1 px-2 cursor-default text-center rounded-md hover:border-none">
      {children}
    </kbd>
  );
});