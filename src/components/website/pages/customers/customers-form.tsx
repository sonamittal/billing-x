"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, MapPin, Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MultiSelect from "@/components/ui/multiselect";
import { addCustomerFormSchema } from "@/components/validation/validation";
import type { AddCustomerFormSchema } from "@/components/validation/validation";
import {
  GetCountries,
  GetState,
  GetCity,
  GetLanguages,
} from "react-country-state-city";
import { CURRENCY_TYPE } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import Message from "@/components/ui/message";
import type { User } from "@/components/website/pages/customers/customers-dialog";
type Props = {
  open?: boolean;
  onOpenChange?: (val: boolean) => void;
  onBack?: () => void;
  selectedUser?: User | null;
};

const AddCustomerForm = ({
  open,
  onOpenChange,
  onBack,
  selectedUser,
}: Props) => {
  const queryClient = useQueryClient();

  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [languageList, setLanguageList] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // form handling >>>>>>>>>>>
  const form = useForm<AddCustomerFormSchema>({
    resolver: zodResolver(addCustomerFormSchema),
    defaultValues: {
      partnerType: undefined,
      displayName: "",
      companyName: "",
      currency: "",
      language: "",
      country: "",
      state: "",
      city: "",
      pinCode: "",
      address: "",
    },
  });

  // add customer form handling >>>>>>>>>>
  const {
    data: addCustomerData,
    mutate: addCustomer,
    isPending: isAddCustomerPending,
    isSuccess: isAddCustomerSuccess,
    error: addCustomerError,
  } = useMutation({
    mutationFn: async (data: AddCustomerFormSchema) => {
      try {
        const res = await axios.post("/api/panel/customers", {
          type: "customer",
          userId: selectedUser?.id,
          ...data,
        });
        return res.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "failed to create customer",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Customer created successfully!");
      form.reset();
      onOpenChange?.(false);
    },
  });

  // Fetch countries & languages
  useEffect(() => {
    GetCountries().then((result) => setCountriesList(result));
    GetLanguages().then((result) => setLanguageList(result));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      GetState(parseInt(selectedCountry)).then((res) => setStateList(res));
      setSelectedState(null);
      form.setValue("state", "");
      form.setValue("city", "");
    }
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState && selectedCountry) {
      GetCity(parseInt(selectedCountry), parseInt(selectedState)).then((res) =>
        setCitiesList(res),
      );
      form.setValue("city", "");
    }
  }, [selectedState, selectedCountry]);

  const onSubmit = (data: AddCustomerFormSchema) => {
    if (!selectedUser?.id) {
      toast.error("Please select a user first");
      return;
    }
    console.log("Form Data Submitted:", data);
    addCustomer({
      userId: selectedUser.id,
      ...data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-auto w-[60%] md:max-w-[85%] xl:max-w-[70%] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Customer Details
          </DialogTitle>
          <DialogDescription>
            {" "}
            Enter the new customer’s information in the form below.
          </DialogDescription>
        </DialogHeader>
        <Message
          variant={addCustomerError ? "destructive" : "default"}
          message={
            addCustomerError?.message ||
            (isAddCustomerSuccess && addCustomerData.message)
          }
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-4 pb-6"
          >
            {/* Partner type */}
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-9 text-blue-600 bg-blue-100 rounded-md p-1.5" />
              <div>
                <div className="font-medium text-md ">Basic Information</div>
                <div className="text-sm mt-0.5 text-gray-500">
                  Partner type selection
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="partnerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Partner Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display name */}
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Display Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Riya" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Company Name */}
              {form.watch("partnerType") === "business" && (
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="ByteWyte" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Currency */}
              <FormField
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Currency <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={CURRENCY_TYPE.map((c) => ({
                          label: c.label,
                          value: c.value,
                        }))}
                        value={[field.value]}
                        onChange={(vals: string[]) =>
                          field.onChange(vals[0] || "INR")
                        }
                        placeholder="Select Currency"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Language */}
              <FormField
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Language <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={languageList.map((lang) => ({
                          label: lang.name,
                          value: lang.name,
                        }))}
                        value={field.value ? [field.value] : []}
                        onChange={(vals: string[]) =>
                          field.onChange(vals[0] || "")
                        }
                        placeholder="Select Language"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Billing Address */}
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-9 text-green-600 bg-green-100 rounded-md p-1.5" />
              <div>
                <div className="font-semibold text-lg">Billing Address</div>
                <div className="text-sm text-gray-500">
                  Primary billing address
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Country */}
              <FormField
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={countriesList.map((c) => ({
                          label: c.name,
                          value: c.id.toString(),
                        }))}
                        value={field.value ? [field.value] : []}
                        onChange={(vals: string[]) => {
                          const val = vals[0] || "";
                          field.onChange(val);
                          setSelectedCountry(val);
                        }}
                        placeholder="Select Country"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      State <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={stateList.map((s) => ({
                          label: s.name,
                          value: s.id.toString(),
                        }))}
                        value={field.value ? [field.value] : []}
                        onChange={(vals: string[]) => {
                          const val = vals[0] || "";
                          field.onChange(val);
                          setSelectedState(val);
                        }}
                        placeholder="Select State"
                        disabled={!selectedCountry}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* City */}
              <FormField
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={citiesList.map((c) => ({
                          label: c.name,
                          value: c.id.toString(),
                        }))}
                        value={field.value ? [field.value] : []}
                        onChange={(vals: string[]) =>
                          field.onChange(vals[0] || "")
                        }
                        placeholder="Select City"
                        disabled={!selectedState}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Pin*/}
              <FormField
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="4001" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full address..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
                {onBack && (
                  <Button type="button" variant="outline" onClick={onBack}>
                    <ChevronLeft className="mt-0.5" />
                    Back
                  </Button>
                )}

                <Button type="submit" disabled={isAddCustomerPending}>
                  {isAddCustomerPending ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    </>
                  ) : (
                    "Create Customer"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerForm;
