import { Button } from "@/components/ui/button";
import { names, userIds, useUserStore } from "@/helper/userdb";
import { useVeltClient, VeltCommentTool } from "@veltdev/react";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";

const Header: React.FC = () => {
  const { user, login } = useUserStore();
  const { client } = useVeltClient();

  const predefinedUsers = useMemo(
    () =>
      userIds.map((uid, index) => {
        return {
          uid: uid,
          displayName: names[index],
          email: `${names[index].toLowerCase()}@gmail.com`,
          photoURL: `https://picsum.photos/seed/${uid}/200/300`,
          organizationId: `org-${uid}`,
        };
      }),
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      const storedUser = localStorage.getItem("user-storage");
      if (!storedUser) {
        login(predefinedUsers[0]);
      }
    }
  }, [user, login, predefinedUsers]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = predefinedUsers.find((u) => u.uid === e.target.value);
    if (selectedUser) {
      login(selectedUser);
    }
  };

  useEffect(() => {
    if (!client || !user) return;
    const veltUser = {
      userId: user.uid,
      organizationId: "org-user001",
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
    };

    client.identify(veltUser);
  }, [client, user]);

  return (
    <header
      className={`flex items-center justify-between p-2 border-b bg-white`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-medium">Sheets</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center ml-4 gap-4">
        <VeltCommentTool />
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              {user.displayName}
            </span>
            <select
              value={user.uid}
              onChange={handleUserChange}
              className="p-2 border rounded"
            >
              {predefinedUsers.map((predefinedUser) => (
                <option key={predefinedUser.uid} value={predefinedUser.uid}>
                  {predefinedUser.displayName}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => login(predefinedUsers[0])}
            className="text-gray-600 hover:bg-gray-100"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
