import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(request: Request) {
    const formData = await request.formData()
    const amount = String(formData.get('amount'))
    // const password = String(formData.get('password'))
    // const { userId, stockId, quantity } = req.body;
    console.log(amount)

    // try {
    //   // Start a Supabase transaction
    //   const { data, error } = await supabase.rpc('purchase_stock', {
    //     userId,
    //     stockId,
    //     quantity,
    //   });

    //   if (error) {
    //     throw new Error(error.message);
    //   }

    //   // Assuming your stored procedure returns updated data, you can send it to the client
    //   res.status(200).json({ data });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'Internal Server Error' });
    // }
    // } else {
    //     res.status(405).json({ error: 'Method Not Allowed' });
    // }
};
