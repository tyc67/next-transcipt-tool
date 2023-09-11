import * as React from 'react'

export const NAV_HEIGHT = '4rem'
export const NAV_HEIGHT_BOX = '(9.5rem - 4rem)'

export default function FixedHeightLayout({
  ...props
}: React.HTMLProps<HTMLDivElement> & { tagName?: any }) {
  const clonedProps = { ...props }
  delete clonedProps.tagName
  return React.createElement(props.tagName ?? 'div', {
    ...clonedProps,
    style: { ...props.style, height: `calc(100vh - ${NAV_HEIGHT_BOX})` },
  })
}
