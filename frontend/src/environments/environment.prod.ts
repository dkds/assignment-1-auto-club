export const environment = {
  production: true,
  apiHost: `http://${process.env['BACKEND_HOST'] || 'localhost'}:${process.env['BACKEND_PORT'] || '3000'}`,
  fileDownloadLink: `http://${process.env['BACKEND_HOST'] || 'localhost'}:${process.env['BACKEND_PORT'] || '3000'}/export/download`,
  socketcluster: {
    hostname: process.env['SOCKETCLUSTER_HOST'] || 'localhost',
    port: process.env['SOCKETCLUSTER_PORT'] || 3000,
  }
};
