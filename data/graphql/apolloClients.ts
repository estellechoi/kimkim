import {ApolloClient, InMemoryCache, createHttpLink, type NormalizedCacheObject, ApolloClientOptions, ApolloLink, from} from "@apollo/client";

export type AppApolloClients = {
  appApolloClient: ApolloClient<NormalizedCacheObject>;
};

const APP_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_APP_TESTNET ?? '';
const APP_GRAPHQL_JWT = process.env.NEXT_PUBLIC_HASURA_JWT_CONSTANTINE_3;

const getApolloClient = (httpURI: string, options?: { headers?: Record<string, string>, jwt?: string }): ApolloClient<NormalizedCacheObject> => {
  const httpLink = createHttpLink({
    uri: httpURI,
  });

  //const wsLink = new GraphQLWsLink(
  //createClient({
  //url: httpURI.replace("https", "wss"),
  //connectionParams: jwt ? () => {
  //return {
  //headers: {
  //Authorization: `Bearer ${jwt}`,
  //},
  //};
  //} : undefined,
  //})
  //);

  const authMiddleware = new ApolloLink((operation, forward) => {
    const { jwt } = options ?? {};

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(options?.headers ?? {}),
        Authorization: jwt ? `Bearer ${jwt}` : null,
      }
    }));
  
    return forward(operation);
  })

  //const splitLink = split(
  //({query}) => {
  //const definition = getMainDefinition(query);
  //return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  //},
  //wsLink,
  //authLink?.concat(httpLink) ?? httpLink,
  //);

  const client = new ApolloClient({
    //link: splitLink,
    cache: new InMemoryCache(),
    link: from([authMiddleware, httpLink]),
  });

  return client;
}

const apolloClients: AppApolloClients = {
  appApolloClient: getApolloClient(APP_GRAPHQL_ENDPOINT, { jwt: APP_GRAPHQL_JWT }),
};

export default apolloClients;