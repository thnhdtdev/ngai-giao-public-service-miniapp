import { MINI_APP_ID } from "@constants/common";
import Routes from "@pages";
import { useStore } from "@store";
import React, { useEffect } from "react";
import { App, SnackbarProvider } from "zmp-ui";
import Auth from "./Auth";

const MyApp = () => {
    const token = useStore(state => state.token);

    const [, getOrganization] = useStore(state => [
        state.organization,
        state.getOrganization,
    ]);

    const getOrg = async () => {
        try {
            await getOrganization({ miniAppId: MINI_APP_ID });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (token) {
            getOrg();
        }
    }, [token]);

    return (
        <App>
            <SnackbarProvider>
                <Auth />
                <Routes />
            </SnackbarProvider>
        </App>
    );
};
export default MyApp;
