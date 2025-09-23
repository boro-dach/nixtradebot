import React from "react";
import { IUser } from "../model/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Verified } from "lucide-react";
import { verifyUser } from "../api/verify";

interface UserProps {
  user: IUser;
}

const User: React.FC<UserProps> = ({ user }) => {
  return (
    <Card className="w-full">
      <CardHeader className="w-full">
        <p className="text-xl">Пользователь</p>
      </CardHeader>
      <CardContent>
        <p className="">ID: {user.tgid}</p>
        <p>Язык: {user.language}</p>
        <p>Баланс: {user.balance}</p>
        <p>Верифицирован: {user.verified === true ? "Да" : "Нет"}</p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row items-center gap-2">
          <Button
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              verifyUser(user.tgid);
            }}
          >
            <Verified />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default User;
