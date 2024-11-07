"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/redux/hooks";
import { logout } from "@/app/redux/features/authSlice";
import { useRouter } from "next/navigation";

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(logout());
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
        router.push("/login");
    }, [dispatch, router]);

    return null;
}
