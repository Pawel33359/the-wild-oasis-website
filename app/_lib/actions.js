"use server";

import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { getBooking, getBookings, getCabin } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: +formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000) || "",
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: "unconfirmed",
    isPaid: false,
    hasBreakfast: false,
  };

  // Make sure the dates dont overlap with existing bookings for the same cabin

  const { error } = await supabase.from("bookings").insert(newBooking);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath("/cabins/" + bookingData.cabinId);
  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const booking = await getBooking(formData.get("reservationId"));
  if (!booking) throw new Error("Booking not found");
  const cabin = await getCabin(booking.cabinId);
  if (!cabin) throw new Error("Cabin not found");

  if (booking.guestId !== session.user.guestId)
    throw new Error("You are not allowed to edit this booking");

  // Would need to get every booking for the cabin and check if the new number of guests would exceed the max capacity, but skipping that for now since it's just a demo app

  const { data, error } = await supabase
    .from("bookings")
    .update({
      numGuests: formData.get("numGuests"),
      observations: formData.get("observations"),
      numNights: formData.get("numNights"),
      totalPrice:
        formData.get("numNights") * (cabin.regularPrice - cabin.discount),
    })
    .eq("id", formData.get("reservationId"))
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath("/account/reservations" + formData.get("reservationId"));
  redirect("/account/reservations");
}
