import { GraphQLClient } from 'graphql-hooks';
import memCache from 'graphql-hooks-memcache';

import api from 'core/api';

const client = new GraphQLClient({
  url: api.url('graphql'),
  cache: memCache({ size: 1000 }),
});

export default client;
