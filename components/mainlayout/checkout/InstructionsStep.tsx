"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCheckoutActions, useLeaveAtDoor, useNote } from "@/store/checkout.store";

const InstructionsStep = () => {
  const note = useNote();
  const leaveAtDoor = useLeaveAtDoor();
  const { updateNote, setLeaveAtDoor } = useCheckoutActions();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label htmlFor="instruction-note">Delivery Instructions Note</Label>
        <Textarea
          id="instruction-note"
          rows={4}
          maxLength={500}
          value={note}
          onChange={(event) => updateNote(event.target.value)}
        />
      </div>
      <div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="leave-at-door"
            checked={leaveAtDoor}
            onCheckedChange={(checked) => setLeaveAtDoor(checked === true)}
          />
          <Label htmlFor="leave-at-door">Leave at my door if I am not around</Label>
        </div>
        <p className="pt-2.5 pl-7 text-sm leading-7 text-muted-foreground">
          By selecting this option you accept full responsibility for your
          order after it has been delivered unattended, including any loss due
          to theft or damage due to temperature sensitivity.
        </p>
      </div>
    </div>
  );
};

export default InstructionsStep;
