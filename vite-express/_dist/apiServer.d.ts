declare function queryAge({ age }: {
    age: number;
}): {
    age: number;
};
declare function queryName({ name }: {
    name: string;
}): {
    name: string;
};
declare const api: {
    queryAge: typeof queryAge;
    queryName: typeof queryName;
};
export default api;
export declare type Api = typeof api;
