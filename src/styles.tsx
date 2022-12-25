import { extractCss } from 'goober'

export const renderStyle = (target?: Element) => `<style id="_goober">${extractCss(target)}</style>`
export { extractCss }
