import { authOption } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';

const Dashboard = async () => {
    const session = await getServerSession(authOption)


    return (

        <div>
            <h1>
                {session?.user?.name}
            </h1>
        </div>
    );
};

export default Dashboard;