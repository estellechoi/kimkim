import { Coin } from "@cosmjs/stargate";

export type BlockId = {
    hash: string;
    parts: {
      total: number;
      hash: string;
    };
  };
  
  export type BlockHeader = {
    version: {
      block: string;
      app: string;
    };
    chain_id: string;
    height: string;
    time: string;
    last_block_id: BlockId;
    last_commit_hash: string;
    data_hash: string;
    validators_hash: string;
    next_validators_hash: string;
    consensus_hash: string;
    app_hash: string;
    last_results_hash: string;
    evidence_hash: string;
    proposer_address: string;
  };
  
  export type Block = {
    header: BlockHeader;
    data: {
      txs: string[] | null;
    };
    evidence: any[];
    last_commit: {
      height: string;
      round: number;
      block_id: BlockId;
      signatures: any[];
    };
  };
  
  export type LatestBlockResponse = {
    block_id: BlockId;
    block: Block;
  };

  export type BalancesResponse = {
    balances: readonly Coin[] | undefined;
  };
