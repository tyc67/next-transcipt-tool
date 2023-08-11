import FixedHeightLayout from '@/components/ui/FixedHeightLayout'

export default function WorkSpace({ children }: { children: React.ReactNode }) {
  return (
    <FixedHeightLayout className="m-0 flex flex-1 flex-col gap-4 rounded-md bg-white p-4">
      {children}
    </FixedHeightLayout>
  )
}
