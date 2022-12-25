<h1 align="center">decorock</h1>

[![NPM Version](https://img.shields.io/npm/v/decorock.svg?style=for-the-badge)](https://www.npmjs.com/package/decorock)
![](https://img.shields.io/npm/dm/decorock.svg?style=for-the-badge)

---

Styled component library for solid.js

## Install

```
npm i decorock
```

## Usage

### `styled`

```tsx
const Heading = styled.('h1')`
  color: ${(p) => p.theme.color};
`

const Container = styled.div((p) => `
  background-color: ${p.theme.bg};
`)

const Paragraph = styled.p((p) => ({
  fontSize: p.theme.fontSize
}))

const Box = styled.div<{height: number}>`
  height: ${(p) => p.height};

  & > div {
    color: blue;
  }
`

<Box height={100} />
```

---

### `css`

```tsx
const Box = (props) => {
  return (
    <div
      class={css`
        background-color: aqua;
      `}
    >
      {props.children}
    </div>
  )
}
```

---

### `Theme`

```tsx
import { styled, createThemeStore, ThemeProvider } from 'decorock'

const [theme, setTheme] = createThemeStore({
  colors: {
    primary: 'aqua',
  },
})

const SomeText = styled.div`
  color: ${(props) => props.theme.colors.primary};
`

render(
  () => (
    <ThemeProvider theme={theme}>
      <SomeText>some text</SomeText>
    </ThemeProvider>
  ),
  document.getElementById('app'),
)
```

---

### `SSR`

```tsx
import { renderStyle } from 'decorock'

// After your app has rendered, just call it:
const styleTag = renderStyle()

// -> <style id="_goober">body { background-color: red; } .go000000000 {color: aqua;}</style>
```
