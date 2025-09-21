import { Card, CardContent } from "@/shared/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Withdraw = () => {
  return (
    <div className="flex flex-col gap-2 px-4 font-semibold">
      <Link href={""}>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <Image
              src={"/ruflag.svg"}
              height={32}
              width={32}
              alt="Russia flag"
            />
            <p>
              Банковская карта, <span className="text-zinc-400">RUB</span>
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link href={""}>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <Image src={"/sbp.svg"} height={32} width={32} alt="SBP" />
            <p>
              SBP, <span className="text-zinc-400">RUB</span>
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link href={""}>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <Image src={"/tether.svg"} height={32} width={32} alt="Tether" />
            <p>Tether</p>
          </CardContent>
        </Card>
      </Link>
      <Link href={""}>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <Image src={"/bitcoin.svg"} height={32} width={32} alt="Bicoin" />
            <p>Bitcoin</p>
          </CardContent>
        </Card>
      </Link>
      <Link href={""}>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <Image
              src={"/ethereum.svg"}
              height={32}
              width={32}
              alt="Ethereum"
            />
            <p>Ethereum</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default Withdraw;
