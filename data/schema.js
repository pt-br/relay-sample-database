import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import Database from './Database';
const database = new Database;

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    var { type, id } = fromGlobalId(globalId);
    if (type === 'Bottle') {
      return database.getBottle;
    } else {
      return null;
    }
  },

  (obj) => {
    if (obj instanceof Bottle)  {
      return BottleType;
    } else {
      return null;
    }
  }
);

/**
 * Defining types of Message and Bottle. A bottle contains messages, so we need to conect those types.
 */

const MessageType = new GraphQLObjectType({
  name: 'Message',
  description: 'Messages inside of a bottle',
  fields: () => ({
    id: globalIdField('Message'),
    messageId: {
      type: GraphQLInt,
      description: 'An ID used for database manipulation',
    },
    text: {
      type: GraphQLString,
      description: 'Text written on the message',
    },
  }),
  interfaces: [nodeInterface],
});

const BottleType = new GraphQLObjectType({
  name: 'Bottle',
  description: 'A bottle that contains messages inside',
  fields: () => ({
    id: globalIdField('Bottle'),

    // This is a connection, we must specify a type for that. I'll call it as 'messageConnection'.
    messages: {
      type: messageConnection,
      description: 'A couple message inside of the bottle',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(database.getMessages(), args),
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Here we are defining what messageConnection should connect to the Bottle
 */
const { connectionType: messageConnection } =
  connectionDefinitions({ name: 'Message', nodeType: MessageType });

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const Root = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    bottle: {
      type: BottleType,
      resolve: () => database.getBottle(),
    },
    message: {
      type: MessageType,
      args: {
        messageId: { type: GraphQLInt },
      },
      resolve: (source, { ...args }) => database.getMessageById(args.messageId),
    },
  }),
});

const InsertMessageMutation = mutationWithClientMutationId({
  name: 'InsertMessage',
  inputFields: {
    message: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    bottle: {
      type: BottleType,
      resolve: () => database.getBottle(),
    },
  },
  mutateAndGetPayload: ({ message }) => {
    const newMessage = database.insertMessage(message);
    return newMessage;
  },
});

const RemoveMessageMutation = mutationWithClientMutationId({
  name: 'RemoveMessage',
  inputFields: {
    messageId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    bottle: {
      type: BottleType,
      resolve: () => database.getBottle(),
    },
  },
  mutateAndGetPayload: ({ messageId }) => {
    const messages = database.removeMessageById(messageId);
    return messages;
  },
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    insertMessage: InsertMessageMutation,
    removeMessage: RemoveMessageMutation,
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});
