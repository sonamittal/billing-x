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
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Message from "@/components/ui/message";
import type { GetCustomerById } from "@/app/api/panel/customers/[customerId]/type";
import { SearchCombobox } from "@/components/ui/combobox";

interface Props {
  customerId: string;
  callback?: string;
  customer: GetCustomerById;
}

type Country = {
  id: number;
  name: string;
};

type State = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
};
const EditBillingAddressForm = ({ customerId, callback, customer }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [citiesList, setCitiesList] = useState<City[]>([]);
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
      countryId: customer.countryId || "",
      country: customer.country || "",

      stateId: customer.stateId || "",
      state: customer.state || "",

      cityId: customer.cityId || "",
      city: customer.city || "",

      pinCode: customer?.pinCode || "",

      address: {
        street1: customer?.street1 || "",
        street2: customer?.street2 || "",
      },
      mobile: customer?.mobile || "",
    },
  });
  //

  // edit customer form handling >>>>>>>>>>
  const {
    data: editCustomerData,
    mutate: editCustomerBAddress,
    isPending: isEditCustomerPending,
    isSuccess: isEditCustomerSuccess,
    error: editCustomerError,
  } = useMutation({
    mutationFn: async (data: EditAddressCustomerFormSchema) => {
      const res = await axios.put(`/api/panel/customers/${customerId}`, {
        id: customerId,
        action: "billingAddress",
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer billing  address updated successfully!");

      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
    },
    onError: (error) => {
      toast.error(error.message || "failed to edit billing address");
    },
  });

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;

    GetState(Number(selectedCountry)).then((res) => {
      setStateList(res);
    });
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;

    GetCity(Number(selectedCountry), Number(selectedState)).then((res) => {
      setCitiesList(res);
    });
  }, [selectedCountry, selectedState]);

  //useEffect
  useEffect(() => {
    if (customer.countryId) {
      setSelectedCountry(customer.countryId);
    }
  }, [customer.countryId]);

  useEffect(() => {
    if (customer.stateId) {
      setSelectedState(customer.stateId);
    }
  }, [customer.stateId]);
  // Submit
  const onSubmit = (data: EditAddressCustomerFormSchema) => {
    console.log("form data sbmitted:", data);
    editCustomerBAddress(data);
  };

  return (
    <Card>
      <CardContent>
        <Message
          variant={editCustomerError ? "destructive" : "default"}
          message={editCustomerError?.message}
        />
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Country */}
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>

                  <FormControl>
                    <SearchCombobox
                      value={field.value || ""}
                      onChange={(value: string) => {
                        field.onChange(value);

                        const selected = countriesList.find(
                          (c) => c.id.toString() === value,
                        );

                        if (selected) {
                          form.setValue("country", selected.name);

                          setSelectedCountry(value);
                          setSelectedState(null);

                          form.setValue("stateId", "");
                          form.setValue("state", "");
                          form.setValue("cityId", "");
                          form.setValue("city", "");
                        }
                      }}
                      options={countriesList.map((country) => ({
                        label: country.name,
                        value: country.id.toString(),
                      }))}
                      placeholder="Select Country"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* State */}
            <FormField
              control={form.control}
              name="stateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>

                  <FormControl>
                    <SearchCombobox
                      value={field.value || ""}
                      onChange={(value: string) => {
                        field.onChange(value);

                        const selected = stateList.find(
                          (s) => s.id.toString() === value,
                        );

                        if (selected) {
                          form.setValue("state", selected.name);

                          setSelectedState(value);

                          form.setValue("cityId", "");
                          form.setValue("city", "");
                        }
                      }}
                      options={stateList.map((state) => ({
                        label: state.name,
                        value: state.id.toString(),
                      }))}
                      placeholder="Select State"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* City */}
            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>

                  <FormControl>
                    <SearchCombobox
                      value={field.value || ""}
                      onChange={(value: string) => {
                        field.onChange(value);

                        const selected = citiesList.find(
                          (c) => c.id.toString() === value,
                        );

                        if (selected) {
                          form.setValue("city", selected.name);
                        }
                      }}
                      options={citiesList.map((city) => ({
                        label: city.name,
                        value: city.id.toString(),
                      }))}
                      placeholder="Select City"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Pin*/}
            <FormField
              control={form.control}
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
            {/* mobile */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mobile No <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="9876543210" {...field} />
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
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> please wait
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
