import type { NextApiRequest, NextApiResponse } from 'next';
import { BithumbApiResponse, axiosBithumbClient } from '.';

export type BithumbNetworkInfoApiData = Readonly<{
  net_name: string;
  net_type: string;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const endpoint = '/public/network-info';

  const response = await axiosBithumbClient
    .get<BithumbApiResponse<readonly BithumbNetworkInfoApiData[]>>(endpoint)
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
