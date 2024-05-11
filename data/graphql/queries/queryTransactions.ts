import { gql } from '@apollo/client';

export type QueryTransactionsVariables = {
  limit?: number;
};

export type QueryTransactionsResponse = {
  transaction: {
    id: string;
    date: string;
    from_id: string;
    to_id: string;
  }[];
};

const QUERY_TRANSACTIONS = gql`
  query MyQuery($limit: Int) {
    transaction(limit: $limit) {
      id
      date
      from_id
      to_id
    }
  }
`;

export default QUERY_TRANSACTIONS;
