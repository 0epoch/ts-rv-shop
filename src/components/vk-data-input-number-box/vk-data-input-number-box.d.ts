import { Component } from '@uni-helper/uni-app-types'

export type InputNumberBox = Component<InputNumberBoxProps>

export type InputNumberBoxInstance = InstanceType<InputNumberBox>

export type InputNumberBoxProps = {
  modelValue: number
  min: number
  max: number
  step: number
  disabled: boolean
  inputWidth: string | number
  inputHeight: string | number
  bgColor: string
  index: number
  onChange: (event: InputNumberBoxEvent) => void
  onBlur: (event: InputNumberBoxEvent) => void
  onPlus: (event: InputNumberBoxEvent) => void
  onMinus: (event: InputNumberBoxEvent) => void
}

export type InputNumberBoxEvent = {
  value: number
  index: string
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'vk-data-input-number-box': InputNumberBox
  }
}
