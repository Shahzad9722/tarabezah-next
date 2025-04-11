import { createContext, useContext, useState } from "react";
import GlobalLoader from "@/app/components/ui/loader";

const LoaderContext = createContext({
    showLoader: () => { },
    hideLoader: () => { },
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
            {loading && <GlobalLoader />}
            {children}
        </LoaderContext.Provider>
    );
};