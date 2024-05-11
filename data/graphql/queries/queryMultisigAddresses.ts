import { gql } from '@apollo/client';

export type QQueryMultisigAddressesVariables = {
  limit?: number;
};

export type QueryMultisigAddressesResponse = {
  multisig: {
    id: string;
    __typename: 'multisig';
  }[];
};

const QUERY_MULTISIG_ADDRESSES = gql`
  query CountMultisigAddresses($limit: Int) {
    multisig(limit: $limit) {
      id
    }
  }
`;

export default QUERY_MULTISIG_ADDRESSES;
