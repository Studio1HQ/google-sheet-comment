import { Button } from "@/components/ui/button";
import { names, userIds, useUserStore } from "@/helper/userdb";
import { useVeltClient, VeltNotificationsTool } from "@veltdev/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { user, setUser } = useUserStore();
  const { client } = useVeltClient();

  const predefinedUsers = useMemo(
    () =>
      userIds.map((uid, index) => {
        // Use DiceBear Avatars for demonstration
        const avatarUrls = [
          "https://api.dicebear.com/7.x/pixel-art/svg?seed=Nany",
          "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mary",
        ];
        return {
          uid: uid,
          displayName: names[index],
          email: `${names[index].toLowerCase()}@gmail.com`,
          photoUrl: avatarUrls[index],
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

  useEffect(() => {
    if (!client || !user) return;
    const veltUser = {
      userId: user.uid,
      organizationId: "organization_id",
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoUrl, // Pass avatar to Velt
    };

    client.identify(veltUser);
  }, [client, user]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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
            {/* Only show the dropdown with avatar and name */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 p-2 border rounded bg-white hover:bg-gray-50 min-w-[120px]"
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <Avatar>
                  <AvatarImage src={user.photoUrl} alt={user.displayName} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <span>{user.displayName}</span>
                <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                  {predefinedUsers.map((predefinedUser) => (
                    <div
                      key={predefinedUser.uid}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 ${user.uid === predefinedUser.uid ? "bg-gray-50" : ""}`}
                      onClick={() => {
                        setUser(predefinedUser);
                        setDropdownOpen(false);
                      }}
                    >
                      <Avatar>
                        <AvatarImage src={predefinedUser.photoUrl} alt={predefinedUser.displayName} />
                        <AvatarFallback>{predefinedUser.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <span>{predefinedUser.displayName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
