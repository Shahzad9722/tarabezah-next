import React from "react";
import { Calendar, NotebookTabs } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { MultiSelect } from "../../../components/ui/multi-select";
import { Button } from "../../ui/button";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

export default function AddReservationStep({
  form,
  sources,
  tags,
  submittingForm,
  setShowAddNewClient,
  walkIn,
}: {
  form: UseFormReturn<any>;
  sources: any[];
  tags: any[];
  submittingForm: boolean;
  setShowAddNewClient: any;
  walkIn?: boolean;
}) {
  return (
    <div className="w-full">
      {/* Add New Client Form */}
      <div className="space-y-6 mb-4">
        <div className="flex  flex-col-reverse gap-6 md:flex-row justify-between">
          <h2 className="text-color-E9E3D7 text-[22px] font-semibold mb-4">
            Add New Client
          </h2>
          <div className="flex">
            <Button type="button" onClick={() => setShowAddNewClient(false)}>
              Client Search
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type="date" placeholder="Enter Birthday" {...field} />
                  <Calendar
                    className="absolute right-4 top-3.5 text-color-E9E3D7 pointer-events-none"
                    size={18}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sources"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Source</FormLabel>
              <FormControl>
                <MultiSelect options={sources} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect options={tags} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Note</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Add Note..."
                    className="pl-12 h-16"
                    {...field}
                  />
                  <NotebookTabs
                    className="absolute left-3 top-[calc(50%-16px)] text-color-E9E3D7 pointer-events-none"
                    size={32}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Add guest button */}
      <div className="flex justify-between my-4 gap-4">
        <Button type="submit" disabled={submittingForm} className="w-full">
          Add Guest
        </Button>
      </div>
    </div>
  );
}
