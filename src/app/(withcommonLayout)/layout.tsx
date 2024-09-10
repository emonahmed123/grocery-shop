

import Footer from '@/components/Shared/Footer';
import NavbarMain from '@/components/Shared/NavbarMain';



import React from 'react';

const Commonlayout = ({ children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        < >
            <NavbarMain />


            <div>{children}</div>

            <Footer></Footer>
        </>
    );
};

export default Commonlayout 