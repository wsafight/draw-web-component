export const isBrowser = () => {
    return 'window' in globalThis && 'document' in globalThis;
}