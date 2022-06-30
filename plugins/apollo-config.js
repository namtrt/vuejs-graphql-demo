import { onError } from '@apollo/client/link/error';
import { createHttpLink, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export default function (context) {
  const httpEndpoint = 'http://localhost:8000/graphql';

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  const httpLink = createHttpLink({
    uri: httpEndpoint,
  });

  const authLink = setContext((_, { headers }) => {
    let token = '';
    if (!process.server) {
      token = localStorage.getItem('access-token');
    }
    return {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        Authorization: 'Basic ' + token,
      },
    };
  });

  return {
    link: from([errorLink, authLink, httpLink]),
    defaultHttpLink: false,
  };
}
