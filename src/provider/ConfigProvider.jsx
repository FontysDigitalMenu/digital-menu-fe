import React, { createContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState();

    useEffect(() => {
        async function getConfig() {
            const response = await fetch('/config.json');
            const data = await response.json();
            setConfig(data);
        }

        getConfig();
    }, []);

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigContext;
