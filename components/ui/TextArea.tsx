import * as React from 'react'

interface TextAreaProps {
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  onChange?: (value: string) => void;
}

export default function TextArea({
  placeholder,
  defaultValue,
  isReadOnly,
  value,
  onChange,
  onKeyDown,
  onMouseUp,
}: TextAreaProps) {
  const [height, setHeight] = React.useState(0);
  const el = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (el.current != null) {
      setHeight(el.current.scrollHeight);
    }
  }, []);

  return (
    <textarea
      ref={el}
      style={{ height }}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onKeyDown={onKeyDown}
      onMouseUp={onMouseUp}
      disabled={isReadOnly}
      onInput={() => {
        if (el.current != null) {
          setHeight(el.current.scrollHeight);
        }
      }}
      value={value}
      onChange={(e) => onChange?.(e.currentTarget.value)}
      className={`p-2 rounded-md outline-none w-full bg-slate-100 focus:bg-slate-200 h-[auto] text-slate-600 ${
        isReadOnly ? 'cursor-not-allowed' : ''
      }`}
    />
  );
}