'use client'

import { Difficulty } from '@/constants'
import { Spelled } from '@/types'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@radix-ui/react-collapsible'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EraserIcon,
  QuestionMarkCircledIcon,
  TargetIcon,
} from '@radix-ui/react-icons'
import { useState } from 'react'

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
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1 p-1 bg-gray-500 rounded-lg text-xs hover:bg-gray-600">
            {data.input}
          </div>
          <div className="flex items-center gap-1 text-gray-200 text-xs">
            <EraserIcon /> {data.corrections.length}개 수정
          </div>
          <div className="flex gap-1 items-center">
            <span className="inline-flex gap-1 p-0 py-0.5 rounded-lg text-xs font-medium">
              <TargetIcon />
              {data.score}점
            </span>
          </div>
        </div>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center w-[20px] h-[20px] rounded-lg hover:bg-gray-400 aspect-square cursor-pointer"
          >
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="p-4 border-t border-gray-800">
          {data.corrections.map((correction, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1 text-xs">
                  <QuestionMarkCircledIcon />
                  {Difficulty.toHangul(correction.difficulty)}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="p-1 py-0.5 bg-red-200 text-red-600 rounded-lg">
                    {correction.wrong}
                  </span>
                  →
                  <span className="p-1 py-0.5 bg-green-200 text-green-600 rounded-lg font-medium">
                    {correction.correct}
                  </span>
                </div>
              </div>
              <p>{correction.explanation}</p>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
