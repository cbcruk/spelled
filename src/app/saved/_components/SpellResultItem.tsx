'use client'

import { Difficulty } from '@/constants'
import { Spelled } from '@/types'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@radix-ui/react-collapsible'
import {
  ArrowRightIcon,
  CheckCircledIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DividerVerticalIcon,
  TargetIcon,
} from '@radix-ui/react-icons'
import { useState } from 'react'
import { SpellResultItemInputWithMark } from './SpellResultItemInputText'
import { SpellResultItemDelete } from './SpellResultItemDelete'

type SpellResultItemProps = {
  data: Spelled
}

export function SpellResultItem({ data }: SpellResultItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border border-gray-800 rounded-lg text-sm"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-2 pr-4">
          <SpellResultItemInputWithMark
            marked={data.corrections.map((correction) => correction.wrong)}
          >
            {data.input}
          </SpellResultItemInputWithMark>
          <div className="flex gap-2">
            <div className="flex gap-1 items-center">
              <span className="inline-flex items-center gap-1 p-0 py-0.5 rounded-lg text-xs font-medium">
                <TargetIcon />
                {data.score}점
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-200 text-xs">
              <CheckCircledIcon /> {data.corrections.length}개
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-center w-[20px] h-[20px] rounded-lg hover:bg-gray-400 aspect-square cursor-pointer"
            >
              {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <div className="flex flex-col gap-4 p-4 border-t border-gray-800">
          <div className="flex justify-between items-center gap-2 text-xs font-mono">
            <p className="inline-flex p-2 rounded-lg bg-gray-900 leading-relaxed">
              {data.corrected}
            </p>
            <div className="flex items-center gap-1">
              <SpellResultItemDelete id={data.id} />
            </div>
          </div>
          <hr className="border-gray-800" />
          {data.corrections.map((correction, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 text-xs">
                  <span className="p-1 py-0.5 bg-red-300 text-red-900 rounded-lg">
                    {correction.wrong}
                  </span>
                  <ArrowRightIcon />
                  <span className="p-1 py-0.5 bg-green-300 text-green-950 rounded-lg font-medium">
                    {correction.correct}
                  </span>
                </div>
                <DividerVerticalIcon />
                <span className="p-1 py-0.5 text-xs bg-purple-300 text-purple-800 rounded-lg font-medium">
                  {Difficulty.toHangul(correction.difficulty)}
                </span>
              </div>
              <p>{correction.explanation}</p>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
