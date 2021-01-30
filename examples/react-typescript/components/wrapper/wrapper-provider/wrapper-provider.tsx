import React from 'react';

export const WrapperContext = React.createContext({
    getValue: (value: string) => value,
});

interface WrapperProviderProps {
    children: React.ReactNode;
    getValue: (value: string) => string;
}

const WrapperProvider = (props: WrapperProviderProps): JSX.Element => {
    const { children, ...rest } = props;
    return <WrapperContext.Provider value={rest}>{children}</WrapperContext.Provider>;
};

export default WrapperProvider;
