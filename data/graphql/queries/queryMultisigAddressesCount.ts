import { gql } from '@apollo/client';

export type QueryMultisigAddressesCountResponse = {
  multisig_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

const QUERY_MULTISIG_ADDRESSES_COUNT = gql`
  query CountMultisigAddresses {
    multisig_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export default QUERY_MULTISIG_ADDRESSES_COUNT;
