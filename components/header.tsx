import { Button } from "@/components/ui/button";
import { names, userIds, useUserStore } from "@/helper/userdb";
import { useVeltClient, VeltNotificationsTool } from "@veltdev/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";

const Header: React.FC = () => {
  const { user, setUser } = useUserStore();
  const { client } = useVeltClient();

  const predefinedUsers = useMemo(
    () =>
      userIds.map((uid, index) => {
        return {
          uid: uid,
          displayName: names[index],
          email: `${names[index].toLowerCase()}@gmail.com`,
        };
      }),
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      const storedUser = localStorage.getItem("user-storage");
      if (!storedUser) {
        setUser(predefinedUsers[0]);
      }
    }
  }, [user, setUser, predefinedUsers]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = predefinedUsers.find((u) => u.uid === e.target.value);
    if (selectedUser) {
      setUser(selectedUser);
    }
  };

  useEffect(() => {
    if (!client || !user) return;
    const veltUser = {
      userId: user.uid,
      organizationId: "organization_id",
      name: user.displayName,
      email: user.email,
    };

    client.identify(veltUser);
  }, [client, user]);

  return (
    <header className="flex items-center justify-between p-2 border-b bg-white">
      <div className="flex flex-col justify-start items-start">
        {/* Sheets Icon and Title */}
        <div className="flex items-center gap-2">
          <Image
            src="https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png"
            alt="google-spreadsheet-icon"
            // width={"40px"}
            // height={"40px"}
            width={40}
            height={40}
          />
          <div>
            <Link href="/" className="flex items-center">
              <span className="text-lg font-medium">Sheets</span>
            </Link>
            {/* Menu Options */}
            <div className=" flex items-center gap-2">
              {[
                "File",
                "Edit",
                "View",
                "Insert",
                "Format",
                "Data",
                "Tools",
                "Help",
              ].map((item) => (
                <div
                  className="flex items-center gap-2 hover:underline hover:cursor-pointer"
                  key={item}
                >
                  <span className="text-sm">{item}</span>
                </div>
              ))}

              {/* Add more menu items as necessary */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center ml-4 gap-4">
      <VeltNotificationsTool />
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
            onClick={() => setUser(predefinedUsers[0])}
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
