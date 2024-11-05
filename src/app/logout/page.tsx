"use client"

import {useAppDispatch} from "@/app/redux/hooks";
import {logout} from "@/app/redux/features/authSlice";
import {useRouter} from "next/navigation";

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    dispatch(logout());
    localStorage.removeItem("user");
    router.push("/login");
}