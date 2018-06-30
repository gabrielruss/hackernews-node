const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

// https://www.howtographql.com/graphql-js/1-getting-started/

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    }
    // link: (root, { id }) => links.find(link => link.id === id)
  },

  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            description: args.description
          }
        },
        info
      );
    }
    // updateLink: (root, { id, url, description }) => {
    //   let link = Object.assign({}, links.find(link => link.id === id), {
    //     url,
    //     description
    //   });
    //   links = [...links.filter(link => link.id !== id), link];
    //   return link;
    // },
    // deleteLink: (root, { id }) => {
    //   links = [...links.filter(link => link.id !== id)];
    //   return;
    // }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://us1.prisma.sh/public-pinkdog-479/hackernews-node/dev",
      secret: "mysecret123",
      debug: true
    })
  })
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
