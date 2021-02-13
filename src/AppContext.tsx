import React, {createContext, useReducer} from "react";

type MyState = {
    theme: string,
    another: string,
}

const initialState = { theme: 'in' };
const AppContext = createContext<any>({});
const { Provider } = AppContext;

export type ActionPayloadType =
    string
    | undefined;

export type ActionType = {
    readonly type: string;
    readonly payload?: ActionPayloadType;
}

const AppContextProvider = ({ children }: { children: any }) => {
    const [state, dispatch] = useReducer((state: any, action: ActionType) => {
        console.log(state)
        console.log(action)
        switch (action.type) {
            case 'ADD_ARTICLE':
                return Object.assign({}, state, action.payload);
            default:
                throw new Error();
        }
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { AppContext, AppContextProvider }