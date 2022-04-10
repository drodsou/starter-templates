declare const fs: any;
declare const path: any;
declare const express: any;
declare const createViteServer: any;
declare const isProd: boolean;
declare const SERVER_PORT = 3000;
declare const CLIENT_OUT: any;
declare const RENDER_PAGE_PATH: string;
declare const INDEX_HTML_PATH: any;
declare function createServer(): Promise<void>;
declare function autoreloadMdPlugin(): {
    name: string;
    enforce: string;
    handleHotUpdate({ file, server }: {
        file: any;
        server: any;
    }): void;
};
