import { AuthParamsInterface } from "./auth-params.interface";

export interface AuthInterface{
    jsonrpc: string, 
    params: AuthParamsInterface;
}