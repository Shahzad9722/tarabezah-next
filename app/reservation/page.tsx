import { Suspense } from "react";
import AddReservation from "../components/AddReservation";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AddReservation />
      </Suspense>
    </div>
  );
};

export default page;
