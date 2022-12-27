import { type CSSAttribute, extractCss, css as gooberCss } from 'goober'
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

import { DefaultTheme, useDecoRock } from './context'

type PropsType<T extends ValidComponent, P> = ComponentProps<T> & {
  class?: string | undefined
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

export const renderStyle = (target?: Element) => `<style id="_goober">${extractCss(target)}</style>`
export { extractCss }

export const css = (
  styles: TemplateStringsArray | CSSAttribute | (() => string | CSSAttribute),
  ...args: any[]
) => {
  const { build } = useDecoRock()
  const s = typeof styles === 'function' ? styles() : styles
  const p = args.map((f) => (build || ((p) => p))(typeof f === 'function' ? f() : f))
  return gooberCss(s, ...p)
}

const makeStyled = <T extends ValidComponent>(
  tag: T,
  opt?: { g: number; d: boolean },
): MakeStyle<T> => {
  return (styles, ...args) =>
    (props) => {
      const [local, others] = splitProps(props, ['as', 'class'])
      const { theme, build } = useDecoRock()
      const withTheme = mergeProps(props, { theme })
      const className = createMemo(() => {
        const c = local.class,
          o = local.class && /^go[0-9]+/.test(c)
        const s = typeof styles === 'function' ? styles(withTheme as any) : styles
        const p = args.map((f) =>
          (build || ((p) => p))(typeof f === 'function' ? f(withTheme as any) : f),
        )
        return [local.class, gooberCss.apply({ o, g: opt?.g }, [s, ...p])].filter(Boolean).join(' ')
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
