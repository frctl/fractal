export interface PathContext {
    get: (path: string) => string;
}

export interface PathProviderProps extends PathContext {
    children: React.ReactNode;
}

export namespace components {
    const PathProvider: React.ComponentType<PathProviderProps> & {
        PathContext: React.Context<PathContext>,
        usePath: () => PathContext,
    };
}
