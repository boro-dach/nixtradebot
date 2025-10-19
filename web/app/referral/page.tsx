"use client";

import { useState } from "react";
import {
  Copy,
  Loader2,
  Share2,
  Check,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useUser } from "@/entities/user/api/useUser";
import { useTelegramStore, telegramSelectors } from "@/entities/telegram";
import { useApplyReferralCode } from "@/features/referral/api/useApplyReferralCode";
import { useReferralSummary } from "@/features/referral/api/useReferralStats";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

const Referral = () => {
  // const userId = useTelegramStore(telegramSelectors.userId);
  const userId = 843961428;
  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { data: referralStats, isLoading: isLoadingStats } = useReferralSummary(
    String(userId)
  );

  const [inputCode, setInputCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const { mutate: applyCode, isPending: isApplyingCode } =
    useApplyReferralCode();

  const handleCopyCode = async () => {
    const referralCode = user?.referralCode || referralStats?.referralCode;

    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleShareCode = async () => {
    const referralCode = user?.referralCode || referralStats?.referralCode;
    const shareText = `Join me on NixTrade! Use my referral code: ${referralCode}`;
    const shareUrl = `https://t.me/your_bot?start=${referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join NixTrade",
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("Referral link copied to clipboard!");
    }
  };

  const handleApplyCode = () => {
    if (!inputCode.trim() || !userId) return;

    applyCode(
      {
        userId: String(userId),
        referralCode: inputCode.trim(),
      },
      {
        onSuccess: () => {
          setInputCode("");
        },
      }
    );
  };

  if (isLoadingUser || isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-96 bg-zinc-950">
        <Loader2 className="w-12 h-12 animate-spin " />
      </div>
    );
  }

  const referralCode = user?.referralCode || referralStats?.referralCode;
  const totalReferrals = referralStats?.totalReferrals || 0;
  const totalEarned = referralStats?.totalEarned || 0;
  const activeReferrals = referralStats?.activeReferrals || 0;

  return (
    <div className=" text-white p-4 flex flex-col gap-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold mb-2">Referral Program</h1>
        <p className="text-sm text-zinc-400">
          Earn rewards by inviting friends
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className=" border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-zinc-400">Total Referrals</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{totalReferrals}</p>
          {activeReferrals > 0 && (
            <p className="text-xs text-zinc-500 mt-1">
              {activeReferrals} active
            </p>
          )}
        </div>

        <div className=" border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <p className="text-xs text-zinc-400">Total Earned</p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            ${totalEarned.toFixed(2)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">10% commission</p>
        </div>
      </div>

      <div className="border rounded-xl">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold mb-2">Your Referral Code</h2>
          <p className="text-sm text-zinc-400">
            Share this code with friends and earn{" "}
            <span className="text-green-400 font-semibold">10%</span> from their
            deposits
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="relative">
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-zinc-400 mb-1">Referral Code</p>
                <p className="font-mono text-sm font-semibold break-all">
                  {referralCode || "Loading..."}
                </p>
              </div>
              <Button
                onClick={handleCopyCode}
                className=""
                aria-label="Copy code"
                disabled={!referralCode}
                size={"icon"}
              >
                {copySuccess ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-zinc-800 group-hover:text-white" />
                )}
              </Button>
            </div>
            {copySuccess && (
              <div className="absolute -top-12 right-0 bg-green-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
                Copied!
              </div>
            )}
          </div>

          <Button
            onClick={handleShareCode}
            disabled={!referralCode}
            className="w-full"
          >
            <Share2 className="w-4 h-4" />
            Share Referral Code
          </Button>
        </div>
      </div>

      {!user?.referredById && (
        <div className="border  rounded-xl">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-2">
              Have a Referral Code?
            </h2>
            <p className="text-sm text-zinc-400">
              Enter your friend's code to get started
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter referral code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.trim())}
                disabled={isApplyingCode}
              />
              <Button
                onClick={handleApplyCode}
                disabled={isApplyingCode || !inputCode}
              >
                {isApplyingCode ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {user?.referredById && (
        <div className=" border rounded-xl">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Invited By</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {user.referredById.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-mono text-sm text-zinc-400">
                {user.referredById}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className=" border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">How It Works</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold text-sm">1</span>
            </div>
            <div>
              <p className="font-semibold mb-1">Share Your Code</p>
              <p className="text-sm text-zinc-400">
                Send your referral code to friends
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
              <span className="text-purple-400 font-bold text-sm">2</span>
            </div>
            <div>
              <p className="font-semibold mb-1">They Sign Up</p>
              <p className="text-sm text-zinc-400">
                Your friend joins using your code
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <span className="text-green-400 font-bold text-sm">3</span>
            </div>
            <div>
              <p className="font-semibold mb-1">Earn Rewards</p>
              <p className="text-sm text-zinc-400">
                Get 10% from their deposits automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
