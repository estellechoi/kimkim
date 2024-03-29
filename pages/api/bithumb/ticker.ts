import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosBithumbClient, getBithumbAuthorizedHeaders } from '.';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => {
    const endpoint = '/public/ticker/ALL_KRW';
    const authHeaders = getBithumbAuthorizedHeaders(endpoint);

    axiosBithumbClient.defaults.headers = {
      ...axiosBithumbClient.defaults.headers,
      ...authHeaders,
    };

    const response = await axiosBithumbClient.get<any>(endpoint).catch(err => {
      return { status: err.response?.status, data: err.response?.data };
    });

    res.status(response.status ?? 500).json(response.data);
  };
  
  export default handler;
