import type { Properties as CSSProperties } from 'csstype'
import { css } from 'goober'
import { ComponentProps, createMemo, JSX, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { DefaultTheme, useTheme } from './theme'

type PropsType<T extends keyof JSX.IntrinsicElements, P> = ComponentProps<T> & {
  class?: string
} & P

type StyledPlaceholder<T extends keyof JSX.IntrinsicElements, P = {}> = (
  p: PropsType<T, P> & { theme: DefaultTheme },
) => any

const makeStyled = <T extends keyof JSX.IntrinsicElements>(tag: T) => {
  return <P,>(
    styles:
      | TemplateStringsArray
      | CSSProperties
      | ((props: PropsType<T, P> & { theme: DefaultTheme }) => string | CSSProperties),
    ...args: StyledPlaceholder<T, P>[]
  ) => {
    const Comp = (props: PropsType<T, P>) => {
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
    return Comp
  }
}

export type StyledFn = typeof makeStyled & {
  [element in keyof JSX.IntrinsicElements]: ReturnType<typeof makeStyled>
}

export const styled = new Proxy(makeStyled, {
  get(target, tag: keyof JSX.IntrinsicElements) {
    return target(tag)
  },
}) as StyledFn
