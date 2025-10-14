"use client";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Copy, Loader2 } from "lucide-react";
import React, { useState } from "react";

import { useUser } from "@/entities/user/api/useUser";
import { useTelegramStore, telegramSelectors } from "@/entities/telegram";
import { useApplyReferralCode } from "@/features/referral/api/useApplyReferralCode";

const Referral = () => {
  const userId = useTelegramStore(telegramSelectors.userId);
  const { data: user, isLoading: isLoadingUser } = useUser(userId);

  const [inputCode, setInputCode] = useState("");
  const { mutate: applyCode, isPending: isApplyingCode } =
    useApplyReferralCode();

  const handleCopyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      alert("Реферальный код скопирован!");
    }
  };

  const handleApplyCode = () => {
    if (!inputCode.trim() || !userId) return;
    applyCode({
      userId: String(userId),
      referralCode: inputCode.trim(),
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6 pb-20">
      <h1 className="text-lg font-semibold">Referral Program</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>
            Share this code with your friends. You will get 10% from their
            deposits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-2 border rounded-md bg-zinc-900">
            <p className="font-mono text-sm flex-1 truncate">
              {user?.referralCode}
            </p>
            <Button size="icon" variant="ghost" onClick={handleCopyCode}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {!user?.referredById && (
        <Card>
          <CardHeader>
            <CardTitle>Apply a Code</CardTitle>
            <CardDescription>
              If you have a referral code, enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input
              placeholder="Enter referral code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              disabled={isApplyingCode}
            />
            <Button
              onClick={handleApplyCode}
              disabled={isApplyingCode || !inputCode}
            >
              {isApplyingCode ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {user?.referredById && (
        <Card>
          <CardHeader>
            <CardTitle>You were invited by</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-muted-foreground">
              {user.referredById}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Referral;
