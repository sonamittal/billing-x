"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import MultiSelect from "@/components/ui/multiselect";
import {
  GetCountries,
  GetState,
  GetCity,
  GetLanguages,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { CURRENCY_TYPE } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CustomerFormValues = {
  partnerType: "individual" | "business";
  displayName: string;
  companyName: string;
  currency: string;
  language: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  address: string;
};

const AddCustomerForm = ({ open, onOpenChange }: CustomerFormProps) => {
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [languageList, setLanguageList] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      partnerType: "individual",
      displayName: "",
      companyName: "",
      currency: "INR",
      language: "English",
      country: "",
      state: "",
      city: "",
      pinCode: "",
      address: "",
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

  const onSubmit = (data: CustomerFormValues) => {
    console.log("Form Data:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-auto w-[60%] md:max-w-[85%] xl:max-w-[70%] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="h-8 w-9 text-blue-600 bg-blue-100 rounded-md p-1.5" />
            <div>
              <div className="font-medium text-md ">Basic Information</div>
              <div className="text-sm mt-0.5 text-gray-500">
                Partner type selection
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-4 pb-6"
          >
            {/* Partner Type */}
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
              {/* Display Name */}
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

              {/* PIN */}
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
              <Button type="submit" className="w-full">
                Create Customer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerForm;
