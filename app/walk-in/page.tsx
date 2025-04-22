import { Suspense } from "react";
import AddReservation from "../components/AddReservation";

const page = () => {
  return (
    <div>
      <Suspense>
        <AddReservation walkIn={true} />
      </Suspense>
    </div>
  );
};

export default page;
