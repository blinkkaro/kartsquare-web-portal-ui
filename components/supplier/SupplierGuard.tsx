"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks"; // Assuming auth state is here or use secureStorage
import { secureStorage } from "@/helper/SecureStorage";
import { AppUserType } from "@/services/auth/auth.interface";
import { CircularProgress, Box } from "@mui/material";

interface SupplierGuardProps {
    children: React.ReactNode;
    requireComplete?: boolean; // If true, redirects to onboarding if incomplete
}

const SupplierGuard: React.FC<SupplierGuardProps> = ({ children, requireComplete = false }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    // We can use Redux selector if available, or just check storage/API
    // const { user, isAuthenticated } = useAppSelector((state) => state.auth); 
    // Let's rely on storage for initial check to avoid flicker if redux is slow to hydrate

    useEffect(() => {
        const checkAuth = async () => {
            const token = secureStorage.getItem("token");
            const role = secureStorage.getItem("role");
            const userStr = secureStorage.getItem("user_details"); // Assuming we store full user obj
            const user = userStr ? (typeof userStr === 'string' ? JSON.parse(userStr) : userStr) : null;
            // Note: secureStorage might return object directly if parsed. 
            // The helper 'getItem' usually returns string or parsed json depending on implementation.
            // Looking at usePosts.ts line 23: local storage item retrieved directly.
            // Let's assume it returns the value.

            if (!token) {
                router.replace(`/supplier/login?returnUrl=${encodeURIComponent(pathname)}`);
                return;
            }

            if (role !== AppUserType.SUPPLIER) {
                router.replace("/selectRole"); // Or access denied page
                return;
            }

            // Check onboarding status
            // We need to know if 'profile_completed', 'kyc_verified', 'store_created' or 'register_step'
            // API response user object should have 'register_step'.
            // Enums.ts in backend: UserRegisterSteps
            // 0: REGISTERED, 1: PROFILE_COMPLETED, ...
            // Let's assume user object has `register_step` and `is_Verified`.

            // If we require complete (Dashboard access)
            if (requireComplete) {
                // For Suppliers, completion is step 11 (SUPPLIER_STORE_CREATED)
                if (user && user.register_step < 11) {
                    router.replace("/supplier/onboarding");
                    return;
                }
            }

            setAuthorized(true);
        };

        checkAuth();
    }, [router, pathname, requireComplete]);

    if (!authorized) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
};

export default SupplierGuard;
