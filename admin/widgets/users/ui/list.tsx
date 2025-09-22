"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/entities/user/api/get-all";
import { IUser } from "@/entities/user/model/types";
import User from "@/entities/user/ui/user";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (e) {
        setError("Не удалось загрузить пользователей.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <p>Загрузка пользователей...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <User key={user.tgid} user={user} />
      ))}
    </div>
  );
};

export default UsersList;
