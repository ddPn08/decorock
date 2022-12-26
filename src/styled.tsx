import { css, type CSSAttribute } from 'goober'
import {
  Component,
  ComponentProps,
  createMemo,
  JSX,
  mergeProps,
  splitProps,
  ValidComponent,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { DefaultTheme, useTheme } from './theme'

type PropsType<T extends ValidComponent, P> = ComponentProps<T> & {
  class?: string
  as?: ValidComponent
} & P

type StyledPlaceholder<T extends ValidComponent, P = {}> = (
  p: PropsType<T, P> & { theme: DefaultTheme },
) => any

type MakeStyle<T extends ValidComponent> = <P>(
  styles:
    | TemplateStringsArray
    | CSSAttribute
    | ((props: PropsType<T, P> & { theme: DefaultTheme }) => string | CSSAttribute),
  ...args: StyledPlaceholder<T, P>[]
) => Component<PropsType<T, P>>

const makeStyled = <T extends ValidComponent>(tag: T, g = 0): MakeStyle<T> => {
  return (styles, ...args) =>
    (props) => {
      const [local, others] = splitProps(props, ['as', 'class'])
      const theme = useTheme()
      const withTheme = mergeProps(props, { theme })
      const className = createMemo(() => {
        const c = local.class,
          o = local.class && /^go[0-9]+/.test(c)
        const s = typeof styles === 'function' ? styles(withTheme as any) : styles
        const p = args.map((f) => (typeof f === 'function' ? f(withTheme as any) : f))
        return [local.class, css.apply({ o, g }, [s, ...p])].filter(Boolean).join(' ')
      })
      return (
        <Dynamic
          component={(local.as || tag) as ValidComponent}
          {...(mergeProps(others, { class: className() }) as any)}
        />
      )
    }
}

export type StyledFn = typeof makeStyled & {
  [E in keyof JSX.IntrinsicElements]: MakeStyle<E>
}

export const styled = new Proxy(makeStyled, {
  get(target, tag: keyof JSX.IntrinsicElements) {
    return target(tag)
  },
}) as StyledFn
