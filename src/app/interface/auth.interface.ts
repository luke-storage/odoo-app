export interface AuthInterface{
    jsonrpc: string, 
    params: AuthParamsInterface;
}

export interface AuthParamsInterface{
    db: string;
    login: string; 
    password: string; 
}