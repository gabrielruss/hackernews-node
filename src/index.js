const { GraphQLServer } = require("graphql-yoga");

// https://www.howtographql.com/graphql-js/1-getting-started/

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (root, { id }) => links.find(link => link.id === id)
  },

  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        url: args.url,
        description: args.description
      };
      links.push(link);
      return link;
    },
    updateLink: (root, { id, url, description }) => {
      let link = Object.assign({}, links.find(link => link.id === id), {
        url,
        description
      });
      links = [...links.filter(link => link.id !== id), link];
      return link;
    },
    deleteLink: (root, { id }) => {
      links = [...links.filter(link => link.id !== id)];
      return;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
