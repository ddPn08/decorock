import { Component, createContext, JSX, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

export interface DefaultTheme {}

const StyleContext = createContext({} as DefaultTheme)

export const ThemeProvider: Component<{ children: JSX.Element; theme: DefaultTheme }> = (props) => {
  return <StyleContext.Provider value={props.theme}>{props.children}</StyleContext.Provider>
}

export const useTheme = () => useContext(StyleContext)

export const createThemeStore = (theme: DefaultTheme) => createStore(theme)
