import { css, type CSSAttribute } from 'goober'
import { Component, ComponentProps, createMemo, JSX, splitProps, ValidComponent } from 'solid-js'
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
      const className = createMemo(() => {
        const c = local.class,
          o = local.class && /^go[0-9]+/.test(c)
        const p = { ...props, theme }
        return [
          local.class,
          css.apply({ o, g }, [
            typeof styles === 'function' ? styles(p) : styles,
            ...args.map((f) => f(p)),
          ]),
        ]
          .filter(Boolean)
          .join(' ')
      })
      const t = createMemo(() => local.as || tag)
      return (
        <Dynamic
          component={t()}
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
