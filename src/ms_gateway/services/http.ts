import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config';

export const proxyOptions = (target: string) => ({
    target,
    changeOrigin: true,
    onError: (err: Error, req: any, res: any) => {
        console.error(`Proxy error: ${err.message}`);
        res.status(500).json({ error: 'Сервис временно недоступен' });
    }
});

export const usersProxy = createProxyMiddleware(proxyOptions(config.SERVICES.USERS));
export const editorProxy = createProxyMiddleware(proxyOptions(config.SERVICES.EDITOR));
export const logsProxy = createProxyMiddleware(proxyOptions(config.SERVICES.LOGS));