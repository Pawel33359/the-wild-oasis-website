import { SubmitButton } from "@/app/_components/SubmitButton";
import { updateReservation } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  return {
    title: `Reservation ${params.reservationId}`,
    description: "Edit your reservation details",
  };
}

// export async function generateStaticParams() {
//   const cabins = await getCabins();

//   return cabins.map((cabin) => ({
//     cabinId: String(cabin.id),
//   }));
// }

export default async function Page({ params }) {
  const booking = await getBooking(params.reservationId);
  if (!booking) {
    notFound();
  }
  const cabin = await getCabin(booking.cabinId);
  if (!cabin) {
    notFound();
  }

  const reservationId = params.reservationId;
  const maxCapacity = cabin.maxCapacity;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <form
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        action={updateReservation}
      >
        <input type="hidden" name="reservationId" value={reservationId} />
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x} selected={booking.numGuests === x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="numNights">
            For how many nights do you want to stay?
          </label>
          <input
            type="number"
            name="numNights"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            defaultValue={booking.numNights || ""}
            min={1}
            max={30}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            defaultValue={booking.observations || ""}
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingText="Updating reservation...">
            Update reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
