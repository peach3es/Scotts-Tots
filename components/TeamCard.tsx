import { getDrivers } from "@/actions";
import { Driver } from "@/types/driver";
import { notFound } from "next/navigation";

import DriverCard from "./DriverCard";

type TeamCardProps = {
  teamName: string;
};

export default async function TeamCard({ teamName }: TeamCardProps) {
  let drivers: Driver[];

  try {
    drivers = await getDrivers(teamName);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-darkRed p-3">
      <div className="text-2xl font-semibold">{teamName}</div>
      <div className="flex w-full flex-row justify-between gap-2 border-t border-burgundy pt-2">
        {drivers.length ? (
          drivers.map((driver) => (
            <div
              className="flex w-full items-center align-middle"
              key={driver.full_name}
            >
              <DriverCard driver={driver} />
            </div>
          ))
        ) : (
          <div className="text-xl font-semibold text-white">
            {"No drivers were found"}
          </div>
        )}
      </div>
    </div>
  );
}
