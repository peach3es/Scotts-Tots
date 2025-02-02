"use client";

import { useState } from "react";

import { Driver } from "@/types/driver";
import Image from "next/image";

type DriverCardProps = {
  driver: Driver;
};

export default function DriverCard({ driver }: DriverCardProps) {
  const teamColor = `#${driver.team_colour}`;
  const driverImg = driver.headshot_url;

  const [bgCol, setBgCol] = useState<string>("#F8F5F4");

  return (
    // TODO onclick open modal for the driver
    <div
      className="flex w-full flex-col justify-center rounded-lg align-middle"
      style={{ backgroundColor: bgCol }}
      onMouseEnter={() => setBgCol(`${teamColor}`)}
      onMouseLeave={() => setBgCol("#F8F5F4")}
    >
      <div className="flex flex-row items-center gap-2 pb-2 align-middle">
        <div
          className="flex max-w-12 flex-col overflow-hidden rounded-lg"
          style={{ backgroundColor: teamColor }}
        >
          <Image
            src={driverImg}
            alt={driver.last_name}
            width={1080}
            height={1080}
            className="object-cover"
          />
        </div>
        <div className="font-nums ml-2 text-3xl font-bold text-darkRed">
          {driver.driver_number}
        </div>
      </div>
      <div className="ml-1 text-xl text-darkRed">{driver.first_name}</div>
      <div className="ml-1 text-xl font-semibold text-darkRed">
        {driver.last_name}
      </div>
    </div>
  );
}
