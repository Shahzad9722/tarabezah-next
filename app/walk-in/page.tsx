import { Suspense } from "react";
import AddReservation from "../components/AddReservation";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AddReservation walkIn={true} />
      </Suspense>
    </div>
  );
};

export default page;
