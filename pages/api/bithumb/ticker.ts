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

    const response = await axiosBithumbClient.get<any>(endpoint);
    res.status(response.status).json(response.data);
  };
  
  export default handler;
