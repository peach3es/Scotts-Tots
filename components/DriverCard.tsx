"use client";

import { Driver } from "@/types/driver";
import Image from "next/image";

type DriverCardProps = {
  driver: Driver;
};

export default function DriverCard({ driver }: DriverCardProps) {
  const teamColor = `#${driver.team_colour}`;
  const driverImg = driver.headshot_url;

  return (
    // TODO onclick open modal for the driver
    <div
      className="flex w-full flex-col rounded-lg"
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
  );
}
