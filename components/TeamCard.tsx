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
    <div className="flex flex-row items-center justify-center gap-1 rounded-lg bg-darkRed p-2">
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
  );
}
