import React from "react";
import { IUser } from "../model/types";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

interface UserProps {
  user: IUser;
}

const User: React.FC<UserProps> = ({ user }) => {
  return (
    <Card>
      <CardContent>
        <p className="">
          Пользователь {user.tgid} Язык {user.languge}
        </p>
      </CardContent>
    </Card>
  );
};

export default User;
