"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { editAddressCustomerFormSchema } from "@/components/validation/validation";
import type { EditAddressCustomerFormSchema } from "@/components/validation/validation";
import MultiSelect from "@/components/ui/multiselect";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const EditBillingAddressForm = () => {
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  // Fetch countries
  useEffect(() => {
    GetCountries().then((result) => setCountriesList(result));
  }, []);
  // form handling >>>>>>>>>>>>>>>>
  const form = useForm<EditAddressCustomerFormSchema>({
    resolver: zodResolver(editAddressCustomerFormSchema),
    defaultValues: {
      type: undefined,
      country: "",
      state: "",
      city: "",
      pinCode: "",
      address: {
        street1: "",
        street2: "",
      },
      phone: "",
    },
  });
  // edit customer form handling >>>>>>>>>>
  const {
    data: editCustomerData,
    mutate: editCustomer,
    isPending: isEditCustomerPending,
    isSuccess: isEditCustomerSuccess,
    error: editCustomerError,
  } = useMutation({});
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

  const onSubmit = (data: EditAddressCustomerFormSchema) => {
    console.log("data form submitted:", data);
  };
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
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
                      mode="single"
                      darkBg="secondary"
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        if (typeof val === "string") {
                          setSelectedCountry(val);
                        }
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
                      darkBg="secondary"
                      mode="single"
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        if (typeof val === "string") setSelectedState(val);
                      }}
                      placeholder="Select State"
                      disabled={!selectedCountry}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                      darkBg="secondary"
                      mode="single"
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
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
            {/* Address */}
            <div className="space-y-3">
              <h3 className="text-md font-medium">Address</h3>
              <FormField
                control={form.control}
                name="address.street1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Street1 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full address..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.street2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Street2 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full address..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* Phone */}

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone no <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="phone"
                      placeholder="eg: +918045682231"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              form="user-form"
              className="w-full"
              disabled={isEditCustomerPending}
            >
              {isEditCustomerPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                </>
              ) : (
                "Update details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default EditBillingAddressForm;
