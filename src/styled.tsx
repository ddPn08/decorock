import type { Properties as CSSProperties } from 'csstype'
import { css } from 'goober'
import { Component, ComponentProps, createMemo, JSX, splitProps, ValidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { DefaultTheme, useTheme } from './theme'

type PropsType<T extends ValidComponent, P> = ComponentProps<T> & {
  class?: string
} & P

type StyledPlaceholder<T extends ValidComponent, P = {}> = (
  p: PropsType<T, P> & { theme: DefaultTheme },
) => any

type MakeStyle<T extends ValidComponent> = <P>(
  styles:
    | TemplateStringsArray
    | CSSProperties
    | ((props: PropsType<T, P> & { theme: DefaultTheme }) => string | CSSProperties),
  ...args: StyledPlaceholder<T, P>[]
) => Component<PropsType<T, P>>

const makeStyled = <T extends ValidComponent>(tag: T): MakeStyle<T> => {
  return (styles, ...args) =>
    (props) => {
      const [local, others] = splitProps(props, ['class'])
      const theme = useTheme()
      const className = createMemo(() => {
        const style =
          typeof styles === 'function'
            ? styles({ ...props, theme })
            : Array.isArray(styles)
            ? styles.reduce((a, b, i) => {
                const fn = args[i - 1]
                return a + fn?.({ ...props, theme }) + b
              })
            : styles
        return local.class ? `${local.class} ` : '' + css(style)
      })
      return (
        <Dynamic
          component={tag}
          {...({
            ...others,
            class: className(),
          } as any)}
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
