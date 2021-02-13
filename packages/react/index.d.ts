export interface PathContext {
    get: (path: string) => string;
}

export interface PathProviderProps extends PathContext {
    children: React.ReactNode;
}

export const PathProvider: React.ComponentType<PathProviderProps>
export const PathContext: React.Context<PathContext>;
export const usePath: () => PathContext;
