import type { NextPage } from "next";
import React from "react";
import ThemeChanger from "@/components/ThemeChanger";
import PageTitle from "./PageTitle";

export const metadata = {
  title: "Link Library",
  description: "A library for storing web links.",
};

const Home: NextPage = () => {
  return (
    <React.Fragment>
      <main>
        <div className="mx-auto flex h-[60px] w-full max-w-7xl flex-wrap items-center justify-end px-4">
          <ul className="flex list-none items-center gap-4 sm:gap-4">
            <li className="block">
              <ThemeChanger />
            </li>
          </ul>
        </div>
        <div className="mx-auto min-h-[calc(100vh-60px)] max-w-7xl px-4">
          <PageTitle />
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
