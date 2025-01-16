'use client'

import { usePathname, useRouter } from 'next/navigation';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { ToastContainer } from 'react-toastify';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();

    // Check if the current page is login or register
    const isAuthPage = pathname === '/';

    return (
        <>
            <ToastContainer />
            {!isAuthPage && <Header />}
            <main>{children}</main>
            {!isAuthPage && <Footer />}
        </>
    );
};

export default LayoutWrapper;
