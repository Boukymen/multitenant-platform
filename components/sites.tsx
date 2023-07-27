import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SiteCard from "./site-card";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function Sites({ limit }: { limit?: number }) {
  const session: any = getSession();
  if (!session) {
    redirect("/login");
  }
    const [sites, setSites] = useState([]);
    const getSites = () => {
        fetch('http://localhost:3000/api/sites', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': session.user.id as string
            }
        })
            .then(res => res.json())
            .then(res => {
            setSites(res)
            })
    }

  useEffect(() => {
      getSites()
     return () => {
        setSites([])
     }
  }, []);

  // const sites = await prisma.site.findMany({
  //   where: {
  //     user: {
  //       id: session.user.id as string,
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "asc",
  //   },
  //   ...(limit ? { take: limit } : {}),
  // });

  return sites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sites.map((site: any ) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Sites Yet</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any sites yet. Create one to get started.
      </p>
    </div>
  );
}
