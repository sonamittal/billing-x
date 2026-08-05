"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Message from "@/components/ui/message";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { organizationSchema } from "@/components/validation/validation";
import type { OrganizationSchema } from "@/components/validation/validation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GetCountries,
  GetState,
  GetCity,
  GetLanguages,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { INDUSTRY_TYPES, CURRENCY_TYPE } from "@/lib/constants";
import UseTimezone from "@/hooks/use-Timezone";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { SearchCombobox } from "@/components/ui/combobox";
import type { ApiErrorResponse } from "@/http/type";
import { toast } from "sonner";

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

type Language = {
  name: string;
};

const OrganizationSetupForm = () => {
  const { timezoneOptions } = UseTimezone();
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  // city state country
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [languageList, setLanguageList] = useState<Language[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      industry: "",
      countryId: "",
      country: "",
      stateId: "",
      state: "",
      cityId: "",
      city: "",
      address: "",
      currency: "",
      language: "",
      timezone: "",
      gstRegistered: false,
      gstNumber: "",
      invoicingMethod: "",
    },
  });
  // organization set up handling >>>>>>>>>>>>>>>
  const {
    mutate,
    isPending: isOrgPending,
    error: orgError,
  } = useMutation({
    mutationFn: async (data: OrganizationSchema) => {
      const response = await axios.post("/api/organization-setup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Organization has been added successfully!");
      reset();
      router.push(callbackUrl || "/auth/callback");
    },
    onError: (error) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data.message ?? "Failed to organization");
      } else {
        toast.error("Failed to organization");
      }
    },
  });

  // gstresgistered
  const gstRegistered = form.watch("gstRegistered");
  // useEffect gstresgistered
  useEffect(() => {
    if (!gstRegistered) {
      form.setValue("gstNumber", "");
    }
  }, [gstRegistered, form]);
  // Fetch countries & languages
  useEffect(() => {
    GetCountries().then((result) => setCountriesList(result));
    GetLanguages().then((result) => setLanguageList(result));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;

    GetState(Number(selectedCountry)).then(setStateList);

    setSelectedState(null);
    form.setValue("state", "");
    form.setValue("city", "");
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState || !selectedCountry) return;

    GetCity(Number(selectedCountry), Number(selectedState)).then(setCitiesList);

    form.setValue("city", "");
  }, [selectedState, selectedCountry]);

  // submit
  const { reset } = form;
  const onSubmit = (data: OrganizationSchema) => {
    console.log("Organization Data:", data);
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Message
          variant={orgError ? "destructive" : "default"}
          message={orgError?.message}
          className="mt-3"
        />
        {/* Organization Name */}
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Industry */}
        <FormField
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <SearchCombobox
                  options={INDUSTRY_TYPES.map((ind) => ({
                    label: ind.label,
                    value: ind.value,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select idustry"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Country */}
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Country <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <SearchCombobox
                    value={field.value}
                    onChange={(val: string) => {
                      field.onChange(val);

                      setSelectedCountry(val);

                      const country = countriesList.find(
                        (c) => c.id.toString() === val,
                      );

                      form.setValue("countryId", val);
                      form.setValue("country", country?.name ?? "");

                      form.setValue("stateId", "");
                      form.setValue("state", "");
                      form.setValue("cityId", "");
                      form.setValue("city", "");

                      setSelectedState(null);
                    }}
                    options={countriesList.map((c) => ({
                      label: c.name,
                      value: c.id.toString(),
                    }))}
                    placeholder="Select Country"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  State <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <SearchCombobox
                    value={field.value}
                    onChange={(val: string) => {
                      field.onChange(val);

                      setSelectedState(val);

                      const state = stateList.find(
                        (s) => s.id.toString() === val,
                      );

                      form.setValue("stateId", val);
                      form.setValue("state", state?.name ?? "");
                      form.setValue("cityId", "");
                      form.setValue("city", "");
                    }}
                    options={stateList.map((s) => ({
                      label: s.name,
                      value: s.id.toString(),
                    }))}
                    placeholder="Select State"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* City */}
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  City <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <SearchCombobox
                    value={field.value}
                    onChange={(val: string) => {
                      field.onChange(val);

                      const city = citiesList.find(
                        (c) => c.id.toString() === val,
                      );

                      form.setValue("cityId", val);
                      form.setValue("city", city?.name ?? "");
                    }}
                    options={citiesList.map((c) => ({
                      label: c.name,
                      value: c.id.toString(),
                    }))}
                    placeholder="Select City"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* address */}
          <FormField
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>address</FormLabel>
                <FormControl>
                  <Input placeholder="london mg road " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Currency */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Currency <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <SearchCombobox
                    options={CURRENCY_TYPE.map((c) => ({
                      label: c.label,
                      value: c.value,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Currency"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Language */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Customer Language <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <SearchCombobox
                    options={languageList.map((lang) => ({
                      label: lang.name,
                      value: lang.name,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Language"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* Timezone */}
        {/* Timezone */}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>

              <FormControl>
                <SearchCombobox
                  options={timezoneOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select Timezone"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* gstregistered */}
        <FormField
          name="gstRegistered"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Is this business registered for GST?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GST Number*/}
        {gstRegistered && (
          <FormField
            name="gstNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GST Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Invoicing Method */}
        <FormField
          name="invoicingMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How are you managing Invoicing currently?</FormLabel>
              <FormControl>
                <Input placeholder="Manual / Automatic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <Button type="submit" className="" disabled={isOrgPending}>
            {isOrgPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                please wait
              </>
            ) : (
              "Get Started"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className=""
          >
            Go Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrganizationSetupForm;
