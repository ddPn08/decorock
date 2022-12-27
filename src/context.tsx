import { Component, createContext, JSX, splitProps, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

export interface DefaultTheme {}

type Context = {
  theme: DefaultTheme
  build?: (props: any) => any
}

const DecoRockContext = createContext({} as Context)

export const DecoRockProvider: Component<{ children: JSX.Element } & Context> = (props) => {
  const [local, others] = splitProps(props, ['children'])
  return <DecoRockContext.Provider value={others}>{local.children}</DecoRockContext.Provider>
}

export const useDecoRock = () => useContext(DecoRockContext)
export const useTheme = () => useDecoRock().theme

export const createThemeStore = (theme: DefaultTheme) => createStore(theme)
