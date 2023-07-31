'use client'

import * as React from 'react'
import { BulbOutlined, CheckCircleFilled, FireOutlined } from '@ant-design/icons';
import FixedHeightLayout from './ui/FixedHeightLayout'
import KeyboardHint from './ui/KeyboardHint';
import TextArea from './ui/TextArea';
import DefaultQA from './defalutQA';

export default function ActivityDetail() {
  return (
    <>
      <FixedHeightLayout className="m-0 flex flex-1 flex-col overflow-y-auto rounded-md bg-white p-0">
        <DefaultQA />
        <div className="sticky left-0 top-0 flex flex-col justify-between gap-4 bg-white p-4 shadow-sm">
          <span className="flex flex-col gap-2 text-sm text-slate-600">
            <b className="flex items-center gap-2">
              <BulbOutlined /> Compose a new message
            </b>
            <blockquote className="flex w-full flex-row items-center gap-2 whitespace-normal rounded-md bg-blue-50 p-2 px-4 text-sm">
              Type <KeyboardHint>cmd</KeyboardHint> + <KeyboardHint>enter</KeyboardHint> to save{' '}
            </blockquote>
            <TextArea />
            {/* <MessageBlock
              submitIcon={<CheckCircleFilled />}
              resetOnSubmit
              pendingContent={pendingContent.new}
              content=""
              onSubmit={onCreateMessage}
            /> */}
          </span>
        </div>
      </FixedHeightLayout>
    </>
  )
}
