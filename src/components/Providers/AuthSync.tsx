"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateSessionStatus } from "@/store/authSlice";

export function AuthSyncComponent() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updateSessionStatus({
        status,
        userData: session?.user,
      })
    );
  }, [status, session, dispatch]);

  return null;
}
