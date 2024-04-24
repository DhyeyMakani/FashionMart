import { createContext, useContext } from "react"

let contexts={};

export function ContextProvider(props) 
{
    if(!contexts[props.name])
    {
        contexts[props.name]=createContext(null);
    }
    let context=contexts[props.name];
    return (
            <context.Provider value={props.value}>
                {props.children}
            </context.Provider>
    )
} 

export function useContextValue(name) {
    let context = contexts[name];
    console.log(useContext(context));
    return useContext(context);
}