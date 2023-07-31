import * as React from 'react'

interface InputProps {
  value: string;
  placeholder: string;
  isReadOnly?: boolean;
  onChange: (value: string) => void;
}

export default function Input({ value, placeholder, isReadOnly, onChange }: InputProps) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => {
    setDraft(value);
  }, [value]);
  return (
    <input
      className="outline-none px-4 py-2 text-slate-600 bg-slate-200 rounded-md focus:bg-white w-full"
      placeholder={placeholder}
      disabled={isReadOnly}
      value={draft}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        }
      }}
      onChange={(e) => {
        const value = e.currentTarget.value ?? '';
        setDraft(value);
      }}
      onBlur={() => {
        onChange(draft);
      }}
    />
  );
}