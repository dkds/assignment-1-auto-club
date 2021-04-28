const http = require("http");
const { postgraphile } = require("postgraphile");
const PostGraphileConnectionFilterPlugin = require("postgraphile-plugin-connection-filter")

http
  .createServer(
    postgraphile(process.env.DATABASE_URL, "public", {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      appendPlugins: [PostGraphileConnectionFilterPlugin],
      graphileBuildOptions: {
        connectionFilterRelations: true,
      },
    })
  )
  .listen(process.env.PORT);